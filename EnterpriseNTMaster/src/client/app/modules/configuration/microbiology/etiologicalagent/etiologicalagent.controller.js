(function () {
  'use strict';
  angular.module('app.etiologicalagent').controller('etiologicalagentController', etiologicalagentController);
  etiologicalagentController.$inject = ['etiologicalagentDS', 'configurationDS', 'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'];

  function etiologicalagentController(etiologicalagentDS, configurationDS, localStorageService, logger, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Etiological Agent';
    vm.searchby = ['search', 'microorganism', 'code', 'clasification'];
    vm.microorganism = ['microorganism', 'search', 'code', 'clasification'];
    vm.code = ['code', 'search', 'microorganism', 'clasification'];
    vm.clasification = ['clasification', 'search', 'microorganism', 'code'];
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
    vm.New = New;
    vm.Edit = Edit;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.searchRequired = false;
    vm.microorganismRequired = false;
    vm.codeRequired = false;
    vm.clasificationRequired = false;

    vm.listsearch = [
      { 'id': 1, name: $filter('translate')('0178')},
      { 'id': 2, name: $filter('translate')('0317')}
    ];

    vm.listclasification = [
      { 'id': 1, name: $filter('translate')('1331')},
      { 'id': 2, name: $filter('translate')('1332')},
      { 'id': 3, name: $filter('translate')('1333')},
      { 'id': 4, name: $filter('translate')('1334')},
    ];

    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });
      return data.data;
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
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
        vm.get();
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Metodo que habilita y desabilita los botones**//
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

    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'searchBy': 1,
        'microorganism': "",
        "code": "",
        "clasification": 1
      };
      vm.stateButton('add');
    }

    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      Form.$setUntouched();
      vm.searchRequired = false;
      vm.microorganismRequired = false;
      vm.codeRequired = false;
      vm.clasificationRequired = false;
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
    }

    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }

    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      Form.$setUntouched();
      if (vm.Detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
    }

    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return etiologicalagentDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          vm.searchRequired = false;
          vm.microorganismRequired = false;
          vm.codeRequired = false;
          vm.clasificationRequired = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return etiologicalagentDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          vm.searchRequired = false;
          vm.microorganismRequired = false;
          vm.codeRequired = false;
          vm.clasificationRequired = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '0' && item[1] === 'searchby') {
              vm.searchRequired = true;
            }
            if (item[0] === '0' && item[1] === 'microorganism') {
              vm.microorganismRequired = true;
            }
            if (item[0] === '0' && item[1] === 'code') {
              vm.codeRequired = true;
            }
            if (item[0] === '0' && item[1] === 'clasification') {
              vm.clasificationRequired = true;
            }
          });
        }
      }

      if (!vm.searchRequired && !vm.microorganismRequired && !vm.codeRequired && !vm.clasificationRequired) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }

    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return etiologicalagentDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.loadingdata = true;
      return etiologicalagentDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.stateButton('update');
          vm.loadingdata = false;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }

    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/microbiology/etiologicalagent/etiologicalagent.mrt';
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

    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
