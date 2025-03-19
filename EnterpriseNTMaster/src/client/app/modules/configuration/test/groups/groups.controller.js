(function () {
  'use strict';

  angular
    .module('app.groups')
    .controller('GroupsController', GroupsController)
    .controller('RequeridGroupController', RequeridGroupController);

  GroupsController.$inject = ['groupsDS', 'configurationDS', 'testDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate', 'areaDS', 'ModalService'
  ];

  function GroupsController(groupsDS, configurationDS, testDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, LZString, $translate, areaDS, ModalService) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Groups';
    vm.name = ['name', 'state'];
    vm.state = ['-state', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.codetest = ['code', 'name', 'selected'];
    vm.nametest = ['name', 'code', 'selected'];
    vm.selectedtest = ['-selected', '+code', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.codetest;
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
    vm.errorservice = 0;
    vm.gettest = gettest;
    vm.changeprofil = changeprofil;
    vm.testassociate = false;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.getArea = getArea;
    vm.id = '';
    vm.loadingdata = true;

    //** Metodo para obtener las areas activas**//
    function getArea() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.gettest();
        if (data.status === 200) {
          data.data[0] = {
            'id': 0,
            'name': $filter('translate')('0209')
          }
          vm.lisArea = data.data.length === 0 ? data.data : removearea(data);
          vm.lisArea = $filter('orderBy')(vm.lisArea, 'name');
          vm.lisArea.id = 0;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que construlle el arreglo de las areas**//
    function removearea(data) {
      var area = [];
      data.data.forEach(function (value, key) {
        if (value.id !== 1) {
          var object = {
            id: value.id,
            name: value.name
          };
          area.push(object);
        }
      });
      return area;
    }
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
    //** Método que carga las pruebas segun el chechk de perfil**//
    function changeprofil() {
      var test;
      if (vm.Detail.profil) {
        test = 3;
      } else {
        test = 0
      }
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, test, 0, 0).then(function (data) {
        vm.datatest = data.data;
        vm.testassociate = false;
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
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
        vm.getArea();
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
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      vm.lisArea.id = 0;
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'name': '',
        'profil': false,
        'state': true
      };
      vm.gettest();
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
      vm.testassociate = false;
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
      vm.testactive = vm.assignade = $filter('filter')(vm.datatest, {
        selected: true
      });
      if (vm.testactive.length === 0) {
        vm.testassociate = true;
      } else {
        var groups = {
          'user': {
            'id': auth.id
          },
          'id': null,
          'code': vm.Detail.code,
          'name': vm.Detail.name,
          'tests': vm.testactive,
          'state': vm.Detail.state
        };
        return groupsDS.New(auth.authToken, groups).then(function (data) {
          if (data.status === 200) {
            vm.get();
            vm.Detail = data.data;
            vm.selected = data.data.id;
            vm.stateButton('insert');
            logger.success($filter('translate')('0042'));
            return data;
          }
        }, function (error) {
          vm.modalError(error);

        });
      }
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.testactive = vm.assignade = $filter('filter')(vm.datatest, {
        selected: true
      });
      if (vm.testactive.length === 0) {
        vm.testassociate = true;
      } else {
        var groups = {
          'user': {
            'id': auth.id
          },
          'id': vm.Detail.id,
          'code': vm.Detail.code,
          'name': vm.Detail.name,
          'tests': vm.testactive,
          'state': vm.Detail.state
        };
        vm.Detail.user.id = auth.id;
        return groupsDS.update(auth.authToken, groups).then(function (data) {
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
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
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
        vm.Error = error;
        vm.ShowPopupError = true;
        vm.loadingdata = false;
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
      return groupsDS.get(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function gettest() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestArea(auth.authToken, 0, 0, 0).then(function (data) {
        if (data.data.length === 0) {
          ModalService.showModal({
            templateUrl: 'RequeridGroup.html',
            controller: 'RequeridGroupController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              vm.loadingdata = false;
              $state.go(result);
            });
          });
        } else {
          vm.get();
          vm.datatest = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.sortReverse2 = true;
      vm.sortType2 = '';
      vm.testassociate = false;
      vm.Repeat = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.id = '';
      Form.$setUntouched();
      vm.loadingdata = true;
      vm.lisArea.id = 0;
      vm.search1 = "";
      return groupsDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.datatest = vm.Detail.tests;
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedtest;
          vm.loadingdata = false;
          vm.stateButton('update');
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
        vm.pathreport = '/report/configuration/test/groups/groups.mrt';
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
  //** Controller de la vetana modal de requerido*//
  function RequeridGroupController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
