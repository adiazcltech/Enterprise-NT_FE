(function () {
  'use strict';

  angular
    .module('app.literalresultfortest')
    .controller('literalResultbyTestController', literalResultbyTestController)
    .controller(
      'dependencetestliteralController',
      dependencetestliteralController
    )
    .controller('SeleccionController', SeleccionController);

  literalResultbyTestController.$inject = [
    'testDS',
    'literalresultDS',
    'configurationDS',
    'localStorageService',
    'logger',
    '$filter',
    '$state',
    'moment',
    '$rootScope',
    'ModalService',
    'LZString',
    '$translate',
  ];

  function literalResultbyTestController(
    testDS,
    literalresultDS,
    configurationDS,
    localStorageService,
    logger,
    $filter,
    $state,
    moment,
    $rootScope,
    ModalService,
    LZString,
    $translate
  ) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'LiteralResultbyTest';
    vm.code = ['code', 'name'];
    vm.name = ['name', 'code'];
    vm.sortReverse = false;
    vm.sortType = vm.code;
    vm.literalresultname = ['name', 'assign'];
    vm.assign = ['-assign', '+name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.literalresultname;
    vm.sortReverse1 = true;
    vm.sortType1 = '';
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.cancel = cancel;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getliteralresul = getliteralresul;
    vm.listliteralresul = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.removeDataresult = removeDataresult;
    vm.idTest = 0;
    vm.updatetestliteralresul = updatetestliteralresul;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Método que obtiene la lista para llenar la grilla**//
    function getliteralresul() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return literalresultDS.get(auth.authToken).then(
        function (data) {
          vm.listliteralresul = data.data;
          vm.get();
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        data.data[key].search = data.data[key].code + data.data[key].name;
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
      return configurationDS
        .getConfigurationKey(auth.authToken, 'FormatoFecha')
        .then(
          function (data) {
            vm.getliteralresul();
            if (data.status === 200) {
              vm.formatDate = data.data.value.toUpperCase();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return literalresultDS.getIdTest(auth.authToken, vm.idTest).then(
        function (data) {
          if (data.status === 200) {
            vm.usuario = $filter('translate')('0017') + ' ';
            vm.usuario =
              vm.usuario +
              moment(data.data.lastTransaction).format(vm.formatDate) +
              ' - ';
            vm.usuario = vm.usuario + vm.username;
            vm.Detail =
              data.data.length === 0 ? data.data : removeDataresult(data);
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var literalresul = vm.updatetestliteralresul();
      if (literalresul.length === 0) {
        ModalService.showModal({
          templateUrl: 'seleccion.html',
          controller: 'SeleccionController',
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            if (result === 'No') {
              $state.go('container');
            }
          });
        });
        vm.loadingdata = false;
      } else {
        return literalresultDS.updateTest(auth.authToken, literalresul).then(
          function (data) {
            if (data.status === 200) {
              vm.get();
              logger.success($filter('translate')('0042'));
              return data;
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que organiza el JSON para guardar**//
    function updatetestliteralresul() {
      var literalresul = [];
      vm.Detail.forEach(function (value, key) {
        if (value.assign === true) {
          var object = {
            user: {
              id: auth.id,
            },
            id: vm.idTest,
            name: vm.nameTest,
            literalResult: {
              id: value.literalResult.id,
              name: value.literalResult.name,
            },
          };
          literalresul.push(object);
        }
      });
      return literalresul;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return testDS.getTestTypeResult(auth.authToken, 2, 1, 0, 0).then(
        function (data) {
          vm.data = data.data.length === 0 ? data.data : removeData(data);
          vm.loadingdata = false;
          vm.modalrequired();
          return vm.data;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método Para validar si existen elemntos requeridos**//
    function modalrequired() {
      if (vm.listliteralresul.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'dependencetestliteralController',
          inputs: {
            hideliteralresult: vm.listliteralresul.length,
            hidetest: vm.data.length,
          },
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(Testre, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = Testre.id;
      vm.Detail = [];
      vm.idTest = Testre.id;
      vm.nameTest = Testre.name;
      vm.sortReverse1 = true;
      vm.sortType1 = '';
      vm.isDisabledSave = false;
      vm.isDisabledCancel = false;
      vm.isDisabledPrint = false;
      vm.username = Testre.username;
      vm.loadingdata = true;
      return literalresultDS.getIdTest(auth.authToken, Testre.id).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            vm.usuario = $filter('translate')('0017') + ' ';
            vm.usuario =
              vm.usuario +
              moment(data.data.lastTransaction).format(vm.formatDate) +
              ' - ';
            vm.usuario = vm.usuario + vm.username;
            vm.Detail =
              data.data.length === 0 ? data.data : removeDataresult(data);
            vm.sortReverse1 = false;
            vm.sortType1 = vm.assign;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataresult(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        data.data[key].name = value.literalResult.name;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      var datareport = [];
      var datareport = $filter('filter')(vm.filtered1, {
        assign: true,
      });
      if (datareport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          name: vm.nameTest,
        };
        vm.datareport = datareport;
        vm.pathreport =
          '/report/configuration/test/literalresultfortest/literalresultfortest.mrt';
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
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );
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
  // Método que muestra la modal de requeridos
  function dependencetestliteralController(
    $scope,
    hideliteralresult,
    hidetest,
    close
  ) {
    $scope.hideliteralresult = hideliteralresult;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
          page: page,
        },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
  }
  // Método que muestra la modal cuando se guarda y no se a seleccionado un elemento
  function SeleccionController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
