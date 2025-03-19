(function () {
  'use strict';
  angular
    .module('app.technique')
    .filter("trust", ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('TechniqueController', TechniqueController);
  TechniqueController.$inject = ['techniqueDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function TechniqueController(techniqueDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, LZString, $translate) {
    $rootScope.menu = true;
    $rootScope.blockView = true;
    var vm = this;
    vm.init = init;
    vm.title = 'Technique';
    vm.code = ['code', 'name', 'state'];
    vm.name = ['name', 'code', 'state'];
    vm.state = ['-state', '+code', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.selected = -1;
    vm.techniqueDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getTechnique = getTechnique;
    vm.getTechniqueId = getTechniqueId;
    vm.NewTechnique = NewTechnique;
    vm.EditTechnique = EditTechnique;
    vm.changeState = changeState;
    vm.cancelTechnique = cancelTechnique;
    vm.insertTechnique = insertTechnique;
    vm.updateTechnique = updateTechnique;
    vm.saveTechnique = saveTechnique;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    vm.removeData = removeData;
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
        vm.getTechnique();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        if (vm.errorservice === 0) {
          vm.modalError(error);
          vm.errorservice = vm.errorservice + 1;
        }
      });
    }
    //** Método que habilita o deshabilitar los controles y botones para crear una nueva técnica**//
    function NewTechnique(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.isDisabledState = true;
      vm.techniqueDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'code': '',
        'name': '',
        'state': true
      };
      vm.stateButton('add');
    }
    //** Método que deshabilitar los controles y botones para cancelar una técnica**//
    function cancelTechnique(TechniqueForm) {
      if (vm.techniqueDetail.id === null) {
        vm.techniqueDetail = [];
      } else {
        vm.getTechniqueId(vm.techniqueDetail.id, vm.selected, TechniqueForm);
      }
      vm.stateButton('init');
    }
    //** Método que habilita o deshabilitar los controles y botones para editar una nueva técnica**//
    function EditTechnique() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es una nueva técnica o se va actualizar**//
    function saveTechnique(TechniqueForm) {
      TechniqueForm.$setUntouched();
      if (vm.texareaHtml !== undefined) {
        vm.techniqueDetail.name = vm.texareaHtml.replace(/span/g, "font").replace(/<br><br>/g, '<br>');
      } else {
        vm.techniqueDetail.name= vm.techniqueDetail.name===undefined?'': vm.techniqueDetail.name.replace(/span/g, "font");      
        vm.techniqueDetail.name= vm.techniqueDetail.name===undefined?'': vm.techniqueDetail.name.replace(new RegExp("<p>", 'g'), "<div>");
        vm.techniqueDetail.name= vm.techniqueDetail.name===undefined?'': vm.techniqueDetail.name.replace(new RegExp("</p>", 'g'), "</div>");
      }
      if (vm.techniqueDetail.id === null) {
        vm.insertTechnique();
      } else {
        vm.updateTechnique();
      }
      vm.texareaHtml = undefined;
    }
    //** Método que inserta una nueva técnica**//
    function insertTechnique() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return techniqueDS.NewTechnique(auth.authToken, vm.techniqueDetail).then(function (data) {
        if (data.status === 200) {
          vm.getTechnique();
          vm.techniqueDetail = data.data;
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
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }
    //** Método que Actualiza una técnica**//
    function updateTechnique() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return techniqueDS.updateTechnique(auth.authToken, vm.techniqueDetail).then(function (data) {
        if (data.status === 200) {
          vm.getTechnique();
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
    //** Método que obtiene una lista de técnicas**//
    function getTechnique() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return techniqueDS.getTechnique(auth.authToken).then(function (data) {
        vm.dataTechnique = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        vm.stateButton('init');
      }, function (error) {
        vm.errorservice = vm.errorservice + 1;
        vm.modalError(error);
      });
    }
    //** Método que obtiene una técnica por id*//
    function getTechniqueId(id, index, TechniqueForm) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.techniqueDetail = [];
      TechniqueForm.$setUntouched();
      vm.loadingdata = true;
      return techniqueDS.getTechniqueId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.loadingdata = false;
          vm.techniqueDetail = data.data;
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
        vm.pathreport = '/report/configuration/test/technique/technique.mrt';
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
        vm.isDisabledEdit = vm.techniqueDetail.id === null || vm.techniqueDetail.id === undefined ? true : false;
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
    //** Método que controla la cantidad maxima de datos
    function keyPressTextarea($event) {
      var keyCode = $event !== undefined ? ($event.which || $event.keyCode) : undefined;
      var c = '';
      if (keyCode === 13) {
        var target = '<' + $event.target.lastChild.localName + '>';
        var n = document.getElementById('name').innerHTML.split(target).length;
        var arr = document.getElementById('name').innerHTML.split(target);
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
