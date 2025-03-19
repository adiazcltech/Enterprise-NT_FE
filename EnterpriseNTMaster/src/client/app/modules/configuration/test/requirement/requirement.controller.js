(function () {
  'use strict';

  angular
    .module('app.requirement')
    .controller('RequirementController', RequirementController);

  RequirementController.$inject = ['requirementDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function RequirementController(requirementDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Requirement';
    vm.code = ['code', 'state'];
    vm.state = ['-state', '+code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.selected = -1;
    vm.requirementDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getRequirement = getRequirement;
    vm.getRequirementId = getRequirementId;
    vm.NewRequirement = NewRequirement;
    vm.EditRequirement = EditRequirement;
    vm.changeState = changeState;
    vm.cancelRequirement = cancelRequirement;
    vm.insertRequirement = insertRequirement;
    vm.updateRequirement = updateRequirement;
    vm.saveRequirement = saveRequirement;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    vm.stateButton = stateButton;
    var auth;
    vm.codeRepeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.keyPressTextarea = keyPressTextarea;
    vm.customMenu = [
      ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
      ['code', 'quote', 'paragraph'],
      ['ordered-list', 'unordered-list', 'outdent', 'indent'],
      ['left-justify', 'center-justify', 'right-justify'],
      ['remove-format'],
      ['link', 'image'],
      ['font'],
      ['font-size'],
      ['font-color', 'hilite-color']
    ];
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    // Método que elimina los datos que no se necesitan en la grilla
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;

      });
      return data.data;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getRequirement();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que habilita o deshabilitar los controles y botones para crear un nuevo requisito**//
    function NewRequirement(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.requirementDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'code': '',
        'requirement': '',
        'state': true
      };
      vm.stateButton('add');
    }
    //** Método que deshabilitar los controles y botones para cancelar un requisito**//
    function cancelRequirement(RequirementForm) {
      RequirementForm.$setUntouched();
      vm.codeRepeat = false;
      if (vm.requirementDetail.id === null) {
        vm.requirementDetail = [];
      } else {
        vm.getRequirementId(vm.requirementDetail.id, vm.selected, RequirementForm);
      }
      vm.stateButton('init');
    }
    //** Método que habilita o deshabilitar los controles y botones para editar un nuevo requisito**//
    function EditRequirement() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es un nuevo requisito o se va actualizar**//
    function saveRequirement(RequirementForm) {
      RequirementForm.$setUntouched();
      if (vm.texareaHtml !== undefined) {
        vm.requirementDetail.requirement = vm.texareaHtml.replace(/span/g, "font").replace(/<br><br>/g, '<br>');
      } else {
        vm.requirementDetail.requirement = vm.requirementDetail.requirement.replace(/span/g, "font");
      }
      if (vm.requirementDetail.id === null) {
        vm.insertRequirement();
      } else {
        vm.updateRequirement();
      }
      vm.texareaHtml = undefined;
    }
    //** Método que inserta un nuevo requisito**//
    function insertRequirement() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.stateButton('init');
      vm.loadingdata = true;
      return requirementDS.NewRequirement(auth.authToken, vm.requirementDetail).then(function (data) {
        if (data.status === 200) {
          vm.getRequirement();
          vm.requirementDetail = data.data;
          vm.selected = data.data.id;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'code') {
              vm.codeRepeat = true;
              vm.loadingdata = false;
            }
          });
        }
      }
      if (vm.codeRepeat === false) {
        vm.loadingdata = false;
        vm.Error = error;
        vm.ShowPopupError = true;
      }

    }
    //** Método que Actualiza un requisito**//
    function updateRequirement() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return requirementDS.updateRequirement(auth.authToken, vm.requirementDetail).then(function (data) {
        if (data.status === 200) {
          vm.getRequirement();
          vm.stateButton('update');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene una lista de requisitos**//
    function getRequirement() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return requirementDS.getRequirement(auth.authToken).then(function (data) {
        vm.dataRequirement = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.dataRequirement;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene un requisito por id*//
    function getRequirementId(id, index, RequirementForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.requirementDetail = [];
      RequirementForm.$setUntouched();
      vm.loadingdata = true;
      return requirementDS.getRequirementId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.loadingdata = false;
          vm.requirementDetail = data.data;
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
        vm.pathreport = '/report/configuration/test/requirement/requirement.mrt';
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
        vm.isDisabledEdit = vm.requirementDetail.id === null || vm.requirementDetail.id === undefined ? true : false;
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
    //** Método para validar la cantidad maxima*//
    function keyPressTextarea($event) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      var c = '';
      if (keyCode === 13) {
        var target = '<' + $event.target.lastChild.localName + '>';
        var n = document.getElementById('requirement').innerHTML.split(target).length;
        var arr = document.getElementById('requirement').innerHTML.split(target);
        c = arr[0];
        for (var i = 1; i <= n - 1; i++) {
          c = c + '<br>' + arr[i];
        }
        vm.texareaHtml = c;
      } else if (keyCode > 31 && keyCode < 255 && keyCode !== 127 && $event.key !== 'Delete') {
        if (vm.texareaHtml !== undefined)
          vm.texareaHtml = vm.texareaHtml + $event.key;
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
