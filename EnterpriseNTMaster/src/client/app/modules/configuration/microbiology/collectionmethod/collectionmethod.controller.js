(function () {
  'use strict';

  angular
    .module('app.collectionmethod')
    .controller('CollectionmethodController', CollectionmethodController);

  CollectionmethodController.$inject = ['collectionmethodDS', 'localStorageService', 'logger',
    'configurationDS', '$rootScope', '$filter', '$state', 'moment', 'LZString', '$translate'
  ];

  function CollectionmethodController(collectionmethodDS, localStorageService, logger,
    configurationDS, $rootScope, $filter, $state, moment, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'collectionmethod';
    vm.name = ['name', 'state'];
    vm.state = ['-state', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.collectionmethodDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getCollectionMethod = getCollectionMethod;
    vm.getcollectionmethodId = getcollectionmethodId;
    vm.generateFile = generateFile;
    vm.newcollectionmethod = newcollectionmethod;
    vm.EditCollectionMethod = EditCollectionMethod;
    vm.changeState = changeState;
    vm.cancelCollectionMethod = cancelCollectionMethod;
    vm.insertCollectionMethod = insertCollectionMethod;
    vm.updateCollectionMethod = updateCollectionMethod;
    vm.saveCollectionMethod = saveCollectionMethod;
    vm.stateButton = stateButton;
    vm.removeData = removeData;
    vm.modalError = modalError;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;

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
        vm.getCollectionMethod();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para adicionar o eliminar elementos del JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });

      return data.data;
    }
    //** Método que habilita o deshabilitar los controles y botones para crear una nueva tarea**//
    function newcollectionmethod(CollectionMethodform) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      CollectionMethodform.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.collectionmethodDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'state': true
      };
      vm.stateButton('add');
    }
    //** Método que deshabilitar los controles y botones para cancelar una tarea**//
    function cancelCollectionMethod(CollectionMethodForm) {
      CollectionMethodForm.$setUntouched();
      vm.loadingdata = false;
      if (vm.collectionmethodDetail.id === null || vm.collectionmethodDetail.id === undefined) {
        vm.collectionmethodDetail = [];
      } else {
        vm.getcollectionmethodId(vm.collectionmethodDetail.id, vm.selected, CollectionMethodForm);
      }
      vm.stateButton('init');
      vm.nameReapeat = false;
    }
    //** Método que habilita o deshabilitar los controles y botones para editar una nueva método de recolección**//
    function EditCollectionMethod() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo método de recolección o se va actualizar **//
    function saveCollectionMethod(CollectionMethodForm) {
      CollectionMethodForm.$setUntouched();
      if (vm.collectionmethodDetail.id === null) {
        vm.insertCollectionMethod();
      } else {
        vm.updateCollectionMethod();
      }
    }
    //** Método que inserta un nuevo método de recolección**//
    function insertCollectionMethod() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return collectionmethodDS.newcollectionmethod(auth.authToken, vm.collectionmethodDetail).then(function (data) {
        if (data.status === 200) {
          vm.getCollectionMethod();
          vm.collectionmethodDetail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value, key) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameReapeat = true;
            }
          });
        } else {
          logger.error($filter('translate')('0029') + error.data.code);
        }

      });
    }
    //** Método que Actualiza una método de recolección**//
    function updateCollectionMethod() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return collectionmethodDS.updatecollectionmethod(auth.authToken, vm.collectionmethodDetail).then(function (data) {
        if (data.status === 200) {
          vm.getCollectionMethod();
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value, key) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameReapeat = true;
            }
          });
        } else {
          logger.error($filter('translate')('0029') + error.data.code);
        }
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameReapeat = true;
            }
          });
        }
      }
      if (!vm.nameReapeat) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      vm.ShowPopupState = false;
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene una lista de tareas**//
    function getCollectionMethod() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return collectionmethodDS.getcollectionmethod(auth.authToken).then(function (data) {
        vm.datacollectionmethod = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene una tarea por id*//
    function getcollectionmethodId(id, index, CollectionMethodForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.collectionmethodDetail = [];
      vm.nameReapeat = false;
      vm.loadingdata = true;
      CollectionMethodForm.$setUntouched();
      return collectionmethodDS.getcollectionmethodId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.collectionmethodDetail = data.data;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError();
      });
    }
    /** funcion para generar informe en PDF O EXEL de areas*/
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/microbiology/collectionmethod/collectionmethod.mrt';
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
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.collectionmethodDetail.id === null || vm.collectionmethodDetail.id === undefined ? true : false;
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
      }
      if (state === 'edit') {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
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
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.stateButton('init');
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

})();
