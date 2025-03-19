(function () {
  'use strict';
  angular
    .module('app.feeschedules')
    .controller('feeschedulesController', feeschedulesController);
  feeschedulesController.$inject = ['feescheduleDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function feeschedulesController(feescheduleDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'feeschedules';
    vm.namefeeschedules = ['name', 'initialDate', 'endDate', 'state'];
    vm.initialDate = ['initialDate', 'name', 'endDate', 'state'];
    vm.endDate = ['endDate', 'name', 'initialDate', 'state'];
    vm.state = ['-state', '+name', '+initialDate', '+endDate'];
    vm.sortReverse = false;
    vm.sortType = vm.namefeeschedules;
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
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.Repeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.validRange = validRange;
    vm.errorservice = 0;
    vm.dateinitial = {
      startDate: ''
    };
    vm.dateend = {
      startDate: ''
    };
    vm.inicial = moment();
    vm.final = moment().add(365, 'days');
    vm.listdate = [];
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.validDateinit = validDateinit;
    vm.validDateEnd = validDateEnd;
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.listdate = [];
      data.data.forEach(function (value, key) {
        var objectdate = {
          "initialDate": data.data[key].initialDate,
          "endDate": data.data[key].endDate,
          "id": data.data[key].id,
          "name": data.data[key].name
        }
        vm.listdate.push(objectdate);
        delete value.user;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
        data.data[key].initialDate = moment(data.data[key].initialDate).format(vm.formatDate);
        data.data[key].endDate = moment(data.data[key].endDate).format(vm.formatDate);
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
        vm.get();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
          vm.formatDateControl = data.data.value;
          var today = new Date();
          vm.optionsDateInit = {
            formatYear: 'yyyy',
            maxDate: new Date(today.setFullYear(today.getFullYear() + 1)),
            minDate: new Date(),
            startingDay: 1
          };
          vm.optionsDateEnd = {
            formatYear: 'yyyy',
            maxDate: new Date(today.setFullYear(today.getFullYear() + 1)),
            minDate: new Date(),
            startingDay: 1
          };
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para validar la fecha final**//
    function validDateEnd() {
      vm.validrequeriddateend = false;
      vm.dateend = vm.dateend === undefined ? '' : vm.dateend;
      if (!moment(vm.dateend).isValid() ||
        moment(moment(vm.dateend).format("YYYYMMDD")).isBefore(moment(vm.dateinitial).format("YYYYMMDD"))) {
        vm.dateend = "";
        vm.validrequeriddateend = true;
      } else {
        //vm.validRange();
      }
    }
    //** Metodo para validar la fecha inicial**//
    function validDateinit() {
      vm.validrequeridDateinit = false;
      vm.dateinitial = vm.dateinitial === undefined ? '' : vm.dateinitial
      if (moment(vm.dateinitial).isValid() && moment(moment().format("YYYYMMDD")).isSameOrBefore(moment(vm.dateinitial).format("YYYYMMDD"))) {
        var today = new Date(vm.dateinitial);
        vm.optionsDateEnd = {
          formatYear: 'yyyy',
          maxDate: new Date(today.setFullYear(today.getFullYear() + 1)),
          minDate: vm.dateinitial,
          startingDay: 1
        };
        if (moment(moment(vm.dateend).format("YYYYMMDD")).isBefore(moment(vm.dateinitial).format("YYYYMMDD"))) {
          vm.dateend = "";
        } else {}
      } else {
        if (!moment(moment(vm.Detail.initialDate).format("YYYYMMDD")).isSame(moment(vm.dateinitial).format("YYYYMMDD"))) {
          vm.dateinitial = "";
          vm.dateend = "";
          vm.validrequeridDateinit = true;
        }
      }
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
        vm.validrequeridDateinit = false;
        vm.validrequeriddateend = false;
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        vm.validrequeridDateinit = false;
        vm.validrequeriddateend = false;
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
      vm.stateButton('add');
      vm.Detail = {
        "id": null,
        "name": "",
        "initialDate": '',
        "endDate": '',
        "state": false,
        "automatically": true,
        "lastTransaction": null,
        "user": {
          'id': auth.id
        }
      }
      vm.dateinitial = '';
      vm.dateend = '';
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Repeat = false;
      vm.showInvaliddate = false;
      vm.showrangedate = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
        vm.dateinitial = '';
        vm.dateend = '';
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Metodo para validar la solopa de fechas**//
    function validRange() {
      vm.showInvaliddate = false;
      vm.showrangedate = false;
      vm.validrequeridDateinit = vm.dateinitial === null || vm.dateinitial === undefined || vm.dateinitial === '';
      vm.validrequeriddateend = vm.dateend === null || vm.dateend === undefined || vm.dateend === '';
      if (vm.validrequeridDateinit === false && vm.validrequeridDateinit === false) {
        var dateday = moment().format('YYYYMMDD');
        var initialdate = moment(vm.dateinitial).format('YYYYMMDD');
        var finaldate = moment(vm.dateend).format('YYYYMMDD');
        if (dateday > initialdate) {
          vm.dateinitial = dateday;
        }
        if (dateday > finaldate) {
          vm.dateend = dateday;
        } else {
          for (var i = 0; i < vm.listdate.length; i++) {
            var initialdateobject = moment(vm.listdate[i].initialDate).format('YYYYMMDD');
            var enddateobject = moment(vm.listdate[i].endDate).format('YYYYMMDD');

            if (vm.Detail.id !== vm.listdate[i].id) {
              if (initialdate === initialdateobject && finaldate === enddateobject) {
                vm.showInvaliddate = true;

                vm.name = vm.listdate[i].name

                break;
              } else if (initialdate < initialdateobject && finaldate > initialdateobject &&
                initialdate < enddateobject && finaldate < enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name

                break;
              } else if (initialdate > initialdateobject && finaldate > initialdateobject &&
                initialdate < enddateobject && finaldate > enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name

                break;
              } else if (initialdate > initialdateobject && finaldate > initialdateobject &&
                initialdate < enddateobject && finaldate === enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name

                break;
              } else if (initialdate < initialdateobject && finaldate === initialdateobject &&
                initialdate < enddateobject && finaldate < enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name

                break;
              } else if (initialdate === initialdateobject && finaldate > initialdateobject &&
                initialdate < enddateobject && finaldate < enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name
                return false;
                break;
              } else if (initialdate > initialdateobject && finaldate > initialdateobject &&
                initialdate === enddateobject && finaldate > enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name

                break;
              } else if (initialdate < initialdateobject && finaldate > initialdateobject &&
                initialdate < enddateobject && finaldate > enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name
                break;
              } else if (initialdate > initialdateobject && finaldate > initialdateobject &&
                initialdate < enddateobject && finaldate < enddateobject) {
                vm.showInvaliddate = true;
                vm.name = vm.listdate[i].name

                break;
              }
            }
          }
        }
      }
      return false;
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      vm.loadingdata = true;
      vm.validRange();
      if (vm.showInvaliddate === false) {
        Form.$setUntouched();
        vm.Detail.initialDate = moment(vm.dateinitial).format("YYYY-MM-DD");
        vm.Detail.endDate = moment(vm.dateend).format("YYYY-MM-DD");
        if (vm.Detail.id === null) {
          vm.insert();
        } else {
          vm.update();
        }
      } else {
        vm.loadingdata = false;
      }
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return feescheduleDS.New(auth.authToken, vm.Detail).then(function (data) {
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
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return feescheduleDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          logger.success($filter('translate')('0042'));
          vm.stateButton('update');
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
            }
          });
        }
      }
      if (vm.Repeat === false) {
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
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return feescheduleDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.Repeat = false;
      vm.showInvaliddate = false;
      vm.showrangedate = false;
      vm.validrequeridDateinit = false;
      vm.validrequeriddateend = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.loadingdata = true;
      return feescheduleDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate);
          vm.Detail = data.data;
          vm.stateButton('update');
          data.data.initialDate = moment(data.data.initialDate).format('YYYY-MM-DD');
          data.data.endDate = moment(data.data.endDate).format('YYYY-MM-DD');
          var dateinit = data.data.initialDate.split("-")
          vm.dateinitial = new Date(dateinit[1] + '-' + dateinit[2] + '-' + dateinit[0]); //moment(data.data.initialDate);
          var dateend = data.data.endDate.split("-")
          vm.dateend = new Date(dateend[1] + '-' + dateend[2] + '-' + dateend[0]); //moment(data.data.initialDate);
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
        vm.pathreport = '/report/configuration/billing/feeschedules/feeschedules.mrt';
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
