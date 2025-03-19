(function () {
  'use strict';

  angular
    .module('app.demographicwebconsultation')
    .controller('DemographicwebconsultationController', DemographicwebconsultationController)
    .controller('demographicwebconsultationdependenceController', demographicwebconsultationdependenceController);

  DemographicwebconsultationController.$inject = ['localStorageService', 'logger', 'ModalService', '$filter', 'demographicDS',
    '$state', '$rootScope', '$translate', 'demographicsItemDS', 'demographicwebqueryDS'
  ];

  function DemographicwebconsultationController(localStorageService, logger, ModalService, $filter, demographicDS,
    $state, $rootScope, $translate, demographicsItemDS, demographicwebqueryDS) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'demographicwebconsultation';
    vm.isAuthenticate = isAuthenticate;
    vm.save = save;
    vm.sortReverse = false;
    vm.sortType = 'name';
    vm.modalError = modalError;
    vm.modalrequired = modalrequired;
    vm.loadingdata = true;
    vm.formatDate = localStorageService.get('FormatoFecha');
    vm.genericpassword = parseInt(localStorageService.get('ContraseñaDemograficoConsultaWeb'));
    vm.validMail = /^[a-z]+[a-z0-9._]+@[a-z0-9._-]+\.[a-z.]{2,5}$/;
    vm.demographic = parseInt(localStorageService.get('DemograficoConsultaWeb'));
    vm.SecurityPolitics = localStorageService.get('SecurityPolitics') === "False" ? false : true;
    vm.keyDays = localStorageService.get('DiasClave') === '' || localStorageService.get('DiasClave') === '0' ? 0 : parseInt(localStorageService.get('DiasClave'));
    vm.getdemographic = getdemographic;
    vm.getdemographicitem = getdemographicitem;
    vm.selected = -1;
    vm.getUsersId = getUsersId;
    vm.changePassword = changePassword;
    vm.CheckStrngth = CheckStrngth;
    vm.strengthlabel = $filter('translate')('1080');
    vm.viewvalidatedpassword = false;
    vm.strength = "";
    vm.lettersize = 9;
    vm.disablecontrol = false;
    vm.data = '';
    vm.color = "#999";
    vm.strength0 = true;
    vm.strength1 = true;
    vm.strength2 = true;
    vm.strength3 = true;
    vm.strength4 = true;
    vm.valueexpiration = false;
    vm.changeState = changeState;
    vm.insertUsers = insertUsers;
    vm.updateUsers = updateUsers;
    vm.stateButton = stateButton;
    vm.isDisabledState = true;
    vm.Edit = Edit;
    vm.cancel = cancel;
    vm.Repeat = false;
    vm.viewvalited = false;
    //** Método que evalua si va crear un nuevo dato o actualizar**//
    function save(UsersForm) {
      if (UsersForm.email !== undefined) {
        UsersForm.email.$touched = true;
      }
      if (UsersForm.$valid) {
        if (vm.usersDetail.id === null && vm.strength === '' ||
          vm.usersDetail.password === vm.confirmPassword && vm.strength === '' && vm.SecurityPolitics ||
          vm.usersDetail.password === vm.confirmPassword && !vm.SecurityPolitics) {
          if (vm.usersDetail.id === null) {
            vm.insertUsers();
          } else {
            vm.usersDetail.password = vm.usersDetail.password === '' || vm.usersDetail.password === undefined ? null : vm.usersDetail.password;
            vm.usersDetail.passwordExpirationDate = vm.usersDetail.password === '' || vm.usersDetail.password === undefined ? moment().format() : moment(vm.passwordExpirationDate).format();
            vm.updateUsers();
          }
        }
      } else {
        UsersForm.name.$touched = true;
      }
    }
    //** Método que inserta un nuevo usuario**//
    function insertUsers() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicwebqueryDS.Newdemographicwebquery(auth.authToken, vm.usersDetail).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usersDetail.passwordExpirationDate = new Date(data.data.passwordExpirationDate);
          vm.confirmPassword = '';
          data.data.password = ''
          vm.usersDetail = data.data;
          vm.Repeat = false;
          vm.viewvalited = false;
          vm.loadingdata = false;
          vm.stateButton('insert');
          logger.success($filter('translate')('0042'));
        }

      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que actualiza un nuevo usuario**//
    function updateUsers() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicwebqueryDS.updatedemographicwebquery(auth.authToken, vm.usersDetail).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usersDetail.passwordExpirationDate = new Date(data.data.passwordExpirationDate);
          vm.confirmPassword = '';
          data.data.password = ''
          vm.usersDetail = data.data;
          vm.stateButton('update');
          vm.Repeat = false;
          vm.viewvalited = false;
          vm.loadingdata = false;
          logger.success($filter('translate')('0042'));
        }
      }, function (error) {
        vm.usersDetail.password = vm.usersDetail.password === null ? '' : vm.usersDetail.password;
        vm.modalError(error);
      });
    }
    //** Método que evalua las politicas de seguridad**//
    function CheckStrngth() {
      if (!vm.SecurityPolitics) {
        vm.passwordExpirationDate = vm.confirmPassword === vm.usersDetail.password &&
          vm.confirmPassword !== '' && vm.usersDetail.password !== '' &&
          vm.confirmPassword !== undefined && vm.usersDetail.password !== undefined ?
          new Date(moment().add(vm.keyDays, 'days').format()) : '';
      } else {
        vm.viewvalidatedpassword = true;
        vm.viewvalited = false
        vm.strengthlabel = $filter('translate')('1080');
        vm.strength0 = false;
        vm.strength1 = false;
        vm.strength2 = false;
        vm.strength3 = false;
        vm.strength4 = false;
        vm.strength = "";
        if (vm.usersDetail.password === undefined) {
          if (vm.usersDetail.id !== null) {
            vm.strength = "";
          }
          vm.data = '';
          vm.color = "#999";
          vm.strength0 = true;
          vm.strength1 = true;
          vm.strength2 = true;
          vm.strength3 = true;
          vm.strength4 = true;
          vm.viewvalidatedpassword = false;
          vm.passwordExpirationDate = new Date(moment().add(vm.keyDays, 'days').format());
        }
        if (vm.usersDetail.password !== undefined) {
          vm.data = '';
          vm.strengthlabel = $filter('translate')('1080');
          vm.strength = "";
          if (vm.usersDetail.password.length < vm.lettersize) {
            vm.strength0 = true;
            vm.strength = "**";
          }
          if (!new RegExp("[A-Z]").test(vm.usersDetail.password)) {
            vm.strength1 = true;
            vm.strength = "**";

          }
          if (!new RegExp("[a-z]").test(vm.usersDetail.password)) {
            vm.strength2 = true;
            vm.strength = "**";

          }
          if (!new RegExp("[0-9]").test(vm.usersDetail.password)) {
            vm.strength3 = true;
            vm.strength = "**";
          }
          if (!new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])").test(vm.usersDetail.password)) {
            vm.strength4 = true;
            if (vm.administrator) {
              vm.strength = "**";
            }
          }
          var regex = new Array();
          regex.push("[A-Z]"); //Uppercase Alphabet.
          regex.push("[a-z]"); //Lowercase Alphabet.
          regex.push("[0-9]"); //Digit.
          regex.push("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\\]{}/^_`|~])"); //Special Character.
          var passed = 0;
          //Validate for each Regular Expression.
          for (var i = 0; i < regex.length; i++) {
            if (new RegExp(regex[i]).test(vm.usersDetail.password)) {
              passed++;
            }
          }
          //Validate for length of Password.
          if (passed > 2 && vm.usersDetail.password.length >= vm.lettersize) {
            passed++;
          }
          //Display status.
          if (passed == 1) {
            vm.strengthlabel = $filter('translate')('1080');
            vm.color = "red";
            vm.data = '0';
          } else if (passed == 2) {
            vm.color = "orangered";
            vm.strengthlabel = $filter('translate')('1081');
            vm.data = '1';
          } else if (passed == 3) {
            vm.color = "orange";
            vm.strengthlabel = $filter('translate')('1082');
            vm.data = '2';
          } else if (passed == 4) {
            vm.color = "yellowgreen";
            vm.strengthlabel = $filter('translate')('1083');
            vm.data = '3';
          } else if (passed == 5) {
            vm.color = "green";
            vm.strengthlabel = $filter('translate')('1084');
            vm.data = '4';
          }
          if (vm.usersDetail.password === vm.confirmPassword) {
            vm.passwordExpirationDate = new Date(moment().add(vm.keyDays, 'days').format());
          }
        }
        if (vm.usersDetail.id !== null && vm.usersDetail.password === '') {
          vm.strength = "";
          vm.viewvalidatedpassword = false;
        }
      }
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton('edit');
    }
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledEdit = true;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.disablecontrol = true;
        vm.isDisabledState = true;
      }
      if (state === 'id') {
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.disablecontrol = true;
        vm.isDisabledState = true;
      }
      if (state === 'edit') {
        vm.isDisabledState = vm.usersDetail.id === null || vm.usersDetail.id === undefined ? true : false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.disablecontrol = false;
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
        vm.disablecontrol = true;
      }
      if (state === 'update') {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.disablecontrol = true;
        vm.isDisabledState = true;
      }
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      vm.ShowPopupState = false;
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que evalua el cambio de contraseña**//
    function changePassword() {
      if (vm.confirmPassword !== undefined && vm.usersDetail.password !== undefined) {
        if (vm.confirmPassword !== '' && vm.usersDetail.password !== '') {
          if (vm.confirmPassword === vm.usersDetail.password) {
            vm.passwordExpirationDate = new Date(moment().add(vm.keyDays, 'days').format());
          }
        }
      }
    }
    //** Método que inicializa los controles**//
    function cancel(UsersForm) {
      vm.emailInvalid = false
      vm.Repeat = false;
      vm.viewvalited = false;
      UsersForm.$setUntouched();
      vm.getUsersId(vm.selected, UsersForm);
    }
    //** Método que obtiene los datos del usuario por id**//
    function getUsersId(demo, UsersForm) {
      UsersForm.$setUntouched();
      vm.Repeat = false;
      vm.viewvalited = false;
      vm.loadingdata = true;
      vm.selected = demo;
      vm.usersDetail = [];
      UsersForm.$setUntouched();
      vm.data = '';
      vm.color = "#999";
      vm.emailInvalid = false;
      vm.strength = "";
      vm.strength0 = true;
      vm.strength1 = true;
      vm.strength2 = true;
      vm.strength3 = true;
      vm.strength4 = true;
      vm.valueexpiration = false;
      vm.loadingdata = false;
      vm.viewvalited = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicwebqueryDS.getdemographicwebqueryId(auth.authToken, vm.namedemographic.id, demo).then(function (data) {
        vm.stateButton('id');
        if (data.status === 200) {
          var date = moment(data.data.passwordExpirationDate)
          vm.passwordExpirationDate = new Date(parseInt(date.format('YYYY')), parseInt(date.format('MM')) - 1, parseInt(date.format('DD')))
          vm.confirmPassword = '';
          data.data.password = ''
          vm.usersDetail = data.data;
        } else {
          vm.usersDetail = {
            'id': null,
            "password": vm.genericpassword,
            "passwordExpirationDate": moment().format(),
            "demographic": vm.namedemographic.id,
            "idDemographicItem": demo,
            "state": true
          }
          vm.confirmPassword = ''
        }
        vm.loadingdata = false;
      }, function (error) {
        vm.modalError();
      });
    }
    //** Método que valida que el usuario se encuentre autenticado**//
    function isAuthenticate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      if (auth === null || auth.token) {
        $state.go('login');
      } else {
        vm.init();
      }
    }
    //** modal para ver el detalle de un error**//
    function modalError(error) {
      vm.Repeat = false;
      vm.viewvalited = false;
      vm.loadingdata = false;
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split('|');
            if (item[0] === '1' && item[1] === 'username') {
              vm.Repeat = true;
            }
            if (item[0] === '1') {
              vm.viewvalited = true
            }
          });
        }
      }
      if (vm.Repeat === false && vm.viewvalited === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    //** modal para ver los requeridos de la pagina**//
    function modalrequired() {
      vm.loadingdata = false;
      ModalService.showModal({
        templateUrl: "Requerido.html",
        controller: "demographicwebconsultationdependenceController"
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $state.go(result.page);
        });
      });

    }
    //** metodo que obtiene los demograficos**//
    function getdemographic() {

      if(vm.demographic > 0){
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return demographicDS.getDemographicsId(auth.authToken, vm.demographic).then(function (data) {
          if (data.status === 200) {
            vm.namedemographic = data.data;
            vm.getdemographicitem();
          }
        }, function (error) {
          vm.modalError(error);
        });
      }
      else{
        vm.namedemographic  = {'id': vm.demographic}
        vm.getdemographicitem(); 
      }
    }
    //** metodo que obtiene los items demograficos**//
    function getdemographicitem() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS.getDemographicsItemsIddataweb(auth.authToken, vm.demographic).then(function (data) {
        if (data.status === 200) {
          vm.dataItemDemographics = data.data;
          vm.loadingdata = false;
        } else {
          vm.modalrequired();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** metodo que Inicializa la pagina**//
    function init() {
      vm.usersDetail = {
        'id': null,
        "password": '',
        "passwordExpirationDate": moment().format(),
        "dateOfLastEntry": null,
        "numberFailedAttempts": 0,
        "state": true
      }
      vm.stateButton('init');
      vm.getdemographic();
    }
    vm.isAuthenticate();
  }
  //** Controller de la ventana modal de datos requeridos por depdendecias*//
  function demographicwebconsultationdependenceController($scope, close) {
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
