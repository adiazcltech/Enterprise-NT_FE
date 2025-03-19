(function () {
  'use strict';

  angular
    .module('app.middleware')
    .controller('MiddlewareController', MiddlewareController)
    .controller('dependenceController', dependenceController);

  MiddlewareController.$inject = ['laboratoryDS', 'configurationDS', 'localStorageService', 'logger', 'ModalService',
    '$filter', '$state', 'moment', '$rootScope'
  ];

  function MiddlewareController(laboratoryDS, configurationDS, localStorageService, logger, ModalService,
    $filter, $state, moment, $rootScope) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'Middleware';
    vm.sortReverse = false;
    vm.sortType = 'codeName';
    vm.selected = -1;
    vm.maskphone = '';
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
    vm.Edit = Edit;
    vm.cancel = cancel;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.testConnection = testConnection;
    vm.errorservice = 0;
    var auth;
    vm.Repeat = false;
    vm.Repeatcode = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.changeTypeSendOrder = changeTypeSendOrder;
    vm.loadingdata = true;
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        value.codeName = value.code + ' - ' + value.name;
        data.data[key].username = auth.userName;
      });
      var dataInternal = $filter('filter')(data.data, {
        type: 1
      }, true);
      return dataInternal;
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
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
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
      }
      if (state === 'add') {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;

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
          document.getElementById('urlMiddleware').focus()
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
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.Repeatcode = false;
      vm.Repeat = false;
      vm.urlrequerid = false;
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
      vm.urlrequerid = false;
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      vm.Repeatcode = false;
      vm.loadingdata = true;
      Form.$setUntouched();
      if (vm.Detail.id !== null) {
        vm.update();
      }
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return laboratoryDS.updateintegration(auth.authToken, vm.Detail).then(function (data) {
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
            if (item[0] === '1' && item[1] === 'code') {
              vm.Repeatcode = true;
            }
            if (item[0] === '1' && item[1] === 'name') {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.Repeat === false && vm.Repeatcode === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return laboratoryDS.getLaboratoryActive(auth.authToken).then(function (data) {
        if (data.status === 200) {
          vm.loadingdata = false;
          vm.urlrequerid = false;
          vm.data = data.data.length === 0 ? data.data : removeData(data);
          if (data.data.length === 0) {
            ModalService.showModal({
              templateUrl: 'Requerido.html',
              controller: 'dependenceController',
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                if (result === 'No') {
                  $state.go('laboratory');
                }
              });
            });
            return [];
          } else {
            return vm.data;
          }

        } else {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'dependenceController',
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result === 'No') {
                $state.go('laboratory');
              }
            });
          });
        }

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.urlrequerid = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      vm.loadingdata = true;
      return laboratoryDS.getId(auth.authToken, id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data.user.userName;
          vm.Detail = data.data;
          vm.stateButton('update');
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método válida la conexion con la ULR**//
    function testConnection(url, id) {
      /*var json = {
                   'url': url,
                   'idLaboratory': id
                 }

      laboratoryDS.testConnectionMiddleware(auth.authToken, json).then(function (data) {
           logger.success($filter('translate')('0974'));
           vm.urlrequerid = false;
           vm.isDisabledSave = false;
      }, function (error) {
           vm.urlrequerid = true;
      });*/
      vm.urlrequerid = false;
      vm.isDisabledSave = false;
    }
    //** Método muestra un popup de advertencia cuando se pretende dejar en false ambos tipos de envío de una orden**//
    function changeTypeSendOrder(value) {
      if (!vm.isDisabled && !vm.Detail.entry && !vm.Detail.check) {
        vm.ShowPopupMesssge = true;
        vm.message = $filter('translate')('0975');
        vm.Detail.entry = value === 'entry';
        vm.Detail.check = value === 'check';
      }
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de dependencia de laboratorios activos internos*//
  function dependenceController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
