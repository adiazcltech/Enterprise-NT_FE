/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.cubicleassignment")
    .controller("cubicleassignmentController", cubicleassignmentController);
  cubicleassignmentController.$inject = [
    "cubicleDS",
    "localStorageService",
    "logger",  
    "$state",
    "$rootScope",
    "userDS",
    "$filter"
  ];
  function cubicleassignmentController(
    cubicleDS,
    localStorageService,
    logger,   
    $state,
    $rootScope,
    userDS,
    $filter
  ) {
    var vm = this;
    vm.title = "cubicleassignment";
    $rootScope.menu = true;
    vm.loadingdata = true;
    $rootScope.helpReference = "06.Tools/cubicleassignment.htm";
    $rootScope.NamePage = $filter('translate')('3680');
    vm.save = save;
    vm.get = get;
    vm.ListOrder = [];
    vm.modalError = modalError;
    $rootScope.pageview = 3;
    vm.isAuthenticate = isAuthenticate;
    vm.validatedActive = validatedActive;
    vm.getUser = getUser;
    //Muestra modal de errores
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }  
    //Consuta los usuarios
    function getUser() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return userDS.getUserssimple(auth.authToken).then(
        function (data) {
          vm.get();
          if (data.status === 200) {
            data.data.forEach(function (value) {
              value.name = value.name + " " + value.lastName;
            });
            vm.ListUser = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //Consulta los cubiculos
    function get() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.loadingdata = true;
      vm.ListOrder = [];
      return cubicleDS.getcubicle(auth.authToken).then(
        function (data) {
          vm.loadingdata = false;
          if (data.status === 200) {
            data.data.forEach(function (cubicle) {
              cubicle.requeridUser = false;
              var username = _.filter(_.clone(vm.ListUser), function (o) {
                return o.id == cubicle.designatedPerson;
              });
              if (username.length === 0) {
                cubicle.user = {};
              } else {
                cubicle.user = { selected: username[0] };
              }
            });
            vm.ListOrder = data.data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //Valida si un cubiculo se puede desactivar o no   
    function validatedActive(Order) {
      if(!Order.active){
        if(Order.numberOfAssignedPeople === 0) {
          Order.disabled=false;
          vm.save(Order)
        }else{
          Order.active=true;
          logger.info($filter('translate')('3684'));
        }
      }else{
        vm.save(Order);
      }
    }
    //Guarda los cambios en el cubiculo
    function save(Order) {
      vm.loadingdata = true;
      Order.requeridUser = Order.user.selected === undefined ? true : false;
      if (Order.requeridUser) {
        vm.loadingdata = false;
      } else {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        Order.designatedPerson=Order.user.selected.id;
        return cubicleDS.updatecubicle(auth.authToken, Order).then(
          function (data) {
            if (data.status === 200) {
              vm.loadingdata = false;
              vm.get();
              logger.success($filter('translate')('3685'));
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
      }
    }
    //Valida si el usuario esta autenticado para ver el contenido
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.getUser();
      }
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
