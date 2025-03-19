(function () {
  'use strict';

  angular
    .module('app.samplebyservice')
    .controller('SampleByServiceController', SampleByServiceController)
    .controller('DependenceServiceController', DependenceServiceController);
  SampleByServiceController.$inject = ['serviceDS', 'samplebyserviceDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function SampleByServiceController(serviceDS, samplebyserviceDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.blockView = true;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'SampleByService';
    vm.sortType = 'code';
    vm.sortReverse = false;
    vm.sortTypeSample = "sample.codesample";
    vm.sortReverseSample = false;
    vm.selected = -1;
    vm.dataSample = [];
    vm.isAuthenticate = isAuthenticate;
    vm.getService = getService;
    vm.getConfiguration = getConfiguration;
    vm.getById = getById;
    vm.update = update;
    vm.removeData = removeData;
    vm.keyupData = keyupData;
    vm.changeSearch = changeSearch;
    vm.stateButton = stateButton;
    vm.modalError = modalError;
    vm.isDisabledCode = true;
    vm.nameRepeat = false;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.modalrequired = modalrequired;
    vm.getSampleEdition = getSampleEdition;
    vm.generateFile = generateFile;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Metodo para adicionar o eliminar datos al JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.external;
        delete value.state;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getService();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para consultar las lista de servicios activos**//
    function getService() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceDS.getServiceActive(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data;
        if (data.data.length > 0) {
          vm.data = vm.removeData(data);
        } else {
          vm.modalrequired();
        }
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para consultar la llave de TipoNumeroOrden**//
    function getConfiguration() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'TipoNumeroOrden').then(function (data) {
        vm.OrdenNumber = data.data.value === 'Servicio' ? true : false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obterner el tiempo esperado de una muestra en un servicio**//
    function getById(id, index, form, This) {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = index;
      vm.selectedSample = -1;
      vm.dataSample = [];
      vm.isChangeData = false;
      vm.idService = id;
      vm.CodeService = This.Service.code;
      vm.NameService = This.Service.name;
      form.$setUntouched();
      return samplebyserviceDS.getSampleService(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].service.user.lastTransaction).format(vm.formatDate);
          vm.dataSample = data.data;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para cambiar los controles cuando selecciona un máximo**//
    function changeSearch() {
      vm.selected = -1;
      vm.selectedSample = -1;
      vm.dataSample = [];
      vm.isChangeData = false;
      vm.idService = undefined;
      vm.searchSample = '';
    }
    //** Metodo para guardar los cambios**//
    function update(key) {
      if (vm.selectedSample.expectedTime !== vm.expectedTime) {
        vm.selectedSample.expectedTime = vm.expectedTime;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var dataUpdate = {
          'expectedTime': vm.selectedSample.expectedTime,
          'sample': {
            'id': vm.selectedSample.sample.id,
            'name': vm.selectedSample.sample.name
          },
          'service': {
            'id': vm.idService,
            'name': vm.NameService
          }
        };
        vm.loadingdata = true;
        return samplebyserviceDS.updateExpectedTime(auth.authToken, dataUpdate, vm.idService).then(function (data) {
          if (data.status === 200) {
            vm.loadingdata = false;
            vm.stateButton('update');
            if (key !== undefined) {
              vm.selectedSample = vm.filteredSample[_.findIndex(vm.filteredSample, function (o) {
                return o.sample.id == vm.selectedSample.sample.id
              }) + 1];
              vm.selectedSample = vm.selectedSample === undefined ? vm.filteredSample[0] : vm.selectedSample
              vm.expectedTime = vm.selectedSample.expectedTime;
              setTimeout(function () {
                document.getElementById('expectedTime').focus()
              }, 100);
            }
            logger.success($filter('translate')('0042'));

          }
        }, function (error) {
          vm.modalError(error);
        });
      }
    }
    //** Metodo para editar la muestras**//
    function getSampleEdition(element) {
      if (element !== undefined) {
        vm.stateButton('update');
        vm.expectedTime = element.expectedTime
        vm.selectedSample = element;
        setTimeout(function () {
          document.getElementById('expectedTime').focus()
        }, 500);

      }
    }
    //** Metodo para guardar el dato cuando se digita enter**//
    function keyupData(e) {
      vm.isChangeData = (e.keyCode === 13 || e.keyCode === 9);
      if (vm.isChangeData && vm.selectedSample !== -1 && vm.selectedSample.expectedTime !== vm.expectedTime) {
        vm.update(true);
      } else if (vm.isChangeData && vm.selectedSample !== -1) {
        vm.selectedSample = vm.filteredSample[_.findIndex(vm.filteredSample, function (o) {
          return o.sample.id == vm.selectedSample.sample.id
        }) + 1];
        vm.selectedSample = vm.selectedSample === undefined ? vm.filteredSample[0] : vm.selectedSample
        vm.expectedTime = vm.selectedSample.expectedTime;
        setTimeout(function () {
          document.getElementById('expectedTime').focus()
        }, 100);
      }
    }
    //** Metodo que muestra un popup se encuentran datos requeridos **//
    function modalrequired() {
      if (vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'DependenceServiceController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Metodo que válida que el usuario se encuentre loqueado **//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo que válida el estado de los botones**//
    function stateButton(state) {
      vm.showInvalidRange = false;
      vm.showInvalidRangemin = false;
      vm.showInvalidMaxCero = false;

      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.dataSample.id === null || vm.dataSample.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
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
        vm.isDisabledState = true;

      }
      if (state === 'edit') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisabledState = false;
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
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
    //** Metodo que muestra un popup cuando sale un error en servicio **//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'code') {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.nameRepeat === false && vm.Repeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var service = vm.NameService;
      var code = vm.CodeService;
      var id = vm.idService;

      vm.filteredSample.forEach(function (value) {
        datareport.push({
          'id': id,
          'code': code,
          'name': service,
          'codeSample': value.sample.codesample,
          'sample': value.sample.name,
          'expectedTime': value.expectedTime,
          'microbiology': value.sample.laboratorytype.indexOf('3') !== -1,
          'username': auth.userName
        });

      });
      if (datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = datareport;
        vm.pathreport = '/Report/configuration/opportunity/samplebyservice/samplebyservice.mrt';
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
    //** Método  para Inicializar la pagina**//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function DependenceServiceController($scope, close) {
    $scope.close = function (page) {
      close({
        page: page
      }, 500);
    };
  }
})();
