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
    "logger",
    "$rootScope",
    "localStorageService",
    "moduleDS",
    "$filter",
    "shortcutsDS",
    "settings",
    "sigaDS",
    "$scope",
    "Idle",
    "Webworker",
    "socket",
    "productVersion",
  ];
  /* @ngInject */
  function SidebarController(
    $state,
    logger,
    $rootScope,
    localStorageService,
    moduleDS,
    $filter,
    shortcutsDS,
    settings,
    sigaDS,
    $scope,
    Idle,
    Webworker,
    socket,
    productVersion
  ) {
    var vm = this;
    vm.menu = $rootScope.menu;
    vm.getUserIP = getUserIP;
    vm.isAuthenticate = isAuthenticate;
    vm.modulecant = 0;
    vm.refreshData = refreshData;
    vm.iteracion = 0;
    vm.autoPending = 1;
    vm.scopeVariable = 1;
    vm.insertShortcuts = insertShortcuts;
    vm.deleteShortcuts = deleteShortcuts;
    vm.closesocket = closesocket;
    vm.getalert = getalert;
    vm.alertcant = 0;
    vm.viewuser = true;
    vm.keysendmessage = keysendmessage;
    vm.listviewuser = listviewuser;
    $rootScope.shortcuts = [];
    $rootScope.orderecall = false;
    $rootScope.serialprint = "";
    vm.page = page;
    vm.datasearch = datasearch;
    vm.search = [];
    vm.session = null;
    localStorage.setItem("altair_sidebar_slim", "1");
    localStorage.removeItem("altair_sidebar_mini");
    $rootScope.cantretakeview = false;
    if (localStorageService.get("turn") !== null) {
      $rootScope.turngestion = true;
      $rootScope.dataturn = null;
    }
    vm.getUserIP();
    vm.cantprueba = 0;
    vm.time = 1514782800000;
    vm.mainSearch = true;
    vm.principalmenu = true;
    vm.Alerts = [];
    vm.sSidebar_users = [];
    vm.messagesuser = [];
    vm.listmenssage = [];
    vm.userdisconnected = [];
    vm.userwithmessage = [];
    vm.cantmessage = 0;
    vm.permissionmodule = permissionmodule;
    vm.opensearch = opensearch;
    vm.openhelp = openhelp;
    vm.openmodalSerial = openmodalSerial;
    vm.modalError = modalError;
    vm.getpointOfCares = getpointOfCares;
    vm.getReasonBreakSiga = getReasonBreakSiga;
    vm.startAttentionSiga = startAttentionSiga;
    vm.resetAttentionSiga = resetAttentionSiga;
    vm.stopAttentionSiga = stopAttentionSiga;
    vm.searchSerial = searchSerial;
    vm.updateSerial = updateSerial;
    vm.showMotiveBreak = false;
    vm.pointSigaSelected = null;
    vm.reasonBreakSelected = null;
    vm.printadvertence = "!";
    vm.seriallabel = "";
    vm.selectorder = selectorder;
    vm.toggleFullScreen = toggleFullScreen;
    vm.searchSerial(1);

    /*CHAT SOCKET I.O*/
    vm.usersOnline = [];
    vm.openSocket = openSocket;
    vm.clearChat = clearChat;
    vm.listviewChat = listviewChat;
    vm.sendMessage = sendMessage;
    vm.loadUsersOnline = loadUsersOnline;
    vm.sender = "";
    vm.receiver = "";
    vm.messages = [];
    vm.numberMessages = 0;
    vm.fullMessages = [];
    vm.messagesview = [];
    vm.isAuth = true;
    vm.noConnected = false;

    try {
      socket.on("init", function (data) {
        vm.loadUsersOnline(data);
      });

      socket.on("user:join", function (data) {
        var userActive = _.filter(vm.usersOnline, function (o) {
          return o.id === data.id;
        });
        if (userActive.length == 0) {
          vm.usersOnline.push(data);
        }
      });

      socket.on("send:message", function (data) {
        if (Object.keys(data).length > 0) {
          var msg = {
            sender: data.from,
            receiver: vm.userAuth,
            message: data.message,
            type: "receiver",
            date: moment().format("YYYYMMDD, HH:mm:ss"),
          };

          vm.fullMessages.push(msg);

          if (!vm.viewuser && vm.receiver.id == data.from.id) {
            vm.messagesview.push(msg);
          } else {
            //Cantidad de mensajes sin leer
            vm.numberMessages += 1;
            var senderUser = _.filter(vm.usersOnline, function (o) {
              return o.id === data.from.id;
            });
            if (senderUser.length > 0) {
              senderUser[0].quantity += 1;
            }
          }
          setTimeout(function () {
            var p = document.getElementById("contenanswer");
            p.scrollTop = p.scrollHeight - p.clientHeight;
          }, 100);
        }
      });

      /*Notificacion cambio de configuración*/
      socket.on("change:configuration", function (data) {
        if (Object.keys(data).length > 0) {
          vm.Alerts = vm.Alerts === undefined ? [] : vm.Alerts;
          var alert = {
            type: 1,
            name: $filter("translate")("0665"),
            description: $filter("translate")("0666"),
          };
          alert.description = alert.description.replace(
            "@@@@",
            data.user.userName
          );
          vm.Alerts.push(alert);
          vm.alertcant = vm.Alerts.length;
        }
      });

      /*Cerrar la Sesion*/
      socket.on("user:closesession", function (data) {
        var message = $filter("translate")("1530");
        logger.warning(message.replace("@@@@", data.userName));
        setTimeout(function () {
          vm.closesocket();
        }, 5000);
      });
    } catch (error) {
      vm.noConnected = true;
    }

    function openSocket() {
      setTimeout(function () {
        vm.userAuth = localStorageService.get(
          "Enterprise_NT.authorizationData"
        );
        if (vm.userAuth) {
          socket.emit("user:join", {
            id: vm.userAuth.id,
            name: vm.userAuth.name,
            lastName: vm.userAuth.lastName,
            photo: vm.userAuth.photo,
            quantity: 0,
            ip: vm.lisIP[0],
            branchname: vm.branchname,
            date: moment().format("YYYYMMDD, HH:mm:ss"),
          });
        }
      }, 500);
    }

    function loadUsersOnline(data) {
      vm.usersOnline.splice(0, vm.usersOnline.length);
      _.forEach(data, function (value, key) {
        var userActive = _.filter(vm.usersOnline, function (o) {
          return o.id === value["id"];
        });
        if (userActive.length === 0) {
          vm.usersOnline.push(value);
        }
      });
    }

    function listviewChat(event, user) {
      event.stopPropagation();
      setTimeout(function () {
        var p = document.getElementById("contenanswer");
        p.scrollTop = p.scrollHeight - p.clientHeight;
      }, 100);
      vm.viewuser = !vm.viewuser;
      vm.receiver = user;

      vm.messagesview = _.filter(vm.fullMessages, function (o) {
        return (
          (o.sender.id === vm.userAuth.id &&
            o.receiver.id === vm.receiver.id) ||
          (o.sender.id === vm.receiver.id && o.receiver.id === vm.userAuth.id)
        );
      });

      var senderUser = _.filter(vm.usersOnline, function (o) {
        return o.id === vm.receiver.id;
      });
      if (senderUser.length > 0) {
        vm.numberMessages -= senderUser[0].quantity;
        senderUser[0].quantity = 0;
      }
    }

    function sendMessage() {
      if (vm.messagesend !== "") {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");

        /*Usuario que envia*/
        var sender = {
          id: auth.id,
          name: auth.name,
          lastName: auth.lastName,
          photo: auth.photo,
        };

        var msg = {
          sender: sender,
          receiver: vm.receiver,
          message: vm.messagesend,
          type: "send",
          date: moment().format("YYYYMMDD, HH:mm:ss"),
        };

        socket.emit("send:message", {
          to: vm.receiver.id,
          from: sender,
          message: vm.messagesend,
        });

        vm.messagesview.push(msg);

        vm.fullMessages.push(msg);

        vm.messagesend = "";

        setTimeout(function () {
          var p = document.getElementById("contenanswer");
          p.scrollTop = p.scrollHeight - p.clientHeight;
        }, 100);
      }
    }

    function clearChat() {
      vm.messagesview = [];
      vm.fullMessages = [];
      vm.messagesend = "";
      vm.numberMessages = 0;
    }

    /*Finaliza Socket I.O*/

    $scope.$on("IdleStart", function () {});

    $scope.$on("IdleEnd", function () {});

    $scope.$on("IdleTimeout", function () {
      vm.closesocket();
    });

    $rootScope.$watch("cantretakeview", function () {
      if ($rootScope.cantretakeview) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var date = moment().format("YYYYMMDD");
        if (auth != null && auth != undefined && auth != "") {
          if ($rootScope.Alerts.length !== 0) {
            if (
              $rootScope.Alerts.length === 1 &&
              $rootScope.Alerts[0].type !== 3
            ) {
            } else if ($rootScope.Alerts[0].type === 3) {
              if ($rootScope.Alerts.length === 2) {
                $rootScope.Alerts = [$rootScope.Alerts[1]];
              } else {
                $rootScope.Alerts = [];
              }
            } else if ($rootScope.Alerts[1].type === 3) {
              if ($rootScope.Alerts.length === 2) {
                $rootScope.Alerts = [$rootScope.Alerts[0]];
              } else {
                $rootScope.Alerts = [];
              }
            }
            $rootScope.myWorkertake.stop();
            $rootScope.myWorkertake = Webworker.create(async, { async: true });
            $rootScope.myWorkertake
              .run(
                settings.serviceUrl,
                auth.authToken,
                moment().format("YYYYMMDD"),
                auth.branch
              )
              .then(
                function (result) {},
                null,
                function (response) {
                  vm.refreshData(response);
                }
              );
          }
        } else {
          vm.isAuthenticate();
        }
      }
      $rootScope.cantretakeview = false;
    });

    $rootScope.$watch(function () {
      vm.menu = $rootScope.menu;
      vm.branchname = localStorageService.get("Branchname");
      vm.NamePage = $rootScope.NamePage;
      vm.helpReference = $rootScope.helpReference;
      vm.idpage = $state.current.idpage;
      vm.listpagepermission = $rootScope.module;
      vm.listAcces = $rootScope.shortcuts;
      vm.dataviewsiga = localStorageService.get("dataviewsiga");
      vm.stateTurnSiga =
        vm.dataviewsiga === true
          ? 1
          : localStorageService.get("stateTurnSiga") === null
          ? 0
          : localStorageService.get("stateTurnSiga");
      vm.turnSiga =
        $rootScope.dataturn === null || $rootScope.dataturn === undefined
          ? undefined
          : $rootScope.dataturn.number;
      if (!vm.menu) {
        Idle.unwatch();
      }
    });

    $rootScope.$watch("photo", function () {
      vm.photo =
        $rootScope.photo === "" || $rootScope.photo === undefined
          ? "images/user.png"
          : "data:image/jpeg;base64," + $rootScope.photo;
      localStorage.setItem("altair_sidebar_slim", "1");
      localStorage.removeItem("altair_sidebar_mini");
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.getalert();
      vm.getReasonBreakSiga();
      if (auth !== null && vm.menu) {
        setTimeout(function () {
          var time =
            parseInt(localStorageService.get("SessionExpirationTime")) * 60;
          Idle.setIdle(time);
          Idle.setTimeout(20);
          Idle.watch();
        }, 3000);
      }

      if (vm.session === null && auth !== null) {
        vm.viewsocket = localStorageService.get("socket") === "True" || localStorageService.get("socket") === "";
        if (vm.viewsocket) {
          vm.openSocket();
        }
        vm.userAuth = localStorageService.get(
          "Enterprise_NT.authorizationData"
        );
        vm.trazability = localStorageService.get("Trazabilidad");
        vm.phlebotomistake = localStorageService.get("Manejodepuntodetomamuestra");
        vm.takesample = localStorageService.get("TomaMuestra");
        vm.growtmicrobiology = localStorageService.get("SiembraMicrobiologia");
        vm.dataviewsiga = localStorageService.get("dataviewsiga");
        vm.stateTurnSiga =
          vm.dataviewsiga === true
            ? 1
            : localStorageService.get("stateTurnSiga") === null
            ? 0
            : localStorageService.get("stateTurnSiga");
        vm.integrationSiga =
          localStorageService.get("IntegracionSIGA") === "True";
        vm.serviceEntrySiga = localStorageService.get("OrdenesSIGA");
        vm.serviceVerificationSiga =
          localStorageService.get("VerificacionSIGA");
        vm.turnfilter =
          localStorageService.get("moduleSiga") === null
            ? vm.serviceEntrySiga === ""
              ? 2
              : 1
            : localStorageService.get("moduleSiga");
        Idle.setIdle(
          parseInt(localStorageService.get("SessionExpirationTime")) * 60
        );
        Idle.setTimeout(20);
        Idle.watch();
        if (vm.integrationSiga) {
          vm.showMotiveBreak = false;
          vm.getpointOfCares();
          vm.getReasonBreakSiga();
          if (localStorageService.get("pointSiga") !== null) {
            vm.pointNameSiga = localStorageService.get("pointSiga").name;
          }
        }
        vm.permissionmodule();
      }
    });
    $rootScope.$watch("Alerts", function () {
      vm.Alerts = $rootScope.Alerts;
      vm.alertcant =
        vm.Alerts === "" || vm.Alerts === undefined ? 0 : vm.Alerts.length;
    });

    $rootScope.$on(
      "$stateChangeStart",
      function (event, toState, toParams, fromState, fromParams, options) {
        if (
          vm.stateTurnSiga === 0 &&
          (toState.name === "completeverify" ||
            toState.name === "simpleverification" ||
            toState.name === "orderentry")
        ) {
          vm.idpage = toState.name === "orderentry" ? 210 : 211;
          vm.getpointOfCares();
        }
      }
    );

    function listviewuser(event, username, userstate) {
      event.stopPropagation();
      setTimeout(function () {
        var p = document.getElementById("contenanswer");
        p.scrollTop = p.scrollHeight - p.clientHeight;
      }, 100);
      vm.viewuser = !vm.viewuser;
      vm.usernamesend = username;
      if (username !== undefined) {
        vm.userstate = userstate;
        vm.messagesuser = $filter("filter")(
          vm.listmenssage,
          {
            usersend: username,
          },
          true
        );
        var usermessagenotopen = $filter("filter")(
          vm.sSidebar_users,
          {
            userName: username,
          },
          true
        );
        vm.cantmessage = vm.cantmessage - usermessagenotopen[0].cant;
        usermessagenotopen[0].cant = 0;
        if (userstate === 0) {
          vm.sSidebar_users = $filter("filter")(vm.sSidebar_users, {
            userName: "!" + username,
          });
        }
      }
    }

    function openmodalSerial() {
      UIkit.modal("#modaleditserial").show();
    }

    vm.openversion = openversion;
    function openversion() {
      vm.version = {
        backend: localStorageService.get("Version"),
        frontend: productVersion.laboratory,
      };
      UIkit.modal("#viewserial").show();
    }
    vm.closedacess = closedacess;

    function closedacess() {
      UIkit.modal("#modaleditserial").show();
    }
    vm.takeorders = takeorders;

    function takeorders() {
      if ($state.$current.self.name === "orderentry") {
        $rootScope.orderecall = true;
      } else {
        $rootScope.orderecall = true;
        $state.go("orderentry");
      }
    }

    function toggleFullScreen() {
      var doc = window.document;
      var docEl = doc.documentElement;

      var requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
      var exitFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(docEl);
      } else {
        exitFullScreen.call(doc);
      }
    }

    function updateSerial() {
      var deleteRequest = indexedDB.deleteDatabase("serialDatabase");
      var request = indexedDB.open("serialDatabase");
      request.onupgradeneeded = function (event) {
        var store = event.currentTarget.result.createObjectStore(
          "serialTable",
          {
            keyPath: "id",
            autoIncrement: true,
          }
        );
        store.createIndex("serial", "serial", {
          unique: true,
        });
        store.add({
          serial: vm.serialPrint,
        });
        $rootScope.serialprint = vm.serialPrint;
        vm.seriallabel = vm.serialPrint;
        UIkit.modal("#modaleditserial").hide();
      };
      request.onerror = function (evt) {
        console.log("Navegador no soporta indexDB");
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
        console.log("Navegador no soporta indexDB");
      };
    }

    function permissionmodule() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth != undefined) {
        return moduleDS.getModuleMasterUser(auth.authToken, auth.id).then(
          function (data) {
            vm.listpagepermission = data.data;
            vm.datasearch();
          },
          function (error) {
            if (error.data === null) {
              logger.error(error);
            }
          }
        );
      }
    }

    function opensearch() {
      vm.mainSearch = false;
      setTimeout(function () {
        document.getElementById("pagesearchmenu_value").focus();
      }, 200);
    }

    function page(selected) {
      if (selected.originalObject !== undefined) {
        $state.go(selected.originalObject.url);
        vm.mainSearch = true;
      }
    }

    function closesocket() {
      vm.cantprueba = 0;
      vm.Alerts = [];
      vm.stateTurnSiga = 0;
      vm.cantmessage = 0;
      vm.alertcant = 0;
      $rootScope.photo = null;
      vm.photo = null;
      vm.pointSigaSelected = null;
      vm.reasonBreakSelected = null;
      $rootScope.myWorkertake.stop();
      if (vm.integrationSiga) {
        vm.stopAttentionSiga();
      }
      $rootScope.dataturn = null;
      vm.session = null;
      Idle.unwatch();
      vm.isAuth = false;
      vm.clearChat();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (vm.viewsocket) {
        socket.emit("sign:off", auth.id);
      }
      $state.go("login");
      localStorageService.clearAll();
    }
    /*Enviar el mensaje con tecla enter NO BORRAR*/
    function keysendmessage($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        vm.sendMessage();
      }
    }

    function async(serviceUrl, token, date, branch) {
      if (token !== "" && token !== null) {
        fetch(
          serviceUrl +
            "/orders/filter/recalled/entryDatep/" +
            date +
            "/" +
            branch,
          {
            method: "GET",
            headers: { Authorization: token },
          }
        )
          .then(function (res) {
            if (res.status === 204) {
              var data = { status: 204, statusText: "No Content" };
            } else {
              var data = { status: 200 };
            }
            return data;
          })
          .catch()
          .then(function (response) {
            notify(response);
          });

        var id = setInterval(function () {
          fetch(
            serviceUrl +
              "/orders/filter/recalled/entryDatep/" +
              date +
              "/" +
              branch,
            {
              method: "GET",
              headers: { Authorization: token },
            }
          )
            .then(function (res) {
              if (res.status === 204) {
                var data = { status: 204, statusText: "No Content" };
              } else {
                var data = { status: 200 };
              }
              return data;
            })
            .catch()
            .then(function (response) {
              notify(response);
            });
        }, 300000);
      }
    }

    function getalert() {
      vm.alertcant = 0;
      $rootScope.Alerts = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var date = moment().format("YYYYMMDD");
      if (auth != null && auth != undefined && auth != "") {
        if ($rootScope.Alerts.length !== 0) {
          if (
            $rootScope.Alerts.length === 1 &&
            $rootScope.Alerts[0].type !== 3
          ) {
          } else if ($rootScope.Alerts[0].type === 3) {
            if ($rootScope.Alerts.length === 2) {
              $rootScope.Alerts = [$rootScope.Alerts[1]];
            } else {
              $rootScope.Alerts = [];
            }
          } else if ($rootScope.Alerts[1].type === 3) {
            if ($rootScope.Alerts.length === 2) {
              $rootScope.Alerts = [$rootScope.Alerts[0]];
            } else {
              $rootScope.Alerts = [];
            }
          }
        }
        $rootScope.myWorkertake = Webworker.create(async, { async: true });
        $rootScope.myWorkertake
          .run(
            settings.serviceUrl,
            auth.authToken,
            moment().format("YYYYMMDD"),
            auth.branch
          )
          .then(
            function (result) {},
            null,
            function (response) {
              vm.refreshData(response);
            }
          );
      } else {
        vm.isAuthenticate();
      }
    }

    function refreshData(response) {
      if (response.status === 200) {
        $rootScope.Alerts = [
          {
            type: 3,
            cant: response.length,
          },
        ];
      }
    }

    function selectorder(order) {
      $rootScope.orderalarm = order;
      vm.Alerts = _.filter(vm.Alerts, function (o) {
        return o.name !== order;
      });
      vm.alertcant = vm.alertcant - 1;
      $state.go("resultsentry");
    }

    function insertShortcuts() {
      if (vm.listAcces.length < 6) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var shortcuts = {
          module: 200,
          user: auth.id,
          form: $state.current.idpage,
        };
        return shortcutsDS.NewShortcutsList(auth.authToken, shortcuts).then(
          function (data) {
            if (data.status === 200) {
              var shortcutsnew = {
                id: $state.current.idpage,
              };
              $rootScope.shortcuts.push(shortcutsnew);
              vm.listAcces.push(shortcutsnew);
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      } else {
        logger.warning($filter("translate")("0155"));
      }
    }

    function deleteShortcuts() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var shortcuts = {
        module: 200,
        user: auth.id,
        form: $state.current.idpage,
      };
      return shortcutsDS.DeleteShortcutsList(auth.authToken, shortcuts).then(
        function (data) {
          if (data.status === 200) {
            for (var i = 0; i < vm.listAcces.length; i++) {
              if (vm.listAcces[i].id === $state.current.idpage) {
                vm.listAcces.splice(i, 1);
                $rootScope.shortcuts = vm.listAcces;
                break;
              }
            }
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      }
    }
    /**
     * Get the user IP throught the webkitRTCPeerConnection
     * @param onNewIP {Function} listener function to expose the IP locally
     * @return undefined
     */
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
            ipRegex =
              /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
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
    //datos del combobox
    function datasearch() {
      vm.trazability = localStorageService.get("Trazabilidad");
      vm.phlebotomistake = localStorageService.get("Manejodepuntodetomamuestra");
      vm.takesample = localStorageService.get("TomaMuestra");
      vm.growtmicrobiology = localStorageService.get("SiembraMicrobiologia");
      vm.dataviewsiga = localStorageService.get("dataviewsiga");
      vm.stateTurnSiga =
        vm.dataviewsiga === true
          ? 1
          : localStorageService.get("stateTurnSiga") === null
          ? 0
          : localStorageService.get("stateTurnSiga");
      vm.integrationSiga =
        localStorageService.get("IntegracionSIGA") === "True";
      vm.branchSiga = parseInt(localStorageService.get("SedeSIGA"));
      vm.serviceEntrySiga = localStorageService.get("OrdenesSIGA");
      vm.serviceVerificationSiga = localStorageService.get("VerificacionSIGA");
      vm.turnfilter =
        localStorageService.get("moduleSiga") === null
          ? vm.serviceEntrySiga === ""
            ? 2
            : 1
          : localStorageService.get("moduleSiga");
      if (vm.integrationSiga) {
        vm.showMotiveBreak = false;
        vm.getpointOfCares();
        vm.getReasonBreakSiga();
        if (localStorageService.get("pointSiga") !== null) {
          vm.pointNameSiga = localStorageService.get("pointSiga").name;
        }
      }
      var Laboratoryorders =
        $filter("filter")(vm.listpagepermission, {
          id: 201,
        }).length > 0;
      var Laboratorypatient =
        $filter("filter")(vm.listpagepermission, {
          id: 202,
        }).length > 0;
      var Laboratorysample =
        $filter("filter")(vm.listpagepermission, {
          id: 204,
        }).length > 0;
      var result =
        $filter("filter")(vm.listpagepermission, {
          id: 203,
        }).length > 0;
      var consultation =
        $filter("filter")(vm.listpagepermission, {
          id: 205,
        }).length > 0;
      var audit =
        $filter("filter")(vm.listpagepermission, {
          id: 206,
        }).length > 0;
      var statistics =
        $filter("filter")(vm.listpagepermission, {
          id: 207,
        }).length > 0;
      var indicators =
        $filter("filter")(vm.listpagepermission, {
          id: 208,
        }).length > 0;
      var tools =
        $filter("filter")(vm.listpagepermission, {
          id: 209,
        }).length > 0;
      var search = [
        {
          //accesos directos Gestión de ordenes-ingreso de ordenes
          id: 210,
          name: $filter("translate")("0011"),
          father: $filter("translate")("1109"),
          image: "images/Menu/Laboratoryorders/orderentry.png",
          url: "orderentry",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 210,
            }).length > 0 && Laboratoryorders,
        },
        {
          //listados
          id: 212,
          name: $filter("translate")("0015"),
          father: $filter("translate")("1109"),
          image: "images/Menu/Laboratoryorders/list.png",
          url: "listed",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 212,
            }).length > 0 && Laboratoryorders,
        },
        {
          //Creación de ordenes sin historia
          id: 213,
          name: $filter("translate")("0252"),
          father: $filter("translate")("1109"),
          image: "images/Menu/Laboratoryorders/orderswithouthistory.png",
          url: "orderswithouthistory",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 213,
            }).length > 0 && Laboratoryorders,
        },
        {
          //Activación de ordenes
          id: 214,
          name: $filter("translate")("0045"),
          father: $filter("translate")("1109"),
          image: "images/Menu/Laboratoryorders/activationorder.png",
          url: "activationorder",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 214,
            }).length > 0 && Laboratoryorders,
        },
        {
          //Reiniciar contador
          id: 215,
          name: $filter("translate")("0951"),
          father: $filter("translate")("1109"),
          image: "images/Menu/tools/rotate.png",
          url: "restartcounter",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 215,
            }).length > 0 && Laboratoryorders,
        },
        {
          //Historia Clinica
          id: 216,
          name: $filter("translate")("0017"),
          father: $filter("translate")("1110"),
          image: "images/Menu/Laboratoryorders/historypatient.png",
          url: "historypatient",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 216,
            }).length > 0 && Laboratorypatient,
        },
        {
          //Asignación de historia
          id: 217,
          name: $filter("translate")("0016"),
          father: $filter("translate")("1110"),
          image: "images/Menu/Laboratoryorders/historyassignment.png",
          url: "historyassignment",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 217,
            }).length > 0 && Laboratorypatient,
        },
        {
          //Reasignación de historia
          id: 218,
          name: $filter("translate")("0044"),
          father: $filter("translate")("1110"),
          image: "images/Menu/Laboratoryorders/historyreassignment.png",
          url: "historyreassignment",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 218,
            }).length > 0 && Laboratorypatient,
        },
        {
          //Inconsistencia
          id: 219,
          name: $filter("translate")("0051"),
          father: $filter("translate")("1110"),
          image: "images/Menu/Laboratoryorders/inconsistency.png",
          url: "inconsistency",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 219,
            }).length > 0 && Laboratorypatient,
        },
        {
          //Desbloqueo de historia/Orden
          id: 220,
          name: $filter("translate")("0055"),
          father: $filter("translate")("1110"),
          image: "images/Menu/Laboratoryorders/unlockorderhistory.png",
          url: "unlockorderhistory",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 220,
            }).length > 0 && Laboratorypatient,
        },
        {
          //Entrada de muestra
          id: 211,
          name: $filter("translate")("0014"),
          father: $filter("translate")("1109"),
          image: "images/Menu/Laboratoryorders/entrysample.png",
          url: "simpleverification",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 211,
            }).length > 0 &&
            vm.trazability === "2" &&
            Laboratorysample,
        },
        {
          //Verificación completa
          id: 211,
          name: $filter("translate")("0247"),
          father: $filter("translate")("1109"),
          image: "images/Menu/Laboratoryorders/entrysample.png",
          url: "completeverify",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 211,
            }).length > 0 &&
            vm.trazability === "3" &&
            Laboratorysample,
        },
        {
          //Almacen de muestra
          id: 243,
          name: $filter("translate")("0043"),
          father: $filter("translate")("1109"),
          image: "images/Menu/tools/Samplewarehouse.png",
          url: "tuberack",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 243,
            }).length > 0 && Laboratorysample,
        },
        {
          //trazabilidad
          id: 251,
          name: $filter("translate")("0046"),
          father: $filter("translate")("1109"),
          image: "images/Menu/audit/audit.png",
          url: "traceability",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 251,
            }).length > 0 && Laboratorysample,
        },
        {
          //registro de resultado
          id: 221,
          name: $filter("translate")("0019"),
          father: $filter("translate")("0027"),
          image: "images/Menu/Result/resultsentry.png",
          url: "resultsentry",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 221,
            }).length > 0 && result,
        },
        {
          //registro de Resultado por lote
          id: 222,
          name: $filter("translate")("0021"),
          father: $filter("translate")("0027"),
          image: "images/Menu/Result/recordresultbyrank.png",
          url: "recordresultbyrank",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 222,
            }).length > 0 && result,
        },
        {
          //Revisión de resultados
          id: 223,
          name: $filter("translate")("0023"),
          father: $filter("translate")("0027"),
          image: "images/Menu/Result/reviewofresults.png",
          url: "reviewofresults",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 223,
            }).length > 0 && result,
        },
        {
          //Hojas de trabajo
          id: 224,
          name: $filter("translate")("0018"),
          father: $filter("translate")("0027"),
          image: "images/Menu/Result/worklist.png",
          url: "worklist",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 224,
            }).length > 0 && result,
        },
        {
          //Reenvio al middleware
          id: 225,
          name: $filter("translate")("1133"),
          father: $filter("translate")("0027"),
          image: "images/Menu/tools/TestAnalyzer.png",
          url: "restartmiddleware",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 225,
            }).length > 0 && result,
        },
        {
          //Informes
          id: 229,
          name: $filter("translate")("0031"),
          father: $filter("translate")("0028"),
          image: "images/Menu/consultation/reports.png",
          url: "reports",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 229,
            }).length > 0 && consultation,
        },
        {
          //Control entrega de informes
          id: 230,
          name: $filter("translate")("0032"),
          father: $filter("translate")("0028"),
          image: "images/Menu/consultation/controldeliveryreports.png",
          url: "controldeliveryreports",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 230,
            }).length > 0 && consultation,
        },
        {
          //Consultas
          id: 231,
          name: $filter("translate")("0033"),
          father: $filter("translate")("0028"),
          image: "images/Menu/consultation/queries.png",
          url: "queries",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 231,
            }).length > 0 && consultation,
        },
        {
          //Consulta de paciente
          id: 232,
          name: $filter("translate")("0322"),
          father: $filter("translate")("0028"),
          image: "images/Menu/consultation/patientconsultation.png",
          url: "patientconsultation",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 232,
            }).length > 0 && consultation,
        },
        {
          //Consentimiento informado
          id: 249,
          name: $filter("translate")("0349"),
          father: $filter("translate")("0028"),
          image: "images/Menu/consultation/informedconsent.png",
          url: "informedconsent",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 249,
            }).length > 0 && consultation,
        },
        {
          //auditoria de ordenes
          id: 233,
          name: $filter("translate")("0926"),
          father: $filter("translate")("0925"),
          image: "images/Menu/audit/order.png",
          url: "auditorder",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 233,
            }).length > 0 && audit,
        },
        {
          //auditoria de maestros
          id: 234,
          name: $filter("translate")("0927"),
          father: $filter("translate")("0925"),
          image: "images/Menu/audit/master.png",
          url: "auditmaster",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 234,
            }).length > 0 && audit,
        },
        {
          //auditoria de usuarios
          id: 235,
          name: $filter("translate")("0928"),
          father: $filter("translate")("0925"),
          image: "images/Menu/audit/user.png",
          url: "audituser",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 235,
            }).length > 0 && audit,
        },
        {
          //auditoria de la factura
          id: 507,
          name: $filter("translate")("1735"),
          father: $filter("translate")("0925"),
          image: "images/Menu/audit/bill.png",
          url: "auditinvoice",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 507,
            }).length > 0 && audit,
        },
        {
          //Estadisticas
          id: 236,
          name: $filter("translate")("0029"),
          father: $filter("translate")("0029"),
          image: "images/Menu/statistics/generalstadistics.png",
          url: "generalstadistics",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 236,
            }).length > 0 && statistics,
        },
        {
          //Estadisticas especiales
          id: 237,
          name: $filter("translate")("0034"),
          father: $filter("translate")("0029"),
          image: "images/Menu/statistics/specialstadistics.png",
          url: "specialstadistics",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 237,
            }).length > 0 && statistics,
        },
        {
          //Estadisticas con precios
          id: 238,
          name: $filter("translate")("0035"),
          father: $filter("translate")("0029"),
          image: "images/Menu/statistics/statisticswithprices.png",
          url: "statisticswithprices",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 238,
            }).length > 0 && statistics,
        },
        {
          //Muestras en destinos
          id: 239,
          name: $filter("translate")("0041"),
          father: $filter("translate")("0029"),
          image: "images/Menu/statistics/destinationsample.png",
          url: "destinationsample",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 239,
            }).length > 0 &&
            statistics &&
            vm.trazability === "3",
        },
        {
          //Alerta temprana
          id: 240,
          name: $filter("translate")("0036"),
          father: $filter("translate")("0037"),
          image: "images/Menu/statistics/earlywarning.png",
          url: "earlywarning",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 240,
            }).length > 0 && indicators,
        },
        {
          //Indicadores
          id: 241,
          name: $filter("translate")("0037"),
          father: $filter("translate")("0037"),
          image: "images/Menu/statistics/indicators.png",
          url: "indicators",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 241,
            }).length > 0 && indicators,
        },
        {
          //Histograma
          id: 242,
          name: $filter("translate")("0038"),
          father: $filter("translate")("0037"),
          image: "images/Menu/statistics/histogram.png",
          url: "histogram",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 242,
            }).length > 0 && indicators,
        },
        {
          //Reporte Adicionales
          id: 305,
          name: $filter("translate")("1724"),
          father: $filter("translate")("0037"),
          image: "images/form.png",
          url: "otherreports",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 305,
            }).length > 0 && indicators,
        },
        {
          //Visor de succesos
          id: 244,
          name: $filter("translate")("0047"),
          father: $filter("translate")("0030"),
          image: "images/Menu/tools/Eventviewer.png",
          url: "exception",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 244,
            }).length > 0 && tools,
        },
        {
          //Visor de sesiones
          id: 245,
          name: $filter("translate")("0933"),
          father: $filter("translate")("0030"),
          image: "images/Menu/tools/Entrylog.png",
          url: "sectionviewer",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 245,
            }).length > 0 && tools,
        },
        {
          //Borrados especiales
          id: 246,
          name: $filter("translate")("0050"),
          father: $filter("translate")("0030"),
          image: "images/Menu/Laboratoryorders/deletespecial.png",
          url: "deletespecial",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 246,
            }).length > 0 && tools,
        },
        {
          //Editor de informes
          id: 247,
          name: $filter("translate")("0782"),
          father: $filter("translate")("0030"),
          image: "images/Menu/tools/ReportEdit.png",
          url: "reportedit",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 247,
            }).length > 0 && tools,
        },
        {
          //Editor de código de barras
          id: 248,
          name: $filter("translate")("0935"),
          father: $filter("translate")("0030"),
          image: "images/Menu/tools/barcode-512.png",
          url: "barcodeedit",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 248,
            }).length > 0 && tools,
        },
        {
          //Verificación de microbiologia
          id: 301,
          name: $filter("translate")("0024"),
          father: $filter("translate")("0225"),
          image: "images/Menu/microbiology/checkmicrobiology.png",
          url: "checkmicrobiology",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 301,
            }).length > 0,
        },
        {
          //Siembra de microbiologia
          id: 304,
          name: $filter("translate")("0025"),
          father: $filter("translate")("0225"),
          image: "images/Menu/microbiology/growtmicrobiology.png",
          url: "growtmicrobiology",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 304,
            }).length > 0 && vm.growtmicrobiology === "True",
        },
        {
          //Lectura de microbiologia
          id: 302,
          name: $filter("translate")("0026"),
          father: $filter("translate")("0225"),
          image: "images/Menu/microbiology/microbiologyReading.png",
          url: "microbiologyReading",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 302,
            }).length > 0,
        },
        {
          //Plano de whonet
          id: 303,
          name: $filter("translate")("0039"),
          father: $filter("translate")("0225"),
          image: "images/Menu/statistics/planoWhonet.png",
          url: "planoWhonet",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 303,
            }).length > 0,
        },
        {
          //Generar Factura
          id: 501,
          name: $filter("translate")("1564"),
          father: $filter("translate")("1283"),
          image: "images/Menu/principal/generateinvoice.png",
          url: "generateinvoice",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 501,
            }).length > 0,
        },
        {
          //notas credito
          id: 502,
          name: $filter("translate")("1576"),
          father: $filter("translate")("1283"),
          image: "images/Menu/principal/nota_credito.png",
          url: "creditnote",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 502,
            }).length > 0,
        },
        {
          //Recalculo
          id: 503,
          name: $filter("translate")("1603"),
          father: $filter("translate")("1283"),
          image: "images/Menu/principal/recalculo.png",
          url: "recalculated",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 503,
            }).length > 0,
        },
        {
          //Reporte de caja
          id: 504,
          name: $filter("translate")("1604"),
          father: $filter("translate")("1283"),
          image: "images/Menu/principal/cashreport.png",
          url: "cashreport",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 504,
            }).length > 0,
        },
        {
          // Reimprimir factura
          id: 505,
          name: $filter("translate")("1605"),
          father: $filter("translate")("1283"),
          image: "images/Menu/principal/printinvoice.png",
          url: "printinvoice",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 505,
            }).length > 0,
        },
        {
          //  RIPS
          id: 506,
          name: $filter("translate")("1606"),
          father: $filter("translate")("1283"),
          image: "images/Menu/principal/rips.png",
          url: "consultrips",
          state:
            $filter("filter")(vm.listpagepermission, {
              id: 506,
            }).length > 0,
        },
      ];
      vm.search = $filter("filter")(search, {
        state: true,
      });
    }

    function openhelp() {
      if (vm.idpage === 601) {
        var pdfUrl = "/enterprise_nt_help/trasplantes/RECEPTORES.pdf";
        window.open(pdfUrl, "_blank");
      } else if (vm.idpage === 602) {
        var pdfUrl = "/enterprise_nt_help/trasplantes/PARTICIPANTES.pdf";
        window.open(pdfUrl, "_blank");
      } else if (vm.idpage === 603) {
        var pdfUrl = "/enterprise_nt_help/trasplantes/DONANTES.pdf";
        window.open(pdfUrl, "_blank");
      } else if (vm.idpage === 604) {
        var pdfUrl =
          "/enterprise_nt_help/trasplantes/ANTICUERPOS_CITOTOXICOS.pdf";
        window.open(pdfUrl, "_blank");
      } else if (vm.idpage === 608) {
        var pdfUrl = "/enterprise_nt_help/trasplantes/SELECCION.pdf";
        window.open(pdfUrl, "_blank");
      } else if (vm.idpage === 605) {
        var pdfUrl = "/enterprise_nt_help/trasplantes/EDITOR_DE_REPORTES.pdf";
        window.open(pdfUrl, "_blank");
      } else if (vm.idpage === 606) {
        var pdfUrl = "/enterprise_nt_help/trasplantes/GESTION_DE_REPORTES.pdf";
        window.open(pdfUrl, "_blank");
      } else if (vm.idpage === 607) {
        var pdfUrl =
          "/enterprise_nt_help/trasplantes/HISTORICO_DE_REPORTES.pdf";
        window.open(pdfUrl, "_blank");
      } else {
        window.open(
          "/enterprise_nt_help/index.htm?page=enterprise_nt/" +
            vm.helpReference,
          "",
          "width=1100,height=600,left=50,top=50,toolbar=yes"
        );
      }
    }

    function getpointOfCares() {
      $scope.$broadcast("angucomplete-alt:clearInput", "pointSiga");

      vm.listPointSiga = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      switch (vm.idpage) {
        case 210:
          vm.turnfilter = 1;
          localStorageService.set("moduleSiga", vm.turnfilter);
          var service =
            localStorageService.get("OrdenesSIGA") === ""
              ? undefined
              : parseInt(localStorageService.get("OrdenesSIGA"));
          break;
        case 211:
          vm.turnfilter = 2;
          localStorageService.set("moduleSiga", vm.turnfilter);
          var service =
            localStorageService.get("VerificacionSIGA") === ""
              ? undefined
              : parseInt(localStorageService.get("VerificacionSIGA"));
          break;
      }

      if (service !== undefined) {
        return sigaDS.getPoint(auth.authToken, parseInt(localStorageService.get("SedeSIGA")), service).then(
          function (data) {
            if (data.status === 200) {
              vm.listPointSiga = data.data;
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }

    function getReasonBreakSiga() {
      vm.listReasonBreak = [];
      if (localStorageService.get("IntegracionSIGA") === "True") {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sigaDS.getReasonBreak(auth.authToken).then(
          function (data) {
            if (data.status === 200) {
              vm.listReasonBreak = data.data;
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }
    vm.startSigahistory = startSigahistory;
    function startSigahistory() {
      switch (vm.idpage) {
        case 210:
          vm.turnfilter = 1;
          localStorageService.set("moduleSiga", vm.turnfilter);
          break;
        case 211:
          vm.turnfilter = 2;
          localStorageService.set("moduleSiga", vm.turnfilter);
          break;
      }
      localStorageService.set("dataviewsiga", false);
      vm.dataviewsiga = false;
      $rootScope.stateTurnSiga = 1;

      if (localStorageService.get("viewsiga").turnInPoint !== undefined) {
        var viewsiga = localStorageService.get("viewsiga").turnInPoint;
        var turn = {
          id: viewsiga.id,
          number: viewsiga.number,
          date: viewsiga.date,
          turnType: viewsiga.turnType,
          service: viewsiga.point.service,
          branch: viewsiga.point.branch,
          state: viewsiga.state,
          attended: viewsiga.attended,
          transferible: viewsiga.transferible,
          finalizable: viewsiga.finalizable,
        };
        localStorageService.set("turn", turn);
        if (!turn.attended) {
          $rootScope.turngestion = true;
        }
      }
    }

    vm.stopSigahistory = stopSigahistory;
    function stopSigahistory() {
      localStorageService.set("dataviewsiga", false);
      vm.dataviewsiga = false;
      if (localStorageService.get("turn") !== null) {
        vm.loading = true;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var dataend = {
          id: 0,
          turn: {
            id: parseInt(localStorageService.get("turn").id),
          },
          service: {
            id: parseInt(localStorageService.get("VerificacionSIGA")),
          },
          pointOfCare: {
            id: parseInt(localStorageService.get("pointSiga").id),
          },
          user: {
            id: auth.id,
            user:auth.userName,
            lastName:auth.lastName,
            name:auth.name
          }
        };      
        return sigaDS.cancelturn(auth.authToken, dataend).then(
          function (data) {
            if (data.status === 200) {
              UIkit.modal("#endturnconfirmationsidebar").hide();
              logger.success($filter("translate")("0906"));
            }
            vm.stopAttentionSiga();
            vm.loading = false;
          },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
          }
        );
      } else {
        UIkit.modal("#endturnconfirmationsidebar").hide();
        vm.stopAttentionSiga();
      }
    }

    function startAttentionSiga() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var data = {
        action:1,
        branch: {
          id:  parseInt(localStorageService.get("SedeSIGA")),
        },
        point: {
          id: vm.pointSigaSelected.originalObject.id,
        },
        user: {
          id: auth.id,
          user:auth.userName,
          lastName:auth.lastName,
          name:auth.name
        }
      };

      return sigaDS.startWork(auth.authToken, data).then(
        function (data) {
          if (data.status === 200) {
            localStorageService.set("dataviewsiga", true);
            localStorageService.set("stateTurnSiga", 1);
            localStorageService.set(
              "pointSiga",
              vm.pointSigaSelected.originalObject
            );
            vm.pointNameSiga = localStorageService.get("pointSiga").name;
            vm.stateTurnSiga = 1;
            $rootScope.stateTurnSiga = 1;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function resetAttentionSiga() {
      if (vm.showMotiveBreak) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var data = {
          action:1,
          branch: {
            id:  parseInt(localStorageService.get("SedeSIGA")),
          },
          point: {
            id: localStorageService.get("pointSiga").id,
          },
          reason: {
            id: vm.reasonBreakSelected.originalObject.id,
          },
          user: {
            id: auth.id,
            user:auth.userName,
            lastName:auth.lastName,
            name:auth.name
          }
        };

        return sigaDS.pauseWork(auth.authToken, data).then(
          function (data) {
            if (data.status === 200) {
              localStorageService.set("dataviewsiga", false);
              localStorageService.set("stateTurnSiga", 2);
              vm.stateTurnSiga = 2;
              $rootScope.stateTurnSiga = 2;
              vm.showMotiveBreak = false;
              vm.pointSigaSelected = {
                originalObject: localStorageService.get("pointSiga"),
              };
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      } else {
        vm.reasonBreakSelected = null;
        vm.showMotiveBreak = true;
      }
    }

    function stopAttentionSiga() {
      if (localStorageService.get("pointSiga") !== null) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var data = {
          action:4,
          branch: {
            id:  parseInt(localStorageService.get("SedeSIGA")),
          },
          point: {
            id: localStorageService.get("pointSiga").id,
          },
          user: {
            id: auth.id,
            user:auth.userName,
            lastName:auth.lastName,
            name:auth.name
          }
        };
        return sigaDS.stopWork(auth.authToken, data).then(
          function (data) {
            if (data.status === 200) {
              localStorageService.set("dataviewsiga", false);
              localStorageService.set("stateTurnSiga", 0);
              vm.stateTurnSiga = 0;
              vm.getpointOfCares();
              $rootScope.stateTurnSiga = 0;
              $rootScope.dataturn = null;
              localStorageService.remove("turn");
              $scope.$broadcast("angucomplete-alt:clearInput", "pointSiga");
              vm.listPointSiga = [];
              var auth = localStorageService.get(
                "Enterprise_NT.authorizationData"
              );
              if (
                $state.$current.title === "completeverify" ||
                $state.$current.title === "Simpleverification"
              ) {
                vm.turnfilter = 2;
                localStorageService.set("moduleSiga", vm.turnfilter);
                var service =
                  localStorageService.get("VerificacionSIGA") === ""
                    ? undefined
                    : parseInt(localStorageService.get("VerificacionSIGA"));
              }
              if ($state.$current.title === "Orderentry") {
                localStorageService.set("moduleSiga", vm.turnfilter);
                var service =
                  localStorageService.get("OrdenesSIGA") === ""
                    ? undefined
                    : parseInt(localStorageService.get("OrdenesSIGA"));
              }
              if (service !== undefined) {
                return sigaDS
                  .getPoint(auth.authToken,  parseInt(localStorageService.get("SedeSIGA")), service)
                  .then(
                    function (data) {
                      if (data.status === 200) {
                        vm.listPointSiga = data.data;
                      }
                    },
                    function (error) {
                      vm.modalError(error);
                    }
                  );
              }
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }

    function modalError(error) {
      vm.PopupError = true;
      vm.Error = error;
    }
  }
})();
/* jshint ignore:end */
