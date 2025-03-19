(function () {
  "use strict";

  angular.module("app.account").controller("LoginController", LoginController);

  LoginController.$inject = [
    "authService",
    "branchDS",
    "logger",
    "routerHelper",
    "$state",
    "$translate",
    "localStorageService",
    "$filter",
    "$rootScope",
    "configurationDS",
    "tmhDynamicLocale",
    "ModalService",
    "productVersion"
  ];

  /* @ngInject */
  function LoginController(
    authService,
    branchDS,
    logger,
    routerHelper,
    $state,
    $translate,
    localStorageService,
    $filter,
    $rootScope,
    configurationDS,
    tmhDynamicLocale,
    ModalService,
    productVersion
  ) {
    var vm = this;
    vm.title = "Login";
    vm.login = login;
    vm.getBranch = getBranch;
    vm.user = {};
    vm.changeLanguage = changeLanguage;
    vm.getBranchUsername = getBranchUsername;
    vm.visibleBranch = false;
    vm.invalidUser = false;
    vm.invalidDate = false;
    vm.user.location = 1;
    $rootScope.menu = false;
    vm.version =  productVersion.master;
    vm.errorservice = 0;
    vm.getkeyconfigure = getkeyconfigure;

    tmhDynamicLocale.set(
      $filter("translate")("0000") === "esCo" ? "es-co" : "en"
    );

    /*performs login operation */
    function login(page) {
      vm.loadingdata = true;
      vm.invalidUser = false;
      vm.invalidDate = false;
      vm.menssageInvalid = "";
      vm.user.location = -1;
      vm.user.branch = -1;
      if (vm.user.username && vm.user.password) {
        return authService.login(vm.user).then(
          function (data) {
            if (data.data.success) {
              vm.getkeyconfigure(data.data.token, page);
              //Validación de las llaves de seguridad
              vm.loadingdata = false;
              /*  if (data.data.user.licenses.product === false) {
                vm.menssageInvalid = $filter("translate")("1067");
              } else if (data.data.user.licenses.user === false) {
                vm.menssageInvalid = $filter("translate")("1069");
              } else {
                $state.go(page);
                vm.getkeyconfigure(data.data.token, page);
              } */
            }
          },
          function (error) {
            vm.loadingdata = false;
            if (error.data !== null) {
              if (error.data.message === "timeout") {
                vm.menssageInvalid = $filter("translate")("1070");
              } else if (
                error.data.errorFields === null &&
                error.data.message !== "timeout"
              ) {
                vm.Error = error;
                vm.ShowPopupError = true;
              } else {
                if (
                  error.data.errorFields[0] ===
                  "La licencia registrada ha expirado."
                ) {
                  vm.menssageInvalid = $filter("translate")("1077");
                } else {
                  error.data.errorFields.forEach(function (value) {
                    var item = value.split("|");
                    if (
                      item[0] === "1" &&
                      item[1] ===
                        "LDAP The authentication is not supported by the server"
                    ) {
                      vm.menssageInvalid = $filter("translate")("1167");
                    }
                    if (
                      item[0] === "2" &&
                      item[1] === "Incorrect password or username LDAP"
                    ) {
                      vm.menssageInvalid = $filter("translate")("1168");
                    }
                    if (item[0] === "3" && item[1] === "LDAP fail conection") {
                      vm.menssageInvalid = $filter("translate")("1169");
                    }
                    if (item[0] === "4") {
                      if (item[1] === "inactive user") {
                        vm.menssageInvalid = $filter("translate")("1096");
                      } else {
                        vm.menssageInvalid = $filter("translate")("0097");
                      }
                    }
                    if (item[0] === "5") {
                      vm.menssageInvalid = $filter("translate")("0098");
                    }
                    if (item[0] === "3") {
                      vm.menssageInvalid = "";
                      vm.menssageInvalid = $filter("translate")("1095");
                    }
                    if (item[0] === "6") {
                      vm.Repeat = true;
                      if (item[1] === "password expiration date") {
                        vm.changepassword(item[2]);
                        vm.administrator = item[3];
                      } else {
                        vm.menssageInvalid = $filter("translate")("1038");
                      }
                    }
                    if (item[0] === "7") {
                      if (item[1] === "change password") {
                        vm.changepassword(item[2]);
                        vm.administrator = item[3];
                      }
                    }
                  });
                }
              }
            }
          }
        );
      } else {
        logger.info("the form is uncomplete");
      }
    }
    vm.changepassword = changepassword;

    function changepassword(id) {
      return configurationDS.getsecurity().then(
        function (data) {
          vm.keySecurityPolitics = data.data.value === "True" ? true : false;
          ModalService.showModal({
            templateUrl: "changepassword.html",
            controller: "changepasswordController",
            inputs: {
              id: parseInt(id),
              username: vm.user.username,
              password: vm.user.password,
              keySecurityPolitics: vm.keySecurityPolitics,
              administrator: vm.administrator,
            },
          }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              if (result.action === "Si") {
                logger.success($filter("translate")("1037"));
                vm.user.password = "";
              }
            });
          });
          vm.loadingdata = false;
        },
        function (error) {
          vm.Error = error;
          vm.PopupError = true;
        }
      );
    }

    function getkeyconfigure(token, page) {
      return configurationDS.getConfiguration(token).then(
        function (data) {
          data.data.forEach(function (value, key) {
            return localStorageService.set(value.key, value.value);
          });
          $state.go(page);
          vm.loadingdata = false;
        },
        function (error) {
          vm.Error = error;
          vm.PopupError = true;
        }
      );
    }

    function getDefaultRoute() {
      return routerHelper.getStates().filter(function (r) {
        return r.settings && r.settings.isDefault;
      })[0];
    }

    function getBranch() {
      var validsession = localStorageService.get("sessionExpired");
      if (validsession) {
        vm.ShowPopupError = true;
        vm.Error = {
          status: 0,
          session: true,
        };
        localStorageService.set("sessionExpired", false);
      }
      localStorage.clear();

      return branchDS.getBranchAutenticate().then(
        function (data) {
          if (data.status === 200) {
            vm.ListBranch = data.data;
            vm.visibleBranch = true;
            vm.user.location = vm.ListBranch[0].id;
          } else if (data.status === 204) {
            $state.go("configureinitial");
          }
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }

    function getBranchUsername(username) {
      return branchDS.getBranchUsername(username).then(
        function (data) {
          if (data.status === 200) {
            vm.ListBranch = data.data;
          } else {
            vm.getBranch();
          }
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }

    function changeLanguage(langKey) {
      $translate.use(langKey);
      if (langKey === "es") {
        tmhDynamicLocale.set("es-co");
      } else {
        tmhDynamicLocale.set("en");
      }
    }

    vm.getBranch();
  }
  angular
    .module("app.account")
    .controller("changepasswordController", changepasswordController);
  changepasswordController.$inject = [
    "$scope",
    "id",
    "close",
    "$filter",
    "userDS",
    "username",
    "password",
    "$element",
    "keySecurityPolitics",
    "administrator",
  ];

  function changepasswordController(
    $scope,
    id,
    close,
    $filter,
    userDS,
    username,
    password,
    $element,
    keySecurityPolitics,
    administrator
  ) {
    $scope.keySecurityPolitics = keySecurityPolitics;
    $scope.administrator = administrator === "true";
    $scope.lettersize = $scope.administrator ? 12 : 9;
    $scope.userchangepassword = {
      password1: "",
      password2: "",
    };
    $scope.strength0 = true;
    $scope.strength1 = true;
    $scope.strength2 = true;
    $scope.strength3 = true;
    $scope.strength4 = true;
    $scope.data = "";
    $scope.color = "#999";
    $scope.strength = "";
    $scope.messageerrorpassword = "";
    $scope.strengthlabel = $filter("translate")("1080");

    $scope.close = function (action) {
      close(
        {
          action: action,
        },
        500
      ); // close, but give 500ms for bootstrap to animate
    };
    $scope.CheckStrngth = function () {
      $scope.strengthlabel = $filter("translate")("1080");
      $scope.viewvalited = false;
      $scope.strength0 = false;
      $scope.strength1 = false;
      $scope.strength2 = false;
      $scope.strength3 = false;
      $scope.strength4 = false;
      $scope.strength = "";

      if ($scope.userchangepassword.password1 === undefined) {
        $scope.data = "";
        $scope.color = "#999";
        $scope.strength0 = true;
        $scope.strength1 = true;
        $scope.strength2 = true;
        $scope.strength3 = true;
        $scope.strength4 = true;
      }
      if ($scope.userchangepassword.password1 !== undefined) {
        $scope.data = "";
        $scope.strengthlabel = $filter("translate")("1080");
        if ($scope.userchangepassword.password1.length < $scope.lettersize) {
          $scope.strength0 = true;
          $scope.strength = "**";
        }
        if (!new RegExp("[A-Z]").test($scope.userchangepassword.password1)) {
          $scope.strength1 = true;
          $scope.strength = "**";
        }
        if (!new RegExp("[a-z]").test($scope.userchangepassword.password1)) {
          $scope.strength2 = true;
          $scope.strength = "**";
        }
        if (!new RegExp("[0-9]").test($scope.userchangepassword.password1)) {
          $scope.strength3 = true;
          $scope.strength = "**";
        }
        if (
          !new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\]{}/^_`|~])").test(
            $scope.userchangepassword.password1
          )
        ) {
          $scope.strength4 = true;
          if ($scope.administrator) {
            $scope.strength = "**";
          }
        }

        var regex = new Array();
        regex.push("[A-Z]"); //Uppercase Alphabet.
        regex.push("[a-z]"); //Lowercase Alphabet.
        regex.push("[0-9]"); //Digit.
        regex.push("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\]{}/^_`|~])"); //Special Character.
        var passed = 0;
        //Validate for each Regular Expression.
        for (var i = 0; i < regex.length; i++) {
          if (new RegExp(regex[i]).test($scope.userchangepassword.password1)) {
            passed++;
          }
        }
        //Validate for length of Password.
        if (
          passed > 2 &&
          $scope.userchangepassword.password1.length >= $scope.lettersize
        ) {
          passed++;
        }
        //Display status.
        if (passed == 1) {
          $scope.strengthlabel = $filter("translate")("1080");
          $scope.color = "red";
          $scope.data = "0";
        } else if (passed == 2) {
          $scope.color = "orangered";
          $scope.strengthlabel = $filter("translate")("1081");
          $scope.data = "1";
        } else if (passed == 3) {
          $scope.color = "orange";
          $scope.strengthlabel = $filter("translate")("1082");
          $scope.data = "2";
        } else if (passed == 4) {
          $scope.color = "yellowgreen";
          $scope.strengthlabel = $filter("translate")("1083");
          $scope.data = "3";
        } else if (passed == 5) {
          $scope.color = "green";
          $scope.strengthlabel = $filter("translate")("1084");
          $scope.data = "4";
        }
      }
    };
    $scope.changepassword = function () {
      $scope.viewvalited = false;
      if (
        $scope.strength === "" &&
        $scope.userchangepassword.password1 ===
          $scope.userchangepassword.password2
      ) {
        if ($scope.userchangepassword.password1 === password) {
          $scope.viewvalited = true;
        } else {
          var user = {
            idUser: id,
            userName: username,
            passwordOld: password,
            passwordNew: $scope.userchangepassword.password1,
          };
          return userDS.changepasswordexpirit(user).then(
            function (data) {
              if (data.status === 200) {
                $element.modal("hide");
                $scope.close("Si");
              }
            },
            function (error) {
              if (error.data.errorFields !== "") {
                error.data.errorFields.forEach(function (value) {
                  var item = value.split("|");
                  if (item[0] === "1") {
                    $scope.viewvalited = true;
                  }
                });
              }
            }
          );
        }
      }
    };
  }
})();
