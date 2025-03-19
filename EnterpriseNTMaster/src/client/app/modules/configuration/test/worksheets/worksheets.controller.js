(function () {
  'use strict';
  angular
    .module('app.worksheets')
    .controller('worksheetsController', worksheetsController)
    .controller('worksheetsdependenceController', worksheetsdependenceController);
  worksheetsController.$inject = ['worksheetsDS', 'configurationDS', 'testDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function worksheetsController(worksheetsDS, configurationDS, testDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'worksheets';
    vm.name = ['name', 'state'];
    vm.state = ['-state', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.codetests = ['code', 'name', 'selected'];
    vm.nametests = ['name', 'code', 'selected'];
    vm.selectedtests = ['-selected', '+code', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetests;
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
    vm.getTest = getTest;
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.changeMicrobiology = changeMicrobiology;
    vm.changeType = changeType;
    vm.changeOrientation = changeOrientation;
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
    vm.errorservice = 0;
    vm.validTest = validTest;
    vm.selectTest = selectTest;
    vm.selectCant = 1;
    vm.disabledorientation = false;
    vm.cantValidTest = 0;
    vm.acoodionTests = true;
    vm.modalrequired = modalrequired;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Metodo para obtener lista de exámenes**//
    function getTest() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 3, 1, 0).then(function (data) {
        vm.get();
        if (data.status === 200) {
          vm.Detail.tests = data.data.length === 0 ? data.data : removeDatatest(data);
          vm.Detail.tests[0].selected = true;
          vm.loadingdata = false;
        } else {
          vm.Detail.tests = [];
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para dicionar o eliminar elementos en el JSON de exámenes**//
    function removeDatatest(data) {
      data.data.forEach(function (value, key) {
        data.data[key].search = data.data[key].code + data.data[key].name;
      });
      return data.data;
    }
    //** Metodo para válidar el tipo de examen**//
    function validTest() {
      if (vm.Detail.tests.length > 0) {
        vm.Detail.tests.forEach(function (value, key) {
          if (vm.allTest && (vm.Detail.microbiology || vm.Detail.type)) {
            vm.Detail.tests[key].selected = vm.allTest;
            vm.selectCant = vm.selectCant + 1
          } else if (vm.allTest && !vm.Detail.microbiology) {
            if (vm.selectCant < vm.cantValidTest) {
              vm.selectCant = vm.selectCant + 1;
              vm.Detail.tests[key].selected = vm.allTest;
            }
          } else {
            vm.selectCant = 0;
            vm.Detail.tests[key].selected = vm.allTest;
          }
        });
      }
    }
    //** Metodo para válidar el mínimo de exámenes seleccionados**//
    function selectTest(value) {
      if (value) {
        vm.selectCant = vm.selectCant + 1;
      } else if (!value) {
        vm.selectCant = vm.selectCant - 1;
      }
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
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
        vm.get();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
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
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail = {
        "id": null,
        "name": "",
        "type": false,
        "orientation": false,
        "exclusive": false,
        "microbiology": false,
        "state": true,
        "tests": [],
        "lastTransaction": null,
        "user": {
          "id": auth.id
        }
      }
      vm.getTest();
      vm.cantValidTest = 11;
      vm.selectCant = 1;
      vm.sortReverse1 = false;
      vm.sortType1 = vm.codetests;
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Repeat = false;
      Form.$setUntouched();
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
      vm.loadingdata = true;
      vm.Detail.orientation = vm.Detail.orientation === false ? 2 : vm.Detail.orientation === true ? 1 : null;
      vm.Detail.type = vm.Detail.type === false ? 2 : vm.Detail.type === true ? 1 : null;
      Form.$setUntouched();
      if (vm.Detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return worksheetsDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.get();
          vm.Detail = data.data;
          vm.selected = data.data.id;
          vm.Detail.orientation = vm.Detail.orientation === 2 ? false : vm.Detail.orientation === 1 ? true : null;
          vm.Detail.type = vm.Detail.type === 2 ? false : vm.Detail.type === 1 ? true : null;
          vm.Detail.tests.forEach(function (value, key) {
            vm.Detail.tests[key].search = vm.Detail.tests[key].code + vm.Detail.tests[key].name;
            if (vm.Detail.tests[key].selected) {
              vm.selectCant = vm.selectCant + 1;
            }
          });
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
      return worksheetsDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          vm.Detail.orientation = vm.Detail.orientation === 2 ? false : vm.Detail.orientation === 1 ? true : null;
          vm.Detail.type = vm.Detail.type === 2 ? false : vm.Detail.type === 1 ? true : null;
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
    //** Método para válidar el cambio a microbiologia**//
    function changeMicrobiology() {
      if (vm.Detail.microbiology) {
        vm.Detail.orientation = null;
        vm.Detail.type = null;
        vm.Detail.exclusive = false;
        vm.cantValidTest = 0;
      } else {
        vm.cantValidTest = 14;
        vm.Detail.orientation = false;
        vm.Detail.type = false;
        vm.disabledorientation = false;
      }
    }
    //** Método para válidar el cambio a tipo de hoja de trabajo**//
    function changeType() {
      if (vm.Detail.type) {
        vm.Detail.orientation = false;
        vm.disabledorientation = true;
        vm.cantValidTest = 14;
      } else {
        vm.disabledorientation = false;
      }
    }
    //** Método para válidar el cambio de horientación de hoja de trabajo**//
    function changeOrientation() {
      if (vm.Detail.orientation) {
        vm.cantValidTest = 11;
      } else {
        vm.cantValidTest = 14;
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return worksheetsDS.get(auth.authToken).then(function (data) {
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
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.selectCant = 0;
      Form.$setUntouched();
      vm.loadingdata = true;
      return worksheetsDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.Detail.orientation = vm.Detail.orientation === 2 ? false : vm.Detail.orientation === 1 ? true : null;
          vm.Detail.type = vm.Detail.type === 2 ? false : vm.Detail.type === 1 ? true : null;
          vm.changeOrientation();
          vm.Detail.tests.forEach(function (value, key) {
            vm.Detail.tests[key].search = vm.Detail.tests[key].code + vm.Detail.tests[key].name;
            if (vm.Detail.tests[key].selected) {
              vm.selectCant = vm.selectCant + 1;
            }
          });
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedtests;
          vm.stateButton('update');
        }
        vm.loadingdata = false;
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
        vm.pathreport = '/report/configuration/test/worksheets/worksheets.mrt';
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
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.Detail.tests.length === 0) {
        ModalService.showModal({
          templateUrl: "Requerido.html",
          controller: "worksheetsdependenceController",
          inputs: {
            hidetest: vm.Detail.tests.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Método para ventana modal de los requeridos*//
  function worksheetsdependenceController($scope, hidetest, close) {
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
