(function () {
  'use strict';
  angular
    .module('app.integrationanalyzer')
    .controller('IntegrationuserController', IntegrationuserController)
    .controller(
      'UserintegrationanalyzerController',
      UserintegrationanalyzerController
    );
  UserintegrationanalyzerController.$inject = [
    'userDS',
    'localStorageService',
    'logger',
    'ModalService',
    'listDS',
    'configurationDS',
    '$filter',
    '$state',
    'moment',
    '$rootScope',
    '$translate',
    'LZString',
    'destinationDS',
    'laboratoryDS'
  ];

  function UserintegrationanalyzerController(
    userDS,
    localStorageService,
    logger,
    ModalService,
    listDS,
    configurationDS,
    $filter,
    $state,
    moment,
    $rootScope,
    $translate,
    LZString,
    destinationDS,
    laboratoryDS
  ) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'integrationanalyzer';
    vm.sortReverse = true;
    vm.sortType = 'userName';
    vm.selected = -1;
    vm.usersDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isRequiredPassword = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getUsers = getUsers;
    vm.getUsersId = getUsersId;
    vm.getConfigurationKeyDays = getConfigurationKeyDays;
    vm.NewUsers = NewUsers;
    vm.EditUsers = EditUsers;
    vm.changeState = changeState;
    vm.changePassword = changePassword;
    vm.cancelUsers = cancelUsers;
    vm.insertUsers = insertUsers;
    vm.updateUsers = updateUsers;
    vm.saveUsers = saveUsers;
    vm.stateButton = stateButton;
    vm.getListUserTypes = getListUserTypes;
    vm.modalError = modalError;
    vm.confirmPassword = null;
    vm.modalrequired = modalrequired;
    vm.dateActivateUser = '';
    vm.dateExpirateUser = '';
    vm.dateExpiratePassword = '';
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getDestinos = getDestinos;
    vm.keyDays = 0;
    vm.requiredRoles = true;
    vm.requiredBranches = true;
    var auth;
    vm.imageempty = false;
    vm.validDateExpirateUse = validDateExpirateUse;
    vm.validDateActivateUser = validDateActivateUser;
    vm.loadingdata = true;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    vm.getlab = getlab;
    vm.sortType = 'userName';
    vm.sortReverse = false;

    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS
        .getConfigurationKey(auth.authToken, 'FormatoFecha')
        .then(
          function (data) {
            vm.getListUserTypes();
            if (data.status === 200) {
              vm.formatDateControl = data.data.value;
              vm.formatDate = data.data.value.toUpperCase();
              var today = new Date();
              vm.optionsDateActivateUser = {
                formatYear: 'yyyy',
                maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
                minDate: new Date(),
                startingDay: 1,
              };

              vm.optionsDateExpirateUser = {
                formatYear: 'yyyy',
                maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
                minDate: new Date(),
                startingDay: 1,
              };
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Método que consulta una lista de destinos**//
    function getDestinos() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return destinationDS.getDestinationActive(auth.authToken).then(
        function (data) {
          vm.getlab();
          if (data.status === 200) {
            vm.listDestinos = $filter('orderBy')(data.data, 'name');
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que consulta una lista de laboratorios**//
    function getlab() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return laboratoryDS.getLaboratoryActive(auth.authToken).then(
        function (data) {
          vm.getUsers();
          if (data.status === 200) {
            vm.listlab = $filter('orderBy')(data.data, 'name');
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que válida expiración de usuarios**//
    function validDateExpirateUse() {
      vm.validExpirateUser = true;
      vm.dateExpirateUser =
        vm.dateExpirateUser === undefined ? '' : vm.dateExpirateUser;
      if (moment(vm.dateActivateUser).isValid()) {
        var validdateactivation = moment(vm.dateActivateUser).add(3, 'years');

        if (
          !moment(vm.dateExpirateUser).isValid() ||
          moment(moment(vm.dateExpirateUser).format('YYYYMMDD')).isBefore(
            moment(vm.dateActivateUser).format('YYYYMMDD')
          ) ||
          moment(moment(validdateactivation).format('YYYYMMDD')).isBefore(
            moment(vm.dateExpirateUser).format('YYYYMMDD')
          )
        ) {
          vm.dateExpirateUser = '';
          vm.validExpirateUser = false;
        } else if (moment(vm.dateExpirateUser).isValid()) {
          if (true) {}
        }
      }
    }
    //** Método que válida Activación de usuarios**//
    function validDateActivateUser() {
      vm.validActivateUser = true;
      vm.dateActivateUser =
        vm.dateActivateUser === undefined ? '' : vm.dateActivateUser;
      if (
        moment(vm.dateActivateUser).isValid() &&
        moment(moment().format('YYYYMMDD')).isSameOrBefore(
          moment(vm.dateActivateUser).format('YYYYMMDD')
        )
      ) {
        var today = new Date(vm.dateActivateUser);
        vm.optionsDateExpirateUser = {
          formatYear: 'yyyy',
          maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
          minDate: vm.dateActivateUser,
          startingDay: 1,
        };

        if (
          moment(moment(vm.dateExpirateUser).format('YYYYMMDD')).isBefore(
            moment(vm.dateActivateUser).format('YYYYMMDD')
          )
        ) {
          vm.dateExpirateUser = '';
        }
      } else {
        if (
          !moment(moment(vm.usersDetail.activation).format('YYYYMMDD')).isSame(
            moment(vm.dateActivateUser).format('YYYYMMDD')
          )
        ) {
          vm.dateActivateUser = '';
          vm.dateExpirateUser = '';
          vm.validActivateUser = false;
        }
      }
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo usuario**//
    function NewUsers(Usersform) {
      vm.imageempty = false;
      Usersform.$setUntouched();
      vm.usuario = '';
      vm.dateActivateUser = '';
      vm.dateExpirateUser = '';
      vm.dateExpiratePassword = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.edituser = false;
      vm.usersDetail = {
        user: {
          id: auth.id,
        },
        id: null,
        name: '',
        lastName: '',
        userName: '',
        password: '',
        state: true,
        activation: null,
        expiration: null,
        passwordExpiration: null,
        identification: null,
        email: null,
        maxDiscount: 0,
        destination: {
          id: 0,
        },
        type: {
          id: 13,
        },
        photo: '',
        orderType: {
          id: 0,
        },
      };
      vm.stateButton('add');
      vm.confirmPassword = vm.usersDetail.password;
      vm.requiredRoles = true;
      vm.requiredBranches = true;
    }
    //** Método que consulta la llave dias claves**//
    function getConfigurationKeyDays() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS
        .getConfigurationKey(auth.authToken, 'DiasClave')
        .then(
          function (data) {
            vm.getUsers();
            if (data.status === 200) {
              vm.keyDays = data.data.value;
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Método que valida el cambio de contraseña**//
    function changePassword() {
      vm.dateExpiratePassword =
        vm.confirmPassword === vm.usersDetail.password &&
        vm.confirmPassword !== '' &&
        vm.usersDetail.password !== '' &&
        vm.confirmPassword !== undefined &&
        vm.usersDetail.password !== undefined ?
        new Date(moment().add(vm.keyDays, 'days').format()) :
        '';
    }
    //** Método que Obtiene la lista de tipos de Usuario**//
    function getListUserTypes() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 10).then(
        function (data) {
          vm.getDestinos();
          if (data.status === 200) {
            vm.ListUserTypes = [{
                id: 12,
                name: $filter('translate')('0205'),
              },
              {
                id: 13,
                name: $filter('translate')('0360'),
              },
            ];
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que deshabilitar los controles y botones para cancelar un usuario**//
    function cancelUsers(UsersForm) {
      vm.imageempty = false;
      UsersForm.$setUntouched();
      vm.typeIncorrect = false;
      vm.requiredRoles = true;
      vm.requiredBranches = true;
      vm.validExpirateUser = true;
      vm.validActivateUser = true;
      if (vm.usersDetail.id === null || vm.usersDetail.id === undefined) {
        vm.usersDetail = [];
        vm.dateActivateUser = '';
        vm.dateExpirateUser = '';
        vm.dateExpiratePassword = '';
        vm.confirmPassword = '';
      } else {
        vm.getUsersId(vm.usersDetail.id, vm.selected, UsersForm);
        vm.confirmPassword = vm.usersDetail.password;
        vm.usersDetail.email = '';
      }
      vm.stateButton('init');
      vm.usersNameRepeat = false;
      vm.identificationRepeat = false;
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo usuario**//
    function EditUsers() {
      vm.edituser = true;
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo usuario o se va actualizar **//
    function saveUsers(UsersForm) {
      vm.loadingdata = true;
      vm.imageempty = false;
      UsersForm.identity.$touched = true;
      UsersForm.name.$touched = true;
      UsersForm.userName.$touched = true;
      if (vm.usersDetail.type.id === 13) {
        UsersForm.password.$touched = true;
        UsersForm.confirmPassword.$touched = true;
      }
      if (vm.usersDetail.type.id === 12) {
        UsersForm.laboratory.$touched = true;
        vm.usersDetail.password = '';
        vm.confirmPassword = '';
      }

      if (vm.usersDetail.photo === '') {
        vm.imageempty = true;
      }
      vm.isRequiredPassword =
        vm.usersDetail.password === vm.confirmPassword ? false : true;
      vm.validExpirateUser =
        vm.dateActivateUser !== null &&
        vm.dateActivateUser !== undefined &&
        vm.dateActivateUser !== '';
      vm.validActivateUser =
        vm.dateExpirateUser !== null &&
        vm.dateExpirateUser !== undefined &&
        vm.dateExpirateUser !== '';
      if (UsersForm.$valid) {
        if (
          Date.parse(vm.dateActivateUser) <= Date.parse(vm.dateExpirateUser)
        ) {
          UsersForm.$setUntouched();
          vm.usersDetail.activation = moment(
            vm.dateActivateUser,
            vm.FormatoFecha
          ).format(); //Date.parse(vm.dateActivateUser);
          vm.usersDetail.expiration = moment(
            vm.dateExpirateUser,
            vm.FormatoFecha
          ).format(); // Date.parse(vm.dateExpirateUser);

          vm.usersDetail.passwordExpiration =
            vm.usersDetail.type.id === 13 ?
            moment(vm.dateExpiratePassword, vm.FormatoFecha).format() :
            '';
          if (vm.usersDetail.password === vm.confirmPassword) {
            if (vm.usersDetail.id === null) {
              vm.insertUsers();
            } else {
              vm.updateUsers();
            }
          } else {

          }
        }
      } else {
        vm.loadingdata = false;
      }
    }
    //** Método que inserta un nuevo usuario**//
    function insertUsers() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.newIntegrationAnalyzer(auth.authToken, vm.usersDetail).then(
        function (data) {
          if (data.status === 200) {
            vm.loadingdata = false;
            vm.getUsers();
            vm.usersDetail = data.data;
            vm.stateButton('insert');
            logger.success($filter('translate')('0042'));
            return data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método que Actualiza un usuario**//
    function updateUsers() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS
        .updateIntegrationAnalyzer(auth.authToken, vm.usersDetail)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.loadingdata = false;
              vm.getUsers();
              vm.stateButton('update');
              logger.success($filter('translate')('0042'));
              return data;
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
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
                return e.userName === vm.usersDetail.userName;
              });
              if (searchuser.length > 0) {
                vm.messageusername = $filter('translate')('0038');
              } else {
                vm.messageusername = $filter('translate')('1071');
              }
              vm.usersNameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'identification') {
              var searchuser = _.filter(vm.Usersnotlaboratory, function (e) {
                return e.identification === vm.usersDetail.identification;
              });
              if (searchuser.length > 0) {
                vm.messageidentification = $filter('translate')('0038');
              } else {
                vm.messageidentification = $filter('translate')('1071');
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
    //** Método que obtiene una lista de usuarios**//
    function getUsers() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getUsers(auth.authToken).then(
        function (data) {
          vm.loadingdata = false;
          vm.dataUsers = _.filter(data.data, function (e) {
            e.typename = e.type.id === 12 ? $filter('translate')('0205') : $filter('translate')('0360');
            e.search = e.typename + e.userName;
            return e.type.id !== 11;
          });
          vm.Usersnotlaboratory = _.filter(data.data, function (e) {
            return e.type.id === 11;
          });
          vm.confirmPassword = vm.usersDetail.password;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Ventana modal de los requeridos**//
    function modalrequired() {
      if (vm.listlab.length === 0 && vm.usersDetail.type.id === 12) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'IntegrationuserController'
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result.page === 'integrationanalyzer') {
              vm.usersDetail.type.id = 13;
            }
            $state.go(result.page);
          });
        });

      }
    }
    //** Método que obtiene un usuario por id*//
    function getUsersId(id, index, UsersForm) {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.usersDetail = [];
      vm.usersNameRepeat = false;
      vm.identificationRepeat = false;
      UsersForm.$setUntouched();
      vm.confirmPassword = undefined;
      vm.imageempty = false;
      vm.requiredRoles = true;
      vm.requiredBranches = true;
      vm.validExpirateUser = true;
      vm.validActivateUser = true;
      return userDS.getUsersId(auth.authToken, id).then(
        function (data) {
          if (data.status === 200) {
            vm.usuario =
              $filter('translate')('0017') +
              ' ' +
              moment(data.data.lastTransaction).format(vm.formatDate) +
              '-' +
              data.data.user.userName;
            vm.dateActivateUser = new Date(data.data.activation); //moment(data.data.activation).format().toString();
            vm.dateExpirateUser = new Date(data.data.expiration); //moment(data.data.expiration).format();
            vm.dateExpiratePassword = new Date(data.data.passwordExpiration); //moment(data.data.passwordExpiration).format();

            var today = new Date();
            var limitexpiration = new Date(data.data.activation);
            var maxexpiration = new Date(vm.dateActivateUser);
            vm.optionsDateActivateUser = {
              formatYear: 'yyyy',
              maxDate: new Date(today.setFullYear(today.getFullYear() + 3)),
              minDate: new Date(),
              startingDay: 1,
            };

            vm.optionsDateExpirateUser = {
              formatYear: 'yyyy',
              maxDate: new Date(
                limitexpiration.setFullYear(
                  vm.dateActivateUser.getFullYear() + 3
                )
              ),
              minDate: new Date(),
              startingDay: 1,
            };

            vm.stateButton('update');
            vm.usersDetail = data.data;
            vm.typeUser = data.data.type;
            vm.typeOrder = data.data.orderType;
            vm.dataAreas = [];
            data.data.areas.forEach(function (field) {
              var id = field.area.id;
              var name = field.area.name;
              var access = field.access;
              var validate = field.validate;
              vm.dataAreas.push({
                id: id,
                name: name,
                access: access,
                validate: validate,
              });
            });
            vm.dataRoles = [];
            data.data.roles.forEach(function (field) {
              var id = field.role.id;
              var name = field.role.name;
              var access = field.access;
              vm.dataRoles.push({
                id: id,
                name: name,
                access: access,
              });
            });
            vm.dataBranches = [];
            data.data.branches.forEach(function (field) {
              var id = field.branch.id;
              var name = field.branch.name;
              var access = field.access;
              var batchPrint = field.batchPrint;
              vm.dataBranches.push({
                id: id,
                name: name,
                access: access,
                batchPrint: batchPrint,
              });
            });
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError();
        }
      );
    }
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit =
          vm.usersDetail.id === null || vm.usersDetail.id === undefined ?
          true :
          false;
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
          document.getElementById('identity').focus();
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
          document.getElementById('identity').focus();
        }, 100);
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
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set('parameterReport', parameterReport);
      localStorageService.set('dataReport', datareport);
      window.open('/viewreport/viewreport.html');
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
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
  function IntegrationuserController(
    $scope,
    close
  ) {
    $scope.close = function (page) {
      close({
          page: page,
        },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
  }
})();
