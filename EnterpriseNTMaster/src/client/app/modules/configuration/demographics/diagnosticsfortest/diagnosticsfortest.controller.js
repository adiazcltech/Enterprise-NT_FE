(function () {
  'use strict';
  angular
    .module('app.diagnosticsfortest')
    .controller('DiagnosticsfortestController', DiagnosticsfortestController)
    .controller('DDFTController', DDFTController);

  DiagnosticsfortestController.$inject = ['testDS', 'diagnosticDS', 'configurationDS',
    'localStorageService', 'logger', '$filter', 'areaDS', '$state', 'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function DiagnosticsfortestController(testDS, diagnosticDS, configurationDS,
    localStorageService, logger, $filter, areaDS, $state, moment, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Diagnosticsfortest';
    vm.code = ['code', 'name'];
    vm.name = ['name', 'code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.codetest = ['code', 'name', 'selected'];
    vm.nametest = ['name', 'code', 'selected'];
    vm.selectedtest = ['-selected', '+code', '+name'];
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
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getdiagnostics = getdiagnostics;
    vm.listdiagnostics = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.removeDataresult = removeDataresult;
    vm.idTest = 0;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.getArea = getArea;
    vm.changearea = changearea;
    //** Método que obtiene la lista para llenar la grilla**//
    function getdiagnostics() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return diagnosticDS.getstateactive(auth.authToken).then(function (data) {
        vm.listdiagnostics = data.data.length === 0 ? data.data : removeData(data);
        vm.getArea();
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].search = data.data[key].code + data.data[key].name;
        data.data[key].username = auth.userName;
        data.data[key].dataall = value.name + value.code;
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
        vm.getdiagnostics();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        if (vm.errorservice === 0) {
          vm.modalError(error);
          vm.errorservice = vm.errorservice + 1;
        }
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.getId(vm.diagnostics);
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
      vm.loadingdata = false;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 5, 1, 0).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data;
        vm.modalrequired();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.listdiagnostics.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'DDFTController',
          inputs: {
            hideliteralresult: vm.listdiagnostics.length,
            hidetest: vm.data.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(diagnostics, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = diagnostics.id;
      vm.diagnostics = diagnostics;
      vm.Detail = [];
      vm.idTest = diagnostics.id;
      vm.nameTest = diagnostics.name;
      vm.sortReverse1 = true;
      vm.sortType1 = '';
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.isDisabledPrint = false;
      vm.username = diagnostics.username;
      vm.loadingdata = true;
      vm.lisArea.id = 0;
      return diagnosticDS.getIdiagnostics(auth.authToken, diagnostics.id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.length === 0 ? data.data : removeDataresult(data);
          vm.Detail1 = data.data.length === 0 ? data.data : removeDataresult(data);
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedtest;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function changearea() {
      if (vm.lisArea.id === 0) {
        vm.Detail = vm.Detail1;
      } else {
        vm.Detail = $filter('filter')(vm.Detail1, {
          'area': {
            'id': vm.lisArea.id
          }
        }, true);
      }

    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.get();
        if (data.status === 200) {
          data.data[0] = {
            'id': 0,
            'name': $filter('translate')('0209')
          }
          vm.lisArea = data.data.length === 0 ? data.data : removearea(data);
          vm.lisArea = $filter('orderBy')(vm.lisArea, 'name');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name
          };
          area.push(object);
        }

      });
      return area;
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var diagnosticstest = {
        'idDiagnostic': vm.idTest,
        'nameDiagnostic': vm.nameTest,
        'tests': $filter('filter')(vm.Detail, {
          selected: true
        })
      }
      vm.loadingdata = true;
      return diagnosticDS.updatetestdiagnostics(auth.authToken, diagnosticstest).then(function (data) {
        if (data.status === 200) {
          vm.get();
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataresult(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].search = data.data[key].code + data.data[key].name;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var datareport = [];
      datareport = $filter('filter')(vm.filtered1, {
        selected: true
      });
      if (datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          'Test': ' ' + vm.nameTest
        };
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/demographics/diagnosticsfortest/diagnosticsfortest.mrt';
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
  //** Método ventana modal de los requeridos*//
  function DDFTController($scope, hideliteralresult, hidetest, close) {
    $scope.hideliteralresult = hideliteralresult;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
