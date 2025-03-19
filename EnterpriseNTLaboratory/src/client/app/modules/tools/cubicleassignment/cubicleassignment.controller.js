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
    "$filter",
    "$state",
    "$rootScope",
    "userDS",
  ];
  function cubicleassignmentController(
    cubicleDS,
    localStorageService,
    logger,
    $filter,
    $state,
    $rootScope,
    userDS
  ) {
    var vm = this;
    vm.title = "cubicleassignment";
    $rootScope.menu = true;
    vm.loadingdata = true;
    $rootScope.helpReference = "01. LaboratoryOrders/cubicleassignment.htm";
    $rootScope.NamePage = "Asignación de cubiculos de toma de muestras";
    vm.save = save;
    vm.get = get;
    vm.ListOrder = [];
    vm.modalError = modalError;
    $rootScope.pageview = 3;
    vm.isAuthenticate = isAuthenticate;
    vm.validatedActive = validatedActive;
    vm.getUser = getUser;
 
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }  
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
    function validatedActive(Order) {
      if(!Order.active){
        if(Order.numberOfAssignedPeople === 0) {
          Order.disabled=false;
          vm.save(Order)
        }else{
          Order.active=true;
          logger.info("No se puede desactivar por que tiene usuarios Asignados");
        }
      }else{
        vm.save(Order);
      }
    }
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
              logger.success("Se guardaron los datos satisfactoriamente");
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.modalError(error);
          }
        );
      }
    }
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
