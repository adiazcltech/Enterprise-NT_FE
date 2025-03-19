(function () {
  'use strict';
  angular
    .module('app.histogram')
    .controller('histogramController', histogramController);
  histogramController.$inject = ['histogramDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function histogramController(histogramDS, configurationDS, localStorageService,
    logger, $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'histogram';
    vm.sortType = 'name';
    vm.sortReverse = true;
    vm.selected = -1;
    vm.detail = [];
    vm.isAuthenticate = isAuthenticate;
    vm.validRange = true;
    vm.get = get;
    vm.getById = getById;
    vm.edit = edit;
    vm.add = add;
    vm.update = update;
    vm.insert = insert;
    vm.removeData = removeData;
    vm.cancel = cancel;
    vm.save = save;
    vm.changeState = changeState;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    vm.modalError = modalError;
    vm.validRange = validRange;
    vm.nameRepeat = false;
    vm.abbreviationRepeat = false;
    vm.errorservice = 0;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.get();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
          vm.stateButton('init');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para adicionar o remover elementos de JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Metodo para traer una lista de histogramas**//
    function get() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return histogramDS.get(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener el detalle del histograma**//
    function getById(id, index, form) {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = index;
      vm.detail = [];
      vm.nameRepeat = false;
      vm.abbreviationRepeat = false;
      form.$setUntouched();
      return histogramDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.detail = data.data;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para evaluar si los datos se crean o se actualizan**//
    function save(form) {
      vm.loadingdata = true;
      vm.nameRepeat = false;
      vm.validRange();
      if (!vm.showInvalidRange && !vm.showInvalidRangeminimum && !vm.showInvalidMaxCero) {
        if (vm.detail.id === null) {
          vm.insert();
        } else {
          vm.update();
        }
      }
    }
    //** Metodo para actualizar los datos**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.detail.user.id = auth.id;
      return histogramDS.update(auth.authToken, vm.detail).then(function (data) {
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
    //** Metodo para insertar los datos**//
    function insert() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return histogramDS.insert(auth.authToken, vm.detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.detail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para habilitar los controles**//
    function edit() {
      vm.stateButton('edit');
    }
    //** Metodo para preparar un JSON para crear un nuevo histograma**//
    function add(form) {
      form.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.usuario = '';
      vm.selected = -1;
      vm.detail = {
        'id': null,
        'name': '',
        'minimumimum': 0,
        'maximumimum': 0,
        'state': true,
        'lastTransaction': '',
        'user': {
          'id': auth.id
        },
      };
      vm.stateButton('add');
    }
    //** Metodo que cancela cambios echos**//
    function cancel(form) {
      form.$setUntouched();
      vm.nameRepeat = false;
      vm.abbreviationRepeat = false;
      if (vm.detail.id === null || vm.detail.id === undefined) {
        vm.detail = [];
      } else {
        vm.getById(vm.detail.id, vm.selected, form);
      }
      vm.stateButton('init');
    }
    //** Metodo que muestra el popup de estar seguro de cambiar el estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Metodo validar los rangos**//
    function validRange() {
      vm.loadingdata = false;
      vm.showInvalidRange = false;
      vm.showInvalidRangeminimum = false;
      vm.showInvalidMaxCero = vm.detail.minimum === 0 || vm.detail.minimum === 0 ? true : false;
      if (vm.detail.minimum !== 0 && vm.detail.minimum !== 0) {
        if (vm.detail.minimum >= vm.detail.maximum) {
          vm.showInvalidRangeminimum = true;
        } else {
          for (var i = 0; i < vm.data.length; i++) {
            if (vm.detail.id !== vm.data[i].id) {
              if (vm.detail.minimum === vm.data[i].minimum && vm.detail.maximum === vm.data[i].maximum) {
                vm.showInvalidRange = true;
                break;
              } else if ((vm.detail.minimum < vm.data[i].minimum &&
                  vm.detail.maximum > vm.data[i].maximum) ||
                vm.data[i].minimum === vm.detail.maximum) {
                vm.showInvalidRange = true;
                break;
              } else if (vm.detail.minimum > vm.data[i].minimum && vm.detail.maximum < vm.data[i].maximum) {
                vm.showInvalidRange = true;
                break;
              } else if (vm.detail.minimum < vm.data[i].minimum &&
                vm.detail.maximum < vm.data[i].maximum &&
                vm.detail.maximum > vm.data[i].minimum) {
                vm.showInvalidRange = true;
                break;
              } else if (vm.detail.minimum > vm.data[i].minimum &&
                vm.detail.maximum > vm.data[i].maximum &&
                vm.detail.minimum < vm.data[i].maximum) {
                vm.showInvalidRange = true;
                break;
              }
            }
          }
        }
      }
    }
    //** Metodo validar si el usuario se encuentra logueado**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo validar el estado de los botones**//
    function stateButton(state) {
      vm.showInvalidRange = false;
      vm.showInvalidRangeminimum = false;
      vm.showInvalidMaxCero = false;
      if (state === 'init') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = vm.detail.id === null || vm.detail.id === undefined ? true : false;
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
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.isDisabledState = false;
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
    //** Metodo para mostrar un popup con el error que devolvio el servicio**//
    function modalError(error) {
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
      if (vm.nameRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
      vm.loadingdata = false;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/opportunity/histogram/histogram.mrt';
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
    //** Metodo para inicializar la pagina**//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
