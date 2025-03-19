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
    "$mdDateLocale",
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
    $mdDateLocale
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
    // vm.user.location = 1;
    $rootScope.menu = false;
    vm.userchangepassword = {};
    vm.userchangepassword.password2 = "";
    vm.userchangepassword.password1 = "";
    $rootScope.NamePage = "";

    vm.getBranch();

    vm.errorservice = 0;
    vm.getkeyconfigure = getkeyconfigure;
    vm.getuserdetail = getuserdetail;

    vm.modalError = modalError;
    vm.changepassword = changepassword;
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
    vm.langSwitcherModel =
      $filter("translate")("0000") === "esCo" ? "es" : "en";
    var langData = (vm.langSwitcherOptions = [{
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

    var validsession = localStorageService.get("sessionExpired");
    if (validsession) {
      vm.PopupError = true;
      vm.Error = {
        status: 0,
        session: true,
      };
      localStorageService.set("sessionExpired", false);
    } else {
      vm.PopupError = false;
    }
    localStorage.clear();

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.PopupError = true;
      vm.Error = error;
    }

    /*performs login operation */
    function login(formpassword) {  
      vm.loadingdata = true;
      vm.invalidUser = false;
      vm.invalidDate = false;
      vm.menssageInvalid = "";      
      vm.messagemodificationpassword = ""; 
      if(vm.Branch!==undefined){
        if (vm.user.username && vm.user.password) {
          vm.user.location = vm.Branch.id;
          return authService.login(vm.user).then(
            function (data) {
              if (data.status === 200) {
                localStorageService.set("Branchname", vm.Branch.name);
                vm.loadingdata = false;
                vm.Alerts = [];
                vm.cantmessage = 0;
                vm.alertcant = 0;
                $rootScope.photo = "";
                vm.photo = "";
                vm.reasonBreakSelected = null;
                vm.user = data.data.user;
                $state.go("dashboard");
                vm.getkeyconfigure(data.data.token);
              }
            },
            function (error) {
              vm.menssageInvalid = "";
              vm.Repeat = false;
              vm.loadingdata = false;
              if (error.data !== null) {
                if (error.data.message === "timeout") {
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
                    vm.menssageInvalid = $filter("translate")("1457");
                  } else  if ( error.data.errorFields[0] === "Password incorrecto") {
                     vm.Repeat = true;
                    vm.menssageInvalid = $filter("translate")("1512");
                  } else {
                    error.data.errorFields.forEach(function (value) {
                      var item = value.split("|");
                      if (
                        item[0] === "1" &&
                        item[1] ===
                        "LDAP The authentication is not supported by the server"
                      ) {
                        vm.menssageInvalid = $filter("translate")("1511");
                      }
                      if (
                        item[0] === "2" &&
                        item[1] === "Incorrect password or username LDAP"
                      ) {
                        vm.menssageInvalid = $filter("translate")("1512");
                      }
                      if (item[0] === "3" && item[1] === "LDAP fail conection") {
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
                      if (item[0] === "5") {
                        vm.menssageInvalid = $filter("translate")("0068");
                        vm.Repeat = true;
                      }
                      if (item[0] === "3") {
                        vm.menssageInvalid = "";
                        vm.menssageInvalid = $filter("translate")("1473");
                        vm.Repeat = true;
                      }
                      if (item[0] === "6") {
                        vm.Repeat = true;
                        if (item[1] === "password expiration date") {
                          formpassword.$setPristine();
                          formpassword.$setUntouched();
                          vm.menssageInvalid = 'La contraseña a Expirado';
                         /*  vm.invalidUser = false;
                          vm.invalidDate = false;
                          vm.menssageInvalid = "";
                          vm.userchangepassword = {
                            password1: "",
                            password2: "",
                          };
                          vm.changepasswordview(item[2]);
                          vm.administrator = item[3] === "true"; */
                        } else {
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
                           vm.menssageInvalid = 'Debe cambiar de contraseña';
                          //vm.changepasswordview(item[2]);
                          vm.administrator = item[3] === "true";
                        }
                      }
                    });
                  }
                }
              }
              if (
                vm.Repeat === false &&
                vm.menssageInvalid !== "No hay conexión con la llave de seguridad"
              ) {
                vm.Error = error;
                vm.PopupError = true;
              }
            }
          );
        } else {
          logger.info("Complete los datos");
          vm.loadingdata = false;
        }
      } else {
        logger.info("Complete los datos");
        vm.loadingdata = false;
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
      return branchDS.getBranchAutenticate().then(
        function (data) {
          if (data.status === 200) {
            vm.ListBranch = data.data;
            vm.Branch = vm.ListBranch[0];
            if (data.data.length > 1) {
              vm.visibleBranch = true;
            }
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
          if(data.data !==''){
          data.data.forEach(function (value, key) {
            return localStorageService.set(value.key, value.value);
          });
          }
          vm.getuserdetail(token);
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

    function getBranchUsername(username) {
      return branchDS.getBranchUsername(username).then(
        function (data) {
          if (data.status === 200) {
            vm.ListBranch = data.data;
            vm.Branch = vm.ListBranch[0];
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

    function changeLanguage(langKey) {
      $translate.use(vm.langSwitcherModel);
      if (vm.langSwitcherModel === "es") {
        moment.locale("es");
        var localeDate = moment.localeData();
        $mdDateLocale.months = localeDate._months;
        $mdDateLocale.shortMonths = moment.monthsShort();
        $mdDateLocale.days = localeDate._weekdays;
        $mdDateLocale.shortDays = localeDate._weekdaysMin;
        // Optionaly let the week start on the day as defined by moment's locale data
        $mdDateLocale.firstDayOfWeek = localeData._week.dow;
      } else {
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
