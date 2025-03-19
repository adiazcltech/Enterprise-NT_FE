(function () {
  'use strict';
  angular
    .module('app.service')
    .controller('serviceController', serviceController);
  serviceController.$inject = ['serviceDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', '$translate', 'LZString'
  ];

  function serviceController(serviceDS, configurationDS, localStorageService,
    logger, $filter, $state, moment, $rootScope, $translate, LZString) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Service';
    vm.code = ['code', 'name', 'min', 'max', 'state'];
    vm.name = ['name', 'code', 'min', 'max', 'state'];
    vm.min = ['min', 'code', 'name', 'max', 'state'];
    vm.max = ['max', 'code', 'name', 'min', 'state'];
    vm.state = ['-state', '+code', '+name', '+min', '+max'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.selected = -1;
    vm.detail = [];
    vm.isAuthenticate = isAuthenticate;
    vm.validRange = true;
    vm.get = get;
    vm.getConfiguration = getConfiguration;
    vm.getConfigurationDigitosOrden = getConfigurationDigitosOrden;
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
    vm.windowOpenReport = windowOpenReport;
    vm.modalError = modalError;
    vm.validRange = validRange;
    vm.isDisabledCode = true;
    vm.nameRepeat = false;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.loadingdata = true;
    //** Metodo para adicionar o eliminar elementos en el JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].username = auth.userName;
        value.searchall = value.code + value.name + value.min + value.max;
      });
      return data.data;
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getConfiguration();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que consulta la lista de servicios**//
    function get() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceDS.getService(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data;
        if (data.data.length > 0) {
          vm.data = vm.removeData(data);
        }
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que consulta la llave de configuración de tipo de orden**//
    function getConfiguration() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'TipoNumeroOrden').then(function (data) {
        vm.getConfigurationDigitosOrden();
        vm.OrdenNumber = data.data.value === 'Servicio' ? true : false;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que consulta la llave de configuración de digitos de la orden**//
    function getConfigurationDigitosOrden() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'DigitosOrden').then(function (data) {
        vm.get();
        var valueint = '9';
        for (var i = 0; i < data.data.value - 1; i++) {
          valueint = valueint + '' + 9;
        }
        vm.digitosOrdenNumber = valueint;

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que consulta el detalle del servicio seleccionado**//
    function getById(id, index, form) {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.detail = [];
      vm.nameRepeat = false;
      vm.Repeat = false;
      vm.abbreviationRepeat = false;
      form.$setUntouched();
      return serviceDS.getById(auth.authToken, id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
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
    //** Metodo que para validar si el servicio crea un nuevo servicio o lo actualiza**//
    function save(form) {
      vm.validRange();
      if (!vm.showInvalidRange && !vm.showInvalidRangemin && !vm.showInvalidMaxCero) {
        if (vm.detail.id === null) {
          vm.insert();
        } else {
          vm.update();
        }
      }
    }
    //** Metodo para actualizar el servicio**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.detail.user.id = auth.id;
      return serviceDS.update(auth.authToken, vm.detail).then(function (data) {
        vm.loadingdata = false;
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
    //** Metodo para insertar un nuevo servicio**//
    function insert() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return serviceDS.insert(auth.authToken, vm.detail).then(function (data) {
        vm.loadingdata = false;
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
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/demographics/service/service.mrt';
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
    //** Metodo para edita un servicio**//
    function edit() {
      vm.stateButton('edit');
    }
    //** Metodo que prepara un objeto para crear un nuevo servicio**//
    function add(form) {
      form.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');

      vm.usuario = '';
      vm.selected = -1;
      vm.detail = {
        'id': null,
        'name': '',
        'min': 0,
        'max': 0,
        'external': true,
        'state': true,
        'lastTransaction': '',
        'user': {
          'id': auth.id
        },
      };
      vm.stateButton('add');
    }
    //** Metodo para cancelar los cambios en el servicio**//
    function cancel(form) {
      form.$setUntouched();
      vm.nameRepeat = false;
      vm.Repeat = false;
      if (vm.detail.id === null || vm.detail.id === undefined) {
        vm.detail = [];
      } else {
        vm.getById(vm.detail.id, vm.selected, form);
      }
      vm.stateButton('init');
    }
    //** Metodo que valida el cambio del control de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Metodo que valida los rangos para que no se solapen**//
    function validRange() {
      vm.showInvalidRange = false;
      vm.showInvalidRangemin = false;
      if (vm.OrdenNumber) {
        vm.showInvalidMaxCero = vm.detail.min === 0 || vm.detail.min === 0 ? true : false;
        if (vm.detail.min !== 0 && vm.detail.min !== 0) {
          if (vm.detail.min >= vm.detail.max) {
            vm.showInvalidRangemin = true;
          } else {
            for (var i = 0; i < vm.data.length; i++) {
              if (vm.detail.id !== vm.data[i].id) {
                if (vm.detail.min === vm.data[i].min && vm.detail.max === vm.data[i].max) {
                  vm.showInvalidRange = true;
                  break;
                } else if ((vm.detail.min < vm.data[i].min &&
                    vm.detail.max > vm.data[i].max) ||
                  vm.data[i].min === vm.detail.max) {
                  vm.showInvalidRange = true;
                  break;
                } else if (vm.detail.min > vm.data[i].min && vm.detail.max < vm.data[i].max) {
                  vm.showInvalidRange = true;
                  break;
                } else if (vm.detail.min < vm.data[i].min &&
                  vm.detail.max < vm.data[i].max &&
                  vm.detail.max > vm.data[i].min) {
                  vm.showInvalidRange = true;
                  break;
                } else if (vm.detail.min > vm.data[i].min &&
                  vm.detail.max > vm.data[i].max &&
                  vm.detail.mini < vm.data[i].max) {
                  vm.showInvalidRange = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    //** Metodo que válida que el usuario se encuentre autenticado**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Metodo que válida el estado de los botones**//
    function stateButton(state) {
      vm.showInvalidRange = false;
      vm.showInvalidRangemin = false;
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
        vm.isDisabledState = true;
        setTimeout(function () {
          document.getElementById('code').focus()
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
    //** Metodo que muestra una ventana modal cuando hay error en un servicio**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.nameRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'code') {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.nameRepeat === false && vm.Repeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Metodo que inicializa la pagina**//
    function init() {
      vm.stateButton('init');
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }

})();
