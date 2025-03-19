(function () {
  'use strict';

  angular
    .module('app.destinationmicrobiology')
    .controller('destinationmicrobiologyController', destinationmicrobiologyController)
    .controller('desanauserController', desanauserController);

  destinationmicrobiologyController.$inject = ['destinationmicrobiologyDS', 'ModalService', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
  ];

  function destinationmicrobiologyController(destinationmicrobiologyDS, ModalService, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope, LZString, $translate) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'destinationmicrobiology';
    vm.code = ['code', 'name', 'reportTask', 'state'];
    vm.name = ['code', 'name', 'reportTask', 'state'];
    vm.typename = ['-reportTask', '+code', '+name', '-state'];
    vm.state = ['-state', '+code', '+name', '-reportTask'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.userName = ['userName', 'nameReferenceLaboratory', 'selected'];
    vm.nameReferenceLaboratory = ['nameReferenceLaboratory', 'userName', 'selected'];
    vm.selectedtest = ['-selected', '+userName', '+nameReferenceLaboratory'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.userName;
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
    vm.errorservice = 0;
    var auth;
    vm.Repeat = false;
    vm.Repeatcode = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.changeuseranalyzers = changeuseranalyzers;
    vm.newuseranlalizer = newuseranlalizer;
    vm.modalrequired = modalrequired;
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
    //** Metodo que válida cuando se selcciona un usuario analizador**//
    function changeuseranalyzers(data) {
      if (data.selected === true) {
        var view = $filter('filter')(vm.Detail.analyzersMicrobiologyDestinations, function (e) {
          return e.referenceLaboratory === data.referenceLaboratory && e.selected === true
        });
        if (view.length > 1) {
          data.selected = false;
          logger.info($filter('translate')('1137'));
        }
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
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.newuseranlalizer();
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
      form.$setUntouched();
      vm.search1 = '';
      vm.usuario = '';
      vm.selected = -1;
      vm.Detail = {
        'user': {
          'id': auth.id
        },
        'id': null,
        'code': '',
        'name': '',
        'reportTask': true,
        'analyzersMicrobiologyDestinations': vm.listanalizeruser,
        'state': true
      };
      vm.sortReverse1 = false;
      vm.sortType1 = vm.userName;
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.search1 = '';
      vm.Repeat = false;
      vm.Repeatcode = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.selected, Form);
      }
      vm.stateButton('init');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      Form.$setUntouched();
      vm.Detail.analyzersMicrobiologyDestinations = $filter('filter')(vm.Detail.analyzersMicrobiologyDestinations, function (e) {
        return e.selected === true
      });
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
      return destinationmicrobiologyDS.New(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          return destinationmicrobiologyDS.getId(auth.authToken, data.data.id).then(function (data) {
            if (data.status === 200) {
              vm.usuario = $filter('translate')('0017') + ' ';
              vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
              vm.usuario = vm.usuario + data.data.user.userName;
              vm.Detail = data.data;
              vm.get();
              vm.loadingdata = false;
              vm.stateButton('insert');
              logger.success($filter('translate')('0042'));
            }
          }, function (error) {
            vm.modalError(error);
          });
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return destinationmicrobiologyDS.update(auth.authToken, vm.Detail).then(function (data) {
        if (data.status === 200) {
          return destinationmicrobiologyDS.getId(auth.authToken, vm.selected).then(function (data) {
            if (data.status === 200) {
              vm.usuario = $filter('translate')('0017') + ' ';
              vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
              vm.usuario = vm.usuario + data.data.user.userName;
              vm.Detail = data.data;
              vm.get();
              vm.loadingdata = false;
              logger.success($filter('translate')('0042'));
              vm.stateButton('update');
            }
          }, function (error) {
            vm.modalError(error);
          });
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
            if (item[0] === '1' && item[1] === 'code') {
              vm.Repeatcode = true;
            }
          });
        }
      }
      if (vm.Repeat === false && vm.Repeatcode === false) {
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
      return destinationmicrobiologyDS.get(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, Form) {
      vm.Repeat = false;
      vm.Repeatcode = false;
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.search1 = '';
      return destinationmicrobiologyDS.getId(auth.authToken, id).then(function (data) {
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.loadingdata = false;
          vm.sortReverse1 = false;
          vm.sortType1 = vm.selectedtest;
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
        vm.pathreport = '/report/configuration/microbiology/destinationmicrobiology/destinationmicrobiology.mrt';
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver el reporte en otra pestaña del navegador.
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
    //** Metodo configuración formato**//
    function newuseranlalizer() {
      vm.listanalizeruser = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return destinationmicrobiologyDS.getuseranalizer(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.listanalizeruser = data.data;
          vm.Detail = {
            'analyzersMicrobiologyDestinations': vm.listanalizeruser
          };
          vm.get();
        } else {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
    //** Ventana modal de los requeridos**//
    function modalrequired() {
      if (vm.listanalizeruser.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'desanauserController'
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
  }
  // ventana modal que válida usuario analizador
  function desanauserController(
    $scope,
    close
  ) {
    $scope.close = function (page) {
      close({
          page: page,
        },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
  }
})();
