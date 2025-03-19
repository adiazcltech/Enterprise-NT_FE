/* jshint ignore:start */
(function () {
  "use strict";
  angular
    .module("app.layout")
    .controller("SidebarController", SidebarController)
    .config(function (IdleProvider, KeepaliveProvider) {
      IdleProvider.idle(5);
      IdleProvider.timeout(5);
      KeepaliveProvider.interval(10);
    })
    .filter("trust", [
      "$sce",
      function ($sce) {
        return function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
        };
      },
    ]);
  SidebarController.$inject = [
    "$state",
    "$rootScope",
    "localStorageService",
    "$filter",
    "$websocket",
    "settings",
    "$scope",
    "Idle",
    "authenticationsessionDS",
  ];
  /* @ngInject */
  function SidebarController(
    $state,
    $rootScope,
    localStorageService,
    $filter,
    $websocket,
    settings,
    $scope,
    Idle,
    authenticationsessionDS
  ) {
    var vm = this;
    vm.menu = $rootScope.menu;
    vm.getUserIP = getUserIP;
    vm.isAuthenticate = isAuthenticate;
    vm.openwebservice = openwebservice;
    vm.closesocket = closesocket;
    vm.alertcant = 0;
    vm.viewuser = true;
    vm.receivermessageChat = receivermessageChat;
    $rootScope.shortcuts = [];
    $rootScope.serialprint = '';
    vm.closeSession = closeSession;
    vm.search = [];
    vm.session = null;
    localStorage.setItem("altair_sidebar_slim", "1");
    localStorage.removeItem("altair_sidebar_mini");
    vm.getUserIP();
    vm.cantprueba = 0;
    vm.time = 1514782800000;
    vm.mainSearch = true;
    vm.principalmenu = true;
    vm.sSidebar_users = [];
    vm.messagesuser = [];
    vm.listmenssage = [];
    vm.userdisconnected = [];
    vm.userwithmessage = [];
    vm.cantmessage = 0;
    vm.openhelp = openhelp;
    vm.openmodalSerial = openmodalSerial;
    vm.modalError = modalError;
    vm.searchSerial = searchSerial;
    vm.updateSerial = updateSerial;
    vm.showMotiveBreak = false;
    vm.reasonBreakSelected = null;
    vm.printadvertence = "!";
    vm.seriallabel = "";
    vm.closedacess = closedacess;
    //vm.openwebservice();
    vm.searchSerial(1);


    $scope.$on("IdleStart", function () {});

    $scope.$on("IdleEnd", function () {});

    $scope.$on("IdleTimeout", function () {
      document.title = "EnterpriseNT";
      localStorageService.set("sessionExpired", true);
      vm.closesocket();
    });

    $rootScope.$watch(function () {
      vm.menu = $rootScope.menu;
      vm.branchname = localStorageService.get("Branchname");
      vm.NamePage = $rootScope.NamePage;
      vm.helpReference = $rootScope.helpReference;
      vm.idpage = $state.current.idpage;
      if (!vm.menu) {
        Idle.unwatch();
      }
    });

    $rootScope.$watch("photo", function () {
      vm.photo =
        $rootScope.photo === "" || $rootScope.photo === undefined ?
        "images/user.png" :
        "data:image/jpeg;base64," + $rootScope.photo;
      localStorage.setItem("altair_sidebar_slim", "1");
      localStorage.removeItem("altair_sidebar_mini");
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth !== null && vm.menu) {
        vm.viewconfig = auth.administrator;
        setTimeout(function () {
      /*    var time =
            parseInt(localStorageService.get("SessionExpirationTime")===NaN?60:localStorageService.get("SessionExpirationTime")) * 60;  */

          var time = 60 * 60; 
          Idle.setIdle(time);
          Idle.setTimeout(20);
          Idle.watch();
        }, 3000);
      }

      if (vm.session === null && auth !== null) {
        Idle.setIdle(60 * 60)
        //vm.openwebservice();
      /*   Idle.setIdle(
          parseInt(localStorageService.get("SessionExpirationTime")===NaN? 60 : localStorageService.get("SessionExpirationTime")) * 60
        ); */
        Idle.setTimeout(20);
        Idle.watch();
      }
    });

    $rootScope.$watch("ws", function () {
      vm.receivermessageChat();
    });

    function openmodalSerial() {
      UIkit.modal("#modaleditserial").show();
    }

    function closedacess() {
      UIkit.modal("#modaleditserial").show();
    }

    function updateSerial() {
      var deleteRequest = indexedDB.deleteDatabase("serialDatabase");
      var request = indexedDB.open("serialDatabase");
      request.onupgradeneeded = function (event) {
        var store = event.currentTarget.result.createObjectStore(
          "serialTable", {
            keyPath: "id",
            autoIncrement: true
          }
        );
        store.createIndex("serial", "serial", {
          unique: true
        });
        store.add({
          serial: vm.serialPrint
        });
        $rootScope.serialprint = vm.serialPrint;
        vm.seriallabel = vm.serialPrint;
        UIkit.modal("#modaleditserial").hide();
      };
      request.onerror = function (evt) {
        consolelog("Navegador no soporta indexDB");
      };
    }

    function searchSerial(transaction) {
      var request = indexedDB.open("serialDatabase");
      request.onsuccess = function (event) {
        var result = event.target.result;
        try {
          var transaction = result.transaction(["serialTable"]);
          var object_store = transaction.objectStore("serialTable");
          var req = object_store.getAll();

          req.onsuccess = function (event) {
            $rootScope.serialprint = req.result[0].serial;
            vm.serialPrint = req.result[0].serial;
            vm.seriallabel = req.result[0].serial;
          };
          req.onerror = function (event) {
            console.err("error fetching data");
          };
        } catch (error) {
          $rootScope.serialprint = "";
          vm.serialPrint = "";
          vm.seriallabel = "";
        }
      };
      request.onerror = function (event) {
        consolelog("Navegador no soporta indexDB");
      };
    }

    function openwebservice(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth !== null) {
        $rootScope.ws = $websocket(settings.serviceUrlSocket + "/chat");
        $rootScope.reconnectIfNotNormalClose = true;
        $rootScope.ws.onError(function (event) {
          console.log("connection Error", event);
        });
        $rootScope.ws.onClose(function (event) {
          console.log("connection closed", event);
        });
        $rootScope.ws.onOpen(function () {
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          if (auth !== null) {
            var msg = {
              receivers: [],
              sender: auth.userName,
              type: 0,
              message: "Hola",
              branch: auth.branch,
              ip: $rootScope.ipUser,
            };
            $rootScope.ws.send(JSON.stringify(msg));
          }
        });
      }
    }

    function receivermessageChat() {
      vm.viewuser = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if ($rootScope.ws !== undefined)
        $rootScope.ws.onMessage(function (event) {
          vm.userdisconnected = [];
          vm.userwithmessage = [];
          var response;
          try {
            response = angular.fromJson(event.data);
            vm.userwithmessage = $filter("filter")(vm.sSidebar_users, {
              cant: "!0",
            });
            if (response.code === "3" && response.message === "El usuario se conecto") {
              vm.session = response.idSession;
            }
            if (response.code === "0" && response.sender === auth.userName) {
              if (response.idSession === vm.session) {
                $state.go("login");
              }
            }
            if (response.code === "0") {
              vm.userdisconnected = $filter("filter")(vm.sSidebar_users, {
                  userName: response.sender,
                },
                true
              );
            }
          } catch (e) {
            response = {
              error: e,
            };
          }
        });
    }

    function closesocket() {
      var session = {
        idSession: vm.session,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return authenticationsessionDS
        .deleteonesession(auth.authToken, session)
        .then(
          function (data) {
            if (data.status === 200) {
              localStorageService.clearAll();
              $rootScope.photo = null;
              vm.photo = null;
              vm.session = null;
              Idle.unwatch();
              $state.go("login");
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }

    function closeSession() {
      var session = {
        idSession: vm.session,
      };

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return authenticationsessionDS
        .deleteonesession(auth.authToken, session)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.session = null;
              localStorageService.clearAll();
             // vm.openwebservice();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }

    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      }
    }

    function getUserIP() {
      //  onNewIp - your listener function for new IPs
      try {
        //compatibility for firefox and chrome
        var myPeerConnection =
          window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection ||
          false;
        if (myPeerConnection) {
          var pc = new myPeerConnection({
              iceServers: [],
            }),
            noop = function () {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;
          (vm.localIPs = {}), (vm.lisIP = []);
          //create a bogus data channel
          pc.createDataChannel("");
          // create offer and set local description
          pc.createOffer()
            .then(function (sdp) {
              sdp.sdp.split("\n").forEach(function (line) {
                if (line.indexOf("candidate") < 0) return;
                line.match(ipRegex).forEach(iterateIP());
                $rootScope.ipUser = vm.lisIP[0];
              });
              pc.setLocalDescription(sdp, noop, noop);
            })
            .catch(function (reason) {
              // An error occurred, so handle the failure to connect
            });
          //listen for candidate events
          pc.onicecandidate = function (ice) {
            if (
              !ice ||
              !ice.candidate ||
              !ice.candidate.candidate ||
              !ice.candidate.candidate.match(ipRegex)
            )
              return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
            $rootScope.ipUser = vm.lisIP[0];
          };
        } else {
          console.error("explorador");
        }
      } catch (error) {
        console.error(error);
        // expected output: SyntaxError: unterminated string literal
        // Note - error messages will vary depending on browser
      }
    }

    function iterateIP(ip) {
      if (!vm.localIPs[ip]) vm.lisIP.push(ip);
      vm.localIPs[ip] = true;
    }

    function openhelp() {
      window.open(
        "/enterprise_nt_help/index.htm?page=enterprise_nt/" + vm.helpReference,
        "",
        "width=1100,height=600,left=50,top=50,toolbar=yes"
      );
    }

    function modalError(error) {
      vm.PopupError = true;
      vm.Error = error;
    }
  }
})();
/* jshint ignore:end */
