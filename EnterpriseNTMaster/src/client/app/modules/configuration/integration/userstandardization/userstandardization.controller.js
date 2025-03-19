(function () {
  'use strict';
  angular
    .module('app.userstandardization')
    .controller('UserstandardizationController', UserstandardizationController)
    .controller('userstandardizationcodeController', userstandardizationcodeController)
    .controller('litestdependenceController', litestdependenceController);

  UserstandardizationController.$inject = ['centralsystemDS', 'userDS', 'configurationDS',
    'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'ModalService', 'LZString', '$translate'
  ];

  function UserstandardizationController(centralsystemDS, userDS, configurationDS,
    localStorageService, logger, $filter, $state, moment, $rootScope, ModalService, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Userstandardization';
    vm.sortReverse = false;
    vm.sortType = 'name';
    vm.sortReverse1 = false;
    vm.sortType1 = 'userNameStandardization';
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabledPrint = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getId = getId;
    vm.update = update;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.generateFile = generateFile;
    var auth;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.getcentralsystem = getcentralsystem;
    vm.listuser = [];
    vm.data = [];
    vm.modalrequired = modalrequired;
    vm.removeDataresult = removeDataresult;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Método que obtiene la lista para llenar la grilla**//
    function getcentralsystem() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return userDS.getuserActive(auth.authToken).then(function (data) {
        vm.listuser = data.data;
        vm.get();
      }, function (error) {
        vm.modalError(error);
      });
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
        vm.getcentralsystem();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update(id, userStandardization) {
      vm.loadingdata = true;
      vm.central = $filter('filter')(vm.Detail, {
        centralCode: userStandardization.centralCode
      }, true);
      if (vm.central.length > 1) {
        userStandardization.centralCode = "";
        ModalService.showModal({
          templateUrl: "Informat.html",
          controller: "userstandardizationcodeController"
        }).then(function (modal) {
          modal.element.modal();
        });


      } else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        var object = {
          'user': {
            'id': auth.id
          },
          'id': userStandardization.id,
          'name': vm.namecentralsystem,
          'centralCode': userStandardization.centralCode,
          'userStandardization': {
            'id': userStandardization.iduserStandardization,
            'name': userStandardization.name
          }
        };

        return userDS.standardizationusers(auth.authToken, object).then(function (data) {
          if (data.status === 200) {
            vm.get();
            logger.success($filter('translate')('0042'));
            return data;
          }

        }, function (error) {
          vm.modalError(error);
        });
      }

    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get('Enterprise_NT.authorizationData');
      return centralsystemDS.getCentralSystemActive(auth.authToken).then(function (data) {
        vm.data = data.data.length === 0 ? data.data : removeData(data);
        vm.loadingdata = false;
        vm.modalrequired();
        return vm.data;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que obtiene la lista para llenar la grilla de examenes**//
    function modalrequired() {
      if (vm.listuser.length === 0 || vm.data.length === 0) {
        ModalService.showModal({
          templateUrl: 'Requerido.html',
          controller: 'litestdependenceController',
          inputs: {
            hidecentralsystem: vm.data.length,
            hideuser: vm.listuser.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });

      }
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(centralsystem, index) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.selected = index;
      vm.selected1 = -1;
      vm.Detail = [];
      vm.namecentralsystem = centralsystem.name;
      vm.isDisabledPrint = false;
      vm.username = centralsystem.username;
      vm.loadingdata = true;
      return userDS.getstandardizationusers(auth.authToken, centralsystem.id).then(function (data) {
        vm.loadingdata = false;
        if (data.status === 200) {
          vm.usuario = $filter('translate')('0017') + ' ';
          vm.usuario = vm.usuario + moment(data.data.lastTransaction).format(vm.formatDate) + ' - ';
          vm.usuario = vm.usuario + vm.username;
          vm.Detail = data.data.length === 0 ? data.data : removeDataresult(data);
          return vm.Detail;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeDataresult(data) {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.ehr;
        delete value.lastTransaction;
        delete value.name;
        delete value.repeatCode;
        delete value.state;
        data.data[key].name = value.userStandardization.name + ' ' + value.userStandardization.lastName;
        data.data[key].iduserStandardization = value.userStandardization.id;
        data.data[key].userNameStandardization = value.userStandardization.userName;
        delete value.userStandardization;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      if (vm.filtered1.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {
          'centralsystem': vm.namecentralsystem
        };
        vm.datareport = vm.filtered1;
        vm.pathreport = '/report/configuration/integration/userstandardization/userstandardization.mrt';
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
  //metodo para ver una ventana modal
  function litestdependenceController($scope, hidecentralsystem, hideuser, close) {
    $scope.hidecentralsystem = hidecentralsystem;
    $scope.hideuser = hideuser;
    $scope.close = function (page) {
      close({
        page: page

      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
  //metodo para ver una ventana modal
  function userstandardizationcodeController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
