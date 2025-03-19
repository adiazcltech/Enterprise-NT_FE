(function () {
  'use strict';

  angular
    .module('app.printorder')
    .controller('PrintOrderController', PrintOrderController)
    .controller('DependenceController', DependenceController);
  PrintOrderController.$inject = ['testDS', 'areaDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', 'moment', '$rootScope'
  ];

  function PrintOrderController(testDS, areaDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, moment, $rootScope) {

    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'PrintOrder';
    vm.ordering = ['ordering', 'name'];
    vm.name = ['name', 'ordering'];
    vm.sortReverse = false;
    vm.sortType = vm.ordering;
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
    vm.changeTest = changeTest;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.dataTest = [];
    vm.updatePrintOrder = [];
    vm.loadingdata = false;
    vm.changeOrderTest = changeOrderTest;
    vm.arrayTest = [{
      'codename': '',
      'printOrder': 0
    }, {
      'codename': '',
      'printOrder': 0
    }];
    var auth;

    vm.sortableOptions = {
      items: "div:not(.not-sortable)",
      cancel: ".not-sortable"
    }

    /**Accion que sirve para eliminar una columna de una tabla a partir de un objeto area */
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
    //** Metodo al cambiar la orden de examen**//
    function changeOrderTest() {
      vm.isDisabledSave = vm.arrayTest[0].printOrder + vm.arrayTest[1].printOrder > 0;
      vm.idTest = '';
      vm.filterTest = _.filter(vm.fullTest, function (o) {
        return o.printOrder === vm.arrayTest[0].printOrder
      })[0];
      vm.filterTest2 = _.filter(vm.fullTest, function (o) {
        return o.printOrder === vm.arrayTest[1].printOrder
      })[0];
      if (vm.filterTest !== undefined)
        vm.arrayTest[0].codename = vm.filterTest.code + ' - ' + vm.filterTest.name;

      if (vm.filterTest2 !== undefined)
        vm.arrayTest[1].codename = vm.filterTest2.code + ' - ' + vm.filterTest2.name;
    }
    //** Metodo al cambiar el buscador**//
    function changeSearch() {
      vm.idArea = null;
      vm.selected = -1;
      vm.dataTest = [];
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
        vm.dataAreas = $filter('orderBy')(vm.dataAreas, 'name');
        vm.NumAreas = vm.dataAreas.length.toString();
        if (vm.dataAreas.length === 0) {
          ModalService.showModal({
            templateUrl: 'Requerido.html',
            controller: 'DependenceController',
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
        vm.modalError();
      });
    }
    //** Método que obtiene una lista de pruebas pertenecientes a una área seleccionada**//
    function getTestArea(id, index, PrintOrderForm) {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.idArea = vm.dataAreas === undefined ? 0 : id;
      vm.selected = id;
      vm.selectedTest = -1;
      vm.arrayTest = [{
        'codename': '',
        'printOrder': 0
      }, {
        'codename': '',
        'printOrder': 0
      }];
      vm.loadingdata = true;
      vm.limitTo = 100;
      vm.from = 1;
      vm.filterTest = [];
      vm.filterTest2 = [];
      vm.dataTest = [];
      vm.idTest = undefined;
      vm.stateButton('init');
      return testDS.getTestArea(auth.authToken, 3, 1, vm.idArea).then(function (data) {
        var i = 1;
        if (data.data.length > 0) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data[0].lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + data.data[0].user.userName;
          data.data.sort(function (a, b) {
            return a.printOrder - b.printOrder;
          });
          data.data.forEach(function (value) {
            vm.dataTest.push({
              'id': value.id,
              'abbr': value.abbr,
              'name': value.name,
              'code': value.code,
              'printOrder': value.printOrder,
              'testType': value.testType === 0 ? '' : $filter('translate')('0290')
            });  
          });

          //'printOrder': value.printOrder !== i ? i : value.printOrder,
          vm.fullTest = vm.dataTest;
          vm.sortableOptions = {
            placeholder: "app",
            scroll: true,
            connectWith: ".containerTest",
            stop: function () {
              if (vm.arrayTest[0].printOrder > 0 && vm.arrayTest[1].printOrder > 0) {
                vm.isDisabledCancel = false;
                vm.isDisabledSave = false;
              }
              vm.idTest = undefined;
              var arra = vm.arrayTest;
            }
          };
        }
        document.location.hash = '';
        vm.documentHash = '';
        $rootScope.blockView = false;
        vm.loadingdata = false;
        vm.stateButton('init');
        return vm.dataTest;
      }, function (error) {
        vm.loadingdata = false;
        vm.modalError(error);
      });
    }
    //Método al cambiar el examen
    function changeTest() {
      if (vm.idTest !== undefined && vm.idTest !== '') {
        var printOrder = _.filter(vm.fullTest, function (o) {
          return o.id === vm.idTest
        })[0].printOrder;
        if (printOrder - 100 > 0) {
          vm.from = 1 + (printOrder - 100);
        } else {
          vm.from = 1;
        }
        if (vm.itemLast !== undefined) {
          try {
            document.getElementById(vm.itemLast).classList.remove('itemSelected');

            document.getElementById('item' + vm.idTest.toString()).classList.remove('animationItem');
            document.getElementById('item' + vm.idTest.toString()).classList.add('itemSelected');
            if (vm.documentHash !== '#item' + vm.idTest.toString()) {
              document.location.hash = '';
              vm.documentHash = '#item' + vm.idTest.toString();
            }
            if (document.location.hash === '') {
              setTimeout(function () {
                document.location.hash = '#item' + vm.idTest.toString();
                document.location.hash = '#titlePrintOrder';
              }, 100);
            }
          } catch (e) {

          }
        }
        vm.itemLast = 'item' + vm.idTest.toString();

      }

    }
    /**Funcion que habilita el botón para guardar un orden de impresión.*/
    function edit() {
      vm.stateButton('edit');
    }
    //** Método que actualiza el orden de impresión de los exámenes o pruebas**//
    function save(PrintOrderForm) {
     vm.updatePrintOrder = [];
     // var printOrderOld = "0";
      vm.loadingdata = true;
     /*  if (vm.arrayTest[0].printOrder === 0 || vm.arrayTest[1].printOrder === 0) {
        for (var i = 0; i < document.getElementById("content").children.length; i++) {
          var printOrder = document.getElementById("content").children[i].children[1].id.replace('bin', '');
          var idTest = document.getElementById('bin' + printOrder).children[0].id.replace('item', '');
          var name = document.getElementById('bin' + printOrder).children[0].children[0].title;
          if (printOrderOld !== printOrder) {
            vm.updatePrintOrder.push({
              'id': parseInt(idTest),
              'printOrder': parseInt(printOrder),
              'name': name
            });
            printOrderOld = printOrder;
          };
        };
      } else {
        var filterTest1 = _.filter(vm.fullTest, function (o) {
          return o.printOrder === vm.arrayTest[0].printOrder
        })[0];
        var filterTest2 = _.filter(vm.fullTest, function (o) {
          return o.printOrder === vm.arrayTest[1].printOrder
        })[0];
        vm.updatePrintOrder = [{
            'id': parseInt(filterTest1.id),
            'printOrder': parseInt(vm.arrayTest[1].printOrder),
            'name': filterTest1.name
          },
          {
            'id': parseInt(filterTest2.id),
            'printOrder': parseInt(vm.arrayTest[0].printOrder),
            'name': filterTest2.name
          }
        ];

      } */

      vm.dataTest.forEach(function (value) {
        vm.updatePrintOrder.push({
          'id': value.id,
          'printOrder': value.printOrder,
          'name': value.name
        });   
      });
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.updatePrintOrder(auth.authToken, vm.updatePrintOrder).then(function (data) {
        if (data.status === 200) {
         // PrintOrderForm.$setUntouched();
          vm.getTestArea(vm.idArea, vm.selected, PrintOrderForm);
          vm.stateButton('init');
          logger.success($filter('translate')('0042'));
          return data;
        }

      }, function (error) {
        vm.modalError(error);
      });

    }
    //Método para cancelar el ordenamiento
    function cancel(PrintOrderForm) {
     // PrintOrderForm.$setUntouched();
      vm.loadingdata = true;
      if (vm.idArea === null) {
        vm.dataTest = [];
      } else {
        vm.getTestArea(vm.idArea, vm.selected, PrintOrderForm);
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
    //Método para el estado de los botones
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
    /** funcion inicial que se ejecuta cuando se carga el modulo */
    function init() {
      vm.getConfigurationFormatDate();
      vm.stateButton('init');
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function DependenceController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
