/* jshint ignore:start */
(function () {
  "use strict";

  angular
    .module("app.userprofile")
    .controller("userprofileController", userprofileController);

  userprofileController.$inject = [
    "authService",
    "logger",
    "$rootScope",
    "authenticationsessionDS",
    "localStorageService",
    "userDS",
    "$filter",
  ];
  /* @ngInject */
  function userprofileController(
    authService,
    logger,
    $rootScope,
    authenticationsessionDS,
    localStorageService,
    userDS,
    $filter
  ) {
    var vm = this;
    vm.getUsersId = getUsersId;
    vm.updateUsers = updateUsers;
    vm.validUser = validUser;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0150");
    vm.paswordinvalid = false;
    vm.newpassword = "";
    vm.validpassword = "";
    vm.passwordcorrect = false;
    vm.messagepassword = false;
    $rootScope.pageview = 3;
    vm.modalError = modalError;

    vm.getUsersId();

    $rootScope.$watch("photo", function () {
      vm.photo = $rootScope.photo;
    });

    $rootScope.$watch("ipUser", function () {
      vm.ipuser = $rootScope.ipUser;
    });

    //** Método que obtiene un usuario por id*//
    function getUsersId() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      return userDS.getUsersId(auth.authToken, auth.id).then(
        function (data) {
          if (data.status === 200) {
            vm.Detail = data.data;
            vm.Detail.password = "";
          }
        },
        function (error) {
          vm.modalError();
        }
      );
    }

    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }

    //** Método que obtiene un usuario por id*//
    function validUser() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var user = {
        username: auth.userName,
        password: vm.Detail.password,
        location: auth.branch,
      };

      return authService.login(user).then(
        function (data) {
          if (data.data.success) {
            vm.passwordcorrect = true;
            vm.messagepassword = false;
          }
        },
        function (error) {
          vm.passwordcorrect = false;
          vm.messagepassword = true;
        }
      );
    }

    //** Método que Actualiza un usuario**//
    function updateUsers() {
      vm.loadingdata = true;
      vm.passwordcorrect = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var user = {
        user: auth.userName,
        password: vm.Detail.password,
        type: 3,
      };
      return authenticationsessionDS.gettestpassword(user).then(
        function (data) {
          if (data.status === 200) {
            vm.passwordcorrect = true;
            vm.messagepassword = false;
            if (angular.element("#imageuser").children().length > 0) {
              var photo = angular
                .element("#imageuser")
                .children()[0]
                .src.split(",");
              vm.Detail.photo = photo[1];
            }
            if (
              vm.Detail.identification !== "" &&
              vm.Detail.name !== "" &&
              vm.Detail.lastName !== "" &&
              vm.Detail.password !== ""
            ) {
              var user = {
                userName: vm.Detail.userName,
                password: vm.newpassword === "" ? vm.Detail.password : vm.newpassword,
                lastName: vm.Detail.lastName,
                name: vm.Detail.name,
                photo: vm.Detail.photo,
                identification: vm.Detail.identification,
                email: vm.Detail.email,
                user: {
                  id: auth.id,
                },
              };
              return userDS.changepasswordUser(auth.authToken, user).then(
                function (data) {
                  if (data.status === 200) {
                    vm.loadingdata = false;
                    localStorageService.set("Enterprise_NT.authorizationData", {
                      authToken: auth.authToken,
                      userName: auth.userName,
                      id: auth.id,
                      photo: vm.Detail.photo,
                      confidential: auth.confidential,
                      branch: auth.branch,
                      name: vm.Detail.name,
                      lastName: vm.Detail.lastName,
                    });
                    $rootScope.photo = vm.Detail.photo;
                    logger.success($filter("translate")("0149"));
                    return data;
                  }
                },
                function (error) {
                  vm.loadingdata = false;
                  vm.modalError(error);
                }
              );
            }
          } else {
            vm.loadingdata = false;
            vm.passwordcorrect = false;
            vm.messagepassword = true;
            logger.success("la contraseña no coincide con la que se configuro");
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.passwordcorrect = false;
          vm.messagepassword = true;
          logger.success("la contraseña no coincide con la que se configuro");
        }
      );
    }
  }
})();
/* jshint ignore:end */
