(function () {
  'use strict';

  angular
    .module('app.demographicbranch')
    .controller('demographicbranchController', demographicbranchController)
    .controller('demographicbybranchrequeridController', demographicbybranchrequeridController);
  demographicbranchController.$inject = ['demographicDS', 'branchDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];

  function demographicbranchController(demographicDS, branchDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'demographicbranch';
    vm.name = ['name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.Itemname = ['nameDemographic', 'selected'];
    vm.Itemselected = ['-selected', '+nameDemographic'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.Itemselected;
    vm.getidchange = getidchange;
    vm.selected = -50;
    vm.isDisabled = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getid = getid;
    vm.save = save;
    vm.modalError = modalError;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.generateFile = generateFile;
    vm.modalrequired = modalrequired;
    vm.getbranch = getbranch;
    vm.getdemograficchange = getdemograficchange;
    vm.removeDatademografic = removeDatademografic;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    vm.dataItemDemographics = [];
    vm.change = change;
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
        vm.getbranch();
        if (data.status === 200) {
          vm.formatDate = data.data.value.toUpperCase();
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener las sedes activas**//
    function getbranch() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (data) {
        vm.getdemograficchange();
        if (data.status === 200) {
          vm.lisbranch = data.data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo para obtener todos los demograficos**//
    function getdemograficchange() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
        vm.lisdemografic = data.data.length === 0 ? data.data : removeDatademografic(data);
        vm.modalrequired();
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Metodo que construlle el arreglo para el combo demograficos**//
    function removeDatademografic(data) {
      vm.demografic = [];
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      data.data.forEach(function (value, key) {
        switch (value.id) {
          case -1:
            value.name = $filter('translate')('0248');
            break;
          case -2:
            value.name = $filter('translate')('0225');
            break;
          case -3:
            value.name = $filter('translate')('0307');
            break;
          case -4:
            value.name = $filter('translate')('0133');
            break;
          case -5:
            value.name = $filter('translate')('0075');
            break;
          case -6:
            value.name = $filter('translate')('0175');
            break;
          case -7:
            value.name = $filter('translate')('0174');
            break;
          default:
            value.name = value.name;
        }
        var object = {
          id: value.id,
          name: value.name
        }
        vm.demografic.push(object);
        data.data[key].username = auth.userName;
      });
      return vm.demografic;
    }
    // funcion para sacar la ventana modal de requeridos
    function modalrequired() {
      vm.loadingdata = false;
      if ((vm.lisdemografic.length === 0) || vm.lisbranch.length === 0) {
        ModalService.showModal({
          templateUrl: "requerid.html",
          controller: "demographicbybranchrequeridController",
          inputs: {
            hidedemographics: vm.lisdemografic.length,
            hidetest: vm.lisbranch.length
          }
        }).then(function (modal) {
          modal.element.modal();
          modal.close.then(function (result) {
            $state.go(result.page);
          });
        });
      }
    }
    //metodo que se consulta los items demograficos a cambiarlo en el combo
    function getid(data) {
      vm.dataItemDemographics = [];
      vm.selected = data.id;
      vm.search2 = '';
      vm.branchname = data.name;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      vm.nameDemographic = false;
      return demographicDS.getbranchitem(auth.authToken, vm.selected).then(function (data) {
        vm.dataItemDemographics = data.data;
        vm.sortReverse1 = false;
        vm.sortType1 = vm.Itemselected;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //metodo que se consulta los items demograficos a cambiarlo en el combo
    function getidchange() {
      vm.dataItemDemographics = [];
      vm.search2 = '';
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getbranchitem(auth.authToken, vm.selected).then(function (data) {
        vm.dataItemDemographics = data.data;
        vm.sortReverse1 = false;
        vm.sortType1 = vm.Itemselected;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que  guarda los dias de alama asociados all demografico y a la prueba**//
    function save() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var datasave = $filter('filter')(vm.dataItemDemographics, function (e) {
        e.idBranch = vm.selected;
        return e.selected === true
      });
      return demographicDS.savebranchitem(auth.authToken, datasave).then(function (data) {
        if (data.status === 200) {
          vm.getidchange();
          logger.success($filter('translate')('0042'));
          vm.loadingdata = false;
          return data;
        }
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método para preparar el JSON para imprimir el reporte**//
    function generateFile() {
      if (vm.dataItemDemographics.length === 0) {
        vm.open = true;
      } else {
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.variables = {
          "branch": vm.branchname,
          "username": auth.userName
        };
        vm.datareport = vm.dataItemDemographics;
        vm.pathreport = '/report/configuration/demographics/demographicbranch/demographicbranch.mrt';
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
    //** Método para cuando se selecciona todos**//
    function change() {
      if (vm.filtered1.length !== 0) {
        vm.filtered1.forEach(function (value) {
          value.selected = vm.nameDemographic;
        });
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
    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Método para inicializar la pagina**//
    function init() {
      vm.getConfigurationFormatDate();
    }
    vm.isAuthenticate();
  }
  //** Controller de la vetana modal de datos requeridos por depdendecias*//
  function demographicbybranchrequeridController($scope, hidedemographics, hidetest, close) {
    $scope.hidedemographics = hidedemographics;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
