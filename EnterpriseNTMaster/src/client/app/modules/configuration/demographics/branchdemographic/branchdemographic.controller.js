(function () {
  'use strict';
  angular
    .module('app.branchdemographic')
    .controller('branchdemographicController', branchdemographicController)
    .controller('branchdemographiRequerid', branchdemographiRequerid);
  branchdemographicController.$inject = ['demographicDS', 'branchDS', 'configurationDS', 'localStorageService', 'logger',
    'ModalService', '$filter', '$state', '$rootScope', 'LZString', '$translate'
  ];

  function branchdemographicController(demographicDS, branchDS, configurationDS, localStorageService, logger,
    ModalService, $filter, $state, $rootScope, LZString, $translate) {
    var vm = this;
    $rootScope.menu = true;
    vm.init = init;
    vm.title = 'branchdemographic';
    vm.name = ['name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.Itemname = ['demographicItem.name', 'selected'];
    vm.Itemselected = ['-selected', '+demographicItem.name'];
    vm.sortReverse1 = false;
    vm.sortType1 = vm.Itemselected;
    vm.getidchange = getidchange;
    vm.selected = -50;
    vm.isDisabled = false;
    vm.isAuthenticate = isAuthenticate;
    vm.getid = getid;
    vm.nameDemographic = false;
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
    //** Método para cuando se selecciona todos**//
    function change() {
      if (vm.filtered1.length !== 0) {
        vm.filtered1.forEach(function (value) {
          value.selected = vm.nameDemographic;
        });
      }
    }
    //** Metodo para obtener las sedes activas**//
    function getbranch() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return branchDS.getBranchActive(auth.authToken).then(function (data) {
        vm.getdemograficchange();
        if (data.status === 200) {
          vm.lisbranch = $filter('orderBy')(data.data, 'name');
          vm.branch = vm.lisbranch[0];
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
    //** Metodo que arma el arreglo para el combo demograficos**//
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
        if (value.encoded === true) {
          var object = {
            id: value.id,
            name: value.name
          }
          vm.demografic.push(object);
        }
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
          controller: "alamadaysrequidController",
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
    //metodo que se consulta los items demograficos a seleccionar el demografico
    function getid(data) {
      vm.dataItemDemographics = [];
      vm.selected = data.id;
      vm.nameDemographics = data.name;
      vm.search2 = '';
      vm.nameDemographic = false;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS.getDemographicsbranch(auth.authToken, vm.branch.id, vm.selected).then(function (data) {
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
      return demographicDS.getDemographicsbranch(auth.authToken, vm.branch.id, vm.selected).then(function (data) {
        vm.dataItemDemographics = data.data;
        vm.sortReverse1 = false;
        vm.sortType1 = vm.Itemselected;
      }, function (error) {
        vm.modalError(error);
      });
    }
    //** Método que guarda**//
    function save() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var datasave = $filter('filter')(vm.dataItemDemographics, function (e) {
        return e.selected === true
      });
      return demographicDS.saveDemographicsbranch(auth.authToken, datasave).then(function (data) {
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
          "demographic": vm.nameDemographics,
          "branch": vm.branch.name,
          "username": auth.userName
        };
        vm.datareport = vm.dataItemDemographics;
        vm.pathreport = '/report/configuration/demographics/branchdemographic/branchdemographic.mrt';
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
  //** Controller de la vetana modal de datos requeridos*//
  function branchdemographiRequerid($scope, hidedemographics, hidetest, close) {
    $scope.hidedemographics = hidedemographics;
    $scope.hidetest = hidetest;
    $scope.close = function (page) {
      close({
        page: page
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  }
})();
