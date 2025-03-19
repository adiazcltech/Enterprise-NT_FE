(function () {
  'use strict';
  angular
    .module('app.dutybytest')
    .controller('dutybytestController', dutybytestController)
    .controller('dutybytestDependenceController', dutybytestDependenceController);

  dutybytestController.$inject = ['testDS', 'areaDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function dutybytestController(testDS, areaDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'dutybytest';
    vm.ordering = ['ordering', 'name'];
    vm.name = ['name', 'ordering'];
    vm.sortReverse = false;
    vm.sortType = vm.ordering;
    vm.code = ['code', 'abbr', 'name', 'tax'];
    vm.abbr = ['abbr', 'code', 'name', 'tax'];
    vm.nametest = ['name', 'code', 'abbr', 'tax'];
    vm.codes = ['tax', 'code', 'abbr', 'name'];
    vm.sortReverseTest = false;
    vm.sortTypeTest = vm.code;
    vm.selected = -1;
    vm.isDisabled = true;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.modalError = modalError;
    vm.isAuthenticate = isAuthenticate;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getAreaActive = getAreaActive;
    vm.getTestArea = getTestArea;
    vm.updetetax = updetetax;
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.dataTestEdit = [];

    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getAreaActive();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener las areas activas**//
    function getAreaActive() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.dataAreas = $filter('filter')(data.data, { id: '!1'  });
        vm.dataAreas = _.filter(data.data, function (o) { return (  o.id !== 1  ) });
        vm.NumAreas = vm.dataAreas.length.toString();
        vm.modalrequired();
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que obtiene una lista de pruebas pertenecientes a una área seleccionada**//
    function getTestArea(id, index, TestEditionForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.idArea = vm.dataAreas === undefined ? 0 : id;
      vm.selected = id;
      vm.selectedTest = -1;
      vm.loadingdata = true;
      return testDS.getTestArea(auth.authToken, 5, 1, vm.idArea).then(function (data) {
        vm.dataTestEdit = [];
        vm.idTest = undefined;
        vm.loadingdata = false;
        if (data.data.length > 0) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data[0].user.userName;
          data.data[0].username = auth.userName;
          vm.dataTestEdit = $filter('filter')(data.data, {
            billing: true
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que guarda los impuestos de la prueba**//
    function updetetax() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return testDS.updateTax(auth.authToken, vm.dataTestEdit).then(function (data) {
        vm.loadingdata = false;
        logger.success($filter('translate')('0042'));
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.dataAreas.length === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "dutybytestDependenceController",
          inputs: {
            hidearea: vm.dataAreas.length,
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result);
          });
        });
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.dataTestEdit.length === 0) {
        vm.open = true;
      } else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.dataTestEdit.forEach(function (value, key) {
          vm.dataTestEdit[key].username = auth.userName
        });
        vm.variables = {};
        vm.datareport = vm.dataTestEdit;
        vm.pathreport = '/report/configuration/billing/taxbytest/taxbytest.mrt';
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
    //** Metodo que evalua si el usuario se encuentra logueado**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Metodo para inicializar la pagina**//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function dutybytestDependenceController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
