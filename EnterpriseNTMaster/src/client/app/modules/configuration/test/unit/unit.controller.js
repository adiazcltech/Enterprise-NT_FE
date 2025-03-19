(function () {
  'use strict';

  angular
    .module('app.unit')
    .filter("trust", ['$sce', function ($sce) {
      return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('UnitController', UnitController);
  UnitController.$inject = ['unitDS', 'configurationDS', 'localStorageService',
    '$filter', '$state', 'moment', 'logger', '$rootScope', 'LZString', '$translate'
  ];

  function UnitController(unitDS, configurationDS, localStorageService,
    $filter, $state, moment, logger, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Unit';
    vm.name = ['name', 'international', 'conversionFactor', 'state'];
    vm.international = ['international', 'name', 'conversionFactor', 'state'];
    vm.conversionFactor = ['conversionFactor', 'name', 'international', 'state'];
    vm.state = ['-state', '+name', '+international', '+conversionFactor'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.selected = -1;
    vm.unitDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isDisabledCon = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getUnit = getUnit;
    vm.getUnitId = getUnitId;
    vm.NewUnit = NewUnit;
    vm.EditUnit = EditUnit;
    vm.changeState = changeState;
    vm.cancelUnit = cancelUnit;
    vm.insertUnit = insertUnit;
    vm.updateunit = updateunit;
    vm.saveUnit = saveUnit;
    vm.Validate = Validate;
    vm.generateFile = generateFile;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    var auth;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.validatedtext = validatedtext;
    vm.validcontrol = false;
    vm.validatedtextunit = validatedtextunit;
    vm.validcontrolunit = false;
    vm.tinymceOptions = {
      resize: false,
      min_height: 50,
      menubar: false,
      br_newline_selector : true,
      force_br_newlines : true,
      force_p_newlines : false,
      forced_root_block : false,
      convert_newlines_to_brs : true,
      language: $filter('translate')('0000') === 'esCo' ? 'es' : 'en',
      plugins: [
        '  anchor textcolor charmap'
      ],
      toolbar: [
        'bold italic subscript  superscript | fontselect fontsizeselect | forecolor charmap | code'
      ]
    };
    //** Metodo valida el maximo de el texto**//
    function validatedtext() {
      vm.validcontrol = false;
      if (vm.unitDetail.international !== undefined) {
        if (vm.unitDetail.international.length > 250) {
          vm.validcontrol = true;
        }
      }
    }
    //** Metodo valida el maximo de el texto de la unidad**//
    function validatedtextunit() {
      vm.validcontrolunit = false;
      if (vm.unitDetail.name !== undefined) {
        if (vm.unitDetail.name.length > 250) {
          vm.validcontrolunit = true;
        }
      }
    }
    //** Metodo Adicionar o eliminar campos en un JSON**//
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
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
        vm.getUnit();
      }, function (error) {
        vm.modalError(error);

      });
    }
    // Método habilita y desabilita los botones
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.unitDetail.id === null || vm.unitDetail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isDisabledCon = true;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisabledCon = false;
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
        vm.isDisabledCon = false;
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
        vm.isDisabledCon = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
        vm.isDisabledCon = true;
      }
    }
    //** Método que obtiene una lista de unidades**//
    function getUnit() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return unitDS.getUnit(auth.authToken).then(function (data) {
        vm.dataUnit = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.dataUnit;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que valida que en internacional halla algo escrito**//
    function Validate() {
      if (vm.unitDetail.international !== '') {
        vm.isDisabledCon = false;
      } else {
        vm.isDisabledCon = true;
        vm.unitDetail.conversionFactor = 0;
      }
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
    //** Método inicializa los controles para crear una nueva unidad**//
    function NewUnit(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.unitDetail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'international': '',
        'conversionFactor': 1,
        'state': true
      };
      vm.stateButton('add');
    }
    //** Método que deshabilitar los controles y botones para cancelar una unidad**//
    function cancelUnit(UnitForm) {
      UnitForm.$setUntouched();
      vm.Repeat = false;
      if (vm.unitDetail.id === null || vm.unitDetail.id === undefined) {
        vm.unitDetail.name = '';
        vm.unitDetail = [];
      } else {
        vm.getUnitId(vm.unitDetail.id, vm.selected, UnitForm);
      }
      vm.stateButton('init');
    }
    //** Método que habilita o deshabilitar los controles y botones para editar una nueva unidad**//
    function EditUnit() {
      vm.stateButton('edit');
    }
    //** Método que evalua si es una nueva unidad o se va actualizar**//
    function saveUnit(UnitForm) {
      UnitForm.$setUntouched();
      vm.unitDetail.name= vm.unitDetail.name===undefined?'': vm.unitDetail.name.replace(/span/g, "font");      
      vm.unitDetail.name= vm.unitDetail.name===undefined?'': vm.unitDetail.name.replace(new RegExp("<p>", 'g'), "<div>");
      vm.unitDetail.name= vm.unitDetail.name===undefined?'': vm.unitDetail.name.replace(new RegExp("</p>", 'g'), "</div>");
      vm.unitDetail.international= vm.unitDetail.international===undefined?'': vm.unitDetail.international.replace(/span/g, "font");      
      vm.unitDetail.international= vm.unitDetail.international===undefined?'': vm.unitDetail.international.replace(new RegExp("<p>", 'g'), "<div>");
      vm.unitDetail.international= vm.unitDetail.international===undefined?'': vm.unitDetail.international.replace(new RegExp("</p>", 'g'), "</div>");
      if (vm.unitDetail.id === null) {
        vm.insertUnit();
      } else {
        vm.updateunit();
      }
    }
    //** Método que inserta una nueva unidad**//
    function insertUnit() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.loadingdata = true;
      return unitDS.NewUnit(auth.authToken, vm.unitDetail).then(function (data) {
        if (data.status === 200) {
          vm.Repeat = false;
          vm.getUnit();
          vm.selected = data.data.id;
          vm.unitDetail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que Actualiza una unidad**//
    function updateunit() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.unitDetail.user.id = auth.id;
      vm.loadingdata = true;
      return unitDS.updateunit(auth.authToken, vm.unitDetail).then(function (data) {
        if (data.status === 200) {
          vm.Repeat = false;
          vm.getUnit();
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
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeat = true;
              vm.loadingdata = false;
            }
          });
        }
      }
      if (vm.Repeat === false) {
        vm.loadingdata = false;
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene una unidad por id*//
    function getUnitId(id, index, UnitForm) {
      vm.Repeat = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.unitDetail = [];
      UnitForm.$setUntouched();
      vm.loadingdata = true;
      vm.validcontrol = false;
      vm.validcontrolunit = false;
      return unitDS.getUnitId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.stateButton('update');
          vm.unitDetail = data.data;
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
        vm.pathreport = '/report/configuration/test/unit/unit.mrt';
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
