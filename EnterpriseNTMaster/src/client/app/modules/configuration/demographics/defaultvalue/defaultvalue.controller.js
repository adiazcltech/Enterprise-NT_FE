(function () {
  'use strict';
  angular
    .module('app.defaultvalue')
    .controller('defaultvalueController', defaultvalueController)
    .controller('defaulvaluerequeridController', defaulvaluerequeridController);
  defaultvalueController.$inject = ['localStorageService', 'logger', 'ModalService', '$filter', '$state', '$rootScope', 'demographicsItemDS', 'demographicDS'];

  function defaultvalueController(localStorageService, logger, ModalService, $filter, $state, $rootScope, demographicsItemDS, demographicDS) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = 'defaultvalue';
    vm.isAuthenticate = isAuthenticate;
    vm.save = save;
    vm.modalError = modalError;
    vm.modalrequired = modalrequired;
    vm.loadingdata = true;
    vm.name = ['name', 'defaultValue'];
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
    function save(Form) {
      vm.loadingdata = true;
      if (Form.$valid) {
        var data = [];
        vm.demographic.forEach(function (value) {
          var datademograpdhic = {
            'idDemographic': value.id,
            'defaultValueRequired': value.defaultValueRequired
          }
          data.add(datademograpdhic);
        });
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        return demographicDS.updatevaluerequired(auth.authToken, data)
          .then(
            function (data) {
              vm.loadingdata = false;
              if (data.status === 200) {
                vm.getdemographicitem();
                logger.success($filter('translate')('0042'));
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );

      } else {
        vm.demographic.forEach(function (value) {
          Form['q' + value.id].$touched = true;
        });
        vm.loadingdata = false;
      }
    }
    //** Metodo para mostrar la ventana modal de los requeridos**//
    function modalrequired() {
      vm.loadingdata = false;
      ModalService.showModal({
        templateUrl: 'Requerido.html',
        controller: 'defaulvaluerequeridController',
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
      return demographicDS.getDemographics(auth.authToken).then(function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            var demographic = $filter('filter')(data.data, function (e) {
              return e.obligatory === 1 && e.state === true
            })
            if (demographic.length !== 0) {
              demographic.forEach(function (value, key) {
                if (value.encoded === true) {
                  value.defaultValueRequired = parseInt(value.defaultValueRequired);
                  value.items = $filter('filter')(vm.dataItemDemographics, {
                    demographic: value.id
                  }, true);
                }
              });
              vm.demographic = demographic;
            } else {
              vm.modalrequired();
            }
          } else {
            vm.modalrequired();
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
      return demographicsItemDS.getDemographicsItems(auth.authToken)
        .then(
          function (data) {
            vm.getdemographic();
            if (data.status === 200) {
              vm.dataItemDemographics = data.data;
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Metodo que incializa la aplicación**//
    function init() {
      vm.getdemographicitem();
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
  function defaulvaluerequeridController($scope, close) {
    $scope.close = function (page) {
      close({
          page: page,
        },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
  }
})();
