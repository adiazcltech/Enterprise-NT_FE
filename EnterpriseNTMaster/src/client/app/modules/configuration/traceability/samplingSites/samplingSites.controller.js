(function () {
  "use strict";

  angular
    .module("app.samplingSites")
    .controller("samplingSitesController", samplingSitesController);

  samplingSitesController.$inject = [
    "localStorageService",
    "logger",
    "$filter",
    "$state",
    "$rootScope",
    "samplingSitesDS",
    "LZString",
    "$translate",
  ];

  function samplingSitesController(
    localStorageService,
    logger,
    $filter,
    $state,
    $rootScope,
    samplingSitesDS,
    LZString,
    $translate
  ) {
    var vm = this;

    $rootScope.menu = true;
    vm.title = "samplingSites";
    $rootScope.NamePage = $filter("translate")("3235");
    $rootScope.helpReference = "configurate/samplingSites/samplingSites.htm";

    vm.isAuthenticate = isAuthenticate;
    vm.windowOpenReport = windowOpenReport;

    vm.init = init;

    vm.New = New;
    vm.Edit = Edit;
    vm.save = save;
    vm.cancel = cancel;
    vm.insert = insert;
    vm.update = update;
    vm.modalError = modalError;
    vm.changeState = changeState;
    vm.generateFile = generateFile;

    vm.stateButton = stateButton;
    vm.getSamplingSites = getSamplingSites;
    vm.getSelectedItemId = getSelectedItemId;

    vm.selected = -1;
    vm.Detail = null;
    vm.isDisabled = true;
    vm.loadingdata = false;
    vm.isDisabledAdd = false;
    vm.isDisabledEdit = true;
    vm.isDisabledSave = true;
    vm.isDisabledCancel = true;
    vm.isDisabledPrint = false;
    vm.isDisabledState = true;

    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }

    function init() {
      vm.stateButton("init");
      vm.getSamplingSites();
    }

    function getSamplingSites() {
      samplingSitesDS.getSamplingSites().then(
        function (response) {
          if (response.status === 200) {
            vm.samplingSites = $filter("orderBy")(response.data, "name");
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }

    function stateButton(state) {
      switch (state) {
        case "init":
          vm.isDisabledAdd = false;
          vm.isDisabledEdit =
            vm.Detail === null || vm.Detail === undefined ? true : false;
          vm.isDisabledSave = true;
          vm.isDisabledCancel = true;
          vm.isDisabled = true;
          vm.isDisabledstate = true;
          vm.placeholder = "##:##";
          break;
        case "add":
          vm.isDisabledAdd = true;
          vm.isDisabledEdit = true;
          vm.isDisabledSave = false;
          vm.isDisabledCancel = false;
          vm.isDisabled = false;
          vm.isDisabledstate = true;
          vm.placeholder = "";
          break;
        case "edit":
          vm.isDisabledAdd = true;
          vm.isDisabledEdit = true;
          vm.isDisabledSave = false;
          vm.isDisabledCancel = false;
          vm.isDisabled = false;
          vm.isDisabledstate = false;
          vm.placeholder = "";
          break;
        case "insert":
          vm.isDisabledAdd = false;
          vm.isDisabledEdit = false;
          vm.isDisabledSave = true;
          vm.isDisabledCancel = true;
          vm.isDisabled = true;
          vm.isDisabledstate = true;
          vm.placeholder = "##:##";
          break;
        case "update":
          vm.isDisabledAdd = false;
          vm.isDisabledEdit = false;
          vm.isDisabledSave = true;
          vm.isDisabledCancel = true;
          vm.isDisabled = true;
          vm.isDisabledstate = true;
          vm.placeholder = "";
          break;
        default:
          break;
      }
    }

    function New(form) {
      form.$setUntouched();      
      vm.Detail = {
        active : true,
        automaticPrintingEnabled:true,
        designatedPerson :0,
        disabled:false,
        name:"",
        numberOfAssignedPeople:0
      };
      vm.usuario = "";
      vm.selected = -1;

      vm.stateButton("add");
    }

    function Edit() {
      vm.stateButton("edit");
    }

    function save(Form) {
      Form.$setUntouched();
      if (vm.Detail.id === null || vm.Detail.id == undefined) {
        vm.insert();
      } else {
        vm.update();
      }
    }

    function cancel(Form) {
      if (vm.Detail.id === null || vm.Detail.id === undefined) {
        vm.Detail = null;
      } else {
        vm.getSelectedItemId(vm.Detail.id, vm.selected, Form);
      }
      Form.$setUntouched();
      vm.stateButton("init");
    }

    function insert() {
      vm.loadingdata = true;
      return samplingSitesDS.insertSamplingSites(vm.Detail).then(
        function (data) {
          if (data.status === 200) {
            vm.loadingdata = false;
            vm.getSamplingSites();
            vm.Detail = data.data;
            vm.stateButton("insert");
            logger.success($filter("translate")("0042"));
            return data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    function update() {
      vm.loadingdata = true;
      return samplingSitesDS.updateSamplingSites(vm.Detail).then(
        function (data) {
          if (data.status === 200) {
            vm.loadingdata = false;
            vm.getSamplingSites();
            logger.success($filter("translate")("0042"));
            vm.stateButton("update");
            return data;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    function generateFile() {
      if (vm.listSamplingSites.length === 0) {
        vm.open = true;
      } else {
        vm.variables = {};
        vm.datareport = vm.listSamplingSites;
        vm.pathreport =
          "/report/configuration/traceability/samplingsites/samplingsites.mrt";
        vm.openreport = false;
        vm.report = false;
        vm.windowOpenReport();
      }
    }

    function getSelectedItemId(id, index, Form) {
      vm.selected = id;
      vm.Detail = {};
      Form.$setUntouched();
      vm.loadingdata = true;
      return samplingSitesDS.getSamplingSiteById(id).then(
        function (data) {
          if (data.status === 200) {
            vm.loadingdata = false;
            vm.Detail = data.data;
            vm.stateButton("update");
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    function changeState() {
      if (!vm.isDisabledState) {
        vm.ShowPopupState = true;
      }
    }

    function modalError(error) {
      if (error.data !== null) {
        if (error.data.code === 2) {
          error.data.errorFields.forEach(function (value) {
            var item = value.split("|");
            if (item[0] === "1" && item[1] === "name") {
              vm.Repeat = true;
            }
          });
        }
      }
      if (vm.Repeat === false) {
        vm.Error = error;
        vm.ShowPopupError = true;
      }
    }

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

    vm.isAuthenticate();
  }
})();
