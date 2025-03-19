(function () {
  'use strict';
  angular
    .module('app.answer')
    .controller('answerController', answerController);
  answerController.$inject = ['answerDS', 'configurationDS', 'localStorageService', 'logger',
    '$filter', '$state', 'moment', '$rootScope'
  ];

  function answerController(answerDS, configurationDS, localStorageService, logger,
    $filter, $state, moment, $rootScope) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'question';
    vm.name = ['name', 'state'];
    vm.state = ['-state', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
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
    var auth;
    vm.RepeatnameAnswer = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.answeredit = {
      value: -1
    };
    vm.Detail.open = true;
    vm.Detail.control = -1;
    vm.loadingdata = true;
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      vm.loadingdata = true;
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return answerDS.getAnswer(auth.authToken).then(function (data) {
        vm.loadingdata = false;
        if (data.data.length > 0) {
          vm.data = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.loadingdata = true;
      vm.RepeatnameAnswer = false;
      vm.erroredit = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = id;
      vm.Detail = [];
      vm.selectCant = 0;
      Form.$setUntouched();
      return answerDS.getAnswerId(auth.authToken, id).then(function (data) {
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
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      form.$setUntouched();
      vm.usuario = '';
      vm.selected = -1;
      vm.erroredit = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail = {
        "id": null,
        "name": "",
        "state": true,
        "user": {
          "id": auth.id
        }
      }
      vm.selectCant = 0;
      vm.stateButton('add');
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      if (vm.Detail.quantity > 0) {
        vm.erroredit = true;
        return;
      }
      vm.stateButton('edit');
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
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
      return answerDS.newAnswer(auth.authToken, vm.Detail).then(function (data) {
        vm.loadingdata = false;
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
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.Detail.user.id = auth.id;
      return answerDS.updateAnswer(auth.authToken, vm.Detail).then(function (data) {
        vm.loadingdata = false;
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
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.RepeatnameAnswer = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton('init');
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
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'name') {
              vm.RepeatnameAnswer = true;
            }
          });
        }
      }
      if (vm.RepeatnameAnswer === false) {
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
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
})();
