(function () {
  'use strict';

  angular
    .module('app.processingday')
    .controller('ProcessingDayController', ProcessingDayController)
    .controller('DependenceDaysController', DependenceDaysController);;

  ProcessingDayController.$inject = ['testDS', 'areaDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope'
  ];

  function ProcessingDayController(testDS, areaDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'ProcessingDay';
    vm.ordering = ['ordering', 'name'];
    vm.name = ['name', 'ordering'];
    vm.sortReverse = false;
    vm.sortType = vm.ordering;
    vm.nametest = ['name', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    vm.monday = ['-monday', '+name'];
    vm.tuesday = ['-tuesday', '+name'];
    vm.wednesday = ['-wednesday', '+name'];
    vm.thursday = ['-thursday', '+name'];
    vm.friday = ['-friday', '+name'];
    vm.sunday = ['-sunday', '+name'];
    vm.saturday = ['-saturday', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.nametest;
    vm.selected = -1;
    vm.isDisabled = true;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isAuthenticate = isAuthenticate;
    vm.getAreaActive = getAreaActive;
    vm.getTestArea = getTestArea;
    vm.edit = edit;
    vm.save = save;
    vm.cancel = cancel;
    vm.changeSearch = changeSearch;
    vm.changeCheckAll = changeCheckAll;
    vm.changeCheckMon = changeCheckMon;
    vm.changeCheckTue = changeCheckTue;
    vm.changeCheckWed = changeCheckWed;
    vm.changeCheckThu = changeCheckThu;
    vm.changeCheckFri = changeCheckFri;
    vm.changeCheckSat = changeCheckSat;
    vm.changeCheckSun = changeCheckSun;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.dataTestDays = [];
    vm.updateProcessingDay = [];
    vm.loadingdata = true;
    var auth;
    /**Accion que sirve para eliminar una columna de una tabla a partir de un objeto area*/
    function removeData(data) {
      var dataArea = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.abbreviation;
        delete value.color;
        delete value.partialValidation;
        delete value.lastTransaction;
        delete value.state;
        delete value.type;

        if (value.id === 1) {
          delete data.data[key];
        } else {
          data.data[key].username = auth.userName;
          dataArea.push(data.data[key]);
        }

      });

      return dataArea;
    }
    //** Metodo que valida el control de busqueda**//
    function changeSearch() {
      vm.idArea = null;
      vm.selected = -1;
      vm.dataTestDays = [];
      vm.stateButton('init');
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getAreaActive();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //Método que devuelve la lista de áreas activas
    function getAreaActive() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return areaDS.getAreasActive(auth.authToken).then(function (data) {
        vm.dataAreas = vm.removeData(data);
        $rootScope.blockView = false;
        vm.NumAreas = vm.dataAreas.length.toString();
        vm.loadingdata = false;
        if (vm.dataAreas.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'DependenceDaysController',
          }).then(function (modal) {
            modal.element.modal();
            vm.modalRequired = true;
            modal.close.then(function (result) {
              if (result === 'area') {
                $state.go('area');
              }

            });
          });
        }
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError();
      });
    }
    //** Método que obtiene una lista de pruebas pertenecientes a una área seleccionada**//
    function getTestArea(id, index, ProcessingDayForm) {
      vm.monAll = false;
      vm.tueAll = false;
      vm.wedAll = false;
      vm.thuAll = false;
      vm.friAll = false;
      vm.satAll = false;
      vm.sunAll = false;
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.idArea = vm.dataAreas === undefined ? 0 : id;
      vm.selected = id;
      vm.loadingdata = true;
      vm.selectedTest = -1;
      if (vm.daysAll) {
        vm.daysAll = false;
        vm.changeCheckAll();
      }
      ProcessingDayForm.$setUntouched();
      vm.stateButton('init');
      return testDS.getTestArea(auth.authToken, 0, 1, vm.idArea).then(function (data) {
        var i = 1;
        vm.dataTestDays = [];
        vm.idTest = undefined;

        if (data.data.length > 0) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data[0].user.userName;
          data.data.forEach(function (value) {

            vm.dataTestDays.push({
              'id': value.id,
              'abbr': value.abbr,
              'name': value.name,
              'code': value.code,
              'monday': value.processingDays.indexOf(1) !== -1,
              'tuesday': value.processingDays.indexOf(2) !== -1,
              'wednesday': value.processingDays.indexOf(3) !== -1,
              'thursday': value.processingDays.indexOf(4) !== -1,
              'friday': value.processingDays.indexOf(5) !== -1,
              'saturday': value.processingDays.indexOf(6) !== -1,
              'sunday': value.processingDays.indexOf(7) !== -1,
              'processingDays': value.processingDays
            });
            i++;
          });

        }
        document.location.hash = '';
        vm.documentHash = '';
        vm.loadingdata = false;
        return vm.dataTestDays;
        $rootScope.blockView = false;
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }
    /**Funcion que habilita el botón para guardar un orden de impresión.*/
    function edit() {
      vm.stateButton('edit');
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los dias*/
    function changeCheckAll() {
      vm.monAll = vm.daysAll;
      vm.tueAll = vm.daysAll;
      vm.wedAll = vm.daysAll;
      vm.thuAll = vm.daysAll;
      vm.friAll = vm.daysAll;
      vm.satAll = vm.daysAll;
      vm.sunAll = vm.daysAll;
      vm.changeCheckMon();
      vm.changeCheckTue();
      vm.changeCheckWed();
      vm.changeCheckThu();
      vm.changeCheckFri();
      vm.changeCheckSat();
      vm.changeCheckSun();
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los lunes*/
    function changeCheckMon() {
      vm.loadingdata = true;
      vm.dataTestDays.forEach(function (value) {
        value.monday = vm.monAll;
      });
      vm.loadingdata = false;
      vm.stateButton('edit');
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los martes*/
    function changeCheckTue() {
      vm.loadingdata = true;
      vm.dataTestDays.forEach(function (value) {
        value.tuesday = vm.tueAll;
      });
      vm.loadingdata = false;
      vm.stateButton('edit');
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los miércoles*/
    function changeCheckWed() {
      vm.loadingdata = true;
      vm.dataTestDays.forEach(function (value) {
        value.wednesday = vm.wedAll;
      });
      vm.loadingdata = false;
      vm.stateButton('edit');
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los jueves*/
    function changeCheckThu() {
      vm.dataTestDays.forEach(function (value) {
        value.thursday = vm.thuAll;
      });
      vm.stateButton('edit');
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los viernes*/
    function changeCheckFri() {
      vm.dataTestDays.forEach(function (value) {
        value.friday = vm.friAll;
      });
      vm.stateButton('edit');
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los sábado*/
    function changeCheckSat() {
      vm.dataTestDays.forEach(function (value) {
        value.saturday = vm.satAll;
      });
      vm.stateButton('edit');
    }
    /* Método del evento changed del checkbox de Todos para seleccionar todos los domingo*/
    function changeCheckSun() {
      vm.dataTestDays.forEach(function (value) {
        value.sunday = vm.sunAll;
      });
      vm.stateButton('edit');
    }
    //** Método que actualiza el orden de impresión de los exámenes o pruebas**//
    function save(ProcessingDayForm) {
      vm.updateProcessingDay = [];
      vm.loadingdata = true;
      vm.dataTestDays.forEach(function (value) {
        var days = (value.monday ? '1' : '') +
          (value.tuesday ? '2' : '') +
          (value.wednesday ? '3' : '') +
          (value.thursday ? '4' : '') +
          (value.friday ? '5' : '') +
          (value.saturday ? '6' : '') +
          (value.sunday ? '7' : '');
        vm.updateProcessingDay.push({
          'id': value.id,
          'name': value.name,
          'processingDays': days
        });
      })




      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.updateProcessingDay(auth.authToken, vm.updateProcessingDay).then(function (data) {
        if (data.status === 200) {
          ProcessingDayForm.$setUntouched();
          vm.getTestArea(vm.idArea, vm.selected, ProcessingDayForm);
          vm.stateButton('init');
          logger.success($filter('translate')('0042'));
          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });

    }
    //** Metodo que cancela los cambios antes de guardar**//
    function cancel(ProcessingDayForm) {
      ProcessingDayForm.$setUntouched();
      if (vm.idArea === null) {
        vm.dataTestDays = [];
      } else {
        vm.getTestArea(vm.idArea, vm.selected, ProcessingDayForm);
      }
      vm.stateButton('init');
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
    //** Metodo que valida el estado de los botones**//
    function stateButton(state) {
      if (state === 'init') {
        vm.isDisabledEdit = vm.idArea === null || vm.idArea === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
      }
      if (state === 'edit') {
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
      }
      if (state === 'update') {
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }
    /**funcion inicial que se ejecuta cuando se carga el modulo*/
    function init() {
      vm.getConfigurationFormatDate();
      vm.stateButton('init');
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function DependenceDaysController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
