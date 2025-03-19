(function () {
  "use strict";
  angular
    .module("app.hematologicalcounter")
    .controller(
      "hematologicalcounterController",
      hematologicalcounterController
    )
    .controller("RequeridcounterController", RequeridcounterController);
  hematologicalcounterController.$inject = [
    "hematologicalcounterDS",
    "testDS",
    "configurationDS",
    "localStorageService",
    "logger",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "LZString",
    "ModalService",
    "$translate",
  ];

  function hematologicalcounterController(
    hematologicalcounterDS,
    testDS,
    configurationDS,
    localStorageService,
    logger,
    $filter,
    $state,
    moment,
    $rootScope,
    LZString,
    ModalService,
    $translate
  ) {
    var vm = this;
    $rootScope.menu = true;
    $rootScope.blockView = true;
    vm.init = init;
    vm.title = "hematologicalcounter";
    vm.key = ["key", "text"];
    vm.text = ["text", "key"];
    vm.sortReverse = false;
    vm.sortType = vm.key;
    vm.selected = -1;
    vm.Detail = [];
    vm.isDisabled = true;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;
    vm.isAuthenticate = isAuthenticate;
    vm.get = get;
    vm.getTest = getTest;
    vm.getId = getId;
    vm.New = New;
    vm.Edit = Edit;
    vm.changeState = changeState;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.save = save;
    vm.modalError = modalError;
    vm.removeData = removeData;
    vm.stateButton = stateButton;
    vm.generateFile = generateFile;
    var auth;
    vm.keyRepeat = false;
    vm.textRepeat = false;
    vm.getConfigurationFormatDate = getConfigurationFormatDate;
    vm.errorservice = 0;
    vm.windowOpenReport = windowOpenReport;
    vm.loadingdata = true;
    //** Metodo para obtener los examenes de tipo númerico**//
    function getTest() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return testDS.getTestArea(auth.authToken, 0, 1, 0).then(
        function (data) {
          if (data.data.length === 0) {
            ModalService.showModal({
              templateUrl: "Requeridcounter.html",
              controller: "RequeridcounterController",
            }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                vm.loadingdata = false;
                $state.go(result);
              });
            });
          } else {
            vm.listest = $filter("orderBy")(data.data, "name");
            vm.get();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Metodo que elimina los elementos sobrantes en la grilla**//
    function removeData(data) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      data.data.forEach(function (value, key) {
        delete value.user;
        delete value.lastTransaction;
        delete value.lastTransaction;
        data.data[key].username = auth.userName;
      });
      return data.data;
    }
    //** Metodo que valida la autenticación**//
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    //** Metodo configuración formato**//
    function getConfigurationFormatDate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return configurationDS
        .getConfigurationKey(auth.authToken, "FormatoFecha")
        .then(
          function (data) {
            vm.getTest();
            if (data.status === 200) {
              vm.formatDate = data.data.value.toUpperCase();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }
    //** Metodo que habilita y desabilita los botones**//
    function stateButton(state) {
      if (state === "init") {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit =
          vm.Detail.id === null || vm.Detail.id === undefined ? true : false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
      if (state === "add") {
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById("key").focus();
        }, 100);
      }
      if (state === "edit") {
        vm.isDisabledState = false;
        vm.isDisabledAdd = true;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = false;
        vm.isDisabledCancel = false;
        vm.isDisabledPrint = true;
        vm.isDisabled = false;
        setTimeout(function () {
          document.getElementById("key").focus();
        }, 100);
      }
      if (state === "insert") {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
      }
      if (state === "update") {
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = false;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabled = true;
        vm.isDisabledState = true;
      }
    }
    //** Método que  inicializa y habilita los controles cuando se da click en el botón nuevo**//
    function New(form) {
      form.$setUntouched();
      vm.usuario = "";
      vm.selected = -1;
      vm.Detail = {
        id: null,
        key: "",
        text: "",
        type: false,
        sum: false,
        test: {},
        lastTransaction: null,
        user: {
          id: auth.id,
        },
      };
      vm.stateButton("add");
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón cancelar**//
    function cancel(Form) {
      vm.keyRepeat = false;
      vm.textRepeat = false;
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = [];
      } else {
        vm.getId(vm.Detail.id, vm.selected, Form);
      }
      vm.stateButton("init");
    }
    //** Método que habilita  o desabilita los controles cuando se da click en el botón editar**//
    function Edit() {
      vm.stateButton("edit");
    }
    //** Método que evalua si se  va crear o actualizar**//
    function save(Form) {
      vm.loadingdata = true;
      Form.$setUntouched();
      vm.Detail.type = vm.Detail.type === true ? 1 : 2;
      if (vm.Detail.id === null) {
        vm.insert();
      } else {
        vm.update();
      }
    }
    //** Método se comunica con el dataservice e inserta**//
    function insert() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return hematologicalcounterDS.New(auth.authToken, vm.Detail).then(
        function (data) {
          if (data.status === 200) {
            vm.get();
            vm.Detail = data.data;
            vm.selected = data.data.id;
            vm.Detail.type = vm.Detail.type === 1 ? true : false;
            vm.stateButton("insert");
            logger.success($filter("translate")("0042"));
            return data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método se comunica con el dataservice y actualiza**//
    function update() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.Detail.user.id = auth.id;
      return hematologicalcounterDS.update(auth.authToken, vm.Detail).then(
        function (data) {
          if (data.status === 200) {
            vm.get();
            vm.Detail.type = vm.Detail.type === 1 ? true : false;
            logger.success($filter("translate")("0042"));
            vm.stateButton("update");
            return data;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método para sacar el popup de error**//
    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split("|");
            if (item[0] === "1" && item[1] === "key") {
              vm.keyRepeat = true;
            }
            if (item[0] === "1" && item[1] === "text") {
              vm.textRepeat = true;
            }
          });
        }
      }
      if (vm.keyRepeat === false && vm.textRepeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
      vm.loadingdata = false;
    }
    //** Método muestra un popup de confirmación para el cambio de estado**//
    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }
    //** Método que obtiene la lista para llenar la grilla**//
    function get() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      return hematologicalcounterDS.get(auth.authToken).then(
        function (data) {
          vm.data = data.data.length === 0 ? data.data : removeData(data);
          vm.loadingdata = false;
          return vm.data;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método se comunica con el dataservice y trae los datos por el id**//
    function getId(id, index, Form) {
      vm.loadingdata = true;
      vm.keyRepeat = false;
      vm.textRepeat = false;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.selected = id;
      vm.Detail = [];
      Form.$setUntouched();
      return hematologicalcounterDS.getId(auth.authToken, id).then(
        function (data) {
          if (data.status === 200) {
            vm.usuario = $filter("translate")("0017") + " ";
            vm.usuario =
              vm.usuario +
              moment(data.data.lastTransaction).format(vm.formatDate) +
              " - ";
            vm.usuario = vm.usuario + data.data.user.userName;
            vm.Detail = data.data;

            vm.Detail.type = vm.Detail.type === 1 ? true : false;
            vm.stateButton("update");
            vm.loadingdata = false;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    //** Método  para imprimir el reporte**//
    function generateFile() {
      vm.listreport = [];
      vm.filtered.forEach(function (value, key) {
        var element = {
          key: vm.filtered[key].key,
          text: vm.filtered[key].text,
          type: vm.filtered[key].type,
          sum: vm.filtered[key].sum,
          test: vm.filtered[key].test.name,
          lastTransaction: vm.filtered[key].lastTransaction,
          username: vm.filtered[key].username,
        };
        vm.listreport.push(element);
      });
      if (vm.listreport.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.listreport;
        vm.pathreport =
          "/report/configuration/test/hematologicalcounter/hematologicalcounter.mrt";
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }
    // función para ver pdf el reporte detallado del error
    function windowOpenReport() {
      var parameterReport = {};
      parameterReport.variables = vm.variables;
      parameterReport.pathreport = vm.pathreport;
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );
      var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
      localStorageService.set("parameterReport", parameterReport);
      localStorageService.set("dataReport", datareport);
      window.open("/viewreport/viewreport.html");
    }
    //** Método que carga los metodos que inicializa la pagina*//
    function init() {
      vm.getConfigurationFormatDate();
      vm.Listkeys = [
        { id: "0", name: "0" },
        { id: "1", name: "1" },
        { id: "2", name: "2" },
        { id: "3", name: "3" },
        { id: "4", name: "4" },
        { id: "5", name: "5" },
        { id: "6", name: "6" },
        { id: "7", name: "7" },
        { id: "8", name: "8" },
        { id: "9", name: "9" },       
        { id: "a", name: "a" },
        { id: "b", name: "b" },
        { id: "c", name: "c" },
        { id: "d", name: "d" },
        { id: "e", name: "e" },
        { id: "f", name: "f" },
        { id: "g", name: "g" },
        { id: "h", name: "h" },
        { id: "i", name: "i" },
        { id: "j", name: "j" },
        { id: "k", name: "k" },
        { id: "l", name: "l" },
        { id: "m", name: "m" },
        { id: "n", name: "n" },
        { id: "o", name: "o" },
        { id: "p", name: "p" },
        { id: "q", name: "q" },
        { id: "r", name: "r" },
        { id: "s", name: "s" },
        { id: "t", name: "t" },
        { id: "u", name: "u" },
        { id: "v", name: "v" },
        { id: "w", name: "w" },
        { id: "x", name: "x" },
        { id: "y", name: "y" },
        { id: "z", name: "z" },
        { id: "*", name: "*" },
        { id: "+", name: "+" },
        { id: "-", name: "-" },
        { id: ".", name: "." },
        { id: "/", name: "/" },
        { id: "*", name: "*" },
        { id: "Enter", name: "Enter" },
        { id: "Shift", name: "Shift" },
        { id: "Ctrl", name: "Ctrl" },
        { id: "Alt", name: "Alt" },
        { id: "Esc", name: "Esc" },
        { id: "Space", name: "Space" },
        { id: "ArrowUp", name: "ArrowUp" },
        { id: "ArrowDown", name: "ArrowDown" },
        { id: "ArrowLeft", name: "ArrowLeft" },
        { id: "ArrowRight", name: "ArrowRight" },
        { id: "Backspace", name: "Backspace" },
        { id: "Tab", name: "Tab" },
        { id: "Caps Lock", name: "Caps Lock" },
        { id: "Delete", name: "Delete" } 
      ];
    }
    vm.isAuthenticate();
  }
  //** Método para la ventana modal de los requeridos*//
  function RequeridcounterController($scope, close) {
    $scope.close = function (result) {
      close(result, 500);
    };
  }
})();
