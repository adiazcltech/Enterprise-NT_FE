/* jshint ignore:start */
(function () {
  "use strict";

  angular.module("app.account").controller("LoginController", LoginController);

  LoginController.$inject = [
    "authService",
    "branchDS",
    "userDS",
    "logger",
    "$state",
    "$translate",
    "localStorageService",
    "$filter",
    "$rootScope",
    "configurationDS",
    "sigaDS",
    "$mdDateLocale",
    "socket",
    "securityDS",
  ];

  /* @ngInject */
  function LoginController(
    authService,
    branchDS,
    userDS,
    logger,
    $state,
    $translate,
    localStorageService,
    $filter,
    $rootScope,
    configurationDS,
    sigaDS,
    $mdDateLocale,
    socket,
    securityDS
  ) {
    var vm = this;
    var dataAuth = localStorageService.get("Enterprise_NT.authorizationData");
    if (dataAuth && dataAuth.authToken) {
      // Redirigir a otra página si ya está autenticado
      securityDS
        .validateToken(dataAuth.authToken)
        .then(function (response) {
          if (
            response.status === 200 &&
            response.data.message === "Authorized"
          ) {
            console.log("response", response);
            $state.go("dashboard");
            return;
          }
          if (response.status === 401) {
            localStorageService.remove("Enterprise_NT.authorizationData");
            return;
          }
        })
        .catch(function () {
          localStorageService.remove("Enterprise_NT.authorizationData");
        });
    }
    vm.title = "Login";
    vm.login = login;
    vm.getBranch = getBranch;
    vm.user = {};
    $rootScope.pageview = 1;
    vm.changeLanguage = changeLanguage;
    vm.getBranchUsername = getBranchUsername;
    vm.visibleBranch = false;
    vm.invalidUser = false;
    vm.invalidDate = false;
    $rootScope.menu = false;
    vm.passwordrecovery = false;
    vm.typepassword = "password";
    vm.userchangepassword = {};
    vm.userchangepassword.password2 = "";
    vm.userchangepassword.password1 = "";
    $rootScope.NamePage = "";
    vm.getPointall = getPointall;
    vm.getdatasiga = getdatasiga;
    vm.getBranch();
    vm.errorservice = 0;
    vm.getkeyconfigure = getkeyconfigure;
    vm.getuserdetail = getuserdetail;
    vm.modalError = modalError;
    vm.changepassword = changepassword;
    vm.afterLogin = afterLogin;
    vm.getpasswordrecovery = getpasswordrecovery;
    vm.CheckStrngth = CheckStrngth;
    vm.strength = "";
    vm.strengthlabel = "Weak";
    vm.color = "#999";
    vm.strength0 = true;
    vm.strength1 = true;
    vm.strength2 = true;
    vm.strength3 = true;
    vm.strength4 = true;
    vm.changepasswordview = changepasswordview;
    vm.savepasswordrecovery = savepasswordrecovery;
    vm.changepasswordrecovery = changepasswordrecovery;
    UIkit.slider("#viewerror", {
      autoplay: true,
      animation: "scroll",
      pauseOnHover: true,
      duration: 1000,
      autoplayInterval: 12000,
    });
    vm.usersOnline = [];
    vm.langSwitcherModel =
      $filter("translate")("0000") === "esCo" ? "es" : "en";
    var langData = (vm.langSwitcherOptions = [
      {
        id: 1,
        title: "English",
        value: "en",
        icon: "images/login/us.svg",
      },
      {
        id: 6,
        title: "Spanish",
        value: "es",
        icon: "images/login/es.svg",
      },
    ]);
    vm.langSwitcherConfig = {
      maxItems: 1,
      render: {
        option: function (langData, escape) {
          return (
            "<div>" +
            '<img style="height: 20px; width:25px; margin-right:21px"  src="' +
            escape(langData.icon) +
            '">' +
            "<span>" +
            escape(langData.title) +
            "</span>" +
            "</div>"
          );
        },
        item: function (langData, escape) {
          return (
            '<div class="item"><img style="height: 20px; width:25px; margin-right:21px"  src="' +
            escape(langData.icon) +
            '"></div>'
          );
        },
      },
      valueField: "value",
      labelField: "title",
      searchField: "title",
      create: false,
      onInitialize: function (selectize) {
        $("#lang_switcher")
          .next()
          .children(".selectize-input")
          .find("input")
          .attr("readonly", true);
      },
    };

    localStorage.clear();

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.PopupError = true;
      vm.Error = error;
    }
    /*performs login operation */
    function login(formpassword) {
      localStorage.clear();
      vm.pointSigaSelected = null;
      vm.reasonBreakSelected = null;
      vm.stateTurnSiga = 0;
      $rootScope.dataturn = null;
      localStorageService.set("Branchname", vm.Branch.name);
      vm.user.location = vm.Branch.id;
      vm.loadingdata = true;
      vm.invalidUser = false;
      vm.invalidDate = false;
      vm.menssageInvalid = "";
      vm.messagemodificationpassword = "";
      if (vm.user.username && vm.user.password) {
        return authService.login(vm.user).then(
          function (data) {
            if (data.data.success) {
              vm.loadingdata = false;
              vm.user = data.data.user;
              vm.getkeyconfigure(data.data.token);
              setTimeout(function () {
                vm.afterLogin(data);
              }, 200);
            }
          },
          function (error) {
            vm.menssageInvalid = "";
            vm.Repeat = false;
            vm.loadingdata = false;
            if (error.data !== null) {
              if (error.data.message === "timeout") {
                vm.Repeat = true;
                vm.menssageInvalid = $filter("translate")("1449");
              } else if (
                error.data.errorFields === null &&
                error.data.message !== "timeout"
              ) {
                vm.Error = error;
                vm.PopupError = true;
              } else {
                if (
                  error.data.errorFields[0] ===
                  "La licencia registrada ha expirado."
                ) {
                  vm.Repeat = true;
                  vm.menssageInvalid = $filter("translate")("1457");
                } else {
                  error.data.errorFields.forEach(function (value) {
                    var item = value.split("|");
                    if (item[0] === "7" && item[1] === "invalid branche") {
                      vm.Repeat = true;
                      vm.menssageInvalid = $filter("translate")("1585");
                    }
                    if (
                      item[0] === "1" &&
                      item[1] ===
                        "LDAP The authentication is not supported by the server"
                    ) {
                      vm.Repeat = true;
                      vm.menssageInvalid = $filter("translate")("1511");
                    }
                    if (
                      item[0] === "2" &&
                      item[1] === "Incorrect password or username LDAP"
                    ) {
                      vm.Repeat = true;
                      vm.menssageInvalid = $filter("translate")("1512");
                    }
                    if (item[0] === "3" && item[1] === "LDAP fail conection") {
                      vm.Repeat = true;
                      vm.menssageInvalid = $filter("translate")("1513");
                    }
                    if (item[0] === "4") {
                      if (item[1] === "inactive user") {
                        vm.menssageInvalid = $filter("translate")("1474");
                      } else {
                        vm.menssageInvalid = $filter("translate")("0067");
                      }
                      vm.Repeat = true;
                    }
                    if (item[0] === "3") {
                      vm.menssageInvalid = $filter("translate")("2086");
                      vm.Repeat = true;
                      UIkit.modal("#modalremenber").show();
                    }
                    if (item[0] === "5") {
                      if (item[2] !== undefined) {
                        if (item[2] === "1") {
                          vm.menssageInvalid =
                            $filter("translate")("1884") +
                            " 2 " +
                            $filter("translate")("1885");
                          vm.Repeat = true;
                        } else if (item[2] === "2") {
                          vm.menssageInvalid =
                            $filter("translate")("1884") +
                            " 1 " +
                            $filter("translate")("2082");
                          vm.Repeat = true;
                        } else if (item[2] === "3") {
                          vm.menssageInvalid = $filter("translate")("2086");
                          vm.Repeat = true;
                        } else {
                          vm.menssageInvalid =
                            $filter("translate")("1884") +
                            item[2] +
                            $filter("translate")("1885");
                          vm.Repeat = true;
                        }
                      } else {
                        vm.menssageInvalid = $filter("translate")("1886");
                        vm.Repeat = true;
                      }
                      UIkit.modal("#modalremenber").show();
                    }
                    if (item[0] === "6") {
                      vm.Repeat = true;
                      if (item[1] === "password expiration date") {
                        formpassword.$setPristine();
                        formpassword.$setUntouched();
                        vm.invalidUser = false;
                        vm.invalidDate = false;
                        vm.menssageInvalid = "";
                        vm.userchangepassword = {
                          password1: "",
                          password2: "",
                        };
                        vm.changepasswordview(item[2]);
                        vm.administrator = item[3] === "true";
                      } else {
                        vm.Repeat = true;
                        vm.menssageInvalid = $filter("translate")("1124");
                      }
                    }
                    if (item[0] === "7") {
                      vm.Repeat = true;
                      if (item[1] === "change password") {
                        vm.menssageInvalid = "";
                        vm.userchangepassword = {
                          password1: "",
                          password2: "",
                        };
                        vm.changepasswordview(item[2]);
                        vm.administrator = item[3] === "true";
                      } else if (item[1] === "recovery password") {
                        vm.Repeat = true;
                        vm.menssageInvalid = "";
                        vm.userchangepassword = {
                          password1: "",
                          password2: "",
                        };
                        vm.changepasswordview(item[2]);
                        vm.administrator = item[3] === "true";
                      }
                    }
                    if (item[0] === "9" && item[1] === "First time login") {
                      vm.Repeat = true;
                      vm.menssageInvalid = "";
                      vm.userchangepassword = {
                        password1: "",
                        password2: "",
                      };
                      vm.changepasswordview(item[2]);
                      vm.administrator = item[3] === "true";
                    }
                  });
                }
              }
            }
            if (
              (vm.Repeat === false &&
                vm.menssageInvalid !==
                  "No hay conexión con la llave de seguridad") ||
              vm.Repeat === false
            ) {
              vm.Error = error;
              vm.PopupError = true;
            }
          }
        );
      } else {
        logger.info("the form is uncomplete");
        vm.loadingdata = false;
      }
    }
    function afterLogin(data) {
      vm.Alerts = [];
      vm.cantmessage = 0;
      vm.alertcant = 0;
      $rootScope.photo = "";
      vm.photo = "";
      vm.info = data.data;
      // validación e las llaves
      if (vm.info.user.licenses.product === false) {
        vm.menssageInvalid = $filter("translate")("1445");
      } else if (
        vm.info.user.licenses.LIS === false &&
        vm.info.user.licenses.PAT === false &&
        vm.info.user.licenses.MMB === false
      ) {
        vm.menssageInvalid = $filter("translate")("1446");
      } else if (vm.info.user.licenses.branch === false) {
        vm.menssageInvalid = $filter("translate")("1447");
      } else if (vm.info.user.licenses.user === false) {
        vm.menssageInvalid = $filter("translate")("1448");
      } else {
        localStorageService.set("LIS", vm.info.user.licenses.LIS);
        localStorageService.set("PAT", vm.info.user.licenses.PAT);
        localStorageService.set("MMB", vm.info.user.licenses.MMB);
        localStorageService.set("NUM", vm.info.user.licenses.NUM);
        localStorageService.set("FAC", vm.info.user.licenses.FAC);
        vm.Alerts = [];
        vm.cantmessage = 0;
        vm.alertcant = 0;
        $rootScope.photo = "";
        vm.photo = "";
        vm.user = vm.info.user;
        $state.go("dashboard");
      }
    }
    function changepasswordview(id) {
      return configurationDS.getsecurity().then(
        function (data) {
          vm.keySecurityPolitics = data.data.value === "True" ? true : false;
          vm.idchangepassword = parseInt(id);
          vm.lettersize = vm.administrator ? 12 : 9;
          vm.strength0 = true;
          vm.strength1 = true;
          vm.strength2 = true;
          vm.strength3 = true;
          vm.strength4 = true;
          vm.data = "";
          vm.color = "#999";
          vm.strength = "";
          vm.messageerrorpassword = "";
          vm.strengthlabel = $filter("translate")("1458");
          if (vm.keySecurityPolitics) {
            UIkit.modal("#modalchangepassword1", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
          } else {
            UIkit.modal("#modalchangepassword", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.Error = error;
          vm.PopupError = true;
        }
      );
    }
    function CheckStrngth() {
      vm.viewvalited = false;
      vm.strength0 = false;
      vm.strength1 = false;
      vm.strength2 = false;
      vm.strength3 = false;
      vm.strength4 = false;
      vm.strength = "";
      vm.strengthlabel = $filter("translate")("1458");
      if (vm.userchangepassword.password1 === undefined) {
        vm.strengthlabel = $filter("translate")("1458");
        vm.data = "";
        vm.color = "#999";
        vm.strength = "**";
        vm.strength0 = true;
        vm.strength1 = true;
        vm.strength2 = true;
        vm.strength3 = true;
        vm.strength4 = true;
      }

      if (vm.userchangepassword.password1 !== undefined) {
        vm.data = "";
        vm.strengthlabel = $filter("translate")("1458");
        if (vm.userchangepassword.password1.length < vm.lettersize) {
          vm.strength0 = true;
          vm.strength = "**";
        }
        if (!new RegExp("[A-Z]").test(vm.userchangepassword.password1)) {
          vm.strength1 = true;
          vm.strength = "**";
        }
        if (!new RegExp("[a-z]").test(vm.userchangepassword.password1)) {
          vm.strength2 = true;
          vm.strength = "**";
        }
        if (!new RegExp("[0-9]").test(vm.userchangepassword.password1)) {
          vm.strength3 = true;
          vm.strength = "**";
        }
        if (
          !new RegExp("^(?=.*[!#$%&'()*+,-.:;<=>?¿¡°@[\\]{}/^_`|~])").test(
            vm.userchangepassword.password1
          )
        ) {
          vm.strength4 = true;
          if (vm.administrator) {
            vm.strength = "**";
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
          if (new RegExp(regex[i]).test(vm.userchangepassword.password1)) {
            passed++;
          }
        }
        //Validate for length of Password.
        if (
          passed > 2 &&
          vm.userchangepassword.password1.length >= vm.lettersize
        ) {
          passed++;
        }
        //Display status.
        if (passed === 1) {
          vm.strengthlabel = $filter("translate")("1458");
          vm.color = "red";
          vm.data = "0";
        } else if (passed === 2) {
          vm.color = "orangered";
          vm.strengthlabel = $filter("translate")("1459");
          vm.data = "1";
        } else if (passed === 3) {
          vm.color = "orange";
          vm.strengthlabel = $filter("translate")("1460");
          vm.data = "2";
        } else if (passed === 4) {
          vm.color = "yellowgreen";
          vm.strengthlabel = $filter("translate")("1461");
          vm.data = "3";
        } else if (passed === 5) {
          vm.color = "green";
          vm.strengthlabel = $filter("translate")("1462");
          vm.data = "4";
        }
      }
    }
    function getBranch() {
      return branchDS.getConfig().then(
        function (data) {
          vm.viewbranch = data.data.value === "True" ? true : false;
          return branchDS.getBranchAutenticate().then(
            function (data) {
              vm.getpasswordrecovery();
              if (data.status === 200) {
                Scrollbar.use(OverscrollPlugin);
                Scrollbar.init(document.getElementById("my-scrollbar"));
                vm.ListBranch = $filter("orderBy")(data.data, "name");
                if (!vm.viewbranch) {
                  vm.Branch = vm.ListBranch[0];
                }
                if (data.data.length > 1) {
                  vm.visibleBranch = true;
                }
              }
            },
            function (error) {
              vm.modalError(error);
            }
          );
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getpasswordrecovery() {
      vm.passwordrecovery = false;
      return configurationDS.getpasswordrecovery().then(
        function (data) {
          if (data.status === 200) {
            vm.passwordrecovery = data.data.value === "True" ? true : false;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getkeyconfigure(token) {
      return configurationDS.getConfiguration(token).then(
        function (data) {
          data.data.forEach(function (value, key) {
            localStorageService.set("stateTurnSig", 0);            
            if (value.key === "socket" && value.value === "True") {
              /*SOCKET I.O*/
              try {
                socket.on("init", function (data) {
                  vm.usersOnline = data;
                });
              } catch (error) {
                logger.info($filter("translate")("1851"));
              }
            }
            localStorageService.set(value.key, value.value);
          });
          vm.getuserdetail(token);
          var IntegracionSIGA = _.filter(data.data, function (o) {
            return o.key == "IntegracionSIGA";
          });
          if (IntegracionSIGA.length !== 0) {
            if(IntegracionSIGA[0].value==="True"){
              vm.getdatasiga(token, data);
            }
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getuserdetail(token) {
      return userDS.getUsersId(token, vm.user.id).then(
        function (data) {
          if (data.status === 200) {
            localStorageService.set("user", data.data);
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getdatasiga(token, data) {
      var urlSiga = "";
      var manejodesigaporsede = _.filter(data.data, function (o) {
        return o.key == "manejodesigaporsede";
      });
      if (manejodesigaporsede.length === 0) {
        urlSiga = _.filter(data.data, function (o) {
          return o.key == "UrlSIGA";
        })[0].value;
      } else if (manejodesigaporsede[0].value === "False") {
        urlSiga = _.filter(data.data, function (o) {
          return o.key == "UrlSIGA";
        })[0].value;
      } else {
        var configuraciondesigaporsede = _.filter(data.data, function (o) {
          return o.key == "configuraciondesigaporsede";
        });
        var configuraciondesigaporsede = JSON.parse(
          configuraciondesigaporsede[0].value
        );
       // configuraciondesigaporsede[0].branchsiga.name = "Aida Ascencio";
        var namebranchlogin = _.toUpper(_.replace(vm.Branch.name, /\s+/g, ""));
        configuraciondesigaporsede = _.filter(
          configuraciondesigaporsede,
          function (o) {
            return (
              _.toUpper(_.replace(o.branchsiga.name, /\s+/g, "")) ==
              namebranchlogin
            );
          }
        );
        if (configuraciondesigaporsede.length === 0) {
          localStorageService.set("IntegracionSIGA", "False");
        } else {
          urlSiga = configuraciondesigaporsede[0].urlsiga;
          localStorageService.set("UrlSIGA", urlSiga);
          localStorageService.set("SedeSIGA", configuraciondesigaporsede[0].branchsiga.id);
          localStorageService.set("OrdenesSIGA", configuraciondesigaporsede[0].order===undefined ? "" : configuraciondesigaporsede[0].order);
          localStorageService.set("VerificacionSIGA", configuraciondesigaporsede[0].entry===undefined ? "" : configuraciondesigaporsede[0].entry);
        }
      }
      if (urlSiga !== "") {
        return sigaDS.getUserHistory(token, vm.user.userName, urlSiga).then(
          function (data) {
            if (data.status === 200) {
              if (data.data.logUserInPoint === undefined) {
                localStorageService.set("dataviewsiga", false);
                localStorageService.set("stateTurnSiga", 0);
              } else {
                localStorageService.set("dataviewsiga", true);
                localStorageService.set("viewsiga", data.data);
                if (
                  localStorageService.get("viewsiga").turnInPoint !== undefined
                ) {
                  var pointSiga =
                    localStorageService.get("viewsiga").turnInPoint.point;
                  localStorageService.set("pointSiga", pointSiga);
                  localStorageService.set("stateTurnSiga", 1);
                  if (localStorageService.get("OrdenesSIGA") !== "") {
                    if (
                      parseInt(localStorageService.get("OrdenesSIGA")) ===
                      pointSiga.service.id
                    ) {
                      localStorageService.set("moduleSiga", 1);
                    }
                  }
                  if (localStorageService.get("VerificacionSIGA") !== "") {
                    if (
                      parseInt(localStorageService.get("VerificacionSIGA")) ===
                      pointSiga.service.id
                    ) {
                      localStorageService.set("moduleSiga", 2);
                    }
                  }
                } else {
                  vm.getPointall(token);
                }
              }
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }
    function getPointall(token) {
      return sigaDS.getPointall(token).then(
        function (data) {
          if (data.status === 200) {
            var point =
              localStorageService.get("viewsiga").logUserInPoint.point.id;
            var pointSiga = _.filter(data.data, function (o) {
              return o.id === point;
            })[0];
            localStorageService.set("pointSiga", pointSiga);
            localStorageService.set("stateTurnSiga", 1);
            if (localStorageService.get("OrdenesSIGA") !== "") {
              if (
                parseInt(localStorageService.get("OrdenesSIGA")) ===
                pointSiga.service.id
              ) {
                localStorageService.set("moduleSiga", 1);
              }
            }
            if (localStorageService.get("VerificacionSIGA") !== "") {
              if (
                parseInt(localStorageService.get("VerificacionSIGA")) ===
                pointSiga.service.id
              ) {
                localStorageService.set("moduleSiga", 2);
              }
            }
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function getBranchUsername(username) {
      return branchDS.getBranchUsername(username).then(
        function (data) {
          if (data.status === 200) {
            vm.ListBranch = $filter("orderBy")(data.data, "name");
            if (!vm.viewbranch) {
              vm.Branch = vm.ListBranch[0];
            }
          } else {
            vm.getBranch();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function changepassword(form) {
      vm.viewvalited = false;
      if (
        vm.strength === "" &&
        vm.userchangepassword.password1 === vm.userchangepassword.password2
      ) {
        if (
          vm.userchangepassword.password1 === vm.userchangepassword.passwordOld
        ) {
          vm.viewvalited = true;
        } else {
          var user = {
            idUser: vm.idchangepassword,
            userName: vm.user.username,
            passwordOld: vm.user.password,
            passwordNew: vm.userchangepassword.password1,
          };
          return userDS.changepasswordexpirit(user).then(
            function (data) {
              if (data.status === 200) {
                if (vm.keySecurityPolitics) {
                  UIkit.modal("#modalchangepassword1").hide();
                } else {
                  UIkit.modal("#modalchangepassword").hide();
                }

                logger.success($filter("translate")("1123"));
                vm.user.password = "";
              }
            },
            function (error) {
              error.data.errorFields.forEach(function (value) {
                var item = value.split("|");
                if (item[0] === "1") {
                  vm.viewvalited = true;
                }
              });
            }
          );
        }
      }
    }
    function changepasswordrecovery(Form) {
      Form.$setUntouched();
      vm.usernamerecovery = "";
      vm.emailrecovery = "";
      vm.messagerecoverpassword = "";
      UIkit.modal("#modalpasswordrecovery", {
        bgclose: false,
        escclose: false,
        modal: false,
      }).show();
    }
    function savepasswordrecovery(Form) {
      vm.loadingdata = true;
      vm.messagerecoverpassword = "";
      Form.usernamerecovery.$touched = true;
      Form.emailrecovery.$touched = true;
      if (Form.$valid) {
        var user = {
          userName: vm.usernamerecovery,
          email: vm.emailrecovery,
        };
        return userDS.recoverpassword(user).then(
          function (data) {
            vm.loadingdata = false;
            if (data.status === 200) {
              UIkit.modal("#modalpasswordrecovery").hide();
              logger.success($filter("translate")("1856"));
            }
          },
          function (error) {
            vm.loadingdata = false;
            error.data.errorFields.forEach(function (value) {
              var item = value.split("|");
              if (item[0] === "1") {
                vm.messagerecoverpassword = $filter("translate")("1858");
              }
            });
          }
        );
      }
    }
    function changeLanguage(langKey) {
      $translate.use(vm.langSwitcherModel);
      if (vm.langSwitcherModel === "es") {
        kendo.culture("es-ES");
        moment.locale("es");
        var localeDate = moment.localeData();
        $mdDateLocale.months = localeDate._months;
        $mdDateLocale.shortMonths = moment.monthsShort();
        $mdDateLocale.days = localeDate._weekdays;
        $mdDateLocale.shortDays = localeDate._weekdaysMin;
        // Optionaly let the week start on the day as defined by moment's locale data
        $mdDateLocale.firstDayOfWeek = localeData._week.dow;
      } else {
        kendo.culture("en-US");
        moment.locale("en");
        var localeDate = moment.localeData();
        $mdDateLocale.months = localeDate._months;
        $mdDateLocale.shortMonths = moment.monthsShort();
        $mdDateLocale.days = localeDate._weekdays;
        $mdDateLocale.shortDays = localeDate._weekdaysMin;
        // Optionaly let the week start on the day as defined by moment's locale data
        $mdDateLocale.firstDayOfWeek = localeData._week.dow;
      }
    }
  }
})();
/* jshint ignore:end */
