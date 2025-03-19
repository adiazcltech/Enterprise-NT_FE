(function () {
  'use strict';

  angular
    .module('app.area')
    .controller('AreaController', AreaController);

  AreaController.$inject = ['areaDS', 'listDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function AreaController(areaDS, listDS, configurationDS, localStorageService,
    logger, $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Area';
    vm.ordering = ['ordering', 'name', 'nametype', 'state'];
    vm.name = ['name', 'ordering', 'nametype', 'state'];
    vm.nametype = ['nametype', 'ordering', 'name', 'state'];
    vm.state = ['-state', '+ordering', '+name', '+nametype'];
    vm.sortReverse = false;
    vm.sortType = vm.ordering;
    vm.selected = -1;
    vm.areaDetail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getAreas = getAreas;
    vm.getAreaById = getAreaById;
    vm.getListLaboratory = getListLaboratory;
    vm.editArea = editArea;
    vm.addArea = addArea;
    vm.updateArea = updateArea;
    vm.insertArea = insertArea;
    vm.removeData = removeData;
    vm.cancelArea = cancelArea;
    vm.saveArea = saveArea;
    vm.stateButton = stateButton;
    vm.changeState = changeState;
    vm.modalError = modalError;
    vm.generateFile = generateFile;
    vm.orderingRepeat = false;
    vm.nameRepeat = false;
    vm.abbreviationRepeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    /**Accion que sirve para eliminar una columna de una tabla a partir de un objeto area*/
    function removeData(data) {
      var dataArea = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        if (value.id === 1) {
          delete data.data[key];
        } else {
          data.data[key].username = auth.userName;
          dataArea.push(data.data[key]);
        }
        value.nametype = $filter('translate')('0000') === "esCo" ? value.type.esCo : value.type.enUsa;
        value.searchall = value.ordering + value.name + value.nametype;
      });
      return dataArea;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getListLaboratory();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /** Funcion para consultar el listado de areas existentes en el sistema */
    function getAreas() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreas(auth.authToken).then(function (data) {
        if(data.data.length > 0){
          vm.dataAreas = vm.removeData(data);
          vm.dataAreas.length = data.data.length - 1;
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    /** Funcion consultar el detalle de un area.*/
    function getAreaById(id, index, form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.areaDetail = [];
      vm.orderingRepeat = false;
      vm.nameRepeat = false;
      vm.abbreviationRepeat = false;
      vm.loadingdata = true;
      form.$setUntouched();
      return areaDS.getAreaById(auth.authToken, id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.oldAreaDetail = data.data;
          vm.areaDetail = data.data;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /** Funcion consultar el listado de los tipos de laboratorio del sistema */
    function getListLaboratory() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return listDS.getList(auth.authToken, 1).then(function (data) {
        vm.getAreas();
        if (data.status === 200) {
          vm.ListLaboratory = $filter('orderBy')(data.data, 'name');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /** Funcion para evaluar si un area se va a actualizar o a insertar */
    function saveArea(form) {
      form.$setUntouched();
      vm.orderingRepeat = false;
      var seleccionado = vm.selected;
      if (vm.areaDetail.id === null) {
        vm.insertArea();
      } else {
        vm.updateArea();
      }
    }
    /** Funcion ejecutar el servicio que actualiza los datos de un area */
    function updateArea() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.areaDetail.user.id = auth.id;
      return areaDS.updateArea(auth.authToken, vm.areaDetail).then(function (data) {
        if (data.status === 200) {
          vm.getAreas(vm.areaDetail.id);
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /**Funcion ejecutar el servicio que inserta los datos de un area.*/
    function insertArea() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.insertArea(auth.authToken, vm.areaDetail).then(function (data) {
        if (data.status === 200) {
          vm.areaDetail = data.data;
          vm.getAreas(data.data.id);
          vm.selected = data.data.id;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    /** Funcion ejecutar el servicio que inserta los datos de un area.*/
    function editArea() {
      vm.stateButton('edit');
    }
    /**Funcion para habilitar los controles del form */
    function addArea(form) {
      form.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.usuario = '';
      vm.selected = -1;
      vm.areaDetail = {
        'abbreviation': '',
        'color': '#FFFFFF',
        'id': null,
        'lastTransaction': '',
        'name': '',
        'nameEnglish': '',
        'ordering': null,
        'partialValidation': true,
        'state': true,
        'type': {
          'id': 2
        },
        'user': {
          'id': auth.id
        }
      };
      vm.stateButton('add');
    }
    /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de un area.*/
    function cancelArea(form) {
      form.$setUntouched();
      vm.orderingRepeat = false;
      vm.nameRepeat = false;
      vm.abbreviationRepeat = false;
      vm.loadingdata = false;
      if (vm.areaDetail.id === null || vm.areaDetail.id === undefined) {
        vm.areaDetail = [];
      } else {
        vm.getAreaById(vm.areaDetail.id, vm.selected, form);
      }
      vm.stateButton('init');
    }
    /** funcion para confirmar el cambio del estado que se realice sobre un area.*/
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/test/area/area.mrt';
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
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo que evalua los estados de los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.areaDetail.id === null || vm.areaDetail.id === undefined ? true : false;
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
          document.getElementById('codeArea').focus()
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
          document.getElementById('codeArea').focus()
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
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'ordering') {
              vm.orderingRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'abbreviation') {
              vm.abbreviationRepeat = true;
            }
          });
          vm.loadingdata = false;
        }
      }
      if (vm.orderingRepeat === false && vm.nameRepeat === false && vm.abbreviationRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
      }
    }
    /** funcion inicial que se ejecuta cuando se carga el modulo */
    function init() {
      vm.getConfigurationFormatDate();
      vm.stateButton('init');
    }
    vm.isAuthenticate();
  }
})();
