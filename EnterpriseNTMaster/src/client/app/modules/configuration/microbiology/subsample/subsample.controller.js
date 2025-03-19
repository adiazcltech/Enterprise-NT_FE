(function () {
  'use strict';
  angular
    .module('app.subsample')
    .controller('SubSampleController', SubSampleController)
    .controller('subSampleDependenceController', subSampleDependenceController);
  SubSampleController.$inject = ['subsampleDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate', 'sampleDS'
  ];

  function SubSampleController(subsampleDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate, sampleDS) {

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
    vm.getSample = getSample;
    vm.getSubSample = getSubSample;
    vm.save = save;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.modalRequired = false;
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.changeSearch = changeSearch;
    vm.listsubsample = [];
    vm.listSample = [];
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    var auth;

    /**Accion que sirve para eliminar una columna de una tabla a partir de un objeto area*/
    function removeData(data) {
      var listdata = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        // delete value.ehr;
        delete value.user;
        delete value.lastTransaction;
        delete value.state;
        delete value.printable,
          delete value.check
        data.data[key].seletedOrder = !value.selected;
        data.data[key].username = auth.userName;

      });

      listdata.push(data.data);

      return listdata;
    }
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
    /**Metodo para obtener una lista de muestras*/
    function getSample() {
      vm.sortTypeSubs = '';
      vm.nameSample = '';
      vm.selected = -1;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return sampleDS.getSampleMicrobiology(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listSample = data.data.length === 0 ? data.data : vm.removeData(data)[0];
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
    function getSubSample(id, index, This) {
      vm.sortTypeSubs = '';
      vm.nameSample = This === undefined ? vm.nameSample : This.dataSample.name;
      vm.idSample = (id === undefined ? -1 : id);
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return subsampleDS.getSubSample(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.selected = id;
          vm.sortTypeTest = vm.seletedOrdersample;
          vm.sortReversetest = true;
          vm.listsubsample = data.data.length === 0 ? data.data : vm.removeData(data)[0];
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + auth.userName;
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
            'id': value.id,
            name: value.name
          });
        }
      });
      var subsamples = {
        'id': vm.idSample,
        'name': vm.nameSample,
        'subSamples': listsubsample,
        'selected': true
      };
      return subsampleDS.updateSubSample(auth.authToken, subsamples).then(function (data) {
        if (data.status === 200) {
          logger.success($filter('translate')('0042'));
          vm.getSubSample(vm.idSample, vm.selected);
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
        vm.pathreport = '/report/configuration/microbiology/subsample/subsample.mrt';
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
        templateUrl: 'Requerido.html',
        controller: 'subSampleDependenceController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $state.go(result.page);
        });
      });
    }
    /** funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getSample();
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  /** funcion inicial la modal para mostrar la modal de requridos*/
  function subSampleDependenceController($scope, close) {
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
