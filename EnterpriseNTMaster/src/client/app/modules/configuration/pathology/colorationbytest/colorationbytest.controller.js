(function () {
  'use strict';
  angular
    .module('app.colorationbytest')
    .controller('colorationbytestController', colorationbytestController)
    .controller('testDependenceController', testDependenceController);
  colorationbytestController.$inject = ['colorationbytestDS', 'testDS' ,'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function colorationbytestController(colorationbytestDS, testDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'colorationbytest';
    vm.code = ['code', 'name'];
    vm.name = ['name', 'code'];
    vm.sortType = vm.code;
    vm.sortReverse = false;
    vm.codeColoration = ['code', 'name', '-seletedOrder'];
    vm.nameColoration = ['name', 'code', '-seletedOrder'];
    vm.seletedColoration = ['-seletedOrder', '-code', '-name'];
    vm.selected = -1;
    vm.isDisabled = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getTests = getTests;
    vm.getColorations = getColorations;
    vm.save = save;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.changeSearch = changeSearch;
    vm.listColorations = [];
    vm.listTests = [];
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    var auth;

    /**Metodo para limpiar cuando se busca*/
    function changeSearch() {
      vm.selected = -1;
      vm.listColorations = [];
      vm.searchcoloration = '';
    }

    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    /**Metodo para obtener una lista de pruebas*/
    function getTests() {
      vm.sortTypeSubs = '';
      vm.name = '';
      vm.selected = -1;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getPathology(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listTests = data.data;
        }
        if (data.data.length === 0) {
          vm.modalrequired();
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }

    /**Metodo para obtener una lista de submuestras*/
    function getColorations(test, index, This) {
      vm.loadingdata = true;
      vm.sortTypeSubs = '';
      vm.name = test.name;
      vm.idTest = test.id === undefined ? -1 : test.id;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return colorationbytestDS.getColorations(auth.authToken, test.id).then(function (data) {
        if (data.status === 200) {
          vm.selected = test.id;
          vm.sortTypeTest = vm.seletedColoration;
          vm.sortReversetest = true;
          vm.listColorations = data.data;
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(vm.listColorations[0].createdAt).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.listColorations[0].userCreated.userName === undefined ? "" : vm.listColorations[0].userCreated.userName;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método que actualiza los datos**//
    function save() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      var listColorations = [];
      vm.listColorations.forEach(function (value) {
        if (value.selected === true) {
          listColorations.push({
            id: value.id,
            name: value.name
          });
        }
      });
      var json = {
        idTest: vm.idTest,
        id: vm.idTest,
        colorations: listColorations,
        userCreated: {
          "id": auth.id
        }
      };
      return colorationbytestDS.insertColorations(auth.authToken, json).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.getColorations(json, vm.selected);
          vm.sortTypeTest = vm.seletedColoration;
          vm.sortReversetest = true;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método para contruir el JSON para imprimir**//
    function generateFile() {
      var datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var name = vm.name;
      var id = vm.idTest;
      vm.filteredcoloration.forEach(function (value) {
        if (value.selected) {
          datareport.push({
            'id': id,
            'code': value.code,
            'coloration': value.name,
            'selected': value.selected,
            'name': name.toUpperCase(),
            'username': auth.userName
          });
        }
      });
      if (vm.filteredcoloration.length === 0 || datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/pathology/colorationbytest/colorationbytest.mrt';
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

    //** Metodo que válida la autenticación**//
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
      if (error.data !== null) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }

    //** Método para sacar un popup de los datos requridos**//
    function modalrequired() {
      ModalService.showModal({
        templateUrl: 'Requeridtest.html',
        controller: 'testDependenceController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $state.go(result.page);
        });
      });
    }

    /** funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getTests();
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

  /** funcion inicial la modal para mostrar la modal de requridos*/
  function testDependenceController($scope, close) {
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }

})();
