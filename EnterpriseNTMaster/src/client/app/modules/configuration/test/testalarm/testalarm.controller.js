(function () {
  'use strict';

  angular
    .module('app.testalarm')
    .controller('TestAlarmController', TestAlarmController)
    .controller('DependenceTestController2', DependenceTestController2)
    TestAlarmController.$inject = ['testDS', 'configurationDS', '$stateParams', 'localStorageService', 'logger', 'areaDS', 'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];

  function TestAlarmController(testDS, configurationDS, $stateParams, localStorageService, logger, areaDS, ModalService, $filter, $state, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.area = $stateParams.area;
    vm.codeTest = $stateParams.codetest;
    vm.init = init;
    vm.title = 'Test Alarm';
    vm.sortReverseArea = false;
    vm.sortTypeArea = 'namearea';
    vm.sortReverseTest = false;
    vm.sortTypeTest = 'nametest';
    vm.selectedarea = -1;
    vm.isAuthenticate = isAuthenticate;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.getAreaActive = getAreaActive;
    vm.modalrequired = modalrequired;
    vm.getTestArea = getTestArea;
    vm.removeData = removeData;
    vm.changeSearch = changeSearch;
    vm.selectTests = selectTests;
    vm.save = save;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    var auth;

    //** Método para contruir el JSON para imprimir**//
    function generateFile() {
      var datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var name = vm.nameSample;
      vm.filteredtest.forEach(function (value) {
        datareport.push({
          'code': value.code,
          'name': value.name,
          'testalarm': value.testalarm,
          'username': auth.userName
        });
      });
      if (vm.filteredtest.length === 0 || datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/test/testalarm/testalarm.mrt';
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

    //** Método que actualiza los datos**//
    function save() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      var listtests = [];
      vm.filteredtest.forEach(function (value) {
        listtests.push({
          id: value.id,
          testalarm: value.testalarm
        });
      });
      var body = {
        idArea: vm.selectedarea,
        tests: listtests,
        user: auth.id
      };
      return testDS.insertTestAlarm(auth.authToken, body).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.getTestArea(vm.selectedarea);
          vm.sortTypeTest = 'nametest';
          vm.sortReverseTest = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /**Metodo para seleccionar todos los examenes*/
    function selectTests() {
      vm.dataTest.forEach(function (value, key) {
        value.testalarm = vm.selectAll;
      });
    }

    /**Metodo para limpiar cuando se busca*/
    function changeSearch() {
      vm.selectedarea = -1;
      vm.dataTest = [];
      vm.searchtest = '';
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
        vm.getAreaActive();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //Método que devuelve la lista de áreas activas
    function getAreaActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.ListAreas = [];
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.ListAreas = data.data.length === 0 ? data.data : removearea(data);
        vm.ListAreas = $filter('orderBy')(vm.ListAreas, 'name');
        if (vm.ListAreas.length === 0) {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError();
      });
    }

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name,
            state: value.state
          };
          area.push(object);
        }
      });
      return area;
    }

    //** Método que obtiene una lista de pruebas pertenecientes a una área seleccionada**//
    function getTestArea(idarea) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      vm.selectAll = false;
      return testDS.getTestArea(auth.authToken, 0, 0, idarea).then(function (data) {
        vm.loadingdata = false;
        vm.dataTest = data.data.length === 0 ? data.data : removeData(data);
        vm.selectedarea = idarea;
        vm.usuario = $filter('translate')('0017') + ' ';
        vm.usuario = vm.usuario + moment(vm.dataTest[0].lastTransaction).format(vm.formatDate) + ' - ';
        vm.usuario = vm.usuario + vm.dataTest[0].user.userName;
        return vm.dataTest;
      }, function (error) {
        vm.modalError(error);
      });
    }

    // Método que elimina los datos que no se necesitan en la grilla
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].username = auth.userName,
          data.data[key].nametest = value.code + '-' + value.name
      });
      return data.data;
    }

    //** Método que comprueba la existencia de áreas y examenes**//
    function modalrequired() {
      vm.loadingdata = false;
      if (vm.ListAreas.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'DependenceTestController2',
          inputs: {
            hideArea: vm.ListAreas.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }

    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function DependenceTestController2($scope, hideArea, close) {
    $scope.hideArea = hideArea;
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }
})();
