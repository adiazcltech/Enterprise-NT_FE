(function () {
  'use strict';
  angular
    .module('app.specimen')
    .controller('specimenController', specimenController)
    .controller('specimenDependenceController', specimenDependenceController);
  specimenController.$inject = ['specimenDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function specimenController(specimenDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'subsample';
    vm.codesample = ['codesample', 'name'];
    vm.name = ['name', 'codesample'];
    vm.sortType = vm.codesample;
    vm.sortReverse = false;
    vm.codeSubsample = ['codesample', 'name', '-seletedOrder'];
    vm.nameSubsample = ['name', 'codesample', '-seletedOrder'];
    vm.seletedOrdersample = ['-seletedOrder', '-codesample', '-name'];
    vm.selected = -1;
    vm.isDisabled = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getSpecimens = getSpecimens;
    vm.getSubSample = getSubSample;
    vm.save = save;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;    
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.changeSearch = changeSearch;
    vm.listsubsample = [];
    vm.listSpecimens = [];
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    var auth;

    /**Metodo para limpiar cuando se busca*/
    function changeSearch() {
      vm.selected = -1;
      vm.listsubsample = [];
      vm.searchsubs = '';
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

    /**Metodo para obtener una lista de especimenes*/
    function getSpecimens() {
      vm.sortTypeSubs = '';
      vm.nameSample = '';
      vm.selected = -1;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return specimenDS.getSpecimens(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listSpecimens = data.data;
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
    function getSubSample(specimen, index, This) {
      vm.loadingdata = true;
      vm.sortTypeSubs = '';
      vm.nameSample = specimen.name;
      vm.idSample = specimen.id === undefined ? -1 : specimen.id;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return specimenDS.getSubsamplesBySpecimen(auth.authToken, specimen.id).then(function (data) {
        if (data.status === 200) {
          vm.selected = specimen.id;
          vm.sortTypeTest = vm.seletedOrdersample;
          vm.sortReversetest = true;
          vm.listsubsample = data.data;
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(specimen.createdAt).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + specimen.userCreated.userName;
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
      var listsubsample = [];
      vm.listsubsample.forEach(function (value) {
        if (value.selected === true) {
          listsubsample.push({
            id: value.id,
            name: value.name
          });
        }
      });
      var specimen = {
        id: vm.idSample,
        name: vm.nameSample,
        subSamples: listsubsample,
        selected: true,
        userCreated: auth
      };
      return specimenDS.insertSubsamples(auth.authToken, specimen).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.getSubSample(specimen, vm.selected);
          vm.sortTypeTest = vm.seletedOrdersample;
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
      var name = vm.nameSample;
      var id = vm.idSample;
      vm.filteredsubs.forEach(function (value) {
        if (value.selected) {
          datareport.push({
            'id': id,
            'codesample': value.codesample,
            'subsample': value.name,
            'selected': !value.seletedOrder,
            'namesample': name.toUpperCase(),
            'username': auth.userName
          });
        }
      });
      if (vm.filteredsubs.length === 0 || datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = datareport;
        vm.pathreport = '/report/configuration/pathology/subsample/subsample.mrt';
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
      if (error.data !== null) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }

    //** Método para sacar un popup de los datos requridos**//
    function modalrequired() {
      ModalService.showModal({
        templateUrl: 'Requeridspecimen.html',
        controller: 'specimenDependenceController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $state.go(result.page);
        });
      });
    }

    /** funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getSpecimens();
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

  /** funcion inicial la modal para mostrar la modal de requridos*/
  function specimenDependenceController($scope, close) {
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }

})();
