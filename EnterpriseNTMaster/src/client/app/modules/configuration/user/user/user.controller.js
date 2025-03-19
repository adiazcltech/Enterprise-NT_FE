(function () {
  'use strict';
  angular
    .module('app.user')
    .filter('passwordCount', [function () {
      return function (value, peak) {
        value = angular.isString(value) ? value : '';
        peak = isFinite(peak) ? peak : 7;
        return value && (value.length >= peak ? peak + '+' : value.length);
      };
    }])
    .controller('UserdependenceController', UserdependenceController)
    .controller('UsersController', UsersController);

  UsersController.$inject = ['userDS', 'localStorageService', 'logger', 'ModalService', 'ordertypeDS', 'demographicDS', 'demographicsItemDS',
    'areaDS', 'roleDS', 'branchDS', 'configurationDS', '$filter', '$state', 'moment', '$rootScope', '$translate', 'LZString'
  ];

  function UsersController(userDS, localStorageService, logger, ModalService, ordertypeDS, demographicDS, demographicsItemDS,
    areaDS, roleDS, branchDS, configurationDS, $filter, $state, moment, $rootScope, $translate, LZString) {

    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Users';
    vm.sortReverse = false;
    vm.sortType = 'userName';
    vm.sortReverserole = false;
    vm.sortTyperole = 'name';
    vm.sortReversearea = false;
    vm.sortTypearea = 'id';
    vm.sortReversebran = false;
    vm.sortTypebra = 'id';
    vm.selected = -1;
    vm.usersDetail = [];
    vm.isAuthenticate = isAuthenticate;
    vm.getListOrderTypes = getListOrderTypes;
    vm.getUsers = getUsers;
    vm.getUsersId = getUsersId;
    vm.getAreaActive = getAreaActive;
    vm.getRoleActive = getRoleActive;
    vm.getDemographicsActive = getDemographicsActive;
    vm.getBranchActive = getBranchActive;
    vm.NewUsers = NewUsers;
    vm.EditUsers = EditUsers;
    vm.changeState = changeState;
    vm.changeEditPatients = changeEditPatients;
    vm.changePassword = changePassword;
    vm.changeCheckAreas = changeCheckAreas;
    vm.changeCheckValid = changeCheckValid;
    vm.cancelUsers = cancelUsers;
    vm.insertUsers = insertUsers;
    vm.updateUsers = updateUsers;
    vm.saveUsers = saveUsers;
    vm.stateButton = stateButton;
    vm.modalError = modalError;
    vm.modalRequired = false;
    vm.modalrequiredPrueba = modalrequiredPrueba;
    vm.dateActivateUser = '';
    vm.dateExpirateUser = '';
    vm.dateExpiratePassword = '';
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.requiredRoles = true;
    vm.requiredBranches = true;
    vm.validMail = /^[a-z]+[a-z0-9._]+@[a-z0-9._-]+\.[a-z.]{2,5}$/;
    var auth;
    vm.imageempty = false;
    vm.validDateExpirateUse = validDateExpirateUse;
    vm.validDateActivateUser = validDateActivateUser;
    vm.loadingdata = true;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    vm.validatedroles = validatedroles;
    vm.CheckStrngth = CheckStrngth;
    vm.strengthlabel = $filter('translate')('1080');
    vm.viewvalidatedpassword = false;
    vm.strength = "";
    vm.lettersize = 9;
    vm.listdemographicItems = [{
      "id": 0,
      "name": '--' + $filter('translate')('0504') + '--'
    }];
    vm.requeridemo = false;
    vm.demolist = [];
    vm.disablecontrol = false;
    vm.data = '';
    vm.color = "#999";
    vm.strength0 = true;
    vm.strength1 = true;
    vm.strength2 = true;
    vm.strength3 = true;
    vm.strength4 = true;
    vm.valueexpiration = false;
    vm.getDemographic = getDemographic;
    vm.getDemographicsItems = getDemographicsItems;
    //** Metodo para validar las roles para las politicas de seguridad**//
    function validatedroles() {
      if (!vm.SecurityPolitics) {
        if (vm.isDisabled) {
          vm.disablecontrol = false;
        } else {
          vm.disablecontrol = true;
        }
      } else {
        if (vm.isDisabled) {
          vm.disablecontrol = false;
        } else {
          vm.disablecontrol = false;
          if (vm.dataRoles !== undefined) {
            vm.disablecontrol = false;
            var compare = $filter('filter')(vm.dataRoles, {
              access: true
            })
            if (compare.length === 0) {
              logger.warning($filter('translate')('1099'));
            } else {
              vm.disablecontrol = true;
              vm.administrator = $filter('filter')(compare, {
                administrator: true
              }).length === 0 ? false : true;
              vm.lettersize = vm.administrator ? 12 : 9;
            }
          }
        }
      }
    }
    //** Metodo para validar la fecha de expiración**//
    function changePassword() {
      vm.dateExpiratePassword = vm.confirmPassword === vm.usersDetail.password &&
        vm.confirmPassword !== '' && vm.usersDetail.password !== '' &&
        vm.confirmPassword !== undefined && vm.usersDetail.password !== undefined ?
        new Date(moment().add(vm.keyDays, 'days').format()) : '';
    }
    //** Metodo para validar las politicas de seguridad**//
    function CheckStrngth() {
      if (!vm.SecurityPolitics) {
        vm.dateExpiratePassword = vm.confirmPassword === vm.usersDetail.password &&
          vm.confirmPassword !== '' && vm.usersDetail.password !== '' &&
          vm.confirmPassword !== undefined && vm.usersDetail.password !== undefined ?
          new Date(moment().add(vm.keyDays, 'days').format()) : '';
      } else {
        vm.viewvalidatedpassword = true;
        vm.viewvalited = false
        vm.strengthlabel = $filter('translate')('1080');
        vm.strength0 = false;
        vm.strength1 = false;
        vm.strength2 = false;
        vm.strength3 = false;
        vm.strength4 = false;
        vm.strength = "";
        if (vm.usersDetail.password === undefined) {
          if (vm.usersDetail.id !== null) {
            vm.strength = "";
          }
          vm.data = '';
          vm.color = "#999";
          vm.strength0 = true;
          vm.strength1 = true;
          vm.strength2 = true;
          vm.strength3 = true;
          vm.strength4 = true;
          vm.viewvalidatedpassword = false;
          vm.dateExpiratePassword = new Date(moment().add(vm.keyDays, 'days').format());
        }
        if (vm.usersDetail.password !== undefined) {
          vm.data = '';
          vm.strengthlabel = $filter('translate')('1080');
          vm.strength = "";
          if (vm.usersDetail.password.length < vm.lettersize) {
            vm.strength0 = true;
            vm.strength = "**";
          }
          if (!new RegExp("[A-Z]").test(vm.usersDetail.password)) {
            vm.strength1 = true;
            vm.strength = "**";

          }
          if (!new RegExp("[a-z]").test(vm.usersDetail.password)) {
            vm.strength2 = true;
            vm.strength = "**";

          }
          if (!new RegExp("[0-9]").test(vm.usersDetail.password)) {
            vm.strength3 = true;
            vm.strength = "**";
          }
          if (!new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])").test(vm.usersDetail.password)) {
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
            if (new RegExp(regex[i]).test(vm.usersDetail.password)) {
              passed++;
            }
          }
          //Validate for length of Password.
          if (passed > 2 && vm.usersDetail.password.length >= vm.lettersize) {
            passed++;
          }
          //Display status.
          if (passed == 1) {
            vm.strengthlabel = $filter('translate')('1080');
            vm.color = "red";
            vm.data = '0';
          } else if (passed == 2) {
            vm.color = "orangered";
            vm.strengthlabel = $filter('translate')('1081');
            vm.data = '1';
          } else if (passed == 3) {
            vm.color = "orange";
            vm.strengthlabel = $filter('translate')('1082');
            vm.data = '2';
          } else if (passed == 4) {
            vm.color = "yellowgreen";
            vm.strengthlabel = $filter('translate')('1083');
            vm.data = '3';
          } else if (passed == 5) {
            vm.color = "green";
            vm.strengthlabel = $filter('translate')('1084');
            vm.data = '4';
          }
          if (vm.usersDetail.password === vm.confirmPassword) {
            vm.dateExpiratePassword = new Date(moment().add(vm.keyDays, 'days').format());
          }
        }
        if (vm.usersDetail.id !== null && vm.usersDetail.password === '') {
          vm.strength = "";
          vm.viewvalidatedpassword = false;
        }
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getListOrderTypes();
        if (data.status === 200) {
          vm.formatDateControl = data.data.value;
          vm.formatDate = data.data.value.toUpperCase();
          var today = new Date();
          vm.optionsDateActivateUser = {
            formatYear: 'yyyy',
            maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
            minDate: new Date(),
            startingDay: 1
          };
          vm.optionsDateExpirateUser = {
            formatYear: 'yyyy',
            maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
            minDate: new Date(),
            startingDay: 1
          };
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que consulta una lista de tipo de ordenes**//
    function getListOrderTypes() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        vm.getDemographic();
        if (data.status === 200) {
          vm.ListOrderTypes = $filter('orderBy')(data.data, 'name');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene los demograficos activos*//
    function getDemographic() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsALL(auth.authToken).then(function (dataDemo) {
        vm.getUsers();
        vm.demolist = [];
        if (dataDemo.status === 200) {
          vm.demolist = [{
            "id": 0,
            "name": '--' + $filter('translate')('0504') + '--'
          }]
          dataDemo.data.forEach(function (value, key) {
            switch (value.id) {
              case -1:
                value.name = $filter('translate')('0248');
                break;
              case -2:
                value.name = $filter('translate')('0225');
                break;
              case -3:
                value.name = $filter('translate')('0307');
                break;
              case -4:
                value.name = $filter('translate')('0133');
                break;
              case -5:
                value.name = $filter('translate')('0075');
                break;
              case -6:
                value.name = $filter('translate')('0175');
                break;
              case -7:
                value.name = $filter('translate')('0174');
                break;
              case -10:
                value.name = $filter('translate')('0645');
                break;
              default:
                value.name = value.name;
            }
            if (value.encoded) {
              var datademo = {
                "id": value.id,
                "name": value.name
              }
              vm.demolist.add(datademo);
            }
          });
          vm.demolist = $filter('orderBy')(vm.demolist, 'name');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para consultar los item demográfico segun el padre**//
    function getDemographicsItems(id, valid) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.listdemographicItems = [];
      return demographicsItemDS.getDemographicsItemsAll(auth.authToken, -1, id).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value, key) {
            vm.listdemographicItems.push({
              'id': value.demographicItem.id,
              'name': value.demographicItem.name
            });
          })
          vm.listdemographicItems = $filter('orderBy')(vm.listdemographicItems, 'name');
          var data = {
            "id": 0,
            "name": '--' + $filter('translate')('0504') + '--'
          }
          vm.listdemographicItems.add(data);
          if (valid) {
            vm.usersDetail.demographicItemQuery = 0;
          } else {
            vm.usersDetail.demographicItemQuery = vm.iddemographicItemQuery;
          }
        } else {
          vm.listdemographicItems = [{
            "id": 0,
            "name": '--' + $filter('translate')('0504') + '--'
          }];
          vm.usersDetail.demographicItemQuery = 0;

        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que consulta una lista de usuarios**//
    function getUsers() {
      vm.requeridemo = false;
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.dataUsers = [];
      return userDS.getUserssimple(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.valueexpiration = false;
          vm.disablecontrol = false;
          vm.viewvalidatedpassword = false;
          var datauser = _.filter(data.data, function (e) {
            return e.type.id === 11
          });
          vm.dataUsers = datauser.length === 0 ? [] : removeData(datauser)
          vm.Usersnotlaboratory = _.filter(data.data, function (e) {
            return e.type.id !== 11
          });
          vm.confirmPassword = vm.usersDetail.password;
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que agrega item a la lista de usuarios**//
    function removeData(data) {
      data.forEach(function (value, key) {
        data[key].searh = value.userName + value.name + value.lastName
        data[key].nameuserall = value.name + ' ' + value.lastName
      });
      return data;
    }
    //** Metodo para validar la fecha de expiración del usuario**//
    function validDateExpirateUse() {
      vm.validExpirateUser = true;
      vm.dateExpirateUser = vm.dateExpirateUser === undefined ? '' : vm.dateExpirateUser
      if (moment(vm.dateActivateUser).isValid()) {
        var validdateactivation = moment(vm.dateActivateUser).add(3, 'years');
        if (!moment(vm.dateExpirateUser).isValid() ||
          moment(moment(vm.dateExpirateUser).format("YYYYMMDD")).isBefore(moment(vm.dateActivateUser).format("YYYYMMDD")) ||
          moment(moment(validdateactivation).format("YYYYMMDD")).isBefore(moment(vm.dateExpirateUser).format("YYYYMMDD"))) {
          vm.dateExpirateUser = "";
          vm.validExpirateUser = false;
        } else if (moment(vm.dateExpirateUser).isValid()) {

          if (true) { }
        }
      }

    }
    //** Metodo para validar la fecha de activación del usuario**//
    function validDateActivateUser() {
      vm.validActivateUser = true;
      vm.dateActivateUser = vm.dateActivateUser === undefined ? '' : vm.dateActivateUser
      if (moment(vm.dateActivateUser).isValid() && moment(moment().format("YYYYMMDD")).isSameOrBefore(moment(vm.dateActivateUser).format("YYYYMMDD"))) {

        var today = new Date(vm.dateActivateUser);
        vm.optionsDateExpirateUser = {
          formatYear: 'yyyy',
          maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
          minDate: vm.dateActivateUser,
          startingDay: 1
        };

        if (moment(moment(vm.dateExpirateUser).format("YYYYMMDD")).isBefore(moment(vm.dateActivateUser).format("YYYYMMDD"))) {
          vm.dateExpirateUser = "";
        }
      } else {
        if (!moment(moment(vm.usersDetail.activation).format("YYYYMMDD")).isSame(moment(vm.dateActivateUser).format("YYYYMMDD"))) {
          vm.dateActivateUser = "";
          vm.dateExpirateUser = "";
          vm.validActivateUser = false;
        }
      }
    }
    //** Metodo que contruye un objeto para el nuevo usuario**//
    function NewUsers(Usersform) {
      vm.sortReverse = false;
      vm.sortType = 'userName';
      vm.sortReverserole = false;
      vm.sortTyperole = 'name';
      vm.sortReversearea = false;
      vm.sortTypearea = 'name';
      vm.sortReversebran = false;
      vm.sortTypebra = 'name';
      vm.valueexpiration = false;
      vm.identificationRepeat = false;
      vm.usersNameRepeat = false;
      vm.disablecontrol = false;
      vm.viewvalited = false
      vm.viewvalidatedpassword = false;
      vm.imageempty = false;
      vm.getRoleActive();
      Usersform.$setUntouched();
      vm.usuario = '';
      vm.dateActivateUser = '';
      vm.dateExpirateUser = '';
      vm.dateExpiratePassword = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.data = '';
      vm.color = "#999";
      vm.strength0 = true;
      vm.strength1 = true;
      vm.strength2 = true;
      vm.strength3 = true;
      vm.strength4 = true;
      var today = new Date();
      vm.optionsDateActivateUser = {
        formatYear: 'yyyy',
        maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
        minDate: new Date(),
        startingDay: 1
      };
      vm.optionsDateExpirateUser = {
        formatYear: 'yyyy',
        maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
        minDate: new Date(),
        startingDay: 1
      };
      vm.usersDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'lastName': '',
        'userName': '',
        'state': true,
        'activation': null,
        'expiration': null,
        'passwordExpiration': null,
        'identification': null,
        'email': null,
        'signature': '',
        'signatureCode': null,
        'maxDiscount': 0,
        'type': {
          'id': 11
        },
        'demographicQuery': 0,
        'demographicItemQuery': 0,
        'photo': '',
        'confidential': false,
        'printInReports': false,
        'addExams': false,
        'secondValidation': false,
        'editPatients': false,
        'quitValidation': false,
        'creatingItems': false,
        'printResults': false,
        'editingResultsProcessing': false,
        'transplantManagement': 0,
        'areas': [],
        'branches': [],
        'updatetestentry': false,
        'roles': [],
        'orderType': {
          'id': 1
        },
        'editOrderCash': false,
        'removeCashBox': false,
        'certificationProfessional': null,
        'accessPortalWeb': false,
      };
      if (!vm.SecurityPolitics) {
        vm.disablecontrol = false;
      }
      vm.stateButton('add');
      vm.requiredRoles = true;
      vm.requiredBranches = true;
      vm.modalRequired = false;
    }
    //** Metodo que valida cuando selecciona un area**//
    function changeCheckAreas() {
      vm.dataAreas.forEach(function (value) {
        if (value.id !== 1) {
          value.access = vm.areasAll;
        }
      });
    }
    //** Metodo que valida cuando selecciona todas las area**//
    function changeCheckValid() {
      vm.dataAreas.forEach(function (value) {
        if (value.id !== 1 && value.access) {
          value.validate = vm.validateAll && value.access;
        }
      });
    }
    //** Método que deshabilitar los controles y botones para cancelar un usuario**//
    function cancelUsers(UsersForm) {
      vm.requeridemo = false;
      vm.sortReverse = false;
      vm.sortType = 'userName';
      vm.sortReverserole = false;
      vm.sortTyperole = 'name';
      vm.sortReversearea = false;
      vm.sortTypearea = 'name';
      vm.sortReversebran = false;
      vm.sortTypebra = 'name';
      vm.valueexpiration = false;
      vm.identificationRepeat = false;
      vm.usersNameRepeat = false;
      vm.disablecontrol = false;
      vm.viewvalited = false
      vm.viewvalidatedpassword = false;
      vm.imageempty = false;
      UsersForm.$setUntouched();
      vm.typeIncorrect = false;
      vm.requiredRoles = true;
      vm.requiredBranches = true;
      vm.validExpirateUser = true;
      vm.validActivateUser = true;
      if (vm.usersDetail.id === null || vm.usersDetail.id === undefined) {
        vm.usersDetail = [];
        vm.validMail = /^[a-z]+[a-z0-9._]+@[a-z0-9._-]+\.[a-z.]{2,5}$/;
        vm.dateActivateUser = '';
        vm.dateExpirateUser = '';
        vm.dateExpiratePassword = '';
      } else {
        vm.getUsersId(vm.usersDetail.id, vm.selected, UsersForm);
        vm.usersDetail.email = '';
      }
      vm.stateButton('init');
      vm.usersNameRepeat = false;
      vm.identificationRepeat = false;
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo usuario**//
    function EditUsers() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo usuario o se va actualizar **//
    function saveUsers(UsersForm) {
      vm.loadingdata = true;
      vm.requeridemo = false;
      if (vm.usersDetail.demographicQuery !== 0 && vm.usersDetail.demographicItemQuery === 0) {
        vm.loadingdata = false;
        return vm.requeridemo = true;
      }
      vm.valueexpiration = false;
      vm.identificationRepeat = false;
      vm.usersNameRepeat = false;
      vm.viewvalited = false;
      vm.imageempty = false;
      UsersForm.identity.$touched = true;
      UsersForm.name.$touched = true;
      UsersForm.lastName.$touched = true;
      UsersForm.email.$touched = true;
      UsersForm.userName.$touched = true;
      if (vm.usersDetail.id === null) {
        UsersForm.password.$touched = true;
        UsersForm.confirmPassword.$touched = true;
      }
      if (vm.usersDetail.photo === '') {
        vm.imageempty = true;
        vm.loadingdata = false;
      }
      // Se arama el json para la lista de roles
      var roles = [];
      vm.dataRoles.forEach(function (value) {
        var role = {
          'id': value.id,
          'name': value.name
        };
        if (value.access) {
          roles.push({
            'access': true,
            'role': role
          });
        }
      });
      vm.usersDetail.roles = roles;
      // Se arama el json para la lista de sedes
      var branches = [];
      vm.dataBranches.forEach(function (value) {
        var branch = {
          'id': value.id,
          'name': value.name
        };
        if (value.access) {
          branches.push({
            'access': true,
            'batchPrint': value.batchPrint === undefined ? false : value.batchPrint,
            'branch': branch
          });
        }
      });
      vm.usersDetail.branches = branches;
      vm.loadingdata = roles.length === 0 || branches.length === 0 ? false : true;
      vm.requiredRoles = roles.length > 0;
      vm.requiredBranches = branches.length > 0;
      vm.validExpirateUser = vm.dateActivateUser !== null && vm.dateActivateUser !== undefined && vm.dateActivateUser !== '';
      vm.validActivateUser = vm.dateExpirateUser !== null && vm.dateExpirateUser !== undefined && vm.dateExpirateUser !== '';;
      if (UsersForm.$valid) {
        if (Date.parse(vm.dateActivateUser) <= Date.parse(vm.dateExpirateUser)) {
          UsersForm.$setUntouched();
          vm.typeIncorrect = false;

          // Se arama el json para la lista de áreas
          var areas = [];
          vm.dataAreas.forEach(function (value) {
            var area = {
              'id': value.id,
              'name': value.name
            };
            if (value.id !== 1 && value.access) {
              areas.push({
                'access': true,
                'validate': value.validate === undefined ? false : value.validate,
                'area': area
              });
            }

          });

          vm.usersDetail.areas = areas;

          // Se arama el json para la lista de roles
          var roles = [];
          vm.dataRoles.forEach(function (value) {
            var role = {
              'id': value.id,
              'name': value.name
            };
            if (value.access) {
              roles.push({
                'access': true,
                'role': role
              });
            }

          });
          vm.usersDetail.roles = roles;

          // Se arama el json para la lista de sedes
          var branches = [];
          vm.dataBranches.forEach(function (value) {
            var branch = {
              'id': value.id,
              'name': value.name
            };
            if (value.access) {
              branches.push({
                'access': true,
                'batchPrint': value.batchPrint === undefined ? false : value.batchPrint,
                'branch': branch
              });
            }
          });
          vm.usersDetail.branches = branches;

          vm.usersDetail.type = {
            "id": 11
          };
          vm.usersDetail.orderType = vm.typeOrder;
          vm.usersDetail.activation = moment(vm.dateActivateUser, vm.FormatoFecha).format()
          vm.usersDetail.expiration = moment(vm.dateExpirateUser, vm.FormatoFecha).format();

          vm.usersDetail.passwordExpiration = moment(vm.dateExpiratePassword, vm.FormatoFecha).format();

          vm.requiredRoles = roles.length > 0;
          vm.requiredBranches = branches.length > 0;

          if (vm.usersDetail.activation === vm.usersDetail.expiration) {
            vm.valueexpiration = true;
            vm.loadingdata = false;
          } else if (vm.usersDetail.password === vm.confirmPassword && vm.strength === '') {
            if (vm.SecurityPolitics && vm.usersDetail.password !== '' && vm.usersDetail.password !== undefined) {
              var compare = $filter('filter')(vm.dataRoles, {
                access: true
              })
              vm.administrator = $filter('filter')(compare, {
                administrator: true
              }).length === 0 ? false : true;
              if (vm.administrator) {
                vm.loadingdata = false;
                vm.lettersize = vm.administrator ? 12 : 9;
                if (!new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])").test(vm.usersDetail.password) && vm.usersDetail.password.length <= vm.lettersize) {
                  vm.strength4 = true;
                  vm.strength = "**";
                } else if (vm.requiredRoles && vm.requiredBranches) {
                  if (vm.usersDetail.id === null) {
                    vm.insertUsers();
                  } else {
                    vm.updateUsers(UsersForm);
                  }
                }
              } else if (vm.requiredRoles && vm.requiredBranches) {
                if (vm.usersDetail.id === null) {
                  vm.insertUsers();
                } else {
                  vm.updateUsers(UsersForm);
                }
              }
            } else if (vm.requiredRoles && vm.requiredBranches) {
              if (vm.usersDetail.id === null) {
                vm.insertUsers();
              } else {
                vm.updateUsers(UsersForm);
              }
            }
          }

        }
      }
      vm.loadingdata = false;
    }
    //** Método que inserta un nuevo usuario**//
    function insertUsers() {
      vm.usersDetail.transplantManagement = vm.usersDetail.transplantManagement === true ? 1 : 0;
      vm.usersDetail.accessPortalWeb = vm.usersDetail.accessPortalWeb === true ? 1 : 0;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.NewUsers(auth.authToken, vm.usersDetail).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          vm.getUsers();
          vm.usersDetail = data.data;
          vm.usersDetail.password = '';
          vm.confirmPassword = '';
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza un usuario**//
    function updateUsers(UsersForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.usersDetail.transplantManagement = vm.usersDetail.transplantManagement === true ? 1 : 0;
      vm.usersDetail.accessPortalWeb = vm.usersDetail.accessPortalWeb === true ? 1 : 0;
      return userDS.updateUsers(auth.authToken, vm.usersDetail).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          logger.success($filter('translate')('0042'));
          vm.getUsersId(vm.selected, vm.selected, UsersForm)
          vm.getUsers();
          vm.stateButton('update');
        }

      }, function (error) {
        vm.loadingdata = false;
        vm.viewvalited = false
        error.data.errorFields.forEach(function (value) {
          var item = value.split('|');
          if (item[0] === '1') {
            vm.viewvalited = true
          }
        });
        if (!vm.viewvalited) {
          vm.modalError(error);
        }

      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.usersNameRepeat = false;
      vm.identificationRepeat = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'username') {
              var searchuser = _.filter(vm.Usersnotlaboratory, function (e) {
                return e.userName === vm.usersDetail.userName
              })
              if (searchuser.length > 0) {
                vm.messageusername = $filter('translate')('1071')
              } else {
                vm.messageusername = $filter('translate')('0038')
              }
              vm.usersNameRepeat = true;


            }
            if (item[0] === '1' && item[1] === 'identification') {
              var searchuser = _.filter(vm.Usersnotlaboratory, function (e) {
                return e.identification === vm.usersDetail.identification
              })
              if (searchuser.length > 0) {
                vm.messageidentification = $filter('translate')('1071')
              } else {
                vm.messageidentification = $filter('translate')('0038')
              }
              vm.identificationRepeat = true;
            }
          });
        }
      }
      if (vm.usersNameRepeat === false && vm.identificationRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      vm.ShowPopupState = false;
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeEditPatients() {
      vm.ShowEditPatients = false;
      if (!vm.isDisabled) {
        vm.ShowEditPatients = true;
      }
    }
    //** Método que obtiene las areas activas*//
    function getAreaActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (dataArea) {
        vm.dataAreas = dataArea.data;
        vm.access = false;
        vm.validate = false;
        vm.getBranchActive();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que obtiene los roles activas*//
    function getRoleActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return roleDS.getRoleActive(auth.authToken).then(function (dataRole) {
        vm.getDemographicsActive();
        vm.dataRoles = dataRole.data;
        vm.access = false;
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que obtiene las sedes activas*//
    function getBranchActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (dataBranch) {
        vm.dataBranches = dataBranch.data;
        vm.access = false;
        vm.loadingdata = false;
        vm.modalrequiredPrueba();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que obtiene los demograficos activos*//
    function getDemographicsActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemoEncodeds(auth.authToken).then(function (dataDemo) {
        vm.getAreaActive();
        vm.dataDemographics = dataDemo.data.length === 0;
      }, function (error) {
        vm.modalError();
      });
    }
    //** Ventana modal de los requeridos**//
    function modalrequiredPrueba() {
      if (vm.dataBranches.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'UserdependenceController',
          inputs: {
            reciverhide: vm.dataBranches.length,
            ratehide: vm.dataAreas.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método que obtiene un usuario por id*//
    function getUsersId(id, index, UsersForm) {
      vm.requeridemo = false;
      vm.loadingdata = true;
      vm.viewvalited = false;
      vm.sortReverse = false;
      vm.sortType = 'userName';
      vm.sortReverserole = false;
      vm.sortTyperole = 'name';
      vm.sortReversearea = false;
      vm.sortTypearea = 'id';
      vm.sortReversebran = false;
      vm.sortTypebra = 'name';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.usersDetail = [];
      vm.usersNameRepeat = false;
      vm.identificationRepeat = false;
      UsersForm.$setUntouched();
      vm.imageempty = false;
      vm.requiredRoles = true;
      vm.requiredBranches = true;
      vm.validExpirateUser = true;
      vm.validActivateUser = true;
      vm.viewvalidatedpassword = false;
      vm.disablecontrol = false;
      vm.data = '';
      vm.color = "#999";
      vm.strength0 = true;
      vm.strength1 = true;
      vm.strength2 = true;
      vm.strength3 = true;
      vm.strength4 = true;
      vm.valueexpiration = false;
      return userDS.getUsersId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          data.data.transplantManagement = data.data.transplantManagement === 1 ? true : false;
          if (data.data.demographicQuery !== 0 && data.data.demographicQuery !== undefined && data.data.demographicQuery !== null) {
            vm.iddemographicItemQuery = data.data.demographicItemQuery;
            vm.getDemographicsItems(data.data.demographicQuery, false)
          }
          vm.usuario = $filter('translate')('0017') + ' ' +
            moment(data.data.lastTransaction).format(vm.formatDate) + '-' + data.data.user.userName;
          vm.dateActivateUser = new Date(data.data.activation); //moment(data.data.activation).format().toString();
          vm.dateExpirateUser = new Date(data.data.expiration) //moment(data.data.expiration).format();
          vm.dateExpiratePassword = new Date(data.data.passwordExpiration) //moment(data.data.passwordExpiration).format();
          var today = new Date();
          var limitexpiration = new Date(data.data.activation);
          var maxexpiration = new Date(vm.dateActivateUser);
          vm.optionsDateActivateUser = {
            formatYear: 'yyyy',
            maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
            minDate: new Date(vm.dateActivateUser),
            startingDay: 1
          };

          vm.optionsDateExpirateUser = {
            formatYear: 'yyyy',
            maxDate: new Date(limitexpiration.setFullYear(vm.dateActivateUser.getFullYear() + 3)),
            minDate: new Date(),
            startingDay: 1
          };

          vm.stateButton('update');
          vm.usersDetail = data.data;

          vm.typeUser = {
            "id": 11
          };
          vm.typeOrder = data.data.orderType;
          vm.dataAreas = [];
          data.data.areas.forEach(function (field) {
            var id = field.area.id;
            var name = field.area.name;
            var access = field.access;
            var validate = field.validate;
            vm.dataAreas.push({
              'id': id,
              'name': name,
              'access': access,
              'validate': validate
            });
          });
          vm.dataRoles = [];
          data.data.roles.forEach(function (field) {
            var id = field.role.id;
            var name = field.role.name;
            var access = field.access;
            var administrator = field.role.administrator;
            vm.dataRoles.push({
              'id': id,
              'name': name,
              'access': access,
              'administrator': administrator
            });
          });
          vm.dataBranches = [];
          data.data.branches.forEach(function (field) {
            var id = field.branch.id;
            var name = field.branch.name;
            var access = field.access;
            var batchPrint = field.batchPrint;
            vm.dataBranches.push({
              'id': id,
              'name': name,
              'access': access,
              'batchPrint': batchPrint
            });
          });
        }
        vm.usersDetail.password = undefined;
        vm.confirmPassword = undefined;
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.usersDetail.id === null || vm.usersDetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isRequiredPassword = false;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isRequiredPassword = true;
        setTimeout(function () {
          document.getElementById('identity').focus()
        }, 100);
      }
      if (state === 'edit') {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isRequiredPassword = false;
        setTimeout(function () {
          document.getElementById('identity').focus()
        }, 100);
        vm.validatedroles();
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isRequiredPassword = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isRequiredPassword = false;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/Report/Configuration/user/user/user.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }

    }
    // función para ver pdf el reporte en otra pestaña
    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);
      window.open('/viewreport/viewreport.html');
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.keyDays = localStorageService.get('DiasClave') === '' || localStorageService.get('DiasClave') === '0' ? 0 : parseInt(localStorageService.get('DiasClave'));
      vm.SecurityPolitics = localStorageService.get('SecurityPolitics') === "False" ? false : true;
      vm.Permissionspreliminary = localStorageService.get('PermisoPorUsuarioReportPreliminar') === "False" ? false : true;
      vm.updatetestentry = localStorageService.get('PermisosEdicionUsuarioIngreso') === "False" ? false : true;
      vm.addEditResult = localStorageService.get('Agregaredicionresultadosusuario') === 'True';
      vm.getConfigurationFormatDate();
      vm.stateButton('init');
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    vm.isAuthenticate();
  }
  // Metodo para la modal de requerido
  function UserdependenceController($scope, reciverhide, ratehide, close) {
    $scope.reciverhide = reciverhide;
    $scope.ratehide = ratehide;
    $scope.close = function (page) {
      close({
        page: page

      }, 500);
    };
  }
})();
