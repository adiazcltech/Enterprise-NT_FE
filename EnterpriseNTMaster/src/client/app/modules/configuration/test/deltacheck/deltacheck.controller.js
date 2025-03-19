(function () {
  'use strict';

  angular
    .module('app.deltacheck')
    .controller('DeltaCheckController', DeltaCheckController)
    .controller('RequeridtestController', RequeridtestController);

  DeltaCheckController.$inject = ['areaDS', 'testDS', 'deltacheckDS', 'configurationDS',
    'localStorageService', 'logger', '$filter', '$state',
    'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function DeltaCheckController(areaDS, testDS, deltacheckDS, configurationDS,
    localStorageService, logger, $filter, $state,
    moment, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Deltacheck';
    vm.code = ['code', 'abbr', 'name'];
    vm.abbr = ['abbr', 'code', 'name'];
    vm.name = ['name', 'code', 'abbr'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledState = true;
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getId = getId;
    vm.Edit = Edit;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getArea = getArea;
    vm.changearea = changearea;
    vm.removearea = removearea;
    vm.getTest = getTest;
    vm.getTestchange = getTestchange;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //* Metodo configuración formato**//
    function changearea() {
      vm.listest = [];
      vm.selected = -1;
      vm.Detail = [];
      vm.isDisabled = true;
      vm.isDisabledAdd = false;
      vm.isDisabledEdit = true;
      vm.isDisabledSave = true;
      vm.isDisabledCancel = true;
      vm.isDisabledState = true;
      vm.isDisabledPrint = true;
      vm.getTestchange();
    }
    //** Metodo para obtener las areas activas**//
    function getTestchange() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestTypeResult(auth.authToken, 1, 1, vm.lisArea.id, 0).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.listest = data.data.length === 0 ? data.data : removeData(data);
          vm.isDisabledPrint = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data[0] = {
            "id": 0,
            "name": $filter('translate')('0209')
          }
          vm.lisArea = data.data.length === 0 ? data.data : removearea(data);
          vm.lisArea = $filter('orderBy')(vm.lisArea, 'name');
          vm.lisArea.id = 0;
          vm.getTestchange();
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
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        value.search = value.code + value.name + value.abbr;
        value.deltacheckDays = value.deltacheckDays === null ? 0 : value.deltacheckDays;
        value.deltacheckMin = value.deltacheckMin === null ? 0 : value.deltacheckMin;
        value.deltacheckMax = value.deltacheckMax === null ? 0 : value.deltacheckMax;
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
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = true;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById('deltacheckDays').focus()
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
        setTimeout(function () {
          document.getElementById('deltacheckDays').focus()
        }, 100);
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.Detail.deltacheckDays = vm.Days;
      vm.Detail.deltacheckMin = vm.Min;
      vm.Detail.deltacheckMax = vm.Max;
      vm.stateButton('init');
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(deltacheck, index) {
      vm.loadingdata = true;
      vm.Detail.id = deltacheck.id;
      vm.Detail.deltacheckDays = deltacheck.deltacheckDays === undefined ? 1 : deltacheck.deltacheckDays;
      vm.Detail.deltacheckMin = deltacheck.deltacheckMin === undefined ? 0 : deltacheck.deltacheckMin;
      vm.Detail.deltacheckMax = deltacheck.deltacheckMax === undefined ? 0 : deltacheck.deltacheckMax;
      vm.Days = deltacheck.deltacheckDays;
      vm.Min = deltacheck.deltacheckMin;
      vm.Max = deltacheck.deltacheckMax;
      vm.selected = deltacheck.id;
      vm.usuario = $filter('translate')('0017') + ' ';
      vm.usuario = vm.usuario + moment(deltacheck.lastTransaction).format(vm.formatDate) + ' - ';
      vm.usuario = vm.usuario + deltacheck.username;
      vm.stateButton('update');
      vm.loadingdata = false;
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var object = {
        'id': vm.Detail.id,
        'deltacheckDays': vm.Detail.deltacheckDays,
        'deltacheckMin': vm.Detail.deltacheckMin,
        'deltacheckMax': vm.Detail.deltacheckMax,
        'user': {
          'id': auth.id
        }
      };
      return deltacheckDS.updatedeltacheck(auth.authToken, object).then(function (data) {
        if (data.status === 200) {
          vm.getTestchange();
          vm.detail = data.data;
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }

      }, function (error) {
        vm.modalError(error);

      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/test/deltacheck/deltacheck.mrt';
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
    //* Metodo para el popup de requerido**//
    function getTest() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestTypeResult(auth.authToken, 1, 1, 0, 0).then(function (data) {
        if (data.data.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requeridodeltacheck.html',
            controller: 'RequeridtestController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              vm.loadingdata = false;
              $state.go(result);
            });
          });

        } else {
          vm.getArea();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de requerido*//
  function RequeridtestController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
