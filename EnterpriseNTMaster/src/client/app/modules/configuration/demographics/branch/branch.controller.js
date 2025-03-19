(function () {
  'use strict';
  angular.module('app.branch')
    .controller('branchController', branchController);
  branchController.$inject = ['branchDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function branchController(branchDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Branch';
    vm.code = ['code', 'name', 'minimum', 'maximum', 'state'];
    vm.name = ['name', 'code', 'minimum', 'maximum', 'state'];
    vm.minimum = ['minimum', 'code', 'name', 'maximum', 'state'];
    vm.maximum = ['maximum', 'code', 'name', 'minimum', 'state'];
    vm.state = ['-state', '+code', '+name', '+minimum', '+maximum'];

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
    vm.modalError = modalError;
    vm.validRange = validRange;
    vm.isDisabledCode = true;
    vm.nameRepeat = false;
    vm.codeRepeat = false;
    vm.abbreviationRepeat = false;
    vm.errorservice = 0;
    vm.maskphone = '';
    vm.getConfigurationmask = getConfigurationmask;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    // función que consulta la llave de configuración de la mascara configurada
    function getConfigurationmask() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoTelefono').then(function (data) {
        if (data.data.value !== '') {
          vm.maskphone = data.data.value;
        }
        vm.get();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
          vm.getConfiguration();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para adicionar o eliminar elementos del JSON**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        value.searchall = value.code + value.name + value.minimum + value.maximum;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método para consultar la lista de sedes**//
    function get() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranch(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para consultar la llave de configuración del tipo de sede**//
    function getConfiguration() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'TipoNumeroOrden').then(function (data) {
        vm.OrdenNumber = data.data.value === 'Sede' ? true : false;
        vm.getConfigurationDigitosOrden();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para consultar la llave de configuración de los digitos de la orden**//
    function getConfigurationDigitosOrden() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'DigitosOrden').then(function (data) {
        var valueint = '9';
        for (var i = 0; i < data.data.value - 1; i++) {
          valueint = valueint + '' + 9;
        }
        vm.digitosOrdenNumber = valueint;
        vm.stateButton('init');
        vm.getConfigurationmask();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para consultar el detalle de la sede seleccionada**//
    function getById(id, index, form) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.detail = [];
      vm.nameRepeat = false;
      vm.codeRepeat = false;
      vm.abbreviationRepeat = false;
      vm.loadingdata = true;
      form.$setUntouched();
      return branchDS.getById(auth.authToken, id).then(function (data) {
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
    //** Método para validar si la sede se va guardar o insertar**//
    function save(form) {
      form.$setUntouched();
      form.name.$touched = true;
      vm.codeRepeat = false;
      vm.validRange();
      vm.detail.code = (vm.detail.code < 10 && (vm.detail.code.length === 1 || vm.detail.code.length === undefined) ? 0 + '' + vm.detail.code : vm.detail.code);
      if (!form.name.$invalid && !vm.showInvalidRange && !vm.showInvalidRangeminimum && !vm.showInvalidMaxCero) {
        if (vm.detail.id === null) {
          vm.insert();
        } else {
          vm.update();
        }
      }
    }
    //** Método para guardar la sede**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.detail.user.id = auth.id;
      return branchDS.update(auth.authToken, vm.detail).then(function (data) {
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
    //** Método para insertar la sede**//
    function insert() {
      vm.loadingdata = true;
      vm.detail.code = vm.data.length === 0 ? '01' : vm.detail.code;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.insert(auth.authToken, vm.detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.selected = data.data.id;
          vm.detail = data.data;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para editar la sede**//
    function edit() {
      vm.stateButton('edit');
    }
    //** Método que prepara un objeto para crear una nueva sede**//
    function add(form) {
      form.$setUntouched();
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.usuario = '';
      vm.selected = -1;
      vm.detail = {
        'id': null,
        'abbreviation': '',
        'code': vm.data.length === 0 ? '1' : '',
        'responsable': '',
        'keyCode': 0,
        'name': '',
        'address': '',
        'email': '',
        'phone': '',
        'minimum': 0,
        'maximum': 0,
        'state': true,
        'lastTransaction': '',
        'urlConnection': '',
        'user': {
          'id': auth.id
        },
      };
      vm.stateButton('add');
    }
    //** Método para cancelar la sede **//
    function cancel(form) {
      form.$setUntouched();
      vm.nameRepeat = false;
      vm.codeRepeat = false;
      vm.abbreviationRepeat = false;
      if (vm.detail.id === null || vm.detail.id === undefined) {
        vm.detail = [];
      } else {
        vm.getById(vm.detail.id, vm.selected, form);
      }
      vm.stateButton('init');
    }
    //** Método que pide la confirmación cuando cambia el estado de la sede **//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método para validar la sede y no se solapen**//
    function validRange() {
      vm.showInvalidRange = false;
      vm.showInvalidRangeminimum = false;
      if (vm.OrdenNumber) {
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
                } else if ((vm.detail.minimum < vm.data[i].minimum && vm.detail.maximum > vm.data[i].maximum) || vm.data[i].minimum === vm.detail.maximum) {
                  vm.showInvalidRange = true;
                  break;
                } else if (vm.detail.minimum > vm.data[i].minimum && vm.detail.maximum < vm.data[i].maximum) {
                  vm.showInvalidRange = true;
                  break;
                } else if (vm.detail.minimum < vm.data[i].minimum && vm.detail.maximum < vm.data[i].maximum && vm.detail.maximum > vm.data[i].minimum) {
                  vm.showInvalidRange = true;
                  break;
                } else if (vm.detail.minimum > vm.data[i].minimum && vm.detail.maximum > vm.data[i].maximum && vm.detail.minimum < vm.data[i].maximum) {
                  vm.showInvalidRange = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    //** Método que valida que el usuario se encuentre autenticado **//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** Método que valida los estados de los botones **//
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
        vm.isDisabledCode = vm.data.length === 0 ? true : false;
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
        vm.isDisabledCode = vm.detail.code === '01' ? true : false;
        vm.isDisabledState = vm.detail.code === '01' ? true : false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          vm.detail.code === '01' ? document.getElementById('name').focus() : document.getElementById('code').focus()
        }, 100);
      }
      if (state === 'insert') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledCode = true;
        vm.isDisabledState = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledCode = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que muestra una ventana modal cuando un servicio tiene algun error **//
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
              vm.codeRepeat = true;
            }
            if (item[0] === '1' && item[1] === 'abbreviation') {
              vm.abbreviationRepeat = true;
            }
          });
        }
      }
      if (vm.nameRepeat === false && vm.codeRepeat === false && vm.abbreviationRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.filtered;
        vm.pathreport = '/report/configuration/demographics/branch/branch.mrt';
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
    // función que inicializa la página
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
