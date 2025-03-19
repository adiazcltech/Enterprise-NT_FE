(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$sce', 'usertypesDS', 'userDS', 'configurationDS', 'localStorageService', 'authService', 'logger', '$state', '$translate',
    '$filter', '$rootScope', '$location'
  ];

  /* @ngInject */
  function LoginController($sce, usertypesDS, userDS, configurationDS, localStorageService, authService, logger, $state, $translate, $filter, $rootScope, $location) {
    var vm = this;
    vm.title = 'Login';
    vm.login = login;
    vm.user = {};
    vm.changeLanguage = changeLanguage;
    vm.visibleBranch = false;
    vm.invalidUser = false;
    vm.invalidDate = false;
    vm.user.location = 1;
    vm.typepassword="password";
    $rootScope.menu = false;
    localStorage.clear();
    vm.errorservice = 0;
    vm.viewforgetpassword = false;
    vm.messagerecoverpassword = '';
    vm.messageupdatepassword = ''
    vm.usernamerecovery = '';
    vm.passwordupdate = '';
    vm.passwordupdaterepeat = '';
    vm.resetpassword = resetpassword;
    vm.getconfiguration = getconfiguration;
    vm.getusertype = getusertype;
    vm.passwordrecovery = passwordrecovery;
    vm.loadimageemail = loadimageemail;
    vm.arrayslist = arrayslist;
    vm.cbExpiration = cbExpiration;
    vm.setWidgetId = setWidgetId;
    vm.widgetId = null;
    vm.Language = $filter('translate')('0000') === 'es' ? 'es' : 'en';
    vm.loading = false;
    vm.keygoogle = {
      key: ''
    };
    vm.modalError = modalError;
    vm.loadtermsandConditions = loadtermsandConditions;
    vm.getDocumenttype = getDocumenttype;
    vm.CheckStrngth = CheckStrngth;
    vm.strength = "";
    vm.strengthlabel = $filter('translate')('0148');
    vm.color = "#999";
    vm.strength0 = true;
    vm.strength1 = true;
    vm.strength2 = true;
    vm.strength3 = true;
    vm.strength4 = true;
    vm.lettersize = 9;
    vm.changepasswordview = changepasswordview;
    vm.changepassword = changepassword;
    vm.getDemoConsultaWeb = getDemoConsultaWeb;
    vm.CheckStrngth1 = CheckStrngth1;
    vm.PHYSICIAN = [];
    vm.PATIENT = [];
    vm.ACCOUNT = [];
    vm.USERLIS = [];
    vm.USERDEMO = [];
    vm.viewupdatepassword = $location.search().token === undefined || $location.search().token === null ? false : true;
    vm.getconfiguration();
    setTimeout(function () {
      if ($filter('translate')('0000') === 'es') {
        vm.lenguaje = {
          id: 2,
          title: $filter('translate')('0015'),
          value: 'es',
          icon: 'images/españa.png'
        }
        kendo.culture("es-ES");
      } else {
        vm.lenguaje = {
          id: 1,
          title: $filter('translate')('0016'),
          value: 'en',
          icon: 'images/EEUU.png'
        }
        kendo.culture("en-US");
      }
      vm.langSwitcherOptions = [{
        id: 1,
        title: $filter('translate')('0016'),
        value: 'en',
        icon: 'images/EEUU.png'
      },
      {
        id: 2,
        title: $filter('translate')('0015'),
        value: 'es',
        icon: 'images/españa.png'
      }
      ];
      vm.customOptions = {
        dataSource: vm.langSwitcherOptions,
        dataTextField: "title",
        dataValueField: "value",
        valueTemplate: '<span> <img  src="{{dataItem.icon}}"></span><span style="font-size: 10px"> {{dataItem.title}}</span>',
        template: '<div style="font-size:10px"><span class="k-state-default"><img src="{{dataItem.icon}}"></span>' +
          '<span class="k-state-default"> {{dataItem.title}}</span></div>',
      };
    }, 100);

    function cbExpiration(langKey) {
      // vcRecaptchaService.reload(vm.widgetId);
    }

    vm.chagueviewpaswword=chagueviewpaswword;
    function chagueviewpaswword() {
      vm.typepassword=vm.typepassword==='password'? 'text':'password'
    }

    function loadtermsandConditions(string) {
      return $sce.trustAsHtml(string);
    }

    function setWidgetId(widgetId) {
      vm.widgetId = widgetId;
    }

    function CheckStrngth() {
      vm.viewvalited = false;
      vm.strength0 = false;
      vm.strength1 = false;
      vm.strength2 = false;
      vm.strength3 = false;
      vm.strength4 = false;
      vm.strength = "";
      vm.strengthlabel = $filter('translate')('0148');

      if (vm.passwordupdate === undefined) {
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

      if (vm.passwordupdate !== undefined) {
        vm.data = '';
        vm.strengthlabel = $filter('translate')('0148');
        if (vm.passwordupdate.length < vm.lettersize) {
          vm.strength0 = true;
          vm.strength = "**";
        }
        if (!new RegExp("[A-Z]").test(vm.passwordupdate)) {
          vm.strength1 = true;
          vm.strength = "**";

        }
        if (!new RegExp("[a-z]").test(vm.passwordupdate)) {
          vm.strength2 = true;
          vm.strength = "**";

        }
        if (!new RegExp("[0-9]").test(vm.passwordupdate)) {
          vm.strength3 = true;
          vm.strength = "**";

        }
        if (!new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])").test(vm.passwordupdate)) {
          vm.strength4 = true;
          vm.strength = "**";
          if (vm.administrator) {
            vm.strength = "**";
            1
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
          if (new RegExp(regex[i]).test(vm.passwordupdate)) {
            passed++;
          }
        }
        //Validate for length of Password.
        if (passed > 2 && vm.passwordupdate.length >= vm.lettersize) {
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
    }

    function login() {
      vm.loading = true;
      vm.invalidUser = false;
      vm.invalidDate = false;
      vm.typepassword='password';
      vm.menssageInvalid = '';
      vm.user.type = vm.idrol;
      if (vm.idrol === 2) {
        vm.user.historyType = vm.listconfiguration[12].value === 'True' ? vm.documentTypeSelect : -1;
      }
      if (vm.user.username && vm.user.password) {
        vm.user.type = vm.user.type === undefined ? 4 : vm.user.type;
        return authService.login(vm.user).then(function (data) {
          if (data.data.success) {
            vm.loading = false;
            if(data.data.user.changePassword && data.data.user.type===2){
              vm.menssageInvalid = '';
              vm.userchangepassword = {
                'password1': '',
                'password2': ''
              }
              vm.changepasswordview(data.data.user.id);
              vm.administrator = data.data.user.administrator === 'true';
            }else if (data.data.user.id === -1) {
              $state.go('typeuser');
            } else {
              if (data.data.user.licenses.CWB === false) {
                vm.menssageInvalid = $filter('translate')('0171');
              } else {
                $state.go('dashboard');
              }
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
                    vm.menssageInvalid = $filter('translate')('0018');
                  }
                  if (item[0] === '3') {
                    vm.menssageInvalid = $filter('translate')('0163');
                  }
                  if (item[0] === '6') {
                    vm.menssageInvalid = $filter('translate')('0019');

                    if (item[1] === 'password expiration date') {
                      vm.menssageInvalid = '';
                      vm.userchangepassword = {
                        'password1': '',
                        'password2': ''
                      }
                      vm.changepasswordview(item[2]);
                      vm.administrator = item[3] === 'true';

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
                      vm.changepasswordview(item[2]);
                      vm.administrator = item[3] === 'true';
                    }
                  }
                  if (item[0] === '8') {
                    vm.menssageInvalid = $filter('translate')('0188');
                  }
                });
                vm.loading = false;
              }
            } else {
              vm.Error = error;
              vm.PopupError = true;
            }
          }

        );
      } else {
        logger.info('the form is uncomplete');
      }
    }

    function changepasswordview(id) {
      vm.keySecurityPolitics = localStorageService.get('SecurityPolitics') === "True" ? true : false;
      vm.idchangepassword = parseInt(id);
      vm.lettersize = vm.administrator ? 12 : 9;
      vm.strength0 = true;
      vm.strength1 = true;
      vm.strength2 = true;
      vm.strength3 = true;
      vm.strength4 = true;
      vm.data = '';
      vm.color = "#999";
      // vm.strength = "";
      vm.messageerrorpassword = '';
      vm.strengthlabel = $filter('translate')('0148');
      if (vm.keySecurityPolitics) {
        UIkit.modal("#modalchangepassword1", {
          bgclose: false,
          escclose: false,
          modal: false
        }).show();
      } else {
        UIkit.modal("#modalchangepassword", {
          bgclose: false,
          escclose: false,
          modal: false
        }).show();
      }
      vm.loadingdata = false;
    }

    function CheckStrngth1() {
      vm.viewvalited = false;
      vm.strength0 = false;
      vm.strength1 = false;
      vm.strength2 = false;
      vm.strength3 = false;
      vm.strength4 = false;
      vm.strength = "";
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
          vm.strength4 = true;
          if (vm.administrator) {
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
    }

    function changeLanguage(langKey) {
      $translate.use(langKey.value);
      if (langKey.value === 'es') {
        kendo.culture("es-ES");
      } else {
        kendo.culture("en-US");
      }
    }

    function getconfiguration() {
      vm.viewdemografhip = false;
      vm.viewdemogra = false;
      return configurationDS.getConfiguration().then(function (data) {
        if (data.status === 200) {
          vm.backgroundlogin = $filter('filter')(data.data, {
            key: 'FondoLogin'
          }, true)[0].value
          vm.keygoogle = {
            key: $filter('filter')(data.data, {
              key: 'LlaveCaptcha'
            }, true)[0].value
          }
          data.data.forEach(function (value, key) {
            if (value.key === 'ManejoTipoDocumento' && value.value === 'True') {
              vm.getDocumenttype();
            }
            if (value.key === 'ManejoDemograficoConsultaWeb' && value.value === 'True') {
              vm.viewdemogra = true;
              vm.getDemoConsultaWeb();
            }
            return localStorageService.set(value.key, value.value);
          });


          vm.arrayslist(data.data);
          vm.getusertype();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    function getusertype() {
      return usertypesDS.getusertype().then(function (data) {
        if (data.status === 200) {
          vm.PHYSICIAN = $filter('filter')(data.data, {
            type: 1
          }, true);
          vm.PHYSICIAN[0].image = vm.PHYSICIAN[0].image === '' ? 'images/typeuser.png' : 'data:image/jpeg;base64,' + vm.PHYSICIAN[0].image;


          vm.PATIENT = $filter('filter')(data.data, {
            type: 2
          }, true);
          vm.PATIENT[0].image = vm.PATIENT[0].image === '' ? 'images/typeuser.png' : 'data:image/jpeg;base64,' + vm.PATIENT[0].image;


          vm.ACCOUNT = $filter('filter')(data.data, {
            type: 3
          }, true);
          vm.ACCOUNT[0].image = vm.ACCOUNT[0].image === '' ? 'images/typeuser.png' : 'data:image/jpeg;base64,' + vm.ACCOUNT[0].image;


          vm.USERLIS = $filter('filter')(data.data, {
            type: 4
          }, true);
          vm.USERLIS[0].image = vm.USERLIS[0].image === '' ? 'images/typeuser.png' : 'data:image/jpeg;base64,' + vm.USERLIS[0].image;

          vm.USERDEMO = $filter('filter')(data.data, {
            type: 5
          }, true);
          vm.USERDEMO[0].image = vm.USERDEMO[0].image === '' ? 'images/typeuser.png' : 'data:image/jpeg;base64,' + vm.USERDEMO[0].image;

          if (vm.PHYSICIAN[0].visible === true) {
            vm.idrol = 1;
          } else if (vm.PATIENT[0].visible === true) {
            vm.idrol = 2;
          } else if (vm.ACCOUNT[0].visible === true) {
            vm.idrol = 3;
          } else if (vm.USERLIS[0].visible === true) {
            vm.idrol = 4;
          } else if (vm.USERDEMO[0].visible === true) {
            vm.idrol = 5;
          }
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function getDocumenttype() {
      return configurationDS.getDocumentype().then(function (data) {
        if (data.status === 200) {
          vm.listDocumentype = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function getDemoConsultaWeb() {
      return configurationDS.getwebquery().then(function (data) {
        if (data.status === 200) {
          vm.demoname = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    function arrayslist(data) {
      vm.listconfiguration = [{
        "key": "CuerpoEmail",
        "value": $filter('filter')(data, {
          key: 'CuerpoEmail'
        }, true)[0].value
      },
      {
        "key": "Captcha",
        "value": ($filter('filter')(data, {
          key: 'Captcha'
        }, true)[0].value).toLowerCase() === 'false' ? false : true
      },
      {
        "key": "CambioContraseña",
        "value": ($filter('filter')(data, {
          key: 'CambioContraseña'
        }, true)[0].value).toLowerCase() === 'false' ? false : true
      },
      {
        "key": "TerminosCondiciones",
        "value": $filter('filter')(data, {
          key: 'TerminosCondiciones'
        }, true)[0].value
      }, {
        "key": "URL",
        "value": $filter('filter')(data, {
          key: 'URL'
        }, true)[0].value
      },
      {
        "key": "Color",
        "value": $filter('filter')(data, {
          key: 'Color'
        }, true)[0].value
      },
      {
        "key": "Titulo",
        "value": $filter('filter')(data, {
          key: 'Titulo'
        }, true)[0].value
      },
      {
        "key": "Logo",
        "value": $filter('filter')(data, {
          key: 'Logo'
        }, true)[0].value
      },
      {
        "key": "Banner",
        "value": $filter('filter')(data, {
          key: 'Banner'
        }, true)[0].value
      },
      {
        "key": "Informacion",
        "value": $filter('filter')(data, {
          key: 'Informacion'
        }, true)[0].value
      },
      {
        "key": "Informacion2",
        "value": $filter('filter')(data, {
          key: 'Informacion2'
        }, true)[0].value
      },
      {
        "key": "Entidad",
        "value": $filter('filter')(data, {
          key: 'Entidad'
        }, true)[0].value
      },
      {
        "key": "ManejoTipoDocumento",
        "value": $filter('filter')(data, {
          key: 'ManejoTipoDocumento'
        }, true)[0].value
      },
      {
        "key": "SessionExpirationTime",
        "value": $filter('filter')(data, {
          key: 'SessionExpirationTime'
        }, true)[0].value
      }
      ]

      if (vm.listconfiguration[1].value === true) {
        vm.keygoogle = {
          key: $filter('filter')(data, {
            key: 'LlaveCaptcha'
          }, true)[0].value
        }
      }

      vm.contentemail = vm.listconfiguration[0].value;

    }

    function passwordrecovery() {
      vm.loading = true;
      if (vm.usernamerecovery !== '') {

        return userDS.passwordrecovery(vm.usernamerecovery, vm.idrol, vm.history).then(function (data) {
          if (data.data[0].success) {

           // vm.loadimageemail();

            var contentemail = $('#content-email').html();

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
              attachment: vm.attachmentimageemail
            }

            return userDS.passwordrecoveryemail(data.data[0].token, email).then(function (data) {
              if (data.status === 200) {
                if(data.data==="Se a generado un error a la hora de hacer el envio"){
                  UIkit.modal("#modal-error").show();
                }else{

                  vm.viewforgetpassword = false;
                  vm.loading = false;
                  document.getElementById("content-email").innerHTML = vm.contentemail;
                  UIkit.modal("#modal-informative").show();
                  setTimeout(function () {
                    $state.go('login');
                  }, 1000)
                }
              } else if (data.statusText === "Internal Server Error") {
                if (data.data.message === "2|user not found") {
                  vm.messagerecoverpassword = "Usuario no encontrado"
                } else {

                }
                setTimeout(function () {
                  $state.go('login');
                }, 1000)
                vm.loading = false;
              }
            })
          }
        },
          function (error) {
            if (error.data.code === 0) {
              if (error.data.message === '3|mail not found') {
                vm.messagerecoverpassword = $filter('translate')('0095')
              } else {
                vm.messagerecoverpassword = $filter('translate')('0096')
              }
            }
            vm.loading = false;
          });
      } else {
        vm.messagerecoverpassword = $filter('translate')('0097')
        vm.loading = false;
      }
    }

    function resetpassword() {
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
              vm.messageupdatepassword = $filter('translate')('0099')
            }
          })
        } else {
          vm.messageupdatepassword = $filter('translate')('0100')
        }
      } else {
        vm.messageupdatepassword = $filter('translate')('0101');
      }
    }

    function changepassword(form) {
      vm.viewvalited = false;
      if (vm.strength === '' && vm.userchangepassword.password1 === vm.userchangepassword.password2) {
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
              if (vm.keySecurityPolitics) {
                UIkit.modal("#modalchangepassword1").hide();
              } else {
                UIkit.modal("#modalchangepassword").hide();
              }

              logger.success($filter('translate')('0022'));
              vm.user.password = '';
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
    }

    function loadimageemail() {
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
  }
})();
