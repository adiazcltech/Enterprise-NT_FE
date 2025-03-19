(function () {
  'use strict';

  angular
    .module('app.account')
    .filter('trust', ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      };
    }])
    .filter('passwordCount', [function () {
      return function (value, peak) {
        value = angular.isString(value) ? value : '';
        peak = isFinite(peak) ? peak : 7;
        return value && (value.length >= peak ? peak + '+' : value.length);
      };
    }])
    .controller('ModalforgetpasswordCtrl', function ($uibModalInstance, listconfiguration, usertype, userDS, $filter, logger) {
      var vm = this;
      vm.history = "";
      vm.messagerecoverpassword = "";
      vm.messagerecoverpasswordok = "";
      vm.usernamerecovery = "";
      vm.listconfiguration = listconfiguration;
      vm.usertype = usertype;
      vm.passwordrecovery = function (Form) {
        Form.history.$touched = true;
        Form.emailrecovery.$touched = true;
        if (Form.$valid) {
          vm.messagerecoverpassword = "";
          vm.messagerecoverpasswordok = "";
          return userDS.passwordrecovery(vm.usernamerecovery, vm.usertype, vm.history).then(function (data) {
            if (data.data[0].success) {
              vm.loadimageemail();
              var contentemail = $('#content-email').html();
              vm.contentemail = vm.listconfiguration[0].value;
              contentemail = contentemail.replace('||USER||', data.data[0].user.userName);
              contentemail = contentemail.replace('||LINK||', location.origin + '?token=' + data.data[0].token);
              while (contentemail.indexOf('||DATE||') !== -1) {
                contentemail = contentemail.replace('||DATE||', moment().format('YYYY/MM/DD h:mm:ss'));
              }
              while (contentemail.indexOf('||LAB||') !== -1) {
                contentemail = contentemail.replace('||LAB||', vm.listconfiguration[11].value);
              }
              var email = {
                subject: $filter('translate')('0094'),
                body: contentemail,
                recipients: [data.data[0].user.email],
                attachment: vm.attachmentimageemail,
                webquery: true,
                order: 0,
                user: 0
              }
              return userDS.passwordrecoveryemailV2(data.data[0].token, email).then(function (data) {
                if (data.status === 200) {
                  if (data.data === "Se a generado un error a la hora de hacer el envio") {
                    vm.messagerecoverpassword = $filter('translate')('0204');
                  } else {
                    document.getElementById("content-email").innerHTML = vm.contentemail;
                    $uibModalInstance.close();
                    logger.info($filter('translate')('0102'));
                  }
                } else if (data.statusText === "Internal Server Error") {
                  if (data.data.message === "2|user not found") {
                    vm.messagerecoverpassword = 'Usuario no encontrado';
                  } else {
                    vm.messagerecoverpassword = 'Internal Server Error';
                  }
                }
              })
            }
          },
            function (error) {
              if (error.data.code === 0) {
                if (error.data.message === '3|mail not found') {
                  vm.messagerecoverpassword = $filter('translate')('0095');
                } else {
                  vm.messagerecoverpassword = $filter('translate')('0096');
                }
              }
            });
        } else if (vm.history === '') {
          vm.messagerecoverpassword = $filter('translate')('0097');
        } else if (vm.usernamerecovery === '') {
          vm.messagerecoverpassword = "Email requerido";
        } else {
          vm.messagerecoverpassword = "El email no se encuentra bien digitado";
        }
      };
      vm.loadimageemail = function () {
        var images = $('#content-email').find('img');
        vm.attachmentimageemail = [];
        for (var i = 0; i < images.length; i++) {
          var pathimage = JSON.parse(JSON.stringify(images[i].src)).split(",");
          var image = {
            filename: 'image' + i + '.png',
            path: pathimage[1],
            cid: 'image' + i + '.png'
          }
          images[i].src = 'cid:image' + i + '.png'
          vm.attachmentimageemail.push(image)
        }
      }
      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    })
    .controller('ModalConditionsCtrl', function ($uibModalInstance, listconfiguration, $sce) {
      var vm = this;
      vm.listconfiguration = listconfiguration;
      vm.loadtermsandConditions = function (string) {
        return $sce.trustAsHtml(string);
      }
      vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    })
    .controller('passwordwarningCtrl', function (menssageInvalid) {
      var vm = this;
      vm.menssageInvalid = menssageInvalid;
    })
    .controller('changepassworduser', function ($uibModalInstance, userDS, localStorageService, $filter, listconfiguration) {
      var vm = this;
      vm.userchangepassword = listconfiguration.userchangepassword;
      vm.keySecurityPolitics = localStorageService.get('SecurityPolitics') === "True" ? true : false;
      vm.idchangepassword = parseInt(listconfiguration.id);
      vm.lettersize = listconfiguration.administrator ? 12 : 9;
      vm.administrator = listconfiguration.administrator;
      vm.user = listconfiguration.user;
      vm.idrol = listconfiguration.idrol;
      vm.strength0 = true;
      vm.strength1 = true;
      vm.strength2 = true;
      vm.strength3 = true;
      vm.strength4 = true;
      vm.data = '';
      vm.color = "#999";
      vm.strength = "";
      vm.messageerrorpassword = '';
      vm.strengthlabel = $filter('translate')('0148');
      setTimeout(function () {
        document.getElementById("password1changepassword").focus();
      }, 500);
      vm.CheckStrngth = function (string) {
        if (vm.keySecurityPolitics) {
          vm.viewvalited = false;
          vm.strength0 = false;
          vm.strength1 = false;
          vm.strength2 = false;
          vm.strength3 = false;
          vm.strength4 = false;
          vm.strength = "";
          vm.save = false;
          vm.strengthlabel = $filter('translate')('0148');
          if (vm.userchangepassword.password1 === undefined) {
            vm.strengthlabel = $filter('translate')('0148');
            vm.data = '';
            vm.color = "#999";
            vm.strength = "**";
            vm.strength0 = true;
            vm.strength1 = true;
            vm.strength2 = true;
            vm.strength3 = true;
            vm.strength4 = true;
          }
          if (vm.userchangepassword.password1 !== undefined) {
            vm.data = '';
            vm.strengthlabel = $filter('translate')('0148');
            if (vm.userchangepassword.password1.length < vm.lettersize) {
              vm.strength0 = true;
              vm.strength = "**";
            }
            if (!new RegExp("[A-Z]").test(vm.userchangepassword.password1)) {
              vm.strength1 = true;
              vm.strength = "**";

            }
            if (!new RegExp("[a-z]").test(vm.userchangepassword.password1)) {
              vm.strength2 = true;
              vm.strength = "**";

            }
            if (!new RegExp("[0-9]").test(vm.userchangepassword.password1)) {
              vm.strength3 = true;
              vm.strength = "**";

            }
            if (!new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])").test(vm.userchangepassword.password1)) {
              if (vm.administrator) {
                vm.strength4 = true;
                vm.strength = "**";
              }
            }

            var regex = new Array();
            regex.push("[A-Z]"); //Uppercase Alphabet.
            regex.push("[a-z]"); //Lowercase Alphabet.
            regex.push("[0-9]"); //Digit.
            regex.push("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])"); //Special Character.
            var passed = 0;
            //Validate for each Regular Expression.
            for (var i = 0; i < regex.length; i++) {
              if (new RegExp(regex[i]).test(vm.userchangepassword.password1)) {
                passed++;
              }
            }
            //Validate for length of Password.
            if (passed > 2 && vm.userchangepassword.password1.length >= vm.lettersize) {
              passed++;
            }
            //Display status.
            if (passed == 1) {
              vm.strengthlabel = $filter('translate')('0148');
              vm.color = "red";
              vm.data = '0';
            } else if (passed == 2) {
              vm.color = "orangered";
              vm.strengthlabel = $filter('translate')('0149');
              vm.data = '1';
            } else if (passed == 3) {
              vm.color = "orange";
              vm.strengthlabel = $filter('translate')('0150');
              vm.data = '2';
            } else if (passed == 4) {
              vm.color = "yellowgreen";
              vm.strengthlabel = $filter('translate')('0151');
              vm.data = '3';
            } else if (passed == 5) {
              vm.color = "green";
              vm.strengthlabel = $filter('translate')('0152');
              vm.data = '4';
            }
          }
        } else {
          vm.strength = "";
        }
      }
      vm.changepassword = function (form) {
        vm.viewvalited = false;
        if (vm.userchangepassword.password1 === vm.userchangepassword.password2) {
          if (vm.userchangepassword.password1 === vm.userchangepassword.passwordOld) {
            vm.viewvalited = true
          } else {
            var user = {
              "idUser": vm.idchangepassword,
              "userName": vm.user.username,
              "passwordOld": vm.user.password,
              "passwordNew": vm.userchangepassword.password1,
              "type": vm.idrol
            }
            return userDS.changepasswordexpirit(user).then(function (data) {
              if (data.status === 200) {
                vm.save = true;
                $uibModalInstance.close(vm.save);
              }
            }, function (error) {
              error.data.errorFields.forEach(function (value) {
                var item = value.split('|');
                if (item[0] === '1') {
                  vm.viewvalited = true
                }
              });
            })
          }
        }
      };
      vm.cancel = function () {
        vm.save = false;
        $uibModalInstance.dismiss('cancel');
      };
    })
    .controller('LoginController', LoginController);

  LoginController.$inject = ['configurationDS', 'localStorageService', '$filter', '$sce',
    'authService', '$state', 'usertypesDS', 'logger', 'userDS', '$uibModal', '$location'];
  /* @ngInject */
  function LoginController(configurationDS, localStorageService, $filter, $sce,
    authService, $state, usertypesDS, logger, userDS, $uibModal, $location) {
    var vm = this;
    vm.title = 'Login';
    vm.usertype = 1;
    vm.getconfiguration = getconfiguration;
    vm.arrayslist = arrayslist;
    vm.Send = Send;
    vm.loadtermsandConditions = loadtermsandConditions;
    vm.login = login;
    vm.user = {};
    vm.menssageInvalid = '';
    vm.viewforgetpassword = false;
    vm.user.location = 1;
    vm.getusertype = getusertype;
    vm.getDocumenttype = getDocumenttype;
    vm.getDemoConsultaWeb = getDemoConsultaWeb;
    vm.viewtermsandConditions = viewtermsandConditions;
    vm.forgetpassword = forgetpassword;
    vm.resetpassword = resetpassword;
    vm.changepasswordview = changepasswordview;
    vm.messageupdatepassword = '';
    vm.Language = $filter('translate')('0000') === 'es' ? 'es' : 'en';
    vm.widgetId = null;
    vm.viewupdatepassword = $location.$$search.token === undefined || $location.$$search.token === null ? false : true;
    vm.validatedcapchated = false;
    vm.validateslogin = validateslogin;
    
    vm.listconfiguration = [{
      "key": "CuerpoEmail",//0
      "value": ""
    },
    {
      "key": "Captcha",//1
      "value": false
    },
    {
      "key": "CambioContraseña",//2
      "value": false
    },
    {
      "key": "TerminosCondiciones",//3
      "value": ""
    }, {
      "key": "URL",//4
      "value": ""
    },
    {
      "key": "Color",//5
      "value": ""
    },
    {
      "key": "Entidad",//6
      "value": ""
    },
    {
      "key": "Logo",//7
      "value": ""
    },
    {
      "key": "Banner",//8
      "value": ""
    },
    {
      "key": "Informacion",//9
      "value": ""
    },
    {
      "key": "Informacion2",//10
      "value": ""
    },
    {
      "key": "Titulo",//11
      "value": ""
    },
    {
      "key": "ManejoTipoDocumento",//12
      "value": ""
    },
    {
      "key": "SessionExpirationTime",//13
      "value": ""
    },
    {
      "key": "URL",//14
      "value": ""
    }
    ];

    vm.getconfiguration();

    function getconfiguration() {
      vm.viewdemografhip = false;
      vm.viewdemogra = false;
      vm.viewtype = false;
      return configurationDS.getConfiguration().then(function (data) {
        if (data.status === 200) {
          vm.arrayslist(data);
          vm.getusertype();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    function validateslogin(validated) {
      if (vm.listconfiguration !== undefined) {
        if (vm.listconfiguration[1].value) {
          if (!vm.validatedcapchated || validated) {
            return true;
          } else {
            return false;
          }
        } else {
          if (validated) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return true;
      }
    }
    function getusertype() {
      return usertypesDS.getusertype().then(function (data) {
        if (data.status === 200) {
          vm.PHYSICIAN = $filter('filter')(data.data, {
            type: 1
          }, true);
          vm.PHYSICIAN[0].image = vm.PHYSICIAN[0].image === '' ? 'images/physician.png' : 'data:image/jpeg;base64,' + vm.PHYSICIAN[0].image;

          vm.RATE = $filter('filter')(data.data, {
            type: 6
          }, true);

          if (vm.RATE.length === 0) {
            vm.RATE = [{
              confidential: false,
              image: 'images/physician.png',
              message: '',
              quantityOrder: 0,
              type: 6,
              visible: false
            }]
          } else {
            vm.RATE[0].image = vm.RATE[0].image === '' ? 'images/physician.png' : 'data:image/jpeg;base64,' + vm.RATE[0].image;
          }

          vm.PATIENT = $filter('filter')(data.data, {
            type: 2
          }, true);
          vm.PATIENT[0].image = vm.PATIENT[0].image === '' ? 'images/patient.png' : 'data:image/jpeg;base64,' + vm.PATIENT[0].image;


          vm.ACCOUNT = $filter('filter')(data.data, {
            type: 3
          }, true);
          vm.ACCOUNT[0].image = vm.ACCOUNT[0].image === '' ? 'images/patient.png' : 'data:image/jpeg;base64,' + vm.ACCOUNT[0].image;


          vm.USERLIS = $filter('filter')(data.data, {
            type: 4
          }, true);
          vm.USERLIS[0].image = vm.USERLIS[0].image === '' ? 'images/physician.png' : 'data:image/jpeg;base64,' + vm.USERLIS[0].image;
          vm.USERLIS[0].message = vm.USERLIS[0].message === '' ? 'Acceso a los usuarios del laboratorio' : vm.USERLIS[0].message;

          vm.USERDEMO = $filter('filter')(data.data, {
            type: 5
          }, true);
          vm.USERDEMO[0].image = vm.USERDEMO[0].image === '' ? 'images/patient.png' : 'data:image/jpeg;base64,' + vm.USERDEMO[0].image;

          if (vm.PHYSICIAN[0].visible === true) {
            vm.usertype = 1;
          }
          if (vm.RATE[0].visible === true) {
            vm.usertype = 6;
          } else if (vm.PATIENT[0].visible === true) {
            vm.usertype = 2;
          } else if (vm.ACCOUNT[0].visible === true) {
            vm.usertype = 3;
          } else if (vm.USERLIS[0].visible === true) {
            vm.usertype = 4;
          } else if (vm.USERDEMO[0].visible === true) {
            vm.usertype = 5;
          }
          else if (vm.RATE[0].visible === true) {
            vm.usertype = 6;
          } else {
            vm.usertype = 4;
          }
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    function Send() {
      vm.emailchanguepasword;
      vm.userchanguepasword;
    }
    function login(Form) {
      vm.menssageInvalid = '';
      vm.loading = true;
      Form.username.$touched = true;
      Form.password.$touched = true;
      vm.user.type = vm.usertype;
      if (vm.usertype === 2) {
        vm.user.historyType = vm.listconfiguration[12].value === 'True' ? vm.documentTypeSelect : 1;
      }
      if (Form.$valid) {
        vm.user.type = vm.user.type === undefined ? 4 : vm.user.type;
        vm.user.username = vm.username;
        vm.user.password = vm.Password;
        if (vm.user.username && vm.user.password) {
          vm.user.type = vm.user.type === undefined ? 4 : vm.user.type;
          return authService.login(vm.user).then(function (data) {
            if (data.data.success) {
              vm.loading = false;
              if (data.data.user.changePassword && data.data.user.type === 2) {
                vm.menssageInvalid = '';
                vm.userchangepassword = {
                  'password1': '',
                  'password2': ''
                }
                vm.administrator = data.data.user.administrator === 'true';
                vm.changepasswordview(data.data.user.id);
              } else {
                $state.go('dashboard');
                /* if (data.data.user.licenses.CWB === false) {
                  vm.menssageInvalid = $filter('translate')('0171');
                } else {
                  $state.go('dashboard');
                } */
              }
            }
          },
            function (error) {
              if (error.data.errorFields !== null) {
                if (error.data.errorFields[0] === 'La licencia registrada ha expirado.') {
                  vm.menssageInvalid = $filter('translate')('0180');
                  vm.loading = false;
                } else {
                  error.data.errorFields.forEach(function (value) {
                    var item = value.split('|');
                    if (item[0] === '1' && item[1] === 'LDAP The authentication is not supported by the server') {
                      vm.menssageInvalid = $filter('translate')('0175');
                    }
                    if (item[0] === '2' && item[1] === 'Incorrect password or username LDAP') {
                      vm.menssageInvalid = $filter('translate')('0176');
                    }
                    if (item[0] === '3' && item[1] === 'LDAP fail conection') {
                      vm.menssageInvalid = $filter('translate')('0177');
                    }
                    if (item[0] === '4') {

                      if (item[1] === 'inactive user') {
                        vm.menssageInvalid = $filter('translate')('0164');
                      } else {
                        vm.menssageInvalid = $filter('translate')('0017');
                      }
                    }
                    if (item[0] === '5') {
                      if (item[2] !== undefined) {
                        if (item[2] === '1') {
                          vm.menssageInvalid = $filter("translate")("0242") + " 2 " + $filter("translate")("0245")
                          vm.Repeat = true;
                        } else if (item[2] === '2') {
                          vm.menssageInvalid = $filter("translate")("0242") + " 1 " + $filter("translate")("0243")
                          vm.Repeat = true;
                        } else if (item[2] === '3') {
                          vm.menssageInvalid = $filter("translate")("0247");
                          vm.Repeat = true;
                        } else {
                          vm.menssageInvalid = $filter("translate")("0242") + item[2] + $filter("translate")("0245")
                          vm.Repeat = true;
                        }
                      } else {
                        vm.menssageInvalid = $filter('translate')('0244');
                      }
                      $uibModal.open({
                        animation: true,
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'passwordwarning.html',
                        controller: 'passwordwarningCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                          menssageInvalid: function () {
                            return vm.menssageInvalid;
                          }
                        }
                      });
                    }
                    if (item[0] === '3') {
                      vm.menssageInvalid = $filter("translate")("0247");
                      $uibModal.open({
                        animation: true,
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'passwordwarning.html',
                        controller: 'passwordwarningCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                          menssageInvalid: function () {
                            return vm.menssageInvalid;
                          }
                        }
                      });
                    }
                    if (item[0] === '6') {
                      vm.menssageInvalid = $filter('translate')('0019');

                      if (item[1] === 'password expiration date') {
                        vm.menssageInvalid = '';
                        vm.userchangepassword = {
                          'password1': '',
                          'password2': ''
                        }
                        vm.administrator = item[3] === 'true';
                        vm.changepasswordview(item[2]);
                      } else {
                        vm.menssageInvalid = $filter('translate')('0165');
                      }

                    }
                    if (item[0] === '7') {
                      if (item[1] === 'change password') {
                        vm.menssageInvalid = '';
                        vm.userchangepassword = {
                          'password1': '',
                          'password2': ''
                        }
                        vm.administrator = item[3] === 'true';
                        vm.changepasswordview(item[2]);
                      }
                    }
                    if (item[0] === '8') {
                      vm.menssageInvalid = $filter('translate')('0188');
                    }
                  });
                  vm.loading = false;
                }
              } else {
                vm.menssageInvalid = $filter('translate')('0017');
                vm.Error = error;
                vm.PopupError = true;
              }
            }
          );
        } else {
          logger.info('the form is uncomplete');
        }
      } else {
        logger.info('the form is uncomplete');
      }
    }
    function loadtermsandConditions(string) {
      return $sce.trustAsHtml(string);
    }
    function arrayslist(data) {
      var config = JSON.parse(atob(unescape(encodeURIComponent(data.data[0].value))));
      config.forEach(function (value, key) {
        /*  localStorageService.set(value.key, value.value); */
        value.key = atob(unescape(encodeURIComponent(value.key)));
        value.value = atob(unescape(encodeURIComponent(value.value)));
        if (value.key === 'FondoLogin') {
          vm.backgroundlogin = value.value;
        }
        if (value.key === 'ManejoTipoDocumento' && value.value === 'True') {
          vm.viewtype = true;
          vm.getDocumenttype();
        }
        if (value.key === 'ManejoDemograficoConsultaWeb' && value.value === 'True') {
          vm.viewdemogra = true;
          vm.getDemoConsultaWeb();
        }

        if (value.key === 'CuerpoEmail') {
          vm.listconfiguration[0].value = value.value;
          document.getElementById("content-email").innerHTML = vm.listconfiguration[0].value;
        }

        if (value.key === 'Captcha') {
          vm.listconfiguration[1].value = value.value.toLowerCase() === 'false' ? false : true;
        }

        if (value.key === 'CambioContraseña') {
          vm.listconfiguration[2].value = value.value.toLowerCase() === 'false' ? false : true;
        }

        if (value.key === 'TerminosCondiciones') {
          vm.listconfiguration[3].value = value.value;
        }

        if (value.key === 'URL') {
          vm.listconfiguration[4].value = value.value;
        }

        if (value.key === 'Color') {
          vm.listconfiguration[5].value = value.value === '' ? 'rgb(112, 150, 222)' : value.value;
        }

        if (value.key === 'Entidad') {
          vm.listconfiguration[6].value = value.value;
        }

        if (value.key === 'Logo') {
          vm.listconfiguration[7].value = value.value;
        }

        if (value.key === 'Banner') {
          vm.listconfiguration[8].value = value.value;
        }

        if (value.key === 'Informacion') {
          vm.listconfiguration[9].value = value.value;
        }

        if (value.key === 'Informacion2') {
          vm.listconfiguration[10].value = value.value;
        }

        if (value.key === 'Titulo') {
          vm.listconfiguration[11].value = value.value;
        }

        if (value.key === 'ManejoTipoDocumento') {
          vm.listconfiguration[12].value = value.value;
        }

        if (value.key === 'SessionExpirationTime') {
          vm.listconfiguration[13].value = value.value;
        }

        if (value.key === 'URL') {
          vm.listconfiguration[14].value = value.value;
        }
        if (value.key === 'ServiciosLISUrl' ||
          value.key === 'SessionExpirationTime' ||
          value.key === 'SecurityPolitics' ||
          value.key === 'Color' ||
          value.key === 'TerminosCondiciones' ||
          value.key === 'Informacion' ||
          value.key === 'Informacion2' ||
          value.key === 'Logo' ||
          value.key === 'Banner' ||
          value.key === 'Entidad' ||
          value.key === 'Titulo' ||
          value.key === 'FormatoFecha' ||
          value.key === 'BusquedaOrden' ||
          value.key === 'Historico' ||
          value.key === 'HistoricoGrafica' ||
          value.key === 'HistoricoCombinado' ||
          value.key === 'DigitosOrden' ||
          value.key === 'HistoriaAutomatica' ||
          value.key === 'ManejoTipoDocumento' ||
          value.key === 'BloqueaPanicos' ||
          value.key === 'PathFE' ||
          value.key === 'directReportPrint' ||
          value.key === 'ManejoDemograficoConsultaWeb' ||
          value.key === 'EmpaquetarOrdenesCliente' ||
          value.key === 'FiltroRangoFecha' ||
          value.key === 'VerReporteResultados' ||
          value.key === 'DosNombresPaciente' ||
          value.key === 'DosApellidosPaciente' ||
          value.key === 'AniosConsultas' ||
          value.key === 'VerNombreExamen' ||
          value.key === 'VerPreliminar'

        ) {
          localStorageService.set(value.key, value.value);
        }
      });
    }
    function getDocumenttype() {
      vm.listDocumentype = [];
      var token = localStorageService.get('auto');
      return configurationDS.getDocumentype(token).then(function (data) {
        if (data.status === 200) {
          vm.listDocumentype = data.data;
          vm.documentTypeSelect = vm.listDocumentype[0].id
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    function getDemoConsultaWeb() {
      var token = localStorageService.get('auto');
      return configurationDS.getwebquery(token).then(function (data) {
        if (data.status === 200) {
          vm.demoname = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    function forgetpassword() {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'forgetpassword.html',
        controller: 'ModalforgetpasswordCtrl',
        controllerAs: 'vm',
        resolve: {
          listconfiguration: function () {
            return vm.listconfiguration;
          },
          usertype: function () {
            return vm.usertype;
          }
        }
      });
    }
    function viewtermsandConditions() {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'Conditions.html',
        controller: 'ModalConditionsCtrl',
        controllerAs: 'vm',
        size: 'lg',
        resolve: {
          listconfiguration: function () {
            return vm.listconfiguration;
          }
        }
      });
    }
    function resetpassword() {
      vm.messageupdatepassword = '';
      if (vm.passwordupdate !== '' && vm.passwordupdaterepeat !== '') {
        if (vm.passwordupdate === vm.passwordupdaterepeat) {
          var user = {
            "password": vm.passwordupdate.password
          }
          return userDS.passwordreset($location.search().token, vm.passwordupdate).then(function (data) {
            logger.info($filter('translate')('0098'));
            setTimeout(function () {
              var url = new URL(window.location.href);
              url.search = '';
              var new_url = url.toString();
              window.location.replace(new_url);
            }, 500)
          }, function (error) {
            if (error.data.message === '3|password not set') {
              logger.info($filter('translate')('0099'));
              setTimeout(function () {
                var url = new URL(window.location.href);
                url.search = '';
                var new_url = url.toString();
                window.location.replace(new_url);
              }, 2000)
            } else {
              logger.info("El tiempo  para modificar la contraseña expiro");
              setTimeout(function () {
                var url = new URL(window.location.href);
                url.search = '';
                var new_url = url.toString();
                window.location.replace(new_url);
              }, 2000)
            }
          })
        } else {
          vm.messageupdatepassword = $filter('translate')('0100')
        }
      } else {
        vm.messageupdatepassword = $filter('translate')('0101');
      }
    }
    function changepasswordview(id) {
      var data = {
        "id": id,
        "administrator": vm.administrator,
        "userchangepassword": vm.userchangepassword,
        "user": vm.user,
        "idrol": vm.usertype
      }
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modalchangepassword.html',
        controller: 'changepassworduser',
        controllerAs: 'vm',
        resolve: {
          listconfiguration: function () {
            return data;
          }
        }
      });
      modalInstance.result.then(function (selected) {
        logger.success($filter('translate')('0022'));
        vm.user.password = '';
        vm.Password = '';
      });
      vm.loadingdata = false;
    }
  }
})();
