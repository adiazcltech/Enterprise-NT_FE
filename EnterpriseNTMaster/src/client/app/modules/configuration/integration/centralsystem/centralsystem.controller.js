(function () {
  'use strict';

  angular
    .module('app.centralsystem')
    .controller('CentralSystemController', CentralSystemController);
  CentralSystemController.$inject = ['centralsystemDS', 'localStorageService', 'logger',
    'configurationDS', '$rootScope', '$filter', '$state', 'moment', 'LZString', '$translate'
  ];

  function CentralSystemController(centralsystemDS, localStorageService, logger,
    configurationDS, $rootScope, $filter, $state, moment, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'CentralSystem';
    vm.sortReverse = false;
    vm.sortType = 'name';
    vm.selected = -1;
    vm.centralsystemDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getCentralSystem = getCentralSystem;
    vm.getCentralSystemId = getCentralSystemId;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.generateFile = generateFile;
    vm.NewCentralSystem = NewCentralSystem;
    vm.EditCentralSystem = EditCentralSystem;
    vm.changeState = changeState;
    vm.cancelCentralSystem = cancelCentralSystem;
    vm.insertCentralSystem = insertCentralSystem;
    vm.updateCentralSystem = updateCentralSystem;
    vm.saveCentralSystem = saveCentralSystem;
    vm.stateButton = stateButton;
    vm.removeData = removeData;
    vm.modalError = modalError;
    var auth;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Método para adicionar o eliminar elementos de un arreglo**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.ehr;
        delete value.user;
        delete value.lastTransaction;
        delete value.repeatCode;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo sistema central**//
    function NewCentralSystem(CentralSystemform) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      CentralSystemform.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.centralsystemDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'ehr': false,
        'repeatCode': false,
        'state': true
      };
      vm.stateButton('add');
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getCentralSystem();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que deshabilitar los controles y botones para cancelar un sistema central**//
    function cancelCentralSystem(CentralSystemForm) {
      CentralSystemForm.$setUntouched();
      if (vm.centralsystemDetail.id === null || vm.centralsystemDetail.id === undefined) {
        vm.centralsystemDetail = [];
      } else {
        vm.getCentralSystemId(vm.centralsystemDetail.id, vm.selected, CentralSystemForm);
      }
      vm.stateButton('init');
      vm.nameRepeat = false;
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo sistema central**//
    function EditCentralSystem() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo sistema central o se va actualizar **//
    function saveCentralSystem(CentralSystemForm) {
      vm.loadingdata = true;
      CentralSystemForm.$setUntouched();
      if (vm.centralsystemDetail.id === null) {
        vm.insertCentralSystem();
      } else {
        vm.updateCentralSystem();
      }
    }
    //** Método que inserta un nuevo sistema central**//
    function insertCentralSystem() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return centralsystemDS.newCentralSystem(auth.authToken, vm.centralsystemDetail).then(function (data) {
        if (data.status === 200) {
          vm.getCentralSystem();
          vm.centralsystemDetail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value, key) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
          });
        } else {
          logger.error($filter('translate')('0029') + error.data.code);
        }
      });
    }
    //** Método que Actualiza un sistema central**//
    function updateCentralSystem() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.centralsystemDetail.user.id = auth.id;
      return centralsystemDS.updateCentralSystem(auth.authToken, vm.centralsystemDetail).then(function (data) {
        if (data.status === 200) {
          vm.getCentralSystem();
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value, key) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
          });
        } else {
          logger.error($filter('translate')('0029') + error.data.code);
        }
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
          });
        }
      }
      if (!vm.nameRepeat) {
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
    //** Método que obtiene una lista de sistemas centrales**//
    function getCentralSystem() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return centralsystemDS.getCentralSystem(auth.authToken).then(function (data) {
        vm.dataCentralSystem = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene un sistema central por id*//
    function getCentralSystemId(id, index, CentralSystemForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = index;
      vm.centralsystemDetail = [];
      vm.nameRepeat = false;
      CentralSystemForm.$setUntouched();
      vm.loadingdata = true;
      return centralsystemDS.getCentralSystemId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.centralsystemDetail = data.data;
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/integration/centralsystem/centralsystem.mrt';
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
    //** Método que controla la activación o desactivación de los botones del formulario
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.centralsystemDetail.id === null ||
          vm.centralsystemDetail.id === undefined ? true : false;
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
        setTimeout(function () {
          document.getElementById('name').focus()
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
          document.getElementById('name').focus()
        }, 100);
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
      vm.getConfigurationFormatDate();
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
    vm.isAuthenticate();
  }
})();
