(function () {
  'use strict';
  angular
    .module('app.reportencryption')
    .controller('reportencryptionController', reportencryptionController)
    .controller(
      'reportencryptiondependenceController',
      reportencryptiondependenceController
    );
  reportencryptionController.$inject = [
    'localStorageService',
    'logger',
    'ModalService',
    '$filter',
    '$state',
    '$rootScope',
    'demographicsItemDS',
    'demographicDS'
  ];

  function reportencryptionController(
    localStorageService,
    logger,
    ModalService,
    $filter,
    $state,
    $rootScope,
    demographicsItemDS,
    demographicDS
  ) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'Reportencryption';
    vm.isAuthenticate = isAuthenticate;
    vm.save = save;
    vm.modalError = modalError;
    vm.modalrequired = modalrequired;
    vm.loadingdata = true;
    vm.demographic = parseInt(
      localStorageService.get('DemograficoEncriptacionCorreo')
    );
    vm.name = ['name', 'selected'];
    vm.selected = ['-selected', '+name'];
    vm.sortReverse = false;
    vm.sortType = vm.name;
    vm.getdemographic = getdemographic;
    vm.getdemographicitem = getdemographicitem;
    //** Metodo que muestra una ventana modal cuando hay un error en el servicio**//
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    //** Metodo para guardar los items configurados**//
    function save() {
      vm.loadingdata = true;
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      var data = $filter('filter')(vm.dataItemDemographics, {
        selected: true,
      });
      var saveDemographic = [];
      data.forEach(function (value) {
        var data = {
          idDemographic: vm.demographic,
          idDemographicItem: value.idDemographicItem,
          encryption: 1
        };
        saveDemographic.add(data);
      });
      return demographicsItemDS
        .saveDemographicReportEncrypt(auth.authToken, saveDemographic)
        .then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              logger.success($filter('translate')('0042'));
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Metodo para mostrar la ventana modal de los requeridos**//
    function modalrequired() {
      vm.loadingdata = false;
      ModalService.showModal({
        templateUrl: 'Requerido.html',
        controller: 'reportencryptiondependenceController',
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $state.go(result.page);
        });
      });
    }
    //** Metodo que obtiene el nombre del demografico configurado**//
    function getdemographic() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicDS
        .getDemographicsALL(auth.authToken)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.namedemographic = $filter('filter')(data.data, {
                id: vm.demographic,
              })[0].name;
              vm.getdemographicitem();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Metodo que consulta los item demograficos segun el demografico configurado**//
    function getdemographicitem() {
      var auth = localStorageService.get('Enterprise_NT.authorizationData');
      return demographicsItemDS
        .getDemographicReportEncrypt(auth.authToken, vm.demographic)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.dataItemDemographics = $filter('orderBy')(data.data, 'name');
              vm.loadingdata = false;
            } else {
              vm.modalrequired();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Metodo que incializa la aplicación**//
    function init() {
      switch (vm.demographic) {
        case -1:
          vm.namedemographic = $filter('translate')('0248');
          vm.getdemographicitem();
          break;
        case -2:
          vm.namedemographic = $filter('translate')('0225');
          vm.getdemographicitem();
          break;
        case -3:
          vm.namedemographic = $filter('translate')('0307');
          vm.getdemographicitem();
          break;
        case -4:
          vm.namedemographic = $filter('translate')('0133');
          vm.getdemographicitem();
          break;
        case -5:
          vm.namedemographic = $filter('translate')('0075');
          vm.getdemographicitem();
          break;
        case -6:
          vm.namedemographic = $filter('translate')('0175');
          vm.getdemographicitem();
          break;
        case -7:
          vm.namedemographic = $filter('translate')('0174');
          vm.getdemographicitem();
          break;
        default:
          vm.getdemographic();
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
    vm.isAuthenticate();
  }
  //** Controller de la ventana modal de datos requeridos por depdendecias*//
  function reportencryptiondependenceController($scope, close) {
    $scope.close = function (page) {
      close({
          page: page,
        },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
  }
})();
