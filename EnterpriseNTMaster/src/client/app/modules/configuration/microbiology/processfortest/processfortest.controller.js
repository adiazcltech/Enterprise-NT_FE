(function () {
  'use strict';

  angular
    .module('app.processfortest')
    .controller('ProcessfortestController', ProcessfortestController)
    .controller('customerateController', customerateController);

  ProcessfortestController.$inject = ['processDS', 'testDS', 'configurationDS',
    'localStorageService', 'logger', '$filter',
    '$state', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function ProcessfortestController(processDS, testDS, configurationDS,
    localStorageService, logger,
    $filter, $state, $rootScope, ModalService, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'processfortest';
    vm.codetest = ['code', 'name'];
    vm.nametest = ['name', 'code'];
    vm.sortReverse = false;
    vm.sortType = vm.codetest;
    vm.codeprocess = ['procedure.code', 'procedure.name'];
    vm.nameprocess = ['procedure.name', 'procedure.code'];
    vm.selectedprocess = ['+procedure.selected', '+procedure.defaultvalue', '-procedure.code', '-procedure.name'];
    vm.defaultvalueprocess = ['+procedure.defaultvalue', '+procedure.selected', '-procedure.code', '-procedure.name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codeprocess;
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
    vm.getProcedure = getProcedure;
    vm.ListProcedure = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.removeDataresult = removeDataresult;
    vm.changeSelected = changeSelected;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;

    //** Método que obtiene la lista para llenar la grilla**//
    function getProcedure() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return processDS.getprocessActive(auth.authToken).then(function (data) {
        vm.ListProcedure = data.data;
        vm.get();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.abbr;
        delete value.area;
        delete value.conversionFactor;
        delete value.decimal;
        delete value.deltacheckDays;
        delete value.deltacheckMax;
        delete value.deltacheckMin;
        delete value.lastTransaction;
        delete value.printOrder;
        delete value.processingBy;
        delete value.processingDays;
        delete value.resultType;
        delete value.sample;
        delete value.unit;
        delete value.selected;
        delete value.state;
        delete value.testType;
        delete value.lastTransaction;
        delete value.user;
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
        if (data.status === 200) {
          vm.getProcedure();
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.getId(vm.idtest, vm.name, vm.selected);
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var lisprocedure = [];
      vm.loadingdata = true;
      vm.Detail.forEach(function (value, key) {
        var procedure = {
          'procedure': {
            "id": value.procedure.id,
            "name": value.procedure.name,
            "selected": value.procedure.selected,
            "confirmatorytest": value.procedure.confirmatorytest,
            "confirmatorytestname": value.procedure.confirmatorytestname === undefined ? '' : value.procedure.confirmatorytestname,
            "defaultvalue": value.procedure.defaultvalue,
          },
          'test': {
            'id': vm.idtest,
            'name': vm.name
          }

        };
        lisprocedure.push(procedure);
      });

      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return processDS.updatetestofprocess(auth.authToken, lisprocedure).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.itemselected = -1;
          vm.sortReverse1 = true;
          vm.sortType1 = vm.selectedprocess;
          logger.success($filter('translate')('0042'));
          return data;
        }

      }, function (error) {
        vm.modalError(error);

      });
    }
    //** Método se evalua cuando se selecciona el asignado**//
    function changeSelected(procedure) {
      procedure.procedure.defaultvalue = procedure.procedure.selected === false ? false : procedure.procedure.defaultvalue;
      procedure.procedure.confirmatorytest = procedure.procedure.selected === false ? 0 : procedure.procedure.confirmatorytest;
      procedure.procedure.confirmatorytestname = procedure.procedure.selected === false ? '' : procedure.procedure.confirmatorytestname;
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestmicrobiology(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.modalrequired();
        vm.loadingdata = false;
        vm.changeTest = {
          onSelect: function (item) {
            vm.Detail.forEach(function (value, key) {
              if (value.procedure.id === vm.itemselected) {
                vm.Detail[key].procedure.confirmatorytestname = item.code + ' ' + item.name;
              }
            });
          }
        };

        return vm.data;

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.ListProcedure.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'customerateController',
          inputs: {
            hideprocedure: vm.ListProcedure.length,
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
    function getId(id, name, index) {
      vm.selected = id;
      vm.Detail = [];
      vm.idtest = id;
      vm.name = name;
      vm.itemselected = -1;
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.isDisabledPrint = false;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return processDS.getprocesstestid(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.Detail = data.data === 0 ? data.data : removeDataresult(data.data);
          vm.sortReverse1 = true;
          vm.sortType1 = vm.selectedprocess;
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
      data.forEach(function (value, key) {
        delete value.lastTransaction;
        delete value.user;
        data[key].username = auth.userName;
      });

      return data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/microbiology/processfortest/processfortest.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver el reporte en otra pestaña del navegador.
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
  //** Método para ver la ventana modal de los requeridos*//
  function customerateController($scope, hideprocedure, hidetest, close) {
    $scope.hideprocedure = hideprocedure;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
