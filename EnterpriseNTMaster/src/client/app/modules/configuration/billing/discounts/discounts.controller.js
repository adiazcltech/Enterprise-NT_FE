(function () {
  'use strict';

  angular
    .module('app.discounts')
    .controller('discountsController', discountsController);

  discountsController.$inject = ['discountsDS', 'localStorageService', 'logger',
    'configurationDS', '$rootScope', '$filter', '$state', 'moment', 'LZString', '$translate'
  ];

  function discountsController(discountsDS, localStorageService, logger,
    configurationDS, $rootScope, $filter, $state, moment, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Discounts';
    vm.code = ['code', 'name', 'percentage', 'state'];
    vm.name = ['name', 'code', 'percentage', 'state'];
    vm.percentage = ['percentage', 'code', 'name', 'state'];
    vm.state = ['-state', '+code', '+name', '+percentage'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.generateFile = generateFile;
    vm.NewCard = NewCard;
    vm.EditCard = EditCard;
    vm.changeState = changeState;
    vm.cancelCard = cancelCard;
    vm.insertCard = insertCard;
    vm.updateCard = updateCard;
    vm.saveCard = saveCard;
    vm.stateButton = stateButton;
    vm.removeData = removeData;
    vm.modalError = modalError;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    var auth;

    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo para adicionar o eliminar elementos de un JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo sistema central**//
    function NewCard(Cardform) {
      Cardform.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail = {
        'id': null,
        'code': '',
        'name': '',
        'percentage': 0,
        'state': true,
        'idUserCreating': auth.id,
        'dateCreation': new Date().getTime()
      };
      vm.stateButton('add');
    }
    //** Método para obtener el formato de la llave de configuración**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.get();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que deshabilitar los controles y botones para cancelar un sistema central**//
    function cancelCard(CardForm) {
      CardForm.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, CardForm);
      }
      vm.stateButton('init');
      vm.nameRepeat = false;
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo sistema central**//
    function EditCard() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo sistema central o se va actualizar **//
    function saveCard(CardForm) {
      vm.loadingdata = true;
      CardForm.$setUntouched();
      if (vm.Detail.id === null) {
        vm.insertCard();
      } else {
        vm.updateCard();
      }
    }
    //** Método que inserta un nuevo sistema central**//
    function insertCard() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return discountsDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza un sistema central**//
    function updateCard() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.dateOfModification = new Date().getTime();
      vm.Detail.modifyingUserId = auth.id;
      return discountsDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.codeRepeat = false;
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'code') {
              vm.codeRepeat = true;
            }
          });
        }
      }
      if (!vm.nameRepeat && !vm.codeRepeat) {
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
    function get() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return discountsDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que obtiene un sistema central por id*//
    function getId(id, CardForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.nameRepeat = false;
      CardForm.$setUntouched();
      vm.loadingdata = true;
      return discountsDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          //vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = moment(data.data.dateCreation).format(vm.formatDate);
          //vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.Detail = data.data;
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
        vm.pathreport = '/report/configuration/billing/discounts/discounts.mrt';
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
        vm.isDisabledEdit = vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
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
          document.getElementById('code').focus()
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
          document.getElementById('code').focus()
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
    vm.isAuthenticate();
  }

})();
