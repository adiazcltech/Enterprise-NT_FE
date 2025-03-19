(function () {
  'use strict';
  angular
    .module('app.excludetestbyuser')
    .controller('ExcludeTestbyUserController', ExcludeTestbyUserController)
    .controller('RequeridexludeController', RequeridexludeController);
  ExcludeTestbyUserController.$inject = ['testDS', 'userDS', 'configurationDS',
    'localStorageService', 'logger', '$filter',
    '$state', 'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function ExcludeTestbyUserController(testDS, userDS, configurationDS,
    localStorageService, logger,
    $filter, $state, moment, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'ExcludeTestbyUser';
    vm.userNametable = ['userName', 'name'];
    vm.nameuser = ['name', 'userName'];
    vm.sortReverse = false;
    vm.sortType = vm.userNametable;
    vm.codetest = ['code', 'abbr', 'name', 'selected'];
    vm.abbrtest = ['abbr', 'code', 'name', 'selected'];
    vm.nametest = ['name', 'code', 'abbr', 'selected'];
    vm.selectedtest = ['-selected', '+code', '+abbr', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetest;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getTest = getTest;
    vm.Listrate = [];
    vm.data = [];
    vm.removeDataresult = removeDataresult;
    vm.idtest = 0;
    vm.updateacountrate = updateacountrate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Método que obtiene la lista para llenar la grilla**//
    function getTest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(function (data) {
        if (data.data.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'RequeridexludeController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result === 'test') {
                $state.go('test');
              }
            });
          });

        } else {
          vm.get();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].search = value.name + " " + value.lastName + value.userName;
        data.data[key].name = value.name + " " + value.lastName;
        data.data[key].username = auth.userName;
      });
      return data.data;
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
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getTest();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getestforuser(auth.authToken, vm.idtest).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.length === 0 ? data.data : removeDataresult(data);
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });

    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var Testuser = vm.updateacountrate();
      if (Testuser.length === 0) {
        return userDS.deleteexclude(auth.authToken, vm.idtest).then(function (data) {
          if (data.status === 200) {
            vm.get();
            logger.success($filter('translate')('0042'));
          }
          vm.loadingdata = false;
        }, function (error) {
          vm.modalError(error);

        });

      } else {
        return userDS.updatetestforuser(auth.authToken, Testuser).then(function (data) {
          if (data.status === 200) {
            vm.get();
            logger.success($filter('translate')('0042'));
          }
          vm.loadingdata = false;
        }, function (error) {
          vm.modalError(error);
        });
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
      vm.loadingdata = false;
    }
    // metodo para ordenar el json
    function updateacountrate() {
      var user = [];
      vm.Detail.forEach(function (value, key) {
        if (value.selected === true) {
          var object = {
            'id': vm.idtest,
            'name': vm.name,
            'user': {
              'id': auth.id
            },

            'test': {
              'id': value.id,
              'code': value.code,
              'name': value.name,
              'selected': value.selected
            }


          };
          user.push(object);
        }
      });
      return user;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getuserActive(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(exclude, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = index;
      vm.Detail = [];
      vm.idtest = exclude.id;
      vm.name = exclude.name;
      vm.sortReverse1 = true;
      vm.sortType1 = '';
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.isDisabledPrint = false;
      vm.username = exclude.username;
      vm.loadingdata = true;
      return userDS.getestforuser(auth.authToken, vm.idtest).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.length === 0 ? data.data : removeDataresult(data);
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedtest;
          vm.loadingdata = false;
          return vm.Detail;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataresult(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].code = value.test.code;
        data.data[key].search = value.test.code + value.test.abbr + value.test.name;
        data.data[key].abbr = value.test.abbr;
        data.data[key].name = value.test.name;
        data.data[key].id = value.test.id;
        data.data[key].selected = value.test.selected;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var datareport = $filter('filter')(vm.filtered1, {
        selected: true
      })
      if (datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          "name": vm.name
        };
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/user/excludetestbyuser/excludetestbyuser.mrt'
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
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
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Método para ventana modal de requeridos*//
  function RequeridexludeController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
