(function () {
  'use strict';

  angular
    .module('app.testservice')
    .controller('TestServiceController', TestServiceController)
    .controller('DependenceServiceController', DependenceServiceController);


  TestServiceController.$inject = ['serviceDS', 'testserviceDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function TestServiceController(serviceDS, testserviceDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.blockView = true;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'TestService';
    vm.code = ['code', 'name'];
    vm.name = ['name', 'code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.codetest = ['test.code', 'test.abbr', 'test.name', 'expectedTime', 'maximumTime'];
    vm.abbrtest = ['test.abbr', 'test.code', 'test.name', 'expectedTime', 'maximumTime'];
    vm.nametest = ['test.name', 'test.code', 'test.abbr', 'expectedTime', 'maximumTime'];
    vm.expectedTimetest = ['expectedTime', 'test.code', 'test.abbr', 'test.name', 'maximumTime'];
    vm.maximumTimetest = ['maximumTime', 'test.code', 'test.abbr', 'test.name', 'expectedTime'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetest;
    vm.selected = -1;
    vm.dataTest = [];
    vm.isAuthenticate = isAuthenticate;
    vm.getService = getService;
    vm.getById = getById;
    vm.update = update;
    vm.removeData = removeData;
    vm.cancel = cancel;
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
    vm.getTestEdition = getTestEdition;
    vm.generateFile = generateFile;
    vm.changeCheck = changeCheck;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    // Metodo para adicionar o eliminar elementos de un JSON
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
    //** Metodo para obtener una lista de servicios**//
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
    //** Metodo para obtener una lista pruebas de un servicios**//
    function getById(id, index, form, This) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.selectedTest = -1;
      vm.dataTest = [];
      vm.isChangeData = false;
      vm.idService = id;
      vm.isShowSuccess = true;
      vm.CodeService = This === undefined ? '' : This.Service.code;
      vm.NameService = This === undefined ? '' : This.Service.name;
      vm.expectedTime = '';
      vm.maximumTime = '';
      vm.cero === false;
      if (form !== undefined) {
        form.$setUntouched();
      }
      vm.loadingdata = true;
      return testserviceDS.getTestService(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].service.user.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + (data.data[0].service.user.userName === null ? auth.userName : data.data[0].service.user.userName);
          vm.dataTest = data.data;
          vm.stateButton('update');
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para cambiar los controles cuando se selecciona**//
    function changeSearch() {
      vm.selected = -1;
      vm.selectedTest = -1;
      vm.dataTest = [];
      vm.isChangeData = false;
      vm.idService = undefined;
      vm.isShowSuccess = true;
      vm.searchTest = '';
    }
    //** Metodo para actualizar los examanes**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');

      var dataUpdate = {
        'expectedTime': vm.expectedTime,
        'maximumTime': vm.maximumTime,
        'test': {
          'id': vm.idTest,
          'name': vm.nameTest,
          'selected': true
        },
        'service': {
          'id': vm.idService,
          'name': vm.NameService
        }
      };
      vm.loadingdata = true;
      return testserviceDS.updateExpectedTime(auth.authToken, dataUpdate, vm.idService).then(function (data) {
        if (data.status === 200) {
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          vm.isChangeData = false;
          vm.loadingdata = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
        vm.expectedTime = 0;
      });
    }
    //** Metodo para editar los valores de los examanes**//
    function getTestEdition(id, index, Form) {
      if (vm.expectedTime < vm.maximumTime || vm.expectedTime === '' || vm.maximumTime === '') {
        if (id !== undefined) {
          vm.stateButton('update');
          vm.selectedTest = id;
          Form.$setUntouched();
          if (vm.isChangeData /*&& vm.selectedTest !== -1*/ ) {
            if (vm.expectedTime < vm.maximumTime && vm.expectedTime !== '' && vm.maximumTime !== '') {
              vm.update();
            }
          }
        }
      }
    }
    //** Metodo para cancelar los valores de los examanes**//
    function cancel(form) {
      form.$setUntouched();
      vm.nameRepeat = false;
      vm.Repeat = false;
      if (vm.dataTest.id === null || vm.dataTest.id === undefined) {
        vm.dataTest = [];
      } else {
        vm.getById(vm.dataTest.id, vm.selected, form);
      }
      vm.stateButton('init');
    }
    //** Metodo para guardar con enter**//
    function keyupData(e, This) {
      vm.isChangeData = (e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 || (e.keyCode > 95 && e.keyCode < 106));
      vm.expectedTime = This.TestTime.expectedTime === 0 ? '' : This.TestTime.expectedTime;
      vm.maximumTime = This.TestTime.maximumTime === 0 ? '' : This.TestTime.maximumTime;
      vm.idTest = This.TestTime.test.id;
      vm.nameTest = This.TestTime.test.name;
      vm.selected = This.TestTime.test.selected;
    }
    //** Metodo para evaluar los cambios en el formulario**//
    function changeCheck(This) {
      This.TestTime.expectedTime = This.TestTime.test.selected && This.TestTime.expectedTime === 0 ? 1 : 0;
      This.TestTime.maximumTime = This.TestTime.test.selected && This.TestTime.maximumTime === 0 ? 1 : 0;
      vm.expectedTime = This.TestTime.expectedTime;
      vm.maximumTime = This.TestTime.maximumTime;
      vm.idTest = This.TestTime.test.id;
      vm.nameTest = This.TestTime.test.name;
      vm.selected = This.TestTime.test.selected;
      vm.update();
    }
    //** Método que comprueba la existencia de áreas y muestras por el **//
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
    //** Método que comprueba que el usuario se encuentre logueado **//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Método que evalua el estado de los botones**//
    function stateButton(state) {
      vm.showInvalidRange = false;
      vm.showInvalidRangemin = false;
      vm.showInvalidMaxCero = false;

      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.dataTest.id === null || vm.dataTest.id === undefined ? true : false;
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
    //** Método que muestra una ventana modal cuando ocurre un error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '0' && item[1] === 'expectedTime') {
              vm.cero = true;
            }
          });
        }
      }
      if (vm.cero === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método para inicializar el fomrulario**//
    function generateFile() {
      var datareport = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var service = vm.NameService;
      var code = vm.CodeService;
      var id = vm.idService;
      return testserviceDS.getTestService(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            datareport.push({
              'codeTest': value.test.code,
              'abbrTest': value.test.name,
              'nameTest': value.test.name,
              'expectedTime': value.expectedTime,
              'maximumTime': value.maximumTime,
              'username': auth.userName
            });
          });
          vm.variables = {
            'CodeService': vm.CodeService,
            'NameService': vm.NameService
          };
          vm.datareport = datareport;
          vm.pathreport = '/Report/configuration/opportunity/testservice/testservice.mrt';
          vm.openreport = false;
          vm.report = false;
          vm.windowOpenReport();
        } else {
          vm.open = true;
        }
      });
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
    //** Método para inicializar el fomrulario**//
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
