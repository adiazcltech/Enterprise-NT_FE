/* jshint ignore:start */
(function () {
  "use strict";
  angular
    .module("app.orderentry")
    .controller("orderentryController", orderentryController);

  orderentryController.$inject = [
    "localStorageService",
    "barcodeDS",
    "logger",
    "orderDS",
    "patientDS",
    "orderentryDS",
    "sigaDS",
    "cashboxDS",
    "convertnumberliteral",
    "motiveDS",
    "userDS",
    "serviceDS",
    "TribunalDS",
    "specialdeletesDS",
    "reportsDS",
    "reportadicional",
    "$filter",
    "$state",
    "moment",
    "$rootScope",
    "common",
    "$translate",
    "LZString",
    "$hotkey",
    "$scope",
    "resultsentryDS",
    "demographicDS",
  ];

  function orderentryController(
    localStorageService,
    barcodeDS,
    logger,
    orderDS,
    patientDS,
    orderentryDS,
    sigaDS,
    cashboxDS,
    convertnumberliteral,
    motiveDS,
    userDS,
    serviceDS,
    TribunalDS,
    specialdeletesDS,
    reportsDS,
    reportadicional,
    $filter,
    $state,
    moment,
    $rootScope,
    common,
    $translate,
    LZString,
    $hotkey,
    $scope,
    resultsentryDS,
    demographicDS
  ) {
    var vm = this;
    vm.loadingdata = true;
    $rootScope.pageview = 3;
    var auth = localStorageService.get("Enterprise_NT.authorizationData");
    vm.administrator = auth.administrator;
    $rootScope.helpReference = "01. LaboratoryOrders/orderentry.htm";
    vm.staticDemoIds = {
      patientDB: -99,
      patientComment: -997,
      documentType: -10,
      patientId: -100,
      lastName: -101,
      surName: -102,
      name1: -103,
      name2: -109,
      sex: -104,
      birthday: -105,
      age: -110,
      email: -106,
      weight: -8,
      size: -9,
      race: -7, //demografico
      orderDB: -998,
      orderComment: -996,
      order: -107,
      orderDate: -108,
      orderType: -4, //demografico
      rate: -3, //demografico
      branch: -5, //demografico
      service: -6, //demografico
      account: -1, //demografico
      physician: -2, //demografico
      phone: -111,
      address: -112,
      createUser: -113,
    };
    vm.listestresult = [];
    vm.saveedit = false;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.inconsistency = false;
    vm.title = "Orderentry";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0011");
    vm.stateControl = 8;
    vm.searchByDate = searchByDate;
    vm.ordercomment = "";
    vm.patientcoment = "";
    vm.permissioncancel = false;
    vm.statediagnostic = 1;
    vm.statecomment = 1;
    vm.getBarcode = getBarcode;
    vm.printlabels = printlabels;
    vm.directImpression = directImpression;
    vm.endturn = endturn;
    vm.normalizeNumberFormat = normalizeNumberFormat;
    vm.motiveeditsave = motiveeditsave;
    vm.ipuser = null;
    vm.save = false;
    vm.disabledendturn = disabledendturn;
    vm.viewphoto = false;
    //Variables con directivas
    vm.selectedDate = new Date();
    vm.eventSelectDate = eventSelectDate;

    //Variables de control
    vm.deleteTests = [];
    vm.savephotopatient = savephotopatient;
    vm.modalError = modalError;
    vm.showModalSearch = false;
    vm.showModalDailySearch = false;
    vm.showModalRequirement = false;
    vm.showModalQuote = false;
    vm.showModalProfileInfo = false;
    vm.showModalInterview = false;
    vm.showModalSearchRecall = false;
    vm.showModalCashbox = false;
    vm.orderSearchEvent = orderSearchEvent;
    vm.selectedOrder = 0;
    vm.order = undefined;
    // vm.patientPhoto = 'images/user.png';
    vm.patientDemos = {};
    vm.patientDemosValues = {};
    vm.patientDemosDisabled = {};
    vm.orderDemos = {};
    vm.orderDemosValues = {};
    vm.orderDemosDisabled = {};
    vm.demosAll = [{}, {}];
    vm.loadDemographicControls = loadDemographicControls;
    vm.selectedPatientId = selectedPatientId;
    vm.loadTests = loadTests;
    vm.listDataTest = new Array();
    vm.listDataTest.push([]);
    vm.listDataTest.push([]);
    vm.cleanTests = 0;
    vm.selectLastOrder = selectLastOrder;

    vm.loadPatient = loadPatient;
    vm.loadOrder = loadOrder;
    vm.setdataorder = setdataorder;
    vm.loadOrderRecalled = loadOrderRecalled;

    //Eventos de botones
    vm.eventNew = eventNew;
    vm.eventinconsistencypacient = eventinconsistencypacient;
    vm.eventEdit = eventEdit;
    vm.eventCancel = eventCancel;
    vm.eventConfirmCancel = eventConfirmCancel;
    vm.eventUndo = eventUndo;
    vm.eventSave = eventSave;
    vm.eventSearch = eventSearch;
    vm.eventDailySearch = eventDailySearch;
    vm.eventBarcodes = eventBarcodes;
    vm.eventTicket = eventTicket;
    vm.eventRequirement = eventRequirement;
    vm.eventQuote = eventQuote;
    vm.eventValidityResult = eventValidityResult;
    vm.eventProfileInfo = eventProfileInfo;
    vm.eventInterview = eventInterview;
    vm.eventRecall = eventRecall;
    vm.eventCashbox = eventCashbox;
    vm.eventCashReceipt = eventCashReceipt;
    vm.windowOpenReport = windowOpenReport;
    vm.variablesReport = variablesReport;
    vm.eventTransferTurn = eventTransferTurn;
    vm.getdemographictest = getdemographictest;
    vm.saveAttachment = saveAttachment;
    vm.validationCancel = validationCancel;
    vm.getMotives = getMotives;

    //Botones
    vm.newDisabled = false;
    vm.editDisabled = true;
    vm.cancelDisabled = true;
    vm.saveDisabled = true;
    vm.undoDisabled = true;
    vm.dailyDisabled = false;
    vm.searchDisabled = false;
    vm.barcodesDisabled = true;
    vm.interviewDisabled = true;
    vm.ticketDisabled = true;
    vm.requirementDisabled = false;
    vm.quoteDisabled = false;
    vm.recallDisabled = false;
    vm.cashboxDisabled = true;
    vm.cashreceiptDisabled = false;
    vm.hasCashbox = false;
    vm.invoiceDisabled = false;
    vm.invoiceDisabledparticular = false;
    vm.attachmentDisabled = true;
    vm.worklistDisabled = true;
    vm.printReportDisabled = true;
    vm.observationsDisabled = true;
    vm.loading = false;
    vm.numLiteral = numLiteral;
    vm.openSearch = false;
    vm.listenerDemographic = listenerDemographic;
    vm.orderTestByDemographics = orderTestByDemographics;
    vm.workListOrder = workListOrder;
    vm.variablesReportWorkList = variablesReportWorkList;
    vm.printinvoice = printinvoice;
    //Combo Examenes
    vm.tests = [];
    vm.selectedTest = [];
    vm.testCashReceipt = [];
    vm.selectTest = selectTest;
    vm.disabledTests = true;
    vm.focusOutListTest = focusOutListTest;
    vm.insertdiagnosticorder = insertdiagnosticorder;
    vm.lastOrderAlarm = lastOrderAlarm;
    vm.getnotecredite = getnotecredite;
    vm.savenotecredit = savenotecredit;
    vm.viewinvoice = viewinvoice;
    vm.eventloadexcel = eventloadexcel;
    vm.eventinconsistency = eventinconsistency;
    //Muestras y recipientes
    vm.samples = [];
    //Combo Tarifas
    vm.rates = [];
    //Funciones de utilidad
    vm.validateForm = validateForm;
    //Objecto de valides del resultado
    vm.resultValidity = {};
    vm.cash = {};
    vm.commentsorder = {};
    vm.automaticCashbox = localStorageService.get("CajaAutomatica") === "True";
    vm.addtesservice =
      localStorageService.get("AgregarExamenesServicios") === "True";
    vm.editorderCashbox = localStorageService.get("EditarEmpresa") === "True";

    vm.printselect = printselect;
    vm.getTestByOrderId = getTestByOrderId;
    vm.getObservations = getObservations;
    vm.getProcessPrint = getProcessPrint;

    // //Asigna eventos a los hotkeys
    $hotkey.bind("F2", function (event) {
      if (
        !vm.newDisabled &&
        $state.$current.controller === "orderentryController"
      ) {
        eventNew();
      }
    });
    $hotkey.bind("F3", function (event) {
      event.preventDefault();
      if (
        !vm.editDisabled &&
        $state.$current.controller === "orderentryController"
      ) {
        eventEdit();
      }
    });
    $hotkey.bind("F4", function (event) {
      if (
        !vm.cancelDisabled &&
        $state.$current.controller === "orderentryController"
      ) {
        eventCancel();
      }
    });
    $hotkey.bind("alt+S", function (event) {
      if (
        !vm.saveDisabled &&
        $state.$current.controller === "orderentryController"
      ) {
        vm.save = true;
        if (!vm.quickSave) {
          vm.quickSave = true;
          setTimeout(function () {
            eventSave();
          }, 100);
        }
      }
    });
    $hotkey.bind("F9", function (event) {
      if (
        !vm.searchDisabled &&
        $state.$current.controller === "orderentryController"
      ) {
        eventSearch();
      }
    });
    $hotkey.bind("F10", function (event) {
      if (
        !vm.barcodesDisabled &&
        $state.$current.controller === "orderentryController"
      ) {
        vm.eventBarcodes();
      }
    });
    $hotkey.bind("F12", function (event) {
      if (
        !vm.ticketDisabled &&
        $state.$current.controller === "orderentryController"
      ) {
        eventTicket();
      }
    });

    $hotkey.bind("F8", function (event) {
      if (
        !vm.printReportDisabled &&
        vm.printReport &&
        $state.$current.controller === "orderentryController"
      ) {
        vm.printselect();
      }
    });

    $rootScope.$watch("ipUser", function () {
      vm.ipuser = $rootScope.ipUser;
    });

    $rootScope.$watch("stateTurnSiga", function () {
      vm.dataviewsiga = localStorageService.get("dataviewsiga");
      vm.activesigaorder =
        localStorageService.get("moduleSiga") === null
          ? ""
          : parseInt(localStorageService.get("moduleSiga"));
      if ($rootScope.stateTurnSiga === undefined) {
        vm.serviceEntrySiga =
          localStorageService.get("stateTurnSiga") === null
            ? ""
            : parseInt(localStorageService.get("stateTurnSiga"));
      } else {
        vm.serviceEntrySiga = $rootScope.stateTurnSiga;
      }
    });
    $rootScope.$watch("dataturn", function () {
      vm.dataturn = localStorageService.get("turn");
    });
    $rootScope.$watch("orderecall", function () {
      if (
        $rootScope.orderecall === true &&
        $state.$current.self.name === "orderentry"
      ) {
        vm.showModalSearchRecall = true;
        $rootScope.orderecall = false;
      }
    });
    $rootScope.$watch("viewturnnew", function () {
      vm.viewturnnew = $rootScope.viewturnnew;
    });

    function getObservations() {
      vm.demosobservations = [];
      vm.patientDemos.forEach(function (value) {
        if (
          value.id === -10 ||
          value.id === -104 ||
          value.id === -7 ||
          value.id > 0
        ) {
          vm.demosobservations.push({
            origin: "H",
            name: value.name,
            coded:
              value.id === -10 || value.id === -104 || value.id === -7
                ? true
                : value.coded,
            value: vm.patientDemosValues[value.id],
          });
        }
      });
      vm.orderDemos.forEach(function (value) {
        if (
          value.id === -4 ||
          value.id === -3 ||
          value.id === -5 ||
          value.id === -6 ||
          value.id === -1 ||
          value.id === -2 ||
          value.id > 0
        ) {
          vm.demosobservations.push({
            origin: "O",
            name: value.name,
            coded:
              value.id === -4 ||
              value.id === -3 ||
              value.id === -5 ||
              value.id === -6 ||
              value.id === -1 ||
              value.id === -2
                ? true
                : value.coded,
            value: vm.orderDemosValues[value.id],
          });
        }
      });
      UIkit.modal("#observationsmodal").show();
    }

    function getTestByOrderId() {}

    function printselect() {
      vm.save = true;
      setTimeout(function () {
        vm.dataprint = [];
        vm.areaslist = [];
        var tests = vm.listDataTest[0];
        if (tests !== undefined && tests !== null && tests.length > 0) {
          vm.areaslist = _.uniqBy(
            _.map(tests, function (value) {
              return {
                id: value.areaId,
                name: value.areaName,
              };
            }),
            "id"
          );
          vm.openreportfinalprint = true;
        }
      }, 100);
    }

    function workListOrder() {
      vm.save = true;
      vm.returncomment = true;
      setTimeout(function () {
        var patient = getPatientData();
        var order = getOrderData();
        var comments = vm.commentsorder;
        var tests = vm.listDataTest[0];
        var years = common.getAgeAsString(
          moment(patient.birthday).format(vm.formatDateAge),
          vm.formatDateAge,
          order.createdDate
        );
        var datebirthday = "";
        var birthday = moment(
          patient.birthday,
          vm.formatDate.toUpperCase()
        ).valueOf();
        if (isNaN(birthday)) {
          datebirthday = moment(patient.birthday).format(
            vm.formatDate.toUpperCase()
          );
        }
        patient.birthday = datebirthday;
        patient.years = years;
        var datareport = {
          patient: patient,
          order: order,
          comments: comments,
          tests: tests,
        };
        if (tests.length > 0) {
          vm.pathreport = "/Report/post-analitic/worklist/worklistedorder.mrt";
          vm.datareport = datareport;
          vm.variables = vm.variablesReportWorkList(
            order.createdDateShort,
            order.type.name
          );
          vm.windowOpenReport();
        }
      }, 500);
    }

    function variablesReportWorkList(date, type) {
      var customer = vm.abbrCustomer + " (" + vm.nameCustomer + ")";
      var rangeInit = $filter("translate")("0073") + ": " + date;
      var rangeEnd = $filter("translate")("0074") + ": " + date;
      var Variables = [
        {
          ACCOUNT: customer,
          RANGE_INI: rangeInit, //Orden inicial o Fecha Inicial
          RANGE_END: rangeEnd, //Orden final o Fecha final
          TODAY:
            $filter("translate")("0325") +
            ": " +
            moment().format(vm.formatDateAge),
          SHEET: "", // Nombre de la hoja de trabajo seleccionada
          ORDERTYPE: type, // Nombre de tipo de orden
          USERNAME: localStorageService.get("Enterprise_NT.authorizationData")
            .userName,
        },
      ];
      return Variables;
    }

    vm.validatedservice = validatedservice;
    function validatedservice() {
      var id = localStorageService.get("serviceidvalidated");
      if (id !== "") {
        serviceDS.getserviceId(auth.authToken, id).then(
          function (response) {
            if (response.status === 200) {
              if (vm.servicehospitalary !== response.data.hospitalSampling) {
                vm.permissioncancel = false;
                vm.blockservice = false;
                vm.servicehospitalary = response.data.hospitalSampling;
                if (
                  vm.addtesservice &&
                  vm.teststateprint &&
                  vm.servicehospitalary
                ) {
                  vm.selectedTest = JSON.parse(JSON.stringify(vm.comparetest));
                  vm.permissioncancel = false;
                  vm.blockservice = true;
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
    function orderTestByDemographics(data) {
      var tests = [];
      data.forEach(function (value, key) {
        var findTest = _.find(vm.tests, function (o) {
          return o.id === value;
        });
        if (findTest) {
          tests.push({
            originalObject: findTest,
            title: findTest.name,
            description: findTest.area.name,
          });
        }
      });
      return tests;
    }
    function listenerDemographic(list) {
      vm.listTestsByDemographics = [];
      if (list.length > 0) {
        var tests = [];
        list.forEach(function (value, key) {
          value.tests.forEach(function (test, key) {
            tests.push(test);
          });
        });
        if (tests.length > 0) {
          tests = vm.orderTestByDemographics(_.uniq(tests));
          if (tests.length > 0) {
            vm.listTestsByDemographics = tests;
          }
        }
      }
    }
    function disabledendturn() {
      var disabled = false;
      if (
        vm.dataturn.number !== undefined &&
        $rootScope.dataturn.number !== undefined
      ) {
        if (
          (vm.dataturn.number === $rootScope.dataturn.number) ===
          vm.dataturn
        ) {
          disabled = true;
        }
      }
      return disabled;
    }
    function getdemographictest() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return demographicDS.getdemographictest(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.listdemographictest = data.data;
          }
          vm.loading = false;
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function printinvoice() {
      vm.commentinvoice = "";
      vm.bill = "";
      UIkit.modal("#invoice").show();
    }
    function lastOrderAlarm() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var idPatient = vm.patientDemosValues["-99"];
      if (idPatient) {
        vm.loading = true;
        return orderDS.getLastOrder(auth.authToken, idPatient).then(
          function (data) {
            if (data.status === 200) {
              vm.lastOrderPatient = data.data;
              UIkit.modal("#lastOrder").show();
            }
            vm.loading = false;
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }
    }
    function getnotecredite() {
      vm.loading = true;
      vm.detail = [];
      vm.notevalue = null;
      vm.maxdinner = 0;
      vm.commentcredit = "";
      vm.isPenny =
        localStorageService.get("ManejoCentavos") === "True" ? "n2" : "n0";
      vm.decimal = localStorageService.get("ManejoCentavos") === "True" ? 2 : 0;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      vm.simbolmoney =
        localStorageService.get("SimboloMonetario") === "" ||
        localStorageService.get("SimboloMonetario") === null
          ? "$"
          : localStorageService.get("SimboloMonetario");
      return cashboxDS.getinvoicedetail(auth.authToken, vm.numberinvoice).then(
        function (data) {
          if (data.status === 200) {
            vm.loading = false;
            vm.maxdinner = data.data.total;
            vm.detail = data.data;
            vm.detail.patient = getPatientData();
            vm.detail.order = getOrderData();
            UIkit.modal("#notecredite").show();
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function savenotecredit() {
      vm.loading = true;
      var creditnote = {
        invoiceNumber: vm.numberinvoice,
        dateOfNote: new Date(moment().format()).getTime(),
        cancellationReason: vm.commentcredit,
        value: vm.notevalue,
        type: 0,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return cashboxDS.createCreditNote(auth.authToken, creditnote).then(
        function (data) {
          if (data.status === 200) {
            vm.detail = [];
            vm.notevalue = null;
            vm.maxdinner = 0;
            vm.commentcredit = "";
            logger.info($filter("translate")("1617") + " " + data.data);
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return cashboxDS
              .getinvoicedetail(auth.authToken, vm.numberinvoice)
              .then(
                function (data) {
                  if (data.status === 200) {
                    vm.loading = false;
                    data.data.ratesNames = _.map(data.data.ratesNames);
                    data.data.ratesNames = data.data.ratesNames.toString();
                    vm.maxdinner = data.data.value;
                    vm.detail = data.data;
                    if (vm.detail.value === 0) {
                      UIkit.modal("#notecredite").hide();
                      vm.orderSearchEvent(vm.selectedOrder);
                    }
                    logger.success($filter("translate")("0149"));
                  } else {
                    vm.loading = false;
                    UIkit.modal("#notecredite").hide();
                    vm.orderSearchEvent(vm.selectedOrder);
                  }
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function viewinvoice() {
      vm.loading = true;
      var invoice = {
        order: vm.order,
        comment: vm.commentinvoice,
        invoiceNumber: vm.bill,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return cashboxDS.getinvoceorder(auth.authToken, invoice).then(
        function (data) {
          if (data.status === 200) {
            UIkit.modal("#invoice").hide();
            vm.loading = false;
            vm.orderSearchEvent(vm.order);
            var billingTest = [];
            data.data.billingTest.forEach(function (value) {
              var data = {
                insurancePrice: value.insurancePrice,
                patientPrice: value.patientPrice,
                servicePrice: value.servicePrice,
                testAbbr: value.test.abbr,
                testCode: value.test.code,
                testId: value.test.id,
                testName: value.test.name,
              };
              billingTest.push(data);
            });

            vm.datareport = billingTest;
            vm.variables = {
              accountNit: data.data.invoiceHeader[0].accountNit,
              initialOrder: data.data.invoiceHeader[0].initialOrder,
              accountName: data.data.invoiceHeader[0].accountName,
              accountPhone: data.data.invoiceHeader[0].accountPhone,
              accountAddress: data.data.invoiceHeader[0].accountAddress,
              dateOfInvoice: moment(data.data.dateOfInvoice).format(
                "DD/MM/YYYY"
              ),
              comment: data.data.comment,
              invoiceNumber: data.data.invoiceNumber,
              moderatorFee: data.data.invoiceHeader[0].totalModeratingFee,
              copayment: data.data.invoiceHeader[0].totalCopayment,
              discountValue: data.data.discount,
              taxValue: data.data.tax,
              total: data.data.total,
            };

            vm.pathreport =
              "/Report/pre-analitic/invoiceorder/invoiceorder.mrt";
            var parameterReport = {};
            parameterReport.variables = vm.variables;
            parameterReport.pathreport = vm.pathreport;
            parameterReport.labelsreport = JSON.stringify(
              $translate.getTranslationTable()
            );
            var datareport = LZString.compressToUTF16(
              JSON.stringify(vm.datareport)
            );
            localStorageService.set("parameterReport", parameterReport);
            localStorageService.set("dataReport", datareport);
            window.open("/viewreport/viewreport.html");
          } else {
            UIkit.modal("#invoice").hide();
            vm.loading = false;
          }
        },
        function (error) {
          vm.loading = false;
          vm.dataerror = "";
          if (error.data !== null) {
            if (error.data.code === 2) {
              error.data.errorFields.forEach(function (value) {
                var item = value.split("|");
                if (
                  item[0] === "1" &&
                  item[1].search(
                    "No sequence found to generate the invoice number with the resolution"
                  ) !== -1
                ) {
                  logger.error($filter("translate")("1566"));
                  vm.dataerror = $filter("translate")("1566");
                }
                if (
                  item[0] === "2" &&
                  item[1].search("provider not fount.") !== -1
                ) {
                  logger.error("Debe configurar provedores");
                  vm.dataerror = $filter("Debe configurar provedores");
                }
                if (
                  item[0] === "1" &&
                  item[1] ===
                    "The associated entity does not have an assigned resolution"
                ) {
                  logger.error($filter("translate")("1567"));
                  vm.dataerror = $filter("translate")("1567");
                }
                if (
                  item[0] === "1" &&
                  item[1] === "Invoice numbering has been exceeded"
                ) {
                  logger.error($filter("translate")("1568"));
                  vm.dataerror = $filter("translate")("1568");
                }
                if (item[0] === "1" && item[1] === "Duplicate invoice number") {
                  logger.error($filter("translate")("1569"));
                  vm.dataerror = $filter("translate")("1569");
                }
                if (
                  item[0] === "1" &&
                  item[1] === "Invoice creation without invoice number"
                ) {
                  logger.error($filter("translate")("1570"));
                  vm.dataerror = $filter("translate")("1570");
                }
                if (
                  item[0] === "1" &&
                  item[1] === "The current amount exceeds the maximum amount"
                ) {
                  logger.error($filter("translate")("1571"));
                  vm.dataerror = $filter("translate")("1571");
                }
                if (
                  item[0] === "1" &&
                  item[1] ===
                    "The current amount could not be assigned to the client"
                ) {
                  logger.error($filter("translate")("1572"));
                  vm.dataerror = $filter("translate")("1572");
                }
                if (item[0] === "1" && item[1] === "Limit per capita") {
                  logger.error($filter("translate")("1573"));
                  vm.dataerror = $filter("translate")("1573");
                }
                if (item[0] === "1" && item[1] === "Resolution not fount.") {
                  logger.error($filter("translate")("1597"));
                  vm.dataerror = $filter("translate")("1597");
                }
                if (item[0] === "1" && item[1] === "no valid contracts") {
                  logger.error($filter("translate")("2003"));
                  vm.dataerror = $filter("translate")("2003");
                }
              });
            }
          }
          if (vm.dataerror === "") {
            vm.modalError(error);
          }
        }
      );
    }
    function endturn() {
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
            $rootScope.dataturn = null;
            localStorageService.remove("turn");
            vm.refreshdashboard = true;
            vm.eventUndo();
            UIkit.modal("#endturnconfirmation").hide();
            logger.success($filter("translate")("0906"));
          }
          vm.loading = false;
        },
        function (error) {
          vm.loading = false;
          vm.modalError(error);
        }
      );
    }
    /**
     * Carga en los controles de paciente y ordenes los demograficos configurados
     */
    function loadDemographicControls() {
      //Carga la historia
      vm.loadTests();
      var patientDemosValues = {};
      var patientDemosDisabled = {};
      var index = 1;
      orderentryDS.getDemographics(auth.authToken, "H").then(
        function (response) {
          var demopatient = [];
          response.data.forEach(function (value, key) {
            value.tabIndex = index;
            if (!vm.twoNames && value.id === -103) {
              value.name = "3656";
            }
            if (!vm.twosurnames && value.id === -101) {
              value.name = "3657";
            }
            value.name = $filter("translate")(value.name).toLowerCase();
            value.format =
              value.format === undefined || value.format === ""
                ? ""
                : value.format;

            if (value.id === -100) {
              value.format =
                value.format.indexOf("[") === -1 ? value.format : "";
            }
            if (value.id === -8 || value.id === -9) {
              value.placeholder = "";
              value.format = "";
            }
            if (value.id === -10) {
              vm.ItemTypeDocument = value.items;
            }
            if (value.id === -112 && vm.RequiredAddress) {
              value.obligatory = 1;
            }
            if (value.id === -105) {
              value.date = true;
              value.format = value.placeholder;
            } else if (value.format !== undefined && value.format !== "") {
              if (value.format.search("DATE") === -1) {
                value.date = false;
              } else {
                value.date = true;
                value.format = value.format.slice(5);
              }
            }
            value.showRequired = false;
            value.canCreateItemInOrder = value.canCreateItemInOrder;
            value.idOrigin = "|" + value.id + "H";

            if (
              (!vm.twoNames && value.id === -109) ||
              (!vm.twosurnames && value.id === -102)
            ) {
            } else {
              patientDemosValues[value.id] = "";
              patientDemosDisabled[value.id] = true;
              patientDemosDisabled.photo = false;
              if (value.encoded) {
                var itemsdefault = "";
                var viewdefault = false;
                value.items.forEach(function (item, indexItem) {
                  item.canCreateItemInOrder = value.canCreateItemInOrder;
                  item.idDemo = value.id;
                  item.showValue =
                    item.code === undefined
                      ? ""
                      : (item.code + ". " + item.name).toUpperCase();
                  if (item.defaultItem) {
                    itemsdefault = item;
                    viewdefault = true;
                  }
                });
                value.itemsdefault = itemsdefault;
                value.viewdefault = viewdefault;
              }
              demopatient.add(value);
            }
            index++;
          });
          //Actualiza la vista de paciente
          vm.patientDemos = demopatient;
          vm.patientDemosValues = patientDemosValues;
          vm.patientDemosDisabled = patientDemosDisabled;
          vm.patientDemosDisabled.photo = false;

          //Carga la orden
          var orderDemosValues = {};
          var orderDemosDisabled = {};
          orderentryDS.getDemographics(auth.authToken, "O").then(
            function (response) {
              var databranch = _.clone(response.data);
              var branchauth = _.filter(databranch, function (o) {
                o.itemso = _.filter(o.items, function (p) {
                  return p.id === auth.branch;
                });
                return o.itemso.length > 0 && o.id === -5;
              });
              if (branchauth.length !== 0) {
                vm.branch = {
                  id: auth.branch,
                  code: branchauth[0].itemso[0].code,
                  name: branchauth[0].itemso[0].name,
                  showValue:
                    branchauth[0].itemso[0].code +
                    ". " +
                    branchauth[0].itemso[0].name,
                };
                vm.namebranch = branchauth[0].itemso[0].name;
              }
              if (auth.orderType.toString() !== "0") {
                vm.orderTypeInit = auth.orderType;
              }
              var datatype = _.clone(response.data);
              var typeauth = _.filter(datatype, function (o) {
                o.itemso = _.filter(o.items, function (p) {
                  return p.id === parseInt(vm.orderTypeInit);
                });
                return o.itemso.length > 0 && o.id === -4;
              });
              if (typeauth.length !== 0) {
                vm.orderTypeDefault = {
                  id: parseInt(vm.orderTypeInit),
                  code: typeauth[0].itemso[0].code,
                  name: typeauth[0].itemso[0].name,
                  showValue:
                    typeauth[0].itemso[0].code +
                    ". " +
                    typeauth[0].itemso[0].name,
                };
              }
              response.data.forEach(function (value, key) {
                if (value.id === -2 && value.name === "0086") {
                  value.obligatory = 0;
                }
                if (
                  value.id === -201 ||
                  value.id === -202 ||
                  value.id === -203 ||
                  value.id === -204 ||
                  value.id === -205
                ) {
                  value.items = $filter("filter")(
                    _.clone(databranch),
                    function (e) {
                      return e.id - 2;
                    }
                  );
                }
                if (value.id === vm.staticDemoIds["orderDate"]) {
                  index--;
                }
                if (value.id === -4 && vm.editypeorder) {
                  value.modify = true;
                }
                if (vm.vieworderhis) {
                  if (value.id === -108 && value.name === "0240") {
                    value.id = -109;
                    value.name = "3272";
                  }
                }
                value.tabIndex = index;
                value.name = $filter("translate")(value.name).toLowerCase();
                value.format =
                  value.format === undefined || value.format === ""
                    ? ""
                    : value.format;
                if (value.format !== undefined && value.format !== "") {
                  if (value.format.search("DATE") === -1) {
                    value.date = false;
                  } else {
                    value.date = true;
                    value.format = value.format.slice(5);
                  }
                }

                value.showRequired = false;
                value.idOrigin = "|" + value.id + "O";
                orderDemosValues[value.id] = "";
                orderDemosDisabled[value.id] = true;
                if (value.encoded) {
                  var itemsdefault = "";
                  var viewdefault = false;
                  value.items.forEach(function (item, indexItem) {
                    item.idDemo = value.id;
                    item.showValue =
                      item.code === undefined
                        ? ""
                        : (item.code + ". " + item.name).toUpperCase();
                    if (item.defaultItem) {
                      itemsdefault = item;
                      viewdefault = true;
                    }
                  });
                  value.itemsdefault = itemsdefault;
                  value.viewdefault = viewdefault;
                }
                if (value.id === vm.staticDemoIds["rate"]) {
                  vm.rates = value.items;
                }
                index++;
              });
              vm.orderDemos = response.data;

              vm.orderDemosValues = orderDemosValues;
              vm.orderDemosDisabled = orderDemosDisabled;
              vm.demoalldepen = _.concat(vm.patientDemos, vm.orderDemos);
              //Actualiza las vistas simultaneamente
              vm.demosAll = [vm.patientDemos, vm.orderDemos];
            },
            function (error) {
              vm.Error = error;
              vm.ShowPopupError = true;
            }
          );
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }
    /**
     * Carga en el autocomplete los examenes configurados
     */
    function loadTests() {
      vm.filterListTest = function (search, listtest) {
        var listtestfilter = [];
        if (search.length > 1 && search.substring(0, 1) === "-") {
          search = search.substring(1, search.length);
        }

        if (search.length === 1 && search.substring(0, 1) === "?") {
          listtestfilter = $filter("orderBy")(listtest, "code");
        } else {
          listtestfilter = _.filter(listtest, function (color) {
            return (
              color.code.toUpperCase().indexOf(search.toUpperCase()) !== -1 ||
              color.name.toUpperCase().indexOf(search.toUpperCase()) !== -1
            );
          });
        }
        return listtestfilter;
      };

      vm.inputChangedTest = function (text) {
        vm.searchtest = text;
      };
      vm.getBarcode();
      orderDS.getTestToOrderEntry(auth.authToken).then(
        function (response) {
          vm.loadingdata = false;
          if (response.data.length > 0) {
            var tests = [];
            response.data.forEach(function (test, index) {
              tests.push({
                id: test.id,
                area: {
                  id: test.area.id,
                  abbreviation: test.area.abbreviation,
                  name: test.area.name,
                },
                code: test.code,
                abbr: test.abbr.toUpperCase(),
                name: test.name.toUpperCase(),
                colorType:
                  test.testType === 0
                    ? "images/test.png"
                    : test.testType === 1
                    ? "images/profile.png"
                    : "images/package.png",
                type: test.testType,
                confidential: test.confidential,
                sample: {
                  id: test.sample.id,
                  code: test.sample.code,
                  name: test.sample.name,
                },
                gender: test.gender,
                minAge: test.minAge,
                maxAge: test.maxAge,
                unitAge: test.unitAge,
                testType: test.testType,
                showValue: test.code + ". " + test.name.toUpperCase(),
              });
            });
            tests = tests.sort(function (a, b) {
              if (a.code.trim().length > b.code.trim().length) {
                return 1;
              } else if (a.code.trim().length < b.code.trim().length) {
                return -1;
              } else {
                return 0;
              }
            });
            vm.tests = tests;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }
    function eventloadexcel() {
      vm.inconsistency = false;
      vm.showModalloadexce = true;
    }
    function eventinconsistency() {
      vm.showModalInconsistency = true;
    }
    function focusOutListTest() {
      $scope.$broadcast("angucomplete-alt:clearInput", "orderentry_tests");
    }
    function eventinconsistencypacient() {
      vm.showModalInconsistencypacient = true;
    }

    /**
     * Evento que se realiza al seleccionar la historia de un paciente
     */
    vm.selectedPatientIdSiga = selectedPatientIdSiga;
    function selectedPatientIdSiga(Patient) {
      vm.inconsistency = false;
      vm.blockbilling = false;
      vm.blockservice = false;
      vm.permissioncancel = false;
      vm.ordercomment = "";
      vm.patientcoment = "";
      vm.saveedit = false;
      vm.statediagnostic = 1;
      vm.statecomment = 1;
      vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
      vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
      vm.patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, true);
      vm.patientDemosDisabled.photo = false;
      vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, true);
      //Logica de Botones
      vm.newDisabled = false;
      vm.editDisabled = true;
      vm.cancelDisabled = true;
      vm.saveDisabled = true;
      vm.undoDisabled = true;
      vm.dailyDisabled = false;
      vm.searchDisabled = false;
      vm.barcodesDisabled = true;
      vm.interviewDisabled = true;
      vm.ticketDisabled = true;
      vm.requirementDisabled = false;
      vm.quoteDisabled = false;
      vm.recallDisabled = false;
      vm.cashboxDisabled = true;
      vm.viewphoto = false;
      vm.attachmentDisabled = true;
      vm.worklistDisabled = true;
      vm.printReportDisabled = true;
      vm.observationsDisabled = true;
      vm.hasCashbox = false;

      vm.patient = {};
      vm.commentOrder = "";
      //Limpia el formulario de los indicadores de obligatorios
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
      vm.orderDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
      vm.disabledTests = true;
      vm.selectedTest = [];
      vm.samples = [];
      vm.orderDemosValues[vm.staticDemoIds["orderDB"]] == null;
      vm.patientDemosValues[vm.staticDemoIds["patientDB"]] == null;
      vm.orderDemosValues[-5] = vm.branch;
      if (vm.orderTypeInit.toString() !== "0") {
        vm.orderDemosValues[-4] = vm.orderTypeDefault;
      }
      vm.loading = true;
      var patientId = Patient.patientId;
      var patientDemosValues = {};
      vm.patientcoment = "";
      var documentType =
        vm.managedocumenttype === true ? Patient.documentType : 1;
      vm.statediagnostic = 3;
      vm.statecomment = 3;
      if (
        (documentType === 1 && vm.managedocumenttype === false) ||
        (documentType !== undefined && vm.managedocumenttype === true)
      ) {
        patientDS
          .getPatientbyIddocument(auth.authToken, patientId, documentType)
          .then(
            function (response) {
              vm.statediagnostic = 3;
              vm.statecomment = 3;
              vm.viewphoto = true;
              vm.patientDemosDisabled = disabledAllDemo(
                vm.patientDemosDisabled,
                false
              );
              vm.orderDemosDisabled = disabledAllDemo(
                vm.orderDemosDisabled,
                false
              );
              if (vm.vieworderhis) {
                disabledDemo(vm.orderDemosDisabled, -109, true);
              }
              disabledDemo(
                vm.orderDemosDisabled,
                vm.staticDemoIds["orderDate"],
                true
              );
              if (response.data.length > 0) {
                var patient = $filter("filter")(response.data, function (e) {
                  return e.idDemographic === -99;
                })[0].value;
                vm.patientcoment = parseInt(patient);
                response.data.forEach(function (demographic, index) {
                  if (demographic.encoded) {
                    patientDemosValues[demographic.idDemographic] = {
                      id: demographic.codifiedId,
                      code:
                        demographic.codifiedCode !== undefined
                          ? demographic.codifiedCode
                          : "",
                      name:
                        demographic.codifiedName !== undefined
                          ? demographic.codifiedName
                          : "",
                      showValue:
                        demographic.value !== undefined &&
                        demographic.value !== "."
                          ? demographic.codifiedCode.toUpperCase() +
                            ". " +
                            demographic.codifiedName.toUpperCase()
                          : "",
                    };
                  } else {
                    patientDemosValues[demographic.idDemographic] =
                      demographic.value;
                    if (
                      demographic.idDemographic == vm.staticDemoIds["birthday"]
                    ) {
                      //Si el demografico es la fecha de nacimiento calcula la edad
                      patientDemosValues[vm.staticDemoIds["age"]] =
                        common.getAge(
                          demographic.value,
                          vm.formatDate.toUpperCase()
                        );
                    }
                  }
                  if (vm.permissionuser.editPatients) {
                    var findpropertydemografic = _.filter(
                      vm.patientDemos,
                      function (e) {
                        return e.id === demographic.idDemographic;
                      }
                    );
                    if (findpropertydemografic.length > 0) {
                      if (findpropertydemografic[0].modify === false) {
                        disabledDemo(
                          vm.patientDemosDisabled,
                          demographic.idDemographic,
                          true
                        );
                      }
                    }
                  } else {
                    vm.patientDemos.forEach(function (e) {
                      disabledDemo(vm.patientDemosDisabled, e.id, true);
                    });
                  }
                });
                vm.patientDemosValues = patientDemosValues;
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["documentType"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["patientId"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["lastName"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["surName"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["name1"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["name2"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["sex"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["birthday"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["age"],
                  true
                );
                vm.patientDemosDisabled.photo = true;
                // if (vm.customerdefault !== null && vm.customerdefault !== '' && vm.customerdefault !== '0' && vm.manageAccount) {
                //     disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds['account'], true);
                // }
                if (vm.isOrderAutomatic) {
                  disabledDemo(
                    vm.orderDemosDisabled,
                    vm.staticDemoIds["order"],
                    true
                  );
                  setTimeout(function () {
                    document
                      .getElementById(
                        "demo_" + vm.staticDemoIds["orderType"] + "_value"
                      )
                      .focus();
                  }, 100);
                } else {
                  setTimeout(function () {
                    document
                      .getElementById("demo_" + vm.staticDemoIds["order"])
                      .focus();
                  }, 100);
                }
                vm.comparepatient = JSON.parse(
                  JSON.stringify(vm.patientDemosValues)
                );
              } else {
                vm.patientDemosDisabled.photo = true;
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["documentType"],
                  true
                );
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["patientId"],
                  true
                );

                if (vm.isOrderAutomatic) {
                  disabledDemo(
                    vm.orderDemosDisabled,
                    vm.staticDemoIds["order"],
                    true
                  );
                }
                setTimeout(function () {
                  document
                    .getElementById("demo_" + vm.staticDemoIds["lastName"])
                    .focus();
                }, 100);

                //0,1 - Cédula Ciudadanía
                if (
                  Patient.documentType === "0" ||
                  Patient.documentType === "1"
                ) {
                  var parientType = $filter("filter")(
                    vm.ItemTypeDocument,
                    function (e) {
                      return e.code === "1";
                    }
                  );
                  if (parientType.length !== 0) {
                    vm.patientDemosValues[-10] = parientType[0];
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_-10",
                      parientType[0]
                    );
                  }
                }
                //2 - Tarjeta de Identidad
                if (Patient.documentType === "2") {
                  var parientType = $filter("filter")(
                    vm.ItemTypeDocument,
                    function (e) {
                      return e.code === "3";
                    }
                  );
                  if (parientType.length !== 0) {
                    vm.patientDemosValues[-10] = parientType[0];
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_-10",
                      parientType[0]
                    );
                  }
                }
                //3 - Cédula Extranjería
                if (Patient.documentType === "3") {
                  var parientType = $filter("filter")(
                    vm.ItemTypeDocument,
                    function (e) {
                      return e.code === "2";
                    }
                  );
                  if (parientType.length !== 0) {
                    vm.patientDemosValues[-10] = parientType[0];
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_-10",
                      parientType[0]
                    );
                  }
                }
                //4  - Pasaporte
                if (Patient.documentType === "4") {
                  var parientType = $filter("filter")(
                    vm.ItemTypeDocument,
                    function (e) {
                      return e.code === "5";
                    }
                  );
                  if (parientType.length !== 0) {
                    vm.patientDemosValues[-10] = parientType[0];
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_-10",
                      parientType[0]
                    );
                  }
                }
                //5 - Registro Civil
                if (Patient.documentType === "5") {
                  var parientType = $filter("filter")(
                    vm.ItemTypeDocument,
                    function (e) {
                      return e.code === "4";
                    }
                  );
                  if (parientType.length !== 0) {
                    vm.patientDemosValues[-10] = parientType[0];
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_-10",
                      parientType[0]
                    );
                  }
                }

                var name =
                  Patient.name == undefined ? "" : Patient.name.split(" ");
                var name2 = "";
                if (name.length > 1) {
                  name2 = name.shift();
                  name2 = name2.toString().replaceAll(",", " ");
                }

                vm.patientDemosValues[-100] = Patient.patientId;
                vm.patientDemosValues[-101] =
                  Patient.lastName == undefined ? "" : Patient.lastName;
                vm.patientDemosValues[-102] =
                  Patient.surName == undefined ? "" : Patient.surName;

                vm.patientDemosValues[-103] =
                  Patient.name == undefined ? "" : name[0];
                vm.patientDemosValues[-109] =
                  Patient.name == undefined ? "" : name2;
                vm.patientDemosValues[-105] = moment(Patient.birthday).format(
                  vm.formatDate.toUpperCase()
                );
                vm.patientDemosValues[-110] = common.getAge(
                  moment(Patient.birthday).format(vm.formatDate.toUpperCase()),
                  vm.formatDate.toUpperCase(),
                  vm.staticDemoIds["orderDate"]
                );

                if (Patient.sex === 1) {
                  vm.patientDemosValues[-104] = {
                    id: 7,
                    code: "1",
                    showValue: "1. MASCULINO",
                  };
                  $scope.$broadcast(
                    "angucomplete-alt:changeInput",
                    "demo_-104",
                    vm.patientDemosValues[-104]
                  );
                }

                if (Patient.sex === 2) {
                  vm.patientDemosValues[-104] = {
                    id: 8,
                    code: "2",
                    showValue: "2. FEMENINO",
                  };
                  $scope.$broadcast(
                    "angucomplete-alt:changeInput",
                    "demo_-104",
                    vm.patientDemosValues[-104]
                  );
                }
              }
              //Logica de Botones
              vm.newDisabled = true;
              vm.editDisabled = true;
              vm.cancelDisabled = true;
              vm.saveDisabled = false;
              vm.undoDisabled = false;
              vm.dailyDisabled = true;
              vm.searchDisabled = true;
              vm.barcodesDisabled = true;
              vm.interviewDisabled = true;
              vm.ticketDisabled = true;
              vm.cashboxDisabled = true;

              //Habilita el combo de examenes
              vm.disabledTests = false;
              vm.loading = false;

              if (localStorageService.get("AlarmaUltimaOrden") === "True") {
                vm.lastOrderAlarm();
              }
            },
            function (error) {
              vm.Error = error;
              vm.ShowPopupError = true;
              vm.loading = false;
            }
          );
      } else {
        vm.loading = false;
        if (vm.managedocumenttype === true) {
          logger.warning("Seleccione el tipo de documento");
        }
      }
    }

    function selectLastOrder() {
      var idPatient = vm.patientDemosValues[vm.staticDemoIds["patientDB"]];
      if (idPatient !== "" && idPatient !== null) {
        var orderDemosValues = JSON.parse(JSON.stringify(vm.orderDemosValues));
        orderDS.getLastOrderDemos(auth.authToken, idPatient).then(
          function (response) {
            if (response.data.length > 0) {
              response.data.forEach(function (demographic) {
                if (
                  demographic.idDemographic !== -107 &&
                  demographic.idDemographic !== -108
                ) {
                  if (orderDemosValues[demographic.idDemographic] === "") {
                    if (demographic.encoded) {
                      orderDemosValues[demographic.idDemographic] = {
                        id: demographic.codifiedId,
                        code:
                          demographic.codifiedCode !== undefined
                            ? demographic.codifiedCode
                            : "",
                        name:
                          demographic.codifiedName !== undefined
                            ? demographic.codifiedName
                            : "",
                        showValue:
                          demographic.value !== undefined &&
                          demographic.value !== "."
                            ? demographic.codifiedCode.toUpperCase() +
                              ". " +
                              demographic.codifiedName.toUpperCase()
                            : "",
                      };
                    } else {
                      orderDemosValues[demographic.idDemographic] =
                        demographic.value;
                    }
                  }
                }
              });

              vm.orderDemosValues = orderDemosValues;
            }
          },
          function (error) {
            vm.Error = error;
            vm.ShowPopupError = true;
            vm.loading = false;
          }
        );
      }
    }

    /**
     * Evento que se realiza al seleccionar la historia de un paciente
     */
    function selectedPatientId() {
      vm.loading = true;
      var searchById_DB = vm.managehistoryauto ? "patientDB" : "patientId";
      var patientId = vm.patientDemosValues[vm.staticDemoIds[searchById_DB]];
      var patientDemosValues = {};
      vm.patientcoment = "";
      if (patientId.search("/") === -1) {
        if (patientId.toString().trim() !== "") {
          var documentType =
            vm.patientDemosValues[vm.staticDemoIds["documentType"]];
          if (!vm.managehistoryauto) {
            vm.statediagnostic = 3;
            vm.statecomment = 3;
            if (vm.managedocumenttype === true) {
              if (documentType.hasOwnProperty("originalObject")) {
                documentType = documentType.originalObject.id;
              } else {
                documentType = documentType.id;
              }
            } else {
              documentType = 1;
            }

            if (
              (documentType === 1 && vm.managedocumenttype === false) ||
              (documentType !== undefined && vm.managedocumenttype === true)
            ) {
              patientDS
                .getPatientbyIddocument(auth.authToken, patientId, documentType)
                .then(
                  function (response) {
                    vm.statediagnostic = 3;
                    vm.statecomment = 3;
                    vm.viewphoto = true;
                    vm.patientDemosDisabled = disabledAllDemo(
                      vm.patientDemosDisabled,
                      false
                    );
                    vm.orderDemosDisabled = disabledAllDemo(
                      vm.orderDemosDisabled,
                      false
                    );
                    if (vm.vieworderhis) {
                      disabledDemo(vm.orderDemosDisabled, -109, true);
                    }
                    disabledDemo(
                      vm.orderDemosDisabled,
                      vm.staticDemoIds["orderDate"],
                      true
                    );
                    if (response.data.length > 0) {
                      if (vm.orderDemosValues[-5] === "") {
                        vm.orderDemosValues[-5] = vm.branch;
                      }
                      var patient = $filter("filter")(
                        response.data,
                        function (e) {
                          return e.idDemographic === -99;
                        }
                      )[0].value;
                      vm.patientcoment = parseInt(patient);
                      response.data.forEach(function (demographic, index) {
                        if (demographic.encoded) {
                          patientDemosValues[demographic.idDemographic] = {
                            id: demographic.codifiedId,
                            code:
                              demographic.codifiedCode !== undefined
                                ? demographic.codifiedCode
                                : "",
                            name:
                              demographic.codifiedName !== undefined
                                ? demographic.codifiedName
                                : "",
                            showValue:
                              demographic.value !== undefined &&
                              demographic.value !== "."
                                ? demographic.codifiedCode.toUpperCase() +
                                  ". " +
                                  demographic.codifiedName.toUpperCase()
                                : "",
                          };
                        } else {
                          patientDemosValues[demographic.idDemographic] =
                            demographic.value;
                          if (
                            demographic.idDemographic ==
                            vm.staticDemoIds["birthday"]
                          ) {
                            //Si el demografico es la fecha de nacimiento calcula la edad
                            patientDemosValues[vm.staticDemoIds["age"]] =
                              common.getAge(
                                demographic.value,
                                vm.formatDate.toUpperCase()
                              );
                          }
                        }
                        if (vm.permissionuser.editPatients) {
                          var findpropertydemografic = _.filter(
                            vm.patientDemos,
                            function (e) {
                              return e.id === demographic.idDemographic;
                            }
                          );
                          if (findpropertydemografic.length > 0) {
                            if (findpropertydemografic[0].modify === false) {
                              disabledDemo(
                                vm.patientDemosDisabled,
                                demographic.idDemographic,
                                true
                              );
                            }
                          }
                        } else {
                          vm.patientDemos.forEach(function (e) {
                            disabledDemo(vm.patientDemosDisabled, e.id, true);
                          });
                        }
                      });
                      vm.patientDemosValues = patientDemosValues;
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["documentType"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["patientId"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["lastName"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["surName"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["name1"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["name2"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["sex"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["birthday"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["age"],
                        true
                      );
                      vm.patientDemosDisabled.photo = true;

                      if (vm.isOrderAutomatic) {
                        disabledDemo(
                          vm.orderDemosDisabled,
                          vm.staticDemoIds["order"],
                          true
                        );
                        setTimeout(function () {
                          document
                            .getElementById(
                              "demo_" + vm.staticDemoIds["orderType"] + "_value"
                            )
                            .focus();
                        }, 100);
                      } else {
                        setTimeout(function () {
                          document
                            .getElementById("demo_" + vm.staticDemoIds["order"])
                            .focus();
                        }, 100);
                      }
                      vm.comparepatient = JSON.parse(
                        JSON.stringify(vm.patientDemosValues)
                      );

                      if (vm.demoHistory) {
                        vm.selectLastOrder();
                      }
                    } else {
                      vm.patientDemosDisabled.photo = true;
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["documentType"],
                        true
                      );
                      disabledDemo(
                        vm.patientDemosDisabled,
                        vm.staticDemoIds["patientId"],
                        true
                      );

                      if (vm.isOrderAutomatic) {
                        disabledDemo(
                          vm.orderDemosDisabled,
                          vm.staticDemoIds["order"],
                          true
                        );
                      }
                      setTimeout(function () {
                        document
                          .getElementById(
                            "demo_" + vm.staticDemoIds["lastName"]
                          )
                          .focus();
                      }, 100);
                      if (vm.IntegracionTribunal) {
                        vm.newDisabled = true;
                        vm.editDisabled = true;
                        vm.cancelDisabled = true;
                        vm.saveDisabled = false;
                        vm.undoDisabled = false;
                        vm.dailyDisabled = true;
                        vm.searchDisabled = true;
                        vm.barcodesDisabled = true;
                        vm.interviewDisabled = true;
                        vm.ticketDisabled = true;
                        vm.cashboxDisabled = true;
                        var parameters = {
                          username:
                            localStorageService.get(
                              "usuarioTribunalElectoral"
                            ) === ""
                              ? "zEmiGFeqfhxg637h"
                              : localStorageService.get(
                                  "usuarioTribunalElectoral"
                                ),
                          password:
                            localStorageService.get(
                              "contrasenaTribunalElectoral"
                            ) === ""
                              ? "vMFQoqi2iPkcLUv4"
                              : localStorageService.get(
                                  "contrasenaTribunalElectoral"
                                ),
                          url:
                            localStorageService.get("urlTribunalElectoral") ===
                            ""
                              ? "https://covid2.innovacion.gob.pa/scripts/php/validate.php/validate.php"
                              : localStorageService.get("urlTribunalElectoral"),
                          personalId: patientId,
                          fullNameApproximation: "",
                        };
                        return TribunalDS.getdatatribunal(parameters).then(
                          function (data) {
                            if (data.status === 200) {
                              if (data.data === "") {
                                vm.loading = false;
                                vm.disabledTests = false;
                              } else {
                                if (data.data.result.found) {
                                  //PATIENT_LAST_NAME - primer apellido
                                  vm.patientDemosValues[-101] =
                                    data.data.result.surname;
                                  //PATIENT_SURNAME - segundo apellido
                                  vm.patientDemosValues[-102] =
                                    data.data.result.secondSurname;
                                  // PATIENT_NAME -primer nombre
                                  vm.patientDemosValues[-103] =
                                    data.data.result.firstName;
                                  //PATIENT_SECOND_NAME
                                  vm.patientDemosValues[-109] =
                                    data.data.result.lastName;
                                  vm.patientDemosValues[-105] = moment(
                                    data.data.result.birthDate
                                  ).format(vm.formatDate.toUpperCase());
                                  vm.patientDemosValues[-110] = common.getAge(
                                    moment(data.data.result.birthDate).format(
                                      vm.formatDate.toUpperCase()
                                    ),
                                    vm.formatDate.toUpperCase()
                                  );
                                  if (data.data.result.gender === "F") {
                                    vm.patientDemosValues[-104] = {
                                      id: 8,
                                      code: "2",
                                      showValue: "2. FEMENINO",
                                    };
                                    $scope.$broadcast(
                                      "angucomplete-alt:changeInput",
                                      "demo_-104",
                                      vm.patientDemosValues[-104]
                                    );
                                  }
                                  if (data.data.result.gender === "M") {
                                    vm.patientDemosValues[-104] = {
                                      id: 7,
                                      code: "1",
                                      showValue: "1. MASCULINO",
                                    };
                                    $scope.$broadcast(
                                      "angucomplete-alt:changeInput",
                                      "demo_-104",
                                      vm.patientDemosValues[-104]
                                    );
                                  }
                                }
                                vm.disabledTests = false;
                                vm.loading = false;
                              }
                            } else {
                              vm.loading = false;
                              vm.disabledTests = false;
                            }
                          },
                          function (error) {
                            vm.loading = false;
                            vm.disabledTests = false;
                          }
                        );
                      }
                    }
                    //Logica de Botones
                    vm.newDisabled = true;
                    vm.editDisabled = true;
                    vm.cancelDisabled = true;
                    vm.saveDisabled = false;
                    vm.undoDisabled = false;
                    vm.dailyDisabled = true;
                    vm.searchDisabled = true;
                    vm.barcodesDisabled = true;
                    vm.interviewDisabled = true;
                    vm.ticketDisabled = true;
                    vm.cashboxDisabled = true;

                    //Habilita el combo de examenes
                    vm.disabledTests = false;
                    vm.loading = false;

                    if (
                      localStorageService.get("AlarmaUltimaOrden") === "True"
                    ) {
                      vm.lastOrderAlarm();
                    }
                  },
                  function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                    vm.loading = false;
                  }
                );
            } else {
              vm.loading = false;
              if (vm.managedocumenttype === true) {
                logger.warning("Seleccione el tipo de documento");
              }
            }
          } else {
            patientDS.getPatientbyIddocument(auth.authToken, patientId, 0).then(
              function (response) {
                vm.patientDemosDisabled[-100] = true;
                vm.viewphoto = true;
                vm.patientDemosDisabled = disabledAllDemo(
                  vm.patientDemosDisabled,
                  false
                );
                vm.orderDemosDisabled = disabledAllDemo(
                  vm.orderDemosDisabled,
                  false
                );
                if (vm.vieworderhis) {
                  disabledDemo(vm.orderDemosDisabled, -109, true);
                }
                vm.statediagnostic = 3;
                vm.statecomment = 3;
                disabledDemo(
                  vm.patientDemosDisabled,
                  vm.staticDemoIds["orderDate"],
                  true
                );
                if (response.data.length > 0) {
                  var patient = $filter("filter")(response.data, function (e) {
                    return e.idDemographic === -99;
                  })[0].value;
                  vm.patientcoment = parseInt(patient);
                  response.data.forEach(function (demographic, index) {
                    if (demographic.encoded) {
                      patientDemosValues[demographic.idDemographic] = {
                        id: demographic.codifiedId,
                        code:
                          demographic.codifiedCode !== undefined
                            ? demographic.codifiedCode
                            : "",
                        name:
                          demographic.codifiedName !== undefined
                            ? demographic.codifiedName
                            : "",
                        showValue:
                          demographic.value !== undefined
                            ? demographic.codifiedCode.toUpperCase() +
                              ". " +
                              demographic.codifiedName.toUpperCase()
                            : "",
                      };
                    } else {
                      patientDemosValues[demographic.idDemographic] =
                        demographic.value;
                      if (
                        demographic.idDemographic ==
                        vm.staticDemoIds["birthday"]
                      ) {
                        //Si el demografico es la fecha de nacimiento calcula la edad
                        patientDemosValues[vm.staticDemoIds["age"]] =
                          common.getAge(
                            demographic.value,
                            vm.formatDate.toUpperCase()
                          );
                      }
                    }
                    if (vm.permissionuser.editPatients) {
                      var findpropertydemografic = _.filter(
                        vm.patientDemos,
                        function (e) {
                          return e.id === demographic.idDemographic;
                        }
                      );
                      if (findpropertydemografic.length > 0) {
                        if (findpropertydemografic[0].modify === false) {
                          disabledDemo(
                            vm.patientDemosDisabled,
                            demographic.idDemographic,
                            true
                          );
                        }
                      }
                    } else {
                      vm.patientDemos.forEach(function (e) {
                        disabledDemo(vm.patientDemosDisabled, e.id, true);
                      });
                    }
                  });
                  vm.patientDemosValues = patientDemosValues;
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["documentType"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["patientId"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["lastName"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["surName"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["name1"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["name2"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["sex"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["birthday"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["age"],
                    true
                  );
                  vm.patientDemosDisabled.photo = true;
                  if (vm.isOrderAutomatic) {
                    disabledDemo(
                      vm.orderDemosDisabled,
                      vm.staticDemoIds["order"],
                      true
                    );
                    setTimeout(function () {
                      document
                        .getElementById(
                          "demo_" + vm.staticDemoIds["orderType"] + "_value"
                        )
                        .focus();
                    }, 100);
                  } else {
                    setTimeout(function () {
                      document
                        .getElementById("demo_" + vm.staticDemoIds["order"])
                        .focus();
                    }, 100);
                  }
                  if (vm.demoHistory) {
                    vm.selectLastOrder();
                  }
                } else {
                  vm.patientDemosDisabled.photo = true;
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["documentType"],
                    true
                  );
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["patientId"],
                    true
                  );
                  if (vm.isOrderAutomatic) {
                    disabledDemo(
                      vm.orderDemosDisabled,
                      vm.staticDemoIds["order"],
                      true
                    );
                  }
                  setTimeout(function () {
                    document
                      .getElementById("demo_" + vm.staticDemoIds["lastName"])
                      .focus();
                  }, 100);
                }

                //Logica de Botones
                vm.newDisabled = true;
                vm.editDisabled = true;
                vm.cancelDisabled = true;
                vm.saveDisabled = false;
                vm.undoDisabled = false;
                vm.dailyDisabled = true;
                vm.searchDisabled = true;
                vm.barcodesDisabled = true;
                vm.interviewDisabled = true;
                vm.cashboxDisabled = true;
                vm.ticketDisabled = true;

                vm.comparepatient = JSON.parse(
                  JSON.stringify(vm.patientDemosValues)
                );
                //Habilita el combo de examenes
                vm.disabledTests = false;
                vm.loading = false;

                if (localStorageService.get("AlarmaUltimaOrden") === "True") {
                  vm.lastOrderAlarm();
                }
              },
              function (error) {
                vm.Error = error;
                vm.ShowPopupError = true;
                vm.loading = false;
              }
            );
          }
        }
      } else {
        vm.loading = false;
        logger.warning("No se permite que la historia lleve el caracter /");
      }
    }
    /**
     * Cuando se selecciona un examen se invoca esta funcion
     * @param {*} selected Objeto del examen seleccionado
     */
    function selectTest(selected) {
      if (selected !== undefined) {
        var object = null;
        var toDelete = false;
        if (
          selected.hasOwnProperty("originalObject") &&
          selected.hasOwnProperty("title")
        ) {
          object = $filter("filter")(
            vm.selectedTest,
            {
              id: selected.originalObject.id,
            },
            true
          )[0];
          if (object !== undefined && vm.searchtest.substring(0, 1) === "-") {
            toDelete = true;
          } else if (
            object === undefined &&
            vm.searchtest.substring(0, 1) === "-"
          ) {
            toDelete = null;
          } else {
            object = selected.originalObject;
          }
        } else if (!selected.hasOwnProperty("title")) {
          toDelete = null;
        } else {
          object = select;
        }
        vm.dimensions = " width: 512px; height: 185px;";
        if (toDelete === false) {
          var exists = $filter("filter")(
            vm.selectedTest,
            {
              id: selected.originalObject.id,
            },
            true
          )[0];
          if (exists === undefined) {
            var patientDBId =
              vm.patientDemosValues[vm.staticDemoIds["patientDB"]];
            var sex = vm.patientDemosValues[vm.staticDemoIds["sex"]].code;
            var age =
              vm.patientDemosValues[vm.staticDemoIds["age"]].split(".")[0];
            if (patientDBId === undefined || patientDBId === "") {
              patientDBId = "-1";
            }
            var rateSelected = vm.manageRate
              ? vm.orderDemosValues[vm.staticDemoIds["rate"]] !== undefined &&
                vm.orderDemosValues[vm.staticDemoIds["rate"]] !== ""
                ? vm.orderDemosValues[vm.staticDemoIds["rate"]].id
                : "-1"
              : "-1";
            orderDS
              .getTestInfo(
                auth.authToken,
                patientDBId,
                object.id,
                object.type,
                rateSelected
              )
              .then(
                function (response) {
                  if (response.status === 200) {
                    var data = response.data;
                    //Busca si el examen esta en eliminados
                    if (
                      $filter("filter")(
                        vm.deleteTests,
                        {
                          id: object.id,
                        },
                        true
                      ).length > 0
                    ) {
                      //Si lo contiene lo elimina de la lista
                      var indexDel = -1;
                      vm.deleteTests.forEach(function (test, index) {
                        if (test.id === object.id) {
                          indexDel = index;
                        }
                      });
                      vm.deleteTests.splice(indexDel, 1);
                    }
                    //-----------------------------------------------------------------------------------------
                    vm.stateTest = selected.originalObject.testType;
                    if (vm.stateTest > 0) {
                      age = 0;
                    }
                    //-----------------------------------------------------------------------------------------
                    if (age === "" || sex === undefined) {
                      vm.messageNotSave = $filter("translate")("0815");
                      vm.numError = "0";
                      UIkit.modal("#logErrorTest").show();
                      return;
                    } else {
                      if (
                        ((age < selected.originalObject.minAge ||
                          age > selected.originalObject.maxAge) &&
                          sex === "1" &&
                          selected.originalObject.gender.code === "2") ||
                        (sex === "2" &&
                          selected.originalObject.gender.code === "1")
                      ) {
                        vm.messageNotSave =
                          $filter("translate")("0675") +
                          "\n" +
                          "\n" +
                          $filter("translate")("0674");
                        vm.numError = "2";
                        UIkit.modal("#logErrorTest").show();
                        return;
                      } else if (
                        age < selected.originalObject.minAge ||
                        age > selected.originalObject.maxAge
                      ) {
                        vm.messageNotSave = $filter("translate")("0675");
                        vm.numError = "3";
                        UIkit.modal("#logErrorTest").show();
                        return;
                      } else if (
                        (sex === "1" &&
                          selected.originalObject.gender.code === "2") ||
                        (sex === "2" &&
                          selected.originalObject.gender.code === "1")
                      ) {
                        vm.messageNotSave = $filter("translate")("0674");
                        vm.numError = "4";
                        UIkit.modal("#logErrorTest").show();
                        return;
                      } else {
                        vm.numError = "0";
                      }
                    }
                    vm.selectedTest.push({
                      id: object.id,
                      code: object.code,
                      name: object.name, //vm.manageRate ? (vm.rateDefault !== undefined ? {'id': vm.rateDefault} : {'id': 0}) : {'id': 0},
                      rate: vm.manageRate
                        ? vm.orderDemosValues[vm.staticDemoIds["rate"]] !==
                          undefined
                          ? vm.orderDemosValues[vm.staticDemoIds["rate"]]
                          : ""
                        : "",
                      priceShow:
                        data.price !== undefined && data.price !== null
                          ? $filter("currency")(
                              data.price,
                              vm.symbolCurrency,
                              vm.penny ? 2 : 0
                            )
                          : $filter("currency")(
                              0,
                              vm.symbolCurrency,
                              vm.penny ? 2 : 0
                            ), // '$ ' + data.price : '$ 0',
                      price:
                        data.price !== undefined && data.price !== null
                          ? data.price
                          : 0,
                      state: 0,
                      type: object.type,
                      resultValidity:
                        data.resultValidity !== undefined
                          ? data.resultValidity
                          : null,
                      account: vm.manageAccount
                        ? vm.orderDemosValues[vm.staticDemoIds["account"]] !==
                          undefined
                          ? vm.orderDemosValues[vm.staticDemoIds["account"]]
                          : ""
                        : "",
                    });

                    var samples = data.samples;
                    var temSamples = vm.samples;
                    samples.forEach(function (sample, index) {
                      if (
                        $filter("filter")(
                          temSamples,
                          {
                            id: parseInt(sample.id),
                          },
                          true
                        ).length === 0
                      ) {
                        //La muestra no esta en la lista y la agrega
                        temSamples.push({
                          id: sample.id,
                          name: sample.name,
                          container: {
                            name: sample.container.name,
                            image:
                              sample.container.image === ""
                                ? "images/empty-container.png"
                                : "data:image/png;base64," +
                                  sample.container.image,
                          },
                          tests: [
                            {
                              id: object.id,
                              code: object.code,
                            },
                          ],
                        });
                      } else {
                        $filter("filter")(
                          temSamples,
                          {
                            id: parseInt(sample.id),
                          },
                          true
                        )[0].tests.push({
                          id: object.id,
                          code: object.code,
                        });
                      }
                    });
                    temSamples.forEach(function (sample, index) {
                      sample.index = index + 1;
                    });
                    vm.samples = temSamples;
                  }
                },
                function (error) {
                  vm.modalError(error);
                }
              );
          }
        } else if (toDelete === true) {
          var code = object.code;
          var indexF = -1;
          var testId = -1;
          var testType = -1;
          vm.selectedTest.forEach(function (test, index) {
            if (test.code === code) {
              testId = test.id;
              testType = test.type;
              indexF = index;
            }
          });
          if (indexF > -1) {
            vm.deleteTests.push({
              id: testId,
              code: code,
              testType: testType,
            });
            vm.selectedTest.splice(indexF, 1);
            //Busca en el listado de muestras para eliminar el examen asociado
            var temSamples = vm.samples;
            var newSamples = [];
            var indexTest = -1;
            temSamples.forEach(function (sample, index) {
              //Si el examen eliminado esta asociado a la muestra
              if (
                $filter("filter")(
                  sample.tests,
                  {
                    code: code,
                  },
                  true
                ).length > 0
              ) {
                indexTest = -1;
                //Busca el examen por codigo
                sample.tests.forEach(function (sampleTest, index2) {
                  if (sampleTest.code === code) {
                    indexTest = index2;
                  }
                });
                //Elimina el examen encontrado
                sample.tests.splice(indexTest, 1);
              }
            });
            //Busca si alguna muestra no tiene examenes asociados para eliminarlas
            var samplesWithTests = [];
            temSamples.forEach(function (sample, index) {
              if (sample.tests.length > 0) {
                samplesWithTests.push(sample);
              }
            });
            vm.samples = samplesWithTests;
          }
        }
      }
    }
    function modalError(error) {
      vm.Error = error;
      vm.ShowPopupError = true;
    }
    function normalizeNumberFormat(valueCurrency, symbol) {
      try {
        return parseFloat(valueCurrency.replace(/\,/g, "").replace(symbol, ""));
      } catch (e) {
        return valueCurrency;
      }
    }
    /**
     * Limpia el valor de todos los demograficos
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
     */
    function cleanAllDemos(demos) {
      var cleanDemos = {};
      for (var property in demos) {
        if (demos.hasOwnProperty(property)) {
          cleanDemos[property] = "";
        }
      }
      return cleanDemos;
    }
    /**
     * Habilita o deshabilita todos los demograficos de un control
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
     * @param {*} disabled Si habilita o deshabilita
     */
    function disabledAllDemo(demos, disabled) {
      var disabledDemos = {};
      for (var property in demos) {
        if (demos.hasOwnProperty(property)) {
          disabledDemos[property] = disabled;
        }
      }
      return disabledDemos;
    }
    /**
     * Habilita o deshabilita un demografico
     * @param {*} demos Arreglo de demograficos (vm.patientDemosValue o vm.orderDemosValues)
     * @param {*} id Id demografico para deshabilitar
     * @param {*} disabled Si habilita o deshabilita
     */
    function disabledDemo(demos, id, disabled) {
      for (var property in demos) {
        if (property == id) {
          if (demos.hasOwnProperty(property)) {
            demos[property] = disabled;
          }
        }
      }
      return demos;
    }

    vm.validpassword = validpassword;
    function validpassword(myForm) {
      vm.loading = true;
      vm.loadinguser = true;
      vm.validusername = false;
      vm.userpermiss = false;
      //myForm.username1.$touched = true;
      // myForm.password.$touched = true;
      if (myForm.$valid) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return userDS
          .getUpdateTestEntry(
            auth.authToken,
            vm.user.username,
            vm.user.password
          )
          .then(
            function (data) {
              vm.loadinguser = false;
              if (data.status === 200) {
                if (data.data.updatetestentry) {
                  UIkit.modal("#modalogin").hide();
                  if (vm.motiveeditorder) {
                    vm.editmotiveorder = vm.orderedit;
                    vm.Comment = "";
                    vm.motive = { id: -1 };
                    var auth = localStorageService.get(
                      "Enterprise_NT.authorizationData"
                    );
                    return motiveDS.getMotiveByState(auth.authToken).then(
                      function (data) {
                        if (data.status === 200) {
                          vm.listMotives = _.filter(data.data, function (m) {
                            return m.type.id === 15;
                          });
                          UIkit.modal("#editmodal").show();
                        } else {
                          logger.error(
                            "Debe crear motivos de modificación de ingreso"
                          );
                        }
                        vm.loading = false;
                      },
                      function (error) {
                        vm.modalError(error);
                        vm.loading = false;
                      }
                    );
                  } else {
                    var auth = localStorageService.get(
                      "Enterprise_NT.authorizationData"
                    );
                    orderDS.updateOrder(auth.authToken, vm.orderedit).then(
                      function (data) {
                        if (data.status === 200) {
                          afterSaveOrder(data.data);
                        }
                      },
                      function (error) {
                        vm.loading = false;
                        if (error.data !== null && error.data !== undefined) {
                          if (error.data.errorFields === undefined) {
                            vm.messageNotSave = error.data.message;
                          } else {
                            if (
                              error.data.errorFields[0] === "1" &&
                              error.data.errorFields[1] === "sample"
                            ) {
                              vm.messageNotSave =
                                "Realice la configuración de la muestra";
                            } else {
                              vm.numError = error.data.errorFields[0]
                                .split("|")[0]
                                .toString();
                              vm.messageNotSave =
                                vm.numError === "1"
                                  ? $filter("translate")("0800")
                                  : $filter("translate")("0331");
                              if (vm.numError === "6") {
                                if (
                                  error.data.errorFields[0].split("|")
                                    .length === 3
                                ) {
                                  vm.dimensions =
                                    " width: 512px; height: 350px;";
                                  error.data.errorFields.forEach(function (
                                    value
                                  ) {
                                    var consult = _.filter(
                                      JSON.parse(JSON.stringify(vm.tests)),
                                      function (v) {
                                        return (
                                          v.id === parseInt(value.split("|")[2])
                                        );
                                      }
                                    );
                                    if (consult.length !== 0) {
                                      var cod = consult[0].code;
                                      var name = consult[0].name;
                                      vm.listError.push({
                                        test: cod + ". " + name,
                                      });
                                    }
                                  });
                                } else {
                                  vm.numError = "06";
                                  vm.messageNotTittle =
                                    $filter("translate")("0061");
                                  vm.messageNotSave =
                                    $filter("translate")("1443");
                                }
                              } else if (vm.numError === "5") {
                                vm.messageNotTittle =
                                  $filter("translate")("0061");
                                vm.messageNotSave =
                                  $filter("translate")("1142");
                              } else if (vm.numError === "4") {
                                vm.messageNotTittle =
                                  $filter("translate")("0061");
                                vm.messageNotSave =
                                  $filter("translate")("1442");
                              }
                            }
                          }
                          UIkit.modal("#logErrorTest").show();
                        }
                      }
                    );
                  }
                } else {
                  vm.userpermiss = true;
                  vm.loading = false;
                }
              } else {
                vm.validusername = true;
                vm.loading = false;
              }
            },
            function (error) {
              vm.loadinguser = false;
              vm.loading = false;
              vm.modalError(error);
            }
          );
      }
    }

    /**
     * Evento de presionar el boton Guardar
     */
    function eventSave() {
      vm.validusername = false;
      vm.userpermiss = false;
      vm.inconsistency = false;
      vm.loading = true;
      vm.openSearch = false;
      if (validateForm()) {
        if (vm.integrationMINSA) {
          if (vm.saveedit) {
            vm.saveedit = false;
            vm.detailordersave();
          } else {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return orderDS
              .getexternalId(
                auth.authToken,
                vm.orderDemosValues[8],
                vm.orderDemosValues[-5].code
              )
              .then(
                function (data) {
                  if (data.data === true) {
                    vm.loading = false;
                    logger.warning($filter("translate")("1511"));
                  } else {
                    if (vm.patientDemosValues[-106] === "") {
                      UIkit.modal("#askemail").show();
                      vm.loading = false;
                    } else {
                      vm.detailordersave();
                    }
                  }
                },
                function (error) {
                  vm.loading = false;
                  vm.modalError(error);
                }
              );
          }
        } else {
          vm.detailordersave();
        }
      } else {
        vm.loading = false;
        logger.warning(
          "Los demograficos no estan completos, Revisar los marcados en rojo"
        );
      }
    }
    vm.confirmationsave = confirmationsave;
    function confirmationsave() {
      vm.loading = true;
      UIkit.modal("#askemail").hide();
      vm.detailordersave();
    }
    vm.detailordersave = detailordersave;
    function detailordersave() {
      //Se obtiene la informacion del paciente
      var patient = getPatientData();
      //Se obtiene la informacion de la orden
      var order = getOrderData();
      //order.externalId = '1020';
      order.externalId = vm.externalId;
      if (vm.hasCashbox) {
        vm.returncash = true;
        order.cashbox = {
          order: null,
          header: {
            id: -1,
            order: null,
            rate: null,
            subTotal:
              vm.cash.subtotal === null || vm.cash.subtotal === undefined
                ? 0
                : vm.cash.subtotal,
            discountValue:
              vm.cash.discountValue === null ||
              vm.cash.discountValue === undefined
                ? 0
                : vm.cash.discountValue,
            discountPercent: "0",
            taxValue:
              vm.cash.taxValue === null || vm.cash.taxValue === undefined
                ? 0
                : vm.cash.taxValue,
            discountValueRate: 0,
            discountPercentRate: 0,
            copay:
              vm.cash.copay === null || vm.cash.copay === undefined
                ? 0
                : vm.cash.copay,
            fee:
              vm.cash.fee === null || vm.cash.fee === undefined
                ? 0
                : vm.cash.fee,
            totalPaid:
              vm.cash.balance === null || vm.cash.balance === undefined
                ? 0
                : vm.cash.balance,
            balance:
              vm.cash.totalPaid === null || vm.cash.totalPaid === undefined
                ? 0
                : vm.cash.totalPaid,
          },
        };
      }

      if (vm.integrationMINSA) {
        if (vm.orderDemosValues[8].trim() !== "") {
          order.externalId = vm.orderDemosValues[8];
        }
      }
      //Se obtienen los examenes de la orden
      var tests = vm.listDataTest[0];

      if (tests === -1) {
        return;
      }
      if (tests.length === 0) {
        vm.dimensions = " width: 350px; height: 185px;";
        // vm.messageNotSave = $filter('translate')('0253');
        vm.messageNotTittle = $filter("translate")("0013");
        vm.numError = "0";
        vm.messageNotSave = $filter("translate")("0662");
        UIkit.modal("#logErrorTest").show();
        vm.loading = false;
        return;
      }
      order.listDiagnostic =
        vm.listdiagnosticstest === undefined ? [] : vm.listdiagnosticstest;
      //Arma el objeto de la orden
      order.patient = patient;
      order.tests = tests;
      vm.numError = "0";
      vm.messageNotSave = "";
      vm.listError = [];
      vm.dimensions = " width: 512px; height: 185px;";
      if (
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] !== null &&
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] !== undefined &&
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] !== ""
      ) {
        order.deleteTests = vm.listDataTest[1];
        order.orderNumber = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
        //Invoca el servicio de guardado de la orden
        //order.orderNumber = order.orderNumber;
        order.turn =
          $rootScope.dataturn === null ? "" : $rootScope.dataturn.number;
        vm.validatedtest = true;
        if (tests.length === vm.comparetest.length) {
          tests.forEach(function (value, key) {
            var validatedfilter = $filter("filter")(
              vm.comparetest,
              function (e) {
                return (
                  e.id === value.id &&
                  e.rate.id === value.rate.id &&
                  e.discount === value.discount
                );
              }
            );
            if (validatedfilter.length === 0) {
              vm.validatedtest = false;
            }
          });
        } else {
          vm.validatedtest = false;
        }
        if (
          JSON.stringify(vm.orderDemosValues) ===
            JSON.stringify(vm.compareorder) &&
          vm.validatedtest &&
          JSON.stringify(vm.patientDemosValues) ===
            JSON.stringify(vm.comparepatient)
        ) {
          vm.patientDemosDisabled = disabledAllDemo(
            vm.patientDemosDisabled,
            true
          );
          vm.patientDemosDisabled.photo = false;
          vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, true);
          vm.disabledTests = true;
          //Logica de Botones
          vm.newDisabled = false;
          vm.editDisabled = false;
          vm.cancelDisabled = false;
          vm.saveDisabled = true;
          vm.undoDisabled = true;
          vm.dailyDisabled = false;
          vm.searchDisabled = false;
          vm.barcodesDisabled = false;
          vm.interviewDisabled = false;
          vm.ticketDisabled = false;
          vm.requirementDisabled = false;
          vm.quoteDisabled = false;
          vm.recallDisabled = false;
          vm.cashboxDisabled = false;
          setTimeout(function () {
            vm.loading = false;
            vm.statediagnostic = 1;
            vm.statecomment = 1;
          }, 300);
        } else if (!vm.motiveeditorder) {
          if (
            JSON.stringify(vm.patientDemosValues) ===
            JSON.stringify(vm.comparepatient)
          ) {
            order.patient.updatePatient = false;
          } else {
            order.patient.updatePatient = true;
          }
          vm.orderedit = order;
          if (
            !vm.validatedtest &&
            vm.updatetestentry &&
            !vm.permissionuser.updatetestentry
          ) {
            vm.loading = false;
            vm.user = {
              username: "",
              password: "",
            };
            UIkit.modal("#modalogin", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
          } else {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            orderDS.updateOrder(auth.authToken, order).then(
              function (data) {
                if (data.status === 200) {
                  afterSaveOrder(data.data);
                }
              },
              function (error) {
                vm.loading = false;
                if (error.data !== null && error.data !== undefined) {
                  if (error.data.errorFields === undefined) {
                    vm.messageNotSave = error.data.message;
                  } else {
                    if (
                      error.data.errorFields[0] === "1" &&
                      error.data.errorFields[1] === "sample"
                    ) {
                      vm.messageNotSave =
                        "Realice la configuración de la muestra";
                    } else {
                      vm.numError = error.data.errorFields[0]
                        .split("|")[0]
                        .toString();
                      vm.messageNotSave =
                        vm.numError === "1"
                          ? $filter("translate")("0800")
                          : $filter("translate")("0331");
                      if (vm.numError === "6") {
                        if (error.data.errorFields[0].split("|").length === 3) {
                          vm.dimensions = " width: 512px; height: 350px;";
                          error.data.errorFields.forEach(function (value) {
                            var consult = _.filter(
                              JSON.parse(JSON.stringify(vm.tests)),
                              function (v) {
                                return v.id === parseInt(value.split("|")[2]);
                              }
                            );
                            if (consult.length !== 0) {
                              var cod = consult[0].code;
                              var name = consult[0].name;
                              vm.listError.push({
                                test: cod + ". " + name,
                              });
                            }
                          });
                        } else {
                          vm.numError = "06";
                          vm.messageNotTittle = $filter("translate")("0061");
                          vm.messageNotSave = $filter("translate")("1443");
                        }
                      } else if (vm.numError === "5") {
                        vm.messageNotTittle = $filter("translate")("0061");
                        vm.messageNotSave = $filter("translate")("1142");
                      } else if (vm.numError === "4") {
                        vm.messageNotTittle = $filter("translate")("0061");
                        vm.messageNotSave = $filter("translate")("1442");
                      }
                    }
                  }
                  UIkit.modal("#logErrorTest").show();
                }
              }
            );
          }
        } else if (vm.motiveeditorder) {
          if (
            JSON.stringify(vm.patientDemosValues) ===
            JSON.stringify(vm.comparepatient)
          ) {
            order.patient.updatePatient = false;
          } else {
            order.patient.updatePatient = true;
          }
          vm.orderedit = order;
          if (
            !vm.validatedtest &&
            vm.updatetestentry &&
            !vm.permissionuser.updatetestentry
          ) {
            vm.loading = false;
            vm.user = {
              username: "",
              password: "",
            };
            UIkit.modal("#modalogin", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();
          } else {
            vm.editmotiveorder = order;
            vm.Comment = "";
            vm.motive = { id: -1 };
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            return motiveDS.getMotiveByState(auth.authToken).then(
              function (data) {
                if (data.status === 200) {
                  vm.listMotives = _.filter(data.data, function (m) {
                    return m.type.id === 15;
                  });
                  UIkit.modal("#editmodal").show();
                } else {
                  logger.error("Debe crear motivos de modificación de ingreso");
                }
                vm.loading = false;
              },
              function (error) {
                vm.modalError(error);
                vm.loading = false;
              }
            );
          }
        }
      } else {
        //Invoca el servicio de guardado de la orden
        order.deleteTests = [];
        if (!vm.isOrderAutomatic) {
          $rootScope.orderturn = order.orderNumber;
        }
        order.turn =
          localStorageService.get("turn") === null ||
          localStorageService.get("turn") === undefined
            ? ""
            : localStorageService.get("turn").number;
        var auth = localStorageService.get("Enterprise_NT.authorizationData");

        if (
          JSON.stringify(vm.patientDemosValues) ===
          JSON.stringify(vm.comparepatient)
        ) {
          order.patient.updatePatient = false;
        } else {
          order.patient.updatePatient = true;
        }

        if (vm.automaticCashbox) {
          order.cashbox = {
            order: null,
            header: {
              id: -1,
              order: null,
              rate: null,
              subTotal:
                vm.cash.subtotal === null || vm.cash.subtotal === undefined
                  ? 0
                  : vm.cash.subtotal,
              discountValue:
                vm.cash.discountValue === null ||
                vm.cash.discountValue === undefined
                  ? 0
                  : vm.cash.discountValue,
              discountPercent: "0",
              taxValue:
                vm.cash.taxValue === null || vm.cash.taxValue === undefined
                  ? 0
                  : vm.cash.taxValue,
              discountValueRate: 0,
              discountPercentRate: 0,
              copay:
                vm.cash.copay === null || vm.cash.copay === undefined
                  ? 0
                  : vm.cash.copay,
              fee:
                vm.cash.fee === null || vm.cash.fee === undefined
                  ? 0
                  : vm.cash.fee,
              totalPaid: "0",
              balance:
                vm.cash.totalPaid === null || vm.cash.totalPaid === undefined
                  ? 0
                  : vm.cash.totalPaid,
            },
          };
        }

        orderDS.insertOrder(auth.authToken, order).then(
          function (data) {
            if (data.status === 200) {
              if (data.data.turn !== "") {
                Sigaturnorder(
                  data.data.orderNumber,
                  localStorageService.get("turn").id
                );
              }
              afterSaveOrder(data.data, true);
            }
          },
          function (error) {
            vm.loading = false;
            if (error.data !== null && error.data !== undefined) {
              if (error.data.errorFields === undefined) {
                vm.messageNotSave = error.data.message;
              } else {
                vm.numError = error.data.errorFields[0]
                  .split("|")[0]
                  .toString();
                vm.messageNotSave =
                  vm.numError === "1"
                    ? $filter("translate")("0800")
                    : $filter("translate")("0331");
                vm.messageNotTittle = $filter("translate")("0013");
                if (vm.numError === "6") {
                  if (error.data.errorFields[0].split("|").length === 3) {
                    vm.dimensions = " width: 512px; height: 350px;";
                    error.data.errorFields.forEach(function (value) {
                      var consult = _.filter(
                        JSON.parse(JSON.stringify(vm.tests)),
                        function (v) {
                          return v.id === parseInt(value.split("|")[2]);
                        }
                      );
                      if (consult.length !== 0) {
                        var cod = consult[0].code;
                        var name = consult[0].name;
                        vm.listError.push({
                          test: cod + ". " + name,
                        });
                      }
                    });
                  } else {
                    vm.numError = "06";
                    vm.messageNotTittle = $filter("translate")("0061");
                    vm.messageNotSave = $filter("translate")("1443");
                  }
                } else if (vm.numError === "5") {
                  vm.messageNotTittle = $filter("translate")("0061");
                  vm.messageNotSave = $filter("translate")("1142");
                } else if (vm.numError === "4") {
                  vm.messageNotTittle = $filter("translate")("0061");
                  vm.messageNotSave = $filter("translate")("1442");
                }
              }
              UIkit.modal("#logErrorTest").show();
            }
          }
        );
      }
    }

    function Sigaturnorder(orderNumber, turn) {
      var turninsert = {
        turn: { id: turn },
        order: orderNumber,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return sigaDS.turnorder(auth.authToken, turninsert).then(
        function (data) {},
        function (error) {}
      );
    }
    function motiveeditsave() {
      vm.loading = true;
      vm.editmotiveorder.idMotive = vm.motive.id;
      vm.editmotiveorder.commentary = vm.Comment;
      UIkit.modal("#editmodal").hide();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (
        JSON.stringify(vm.patientDemosValues) ===
        JSON.stringify(vm.comparepatient)
      ) {
        vm.editmotiveorder.patient.updatePatient = false;
      } else {
        vm.editmotiveorder.patient.updatePatient = true;
      }
      orderDS.updateOrder(auth.authToken, vm.editmotiveorder).then(
        function (data) {
          if (data.status === 200) {
            afterSaveOrder(data.data);
          }
        },
        function (error) {
          vm.loading = false;
          if (error.data !== null && error.data !== undefined) {
            if (error.data.errorFields === undefined) {
              vm.messageNotSave = error.data.message;
            } else {
              vm.numError = error.data.errorFields[0].split("|")[0].toString();
              vm.messageNotSave =
                vm.numError === "1"
                  ? $filter("translate")("0800")
                  : $filter("translate")("0331");
              if (vm.numError === "6") {
                if (error.data.errorFields[0].split("|").length === 3) {
                  vm.dimensions = " width: 512px; height: 350px;";
                  error.data.errorFields.forEach(function (value) {
                    var cod = _.filter(vm.tests, function (v) {
                      return v.id === parseInt(value.split("|")[2]);
                    })[0].code;
                    var name = _.filter(vm.tests, function (v) {
                      return v.id === parseInt(value.split("|")[2]);
                    })[0].name;
                    vm.listError.push({
                      test: cod + ". " + name,
                    });
                  });
                } else {
                  vm.numError = "06";
                  vm.messageNotTittle = $filter("translate")("0061");
                  vm.messageNotSave = $filter("translate")("1443");
                }
              } else if (vm.numError === "5") {
                vm.messageNotTittle = $filter("translate")("0061");
                vm.messageNotSave = $filter("translate")("1142");
              } else if (vm.numError === "4") {
                vm.messageNotTittle = $filter("translate")("0061");
                vm.messageNotSave = $filter("translate")("1442");
              }
            }
            UIkit.modal("#logErrorTest").show();
          }
        }
      );
    }
    /**
     * Evento de presionar nuevo
     */
    function eventNew() {
      vm.externalId = '0';
      vm.blockbilling = false;
      vm.blockservice = false;
      vm.permissioncancel = false;
      vm.ordercomment = "";
      vm.saveedit = false;
      vm.patientcoment = "";
      vm.inconsistency = false;
      $rootScope.dataturn = localStorageService.get("turn");
      vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
      vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
      vm.cleanTests = 1;
      vm.patientDemosValues[-99] = "";
      vm.orderDemosValues[-998] = "";
      vm.patientDemosDisabled["-100"] = vm.managehistoryauto;
      //Limpia el formulario de los indicadores de obligatorios
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
      vm.orderDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
      //Limpia los examenes
      vm.selectedTest = [];
      vm.samples = [];
      vm.deleteTests = [];
      //Adjuntos
      vm.patient = {};
      vm.commentOrder = "";
      if (vm.managehistoryauto) {
        vm.openSearch = true;
        vm.orderDemosValues[-5] = vm.branch;
        if (
          vm.customerdefault !== null &&
          vm.customerdefault !== "" &&
          vm.customerdefault !== "0" &&
          vm.manageAccount
        ) {
          var data = _.filter(_.clone(vm.orderDemos), function (o) {
            o.items = _.filter(o.items, function (p) {
              return p.id === parseInt(vm.customerdefault);
            });
            return o.items.length > 0 && o.id === -1;
          });
        }
        if (vm.orderTypeInit.toString() !== "0") {
          vm.orderDemosValues[-4] = vm.orderTypeDefault;
        }
      } else {
        vm.patientDemosDisabled = disabledAllDemo(
          vm.patientDemosDisabled,
          !vm.managehistoryauto
        );
        vm.patientDemosDisabled.photo = true;
        vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, true);
        if (vm.managedocumenttype) {
          vm.patientDemosDisabled["-10"] = false;
          setTimeout(function () {
            document
              .getElementById(
                "demo_" + vm.staticDemoIds["documentType"] + "_value"
              )
              .focus();
          }, 100);
        } else {
          setTimeout(function () {
            document
              .getElementById("demo_" + vm.staticDemoIds["patientId"])
              .focus();
          }, 100);
        }
        $rootScope.dataturn = localStorageService.get("turn");
        vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
        vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
        vm.cleanTests = 1;
        vm.patientDemosValues[-99] = "";
        vm.orderDemosValues[-998] = "";
        vm.patientDemosDisabled["-100"] = vm.managehistoryauto;
        //Limpia el formulario de los indicadores de obligatorios
        vm.patientDemos.forEach(function (demo, index) {
          demo.showRequired = false;
          if (demo.encoded && demo.viewdefault) {
            vm.patientDemosValues[demo.id] = demo.itemsdefault;
          }
        });
        vm.orderDemos.forEach(function (demo, index) {
          demo.showRequired = false;
          if (demo.encoded && demo.viewdefault) {
            vm.orderDemosValues[demo.id] = demo.itemsdefault;
          }
        });
        //Limpia los examenes
        vm.samples = [];
        vm.deleteTests = [];
        vm.orderDemosValues[-5] = vm.branch;
        if (
          vm.customerdefault !== null &&
          vm.customerdefault !== "" &&
          vm.customerdefault !== "0" &&
          vm.manageAccount
        ) {
          var data = _.filter(_.clone(vm.orderDemos), function (o) {
            o.items = _.filter(o.items, function (p) {
              return p.id === parseInt(vm.customerdefault);
            });
            return o.items.length > 0 && o.id === -1;
          });
          vm.orderDemosValues[-1] = data[0].items[0];
        }
        if (vm.orderTypeInit.toString() !== "0") {
          vm.orderDemosValues[-4] = vm.orderTypeDefault;
        }
        //Logica de Botones
        vm.newDisabled = true;
        vm.editDisabled = true;
        vm.cancelDisabled = true;
        vm.saveDisabled = true;
        vm.undoDisabled = false;
        vm.dailyDisabled = true;
        vm.searchDisabled = true;
        vm.barcodesDisabled = true;
        vm.interviewDisabled = true;
        vm.ticketDisabled = true;
        vm.requirementDisabled = true;
        vm.quoteDisabled = true;
        vm.recallDisabled = true;
        vm.cashboxDisabled = true;
        vm.attachmentDisabled = true;
        vm.worklistDisabled = true;
        vm.printReportDisabled = true;
        vm.observationsDisabled = true;
      }
    }
    /**
     * Evento de presionar nuevo
     */
    vm.eventCardReader = eventCardReader;
    function eventCardReader() {
      vm.viewCardReader = 1;
      if (
        vm.demoidcardreader === "" ||
        vm.demoidcardreader === "0" ||
        vm.demoidcardreader === undefined
      ) {
        logger.warning("Debe configurar el demográfico Cedula");
      } else {
        var documentType = parseInt(vm.demoidcardreader);
        vm.parientType = $filter("filter")(vm.ItemTypeDocument, function (e) {
          return e.id === documentType;
        })[0];
        vm.blockbilling = false;
        vm.blockservice = false;
        vm.permissioncancel = false;
        vm.ordercomment = "";
        vm.saveedit = false;
        vm.patientcoment = "";
        vm.inconsistency = false;
        $rootScope.dataturn = localStorageService.get("turn");
        vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
        vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
        vm.cleanTests = 1;
        vm.patientDemosValues[-99] = "";
        vm.orderDemosValues[-998] = "";
        vm.patientDemosDisabled["-100"] = vm.managehistoryauto;
        //Limpia el formulario de los indicadores de obligatorios
        vm.patientDemos.forEach(function (demo, index) {
          demo.showRequired = false;
        });
        vm.orderDemos.forEach(function (demo, index) {
          demo.showRequired = false;
        });
        //Limpia los examenes
        vm.selectedTest = [];
        vm.samples = [];
        vm.deleteTests = [];
        //Adjuntos
        vm.patient = {};
        vm.commentOrder = "";
        if (vm.managehistoryauto) {
          vm.openSearch = true;
          vm.orderDemosValues[-5] = vm.branch;
          if (
            vm.customerdefault !== null &&
            vm.customerdefault !== "" &&
            vm.customerdefault !== "0" &&
            vm.manageAccount
          ) {
            var data = _.filter(
              JSON.parse(JSON.stringify(vm.orderDemos)),
              function (o) {
                o.items = _.filter(o.items, function (p) {
                  return p.id === parseInt(vm.customerdefault);
                });
                return o.items.length > 0 && o.id === -1;
              }
            );
          }
          if (vm.orderTypeInit.toString() !== "0") {
            vm.orderDemosValues[-4] = vm.orderTypeDefault;
          }
        } else {
          vm.patientDemosDisabled = disabledAllDemo(
            vm.patientDemosDisabled,
            !vm.managehistoryauto
          );
          vm.patientDemosDisabled.photo = true;
          vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, true);
          $rootScope.dataturn = localStorageService.get("turn");
          vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
          vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
          vm.cleanTests = 1;
          vm.patientDemosValues[-99] = "";
          vm.orderDemosValues[-998] = "";
          vm.patientDemosDisabled["-100"] = vm.managehistoryauto;
          //Limpia el formulario de los indicadores de obligatorios
          vm.patientDemos.forEach(function (demo, index) {
            demo.showRequired = false;
            if (demo.encoded && demo.viewdefault) {
              vm.patientDemosValues[demo.id] = demo.itemsdefault;
            }
          });
          vm.orderDemos.forEach(function (demo, index) {
            demo.showRequired = false;
            if (demo.encoded && demo.viewdefault) {
              vm.orderDemosValues[demo.id] = demo.itemsdefault;
            }
          });
          //Limpia los examenes
          vm.samples = [];
          vm.deleteTests = [];
          vm.orderDemosValues[-5] = vm.branch;
          if (
            vm.customerdefault !== null &&
            vm.customerdefault !== "" &&
            vm.customerdefault !== "0" &&
            vm.manageAccount
          ) {
            var data = _.filter(
              JSON.parse(JSON.stringify(vm.orderDemos)),
              function (o) {
                o.items = _.filter(o.items, function (p) {
                  return p.id === parseInt(vm.customerdefault);
                });
                return o.items.length > 0 && o.id === -1;
              }
            );
            vm.orderDemosValues[-1] = data[0].items[0];
          }
          if (vm.orderTypeInit.toString() !== "0") {
            vm.orderDemosValues[-4] = vm.orderTypeDefault;
          }
          //Logica de Botones
          vm.newDisabled = true;
          vm.editDisabled = true;
          vm.cancelDisabled = true;
          vm.saveDisabled = true;
          vm.undoDisabled = false;
          vm.dailyDisabled = true;
          vm.searchDisabled = true;
          vm.barcodesDisabled = true;
          vm.interviewDisabled = true;
          vm.ticketDisabled = true;
          vm.requirementDisabled = true;
          vm.quoteDisabled = true;
          vm.recallDisabled = true;
          vm.cashboxDisabled = true;
          vm.attachmentDisabled = true;
          vm.worklistDisabled = true;
          vm.printReportDisabled = true;
          vm.observationsDisabled = true;
          vm.datareaderpatient = "";
          // vm.datareaderpatient = "77514282 PEREZ GOMEZ JOSE LUIS M 26/08/1976 O+";
          UIkit.modal("#modalcardreader", {
            bgclose: false,
            escclose: false,
            modal: false,
          }).show();
        }
      }
    }
    vm.focusinput = focusinput;
    function focusinput() {
      if (vm.viewCardReader === 2) {
        angular.element("#inputcardreader").focus();
      }
    }

    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    vm.keyselectdatapatient = keyselectdatapatient;
    function keyselectdatapatient($event) {
      if (vm.viewCardReader === 2) {
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
          vm.loadingdata = true;
          UIkit.modal("#modalcardreader").hide();
          var Patient = vm.datareaderpatient.split(vm.idscannerseparator);
          if (Patient.length > 4) {
            if (Patient.length === 5) {
              if (Patient[4][0] === "F" || Patient[4][0] === "M") {
                Patient[3] = Patient[4][0];
                Patient[4] = Patient[4].replace(Patient[4][0], "");
              }
              var fechaMoment = moment(Patient[4], vm.birthdateformat);
              var year = fechaMoment.format("YYYY");
              var month = fechaMoment.format("MM");
              var day = fechaMoment.format("DD");
              var birthday = new Date(year, parseInt(month) - 1, day);
              /*  vm.loapatient = {
                                 "patientId": Patient[0].replace(/^0+/, ''),
                                 "name1": Patient[2],
                                 "name2": '',
                                 "lastName": '',
                                 "surName": Patient[1],
                                 "sex": Patient[3],
                                 "birthday": new Date(moment(birthday).format()).getTime()
                             } */
              vm.loapatient = {
                patientId: Patient[0].replace(/^0+/, ""),
                name1:
                  Patient[vm.positioname1] == null
                    ? ""
                    : Patient[vm.positioname1],
                name2: "",
                lastName: "",
                surName:
                  Patient[vm.positionsurName] == null
                    ? ""
                    : Patient[vm.positionsurName],
                sex: Patient[3],
                birthday: new Date(moment(birthday).format()).getTime(),
              };
            }
            if (Patient.length === 6) {
              if (Patient[5][0] === "F" || Patient[5][0] === "M") {
                Patient[4] = Patient[5][0];
                Patient[5] = Patient[5].replace(Patient[5][0], "");
              }
              var fechaMoment = moment(Patient[5], vm.birthdateformat);
              var year = fechaMoment.format("YYYY");
              var month = fechaMoment.format("MM");
              var day = fechaMoment.format("DD");
              var birthday = new Date(year, parseInt(month) - 1, day);
              /*   vm.loapatient = {
                                  "patientId": Patient[0].replace(/^0+/, ''),
                                  "name1": Patient[3],
                                  "name2": '',
                                  "lastName": Patient[2],
                                  "surName": Patient[1],
                                  "sex": Patient[4],
                                  "birthday": new Date(moment(birthday).format()).getTime()
                              } */
              vm.loapatient = {
                patientId: Patient[0].replace(/^0+/, ""),
                name1:
                  Patient[vm.positioname1] == null
                    ? ""
                    : Patient[vm.positioname1],
                name2: "",
                lastName:
                  Patient[vm.positionlastName] == null
                    ? ""
                    : Patient[vm.positionlastName],
                surName:
                  Patient[vm.positionsurName] == null
                    ? ""
                    : Patient[vm.positionsurName],
                sex: Patient[4],
                birthday: new Date(moment(birthday).format()).getTime(),
              };
            }
            if (Patient.length >= 7) {
              if (Patient[6][0] === "F" || Patient[6][0] === "M") {
                Patient[5] = Patient[6][0];
                Patient[6] = Patient[6].replace(Patient[6][0], "");
              }
              var fechaMoment = moment(Patient[6], vm.birthdateformat);
              var year = fechaMoment.format("YYYY");
              var month = fechaMoment.format("MM");
              var day = fechaMoment.format("DD");
              var birthday = new Date(year, parseInt(month) - 1, day);
              /*  vm.loapatient = {
                                 "patientId": Patient[0].replace(/^0+/, ''),
                                 "name1": Patient[3] == null ? '' : Patient[3],
                                 "name2": Patient[4] == null ? '' : Patient[4],
                                 "lastName": Patient[2] == null ? '' : Patient[2],
                                 "surName": Patient[1] == null ? '' : Patient[1],
                                 "sex": Patient[5] == null ? '' : Patient[5],
                                 "birthday": new Date(moment(birthday).format()).getTime()
                             } */

              vm.loapatient = {
                patientId: Patient[0].replace(/^0+/, ""),
                name1:
                  Patient[vm.positioname1] == null
                    ? ""
                    : Patient[vm.positioname1],
                name2:
                  Patient[vm.positioname2] == null
                    ? ""
                    : Patient[vm.positioname2],
                lastName:
                  Patient[vm.positionlastName] == null
                    ? ""
                    : Patient[vm.positionlastName],
                surName:
                  Patient[vm.positionsurName] == null
                    ? ""
                    : Patient[vm.positionsurName],
                sex: Patient[5] == null ? "" : Patient[5],
                birthday: new Date(moment(birthday).format()).getTime(),
              };
            }
            patientDS
              .getPatientbyIddocument(
                auth.authToken,
                vm.loapatient.patientId,
                vm.parientType.id
              )
              .then(
                function (response) {
                  vm.statediagnostic = 3;
                  vm.statecomment = 3;
                  vm.viewphoto = true;
                  vm.patientDemosDisabled = disabledAllDemo(
                    vm.patientDemosDisabled,
                    false
                  );
                  vm.orderDemosDisabled = disabledAllDemo(
                    vm.orderDemosDisabled,
                    false
                  );
                  if (vm.vieworderhis) {
                    disabledDemo(vm.orderDemosDisabled, -109, true);
                  }
                  disabledDemo(
                    vm.orderDemosDisabled,
                    vm.staticDemoIds["orderDate"],
                    true
                  );
                  if (response.data.length > 0) {
                    var patientDemosValues = {};
                    var patient = $filter("filter")(
                      response.data,
                      function (e) {
                        return e.idDemographic === -99;
                      }
                    )[0].value;
                    vm.patientcoment = parseInt(patient);
                    response.data.forEach(function (demographic, index) {
                      if (demographic.encoded) {
                        patientDemosValues[demographic.idDemographic] = {
                          id: demographic.codifiedId,
                          code:
                            demographic.codifiedCode !== undefined
                              ? demographic.codifiedCode
                              : "",
                          name:
                            demographic.codifiedName !== undefined
                              ? demographic.codifiedName
                              : "",
                          showValue:
                            demographic.value !== undefined &&
                            demographic.value !== "."
                              ? demographic.codifiedCode.toUpperCase() +
                                ". " +
                                demographic.codifiedName.toUpperCase()
                              : "",
                        };
                      } else {
                        patientDemosValues[demographic.idDemographic] =
                          demographic.value;
                        if (
                          demographic.idDemographic ==
                          vm.staticDemoIds["birthday"]
                        ) {
                          //Si el demografico es la fecha de nacimiento calcula la edad
                          patientDemosValues[vm.staticDemoIds["age"]] =
                            common.getAge(
                              demographic.value,
                              vm.formatDate.toUpperCase()
                            );
                        }
                      }
                      if (vm.permissionuser.editPatients) {
                        var findpropertydemografic = _.filter(
                          vm.patientDemos,
                          function (e) {
                            return e.id === demographic.idDemographic;
                          }
                        );
                        if (findpropertydemografic.length > 0) {
                          if (findpropertydemografic[0].modify === false) {
                            disabledDemo(
                              vm.patientDemosDisabled,
                              demographic.idDemographic,
                              true
                            );
                          }
                        }
                      } else {
                        vm.patientDemos.forEach(function (e) {
                          disabledDemo(vm.patientDemosDisabled, e.id, true);
                        });
                      }
                    });
                    vm.patientDemosValues = patientDemosValues;
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["documentType"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["patientId"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["lastName"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["surName"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["name1"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["name2"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["sex"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["birthday"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["age"],
                      true
                    );
                    vm.patientDemosDisabled.photo = true;
                    if (vm.isOrderAutomatic) {
                      disabledDemo(
                        vm.orderDemosDisabled,
                        vm.staticDemoIds["order"],
                        true
                      );
                      setTimeout(function () {
                        document
                          .getElementById(
                            "demo_" + vm.staticDemoIds["orderType"] + "_value"
                          )
                          .focus();
                      }, 100);
                    } else {
                      setTimeout(function () {
                        document
                          .getElementById("demo_" + vm.staticDemoIds["order"])
                          .focus();
                      }, 100);
                    }
                    vm.comparepatient = JSON.parse(
                      JSON.stringify(vm.patientDemosValues)
                    );
                    if (vm.demoHistory) {
                      vm.selectLastOrder();
                    }
                  } else {
                    vm.patientDemosDisabled.photo = true;
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["documentType"],
                      true
                    );
                    disabledDemo(
                      vm.patientDemosDisabled,
                      vm.staticDemoIds["patientId"],
                      true
                    );

                    if (vm.isOrderAutomatic) {
                      disabledDemo(
                        vm.orderDemosDisabled,
                        vm.staticDemoIds["order"],
                        true
                      );
                    }
                    setTimeout(function () {
                      document
                        .getElementById("demo_" + vm.staticDemoIds["lastName"])
                        .focus();
                    }, 100);
                    vm.patientDemosValues[-10] = vm.parientType;
                    $scope.$broadcast(
                      "angucomplete-alt:changeInput",
                      "demo_-10",
                      vm.parientType
                    );

                    vm.patientDemosValues[-100] = vm.loapatient.patientId;
                    vm.patientDemosValues[-101] = vm.loapatient.surName;
                    vm.patientDemosValues[-102] = vm.loapatient.lastName;

                    vm.patientDemosValues[-103] = vm.loapatient.name1;
                    vm.patientDemosValues[-109] = vm.loapatient.name2;
                    vm.patientDemosValues[-105] = moment(
                      vm.loapatient.birthday
                    ).format(vm.formatDate.toUpperCase());
                    vm.patientDemosValues[-110] = common.getAge(
                      moment(vm.loapatient.birthday).format(
                        vm.formatDate.toUpperCase()
                      ),
                      vm.formatDate.toUpperCase()
                    );

                    if (vm.loapatient.sex === "M") {
                      vm.patientDemosValues[-104] = {
                        showValue: "1. MASCULINO",
                        name: "MASCULINO",
                        id: 7,
                        code: "1",
                      };
                      $scope.$broadcast(
                        "angucomplete-alt:changeInput",
                        "demo_-104",
                        vm.patientDemosValues[-104]
                      );
                    }

                    if (vm.loapatient.sex === "F") {
                      vm.patientDemosValues[-104] = {
                        id: 8,
                        code: "2",
                        showValue: "2. FEMENINO",
                        name: "FEMENINO",
                      };
                      $scope.$broadcast(
                        "angucomplete-alt:changeInput",
                        "demo_-104",
                        vm.patientDemosValues[-104]
                      );
                    }
                  }
                  //Logica de Botones
                  vm.newDisabled = true;
                  vm.editDisabled = true;
                  vm.cancelDisabled = true;
                  vm.saveDisabled = false;
                  vm.undoDisabled = false;
                  vm.dailyDisabled = true;
                  vm.searchDisabled = true;
                  vm.barcodesDisabled = true;
                  vm.interviewDisabled = true;
                  vm.ticketDisabled = true;
                  vm.cashboxDisabled = true;

                  //Habilita el combo de examenes
                  vm.disabledTests = false;
                  vm.loadingdata = false;

                  if (localStorageService.get("ManejoCentavos") === "True") {
                    vm.lastOrderAlarm();
                  }
                },
                function (error) {
                  vm.Error = error;
                  vm.ShowPopupError = true;
                  vm.loading = false;
                }
              );
          } else {
            vm.loadingdata = false;
            logger.success(
              "El lector no se encuentra correctamente configurado"
            );
          }
        }
      }
    }

    function eventEdit() {
      vm.saveedit = true;
      vm.openSearch = false;
      vm.deleteTests = [];
      vm.listDataTest[1] = [];
      vm.statediagnostic = 2;
      vm.statecomment = 2;
      vm.inconsistency = false;

      var demoexclude = localStorageService.get("DemograficoExcluirPrueba");
      if (
        demoexclude !== "" &&
        demoexclude !== "0" &&
        demoexclude !== "?" &&
        demoexclude !== "-1"
      ) {
        if (vm.patientDemosValues[parseInt(demoexclude)] === undefined) {
          $rootScope.editTestExclude =
            vm.orderDemosValues[parseInt(demoexclude)].id === undefined
              ? 0
              : vm.orderDemosValues[parseInt(demoexclude)].id;
        } else {
          $rootScope.editTestExclude =
            vm.patientDemosValues[parseInt(demoexclude)].id === undefined
              ? 0
              : vm.patientDemosValues[parseInt(demoexclude)].id;
        }
      }

      //Valida los días máximos configurados para editar una orden.
      var datePast = moment(
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]]
          .toString()
          .substr(0, 8),
        "YYYYMMDD"
      );
      var dateNow = moment();
      var diff = dateNow.diff(datePast, "days");
      if (vm.maxDaysEditOrder !== -1 && !auth.administrator) {
        if (diff > vm.maxDaysEditOrder) {
          vm.messageNotSave = $filter("translate")("0952")
            .replace(
              "@@@@",
              vm.orderDemosValues[vm.staticDemoIds["orderDB"]].toString()
            )
            .replace("##", diff.toString())
            .replace("%%", vm.maxDaysEditOrder.toString());
          vm.numError = "9";
          UIkit.modal("#logErrorTest").show();
          vm.loading = false;
          return;
        }
      }
      //Habilita los datos del paciente
      var patientDemosDisabled = disabledAllDemo(
        vm.patientDemosDisabled,
        false
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["documentType"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["patientId"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["lastName"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["surName"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["name1"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["name2"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["sex"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["birthday"],
        true
      );
      patientDemosDisabled = disabledDemo(
        patientDemosDisabled,
        vm.staticDemoIds["age"],
        true
      );

      vm.patientDemosDisabled = patientDemosDisabled;
      vm.patientDemosDisabled.photo = true;

      if (vm.permissionuser.editPatients) {
        var findpropertydemografic = _.filter(vm.patientDemos, function (e) {
          return e.modify === false;
        });
        if (findpropertydemografic.length > 0) {
          findpropertydemografic.forEach(function (e) {
            disabledDemo(vm.patientDemosDisabled, e.id, true);
          });
        }
      } else {
        vm.patientDemos.forEach(function (e) {
          disabledDemo(vm.patientDemosDisabled, e.id, true);
        });
      }
      //Habilita los datos de la orden
      var orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, false);
      if (vm.vieworderhis) {
        orderDemosDisabled = disabledDemo(orderDemosDisabled, -109, true);
      }
      orderDemosDisabled = disabledDemo(
        orderDemosDisabled,
        vm.staticDemoIds["order"],
        true
      );
      vm.blockbilling = vm.blockbilling === undefined ? false : vm.blockbilling;

      if ((!vm.editorderCashbox || vm.blockbilling) && vm.cashreceiptDisabled) {
        orderDemosDisabled = disabledDemo(
          orderDemosDisabled,
          vm.staticDemoIds["rate"],
          true
        );
        orderDemosDisabled = disabledDemo(
          orderDemosDisabled,
          vm.staticDemoIds["account"],
          true
        );
      }

      orderDemosDisabled = disabledDemo(
        orderDemosDisabled,
        vm.staticDemoIds["orderDate"],
        true
      );
      // if (vm.customerdefault !== null && vm.customerdefault !== '' && vm.customerdefault !== '0' && vm.manageAccount) {
      //     orderDemosDisabled = disabledDemo(orderDemosDisabled, vm.staticDemoIds['account'], true);
      // }
      vm.orderDemosDisabled = orderDemosDisabled;

      var findpropertydemografic = _.filter(vm.orderDemos, function (e) {
        return e.modify === false;
      });
      if (findpropertydemografic.length > 0) {
        findpropertydemografic.forEach(function (e) {
          disabledDemo(orderDemosDisabled, e.id, true);
        });
      }
      /*  if (vm.addtesservice && !vm.servicehospitalary) {
                 vm.blockservice = true;
             } */
      if (vm.addtesservice && vm.teststateprint && vm.servicehospitalary) {
        vm.blockservice = true;
      }
      vm.compareorder = JSON.parse(JSON.stringify(vm.orderDemosValues));
      vm.comparepatient = JSON.parse(JSON.stringify(vm.patientDemosValues));
      //Habilita los examenes
      vm.disabledTests = false;
      //Logica de Botones
      vm.newDisabled = true;
      vm.editDisabled = true;
      vm.cancelDisabled = true;
      vm.saveDisabled = false;
      vm.undoDisabled = false;
      vm.dailyDisabled = true;
      vm.searchDisabled = true;
      vm.barcodesDisabled = true;
      vm.interviewDisabled = true;
      vm.ticketDisabled = true;
      vm.cashboxDisabled = true;
    }

    function getMotives() {
      vm.inconsistency = false;
      vm.saveedit = false;
      //** Método que obtiene la lista para llenar la grilla**//
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return motiveDS.getMotiveByState(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.listMotives = _.filter(data.data, function (m) {
              return m.type.id === 16;
            });
            UIkit.modal("#deletemodal").show();
          } else {
            logger.error("Debe crear motivos de cancelación");
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError(error);
          vm.loadingdata = false;
        }
      );
    }

    function validationCancel() {
      var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return orderDS.checkValidation(auth.authToken, order).then(
        function (data) {
          if (data.status === 200) {
            if (data.data < 4) {
              vm.getMotives();
            } else {
              logger.error(
                "La orden no puede ser anulada porque esta validada"
              );
            }
          }
          vm.loadingdata = false;
        },
        function (error) {
          vm.modalError(error);
          vm.loadingdata = false;
        }
      );
    }

    function eventCancel() {
      vm.Comment = "";
      vm.motive = { id: -1 };
      vm.loadingdata = true;
      if (vm.cancelValidatedOrders) {
        vm.getMotives();
      } else {
        vm.validationCancel();
      }
    }

    function eventConfirmCancel() {
      vm.loadingConfirmCancel = true;
      var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
      var deletedata = {
        deleteType: 1,
        init: order,
        end: order,
        comment: vm.Comment,
        motive: {
          id: vm.motive.id,
          name: vm.motive.name,
        },
      };
      specialdeletesDS.deletespecialrange(auth.authToken, deletedata).then(
        function (data) {
          if (data.status === 200) {
            vm.loadingConfirmCancel = false;
            //La orden ha sido cancelada
            eventUndo();
            UIkit.modal("#modalConfirmCancel").hide();
            logger.success(
              $filter("translate")("1143").replace("@@@@", vm.order)
            );
          }
        },
        function (error) {
          vm.loadingConfirmCancel = false;
          vm.modalError(error);
        }
      );
    }
    function eventTransferTurn() {
      vm.refreshdashboard = true;
      eventUndo();
    }
    function saveAttachment() {
      logger.success($filter("translate")("1523"));
    }
    /**
     * Evento de Deshacer
     */
    function eventUndo() {
      vm.inconsistency = false;
      vm.blockbilling = false;
      vm.blockservice = false;
      vm.permissioncancel = false;
      vm.ordercomment = "";
      vm.patientcoment = "";
      vm.saveedit = false;
      vm.statediagnostic = 1;
      vm.statecomment = 1;
      vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
      vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
      vm.patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, true);
      vm.patientDemosDisabled.photo = false;
      vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, true);
      //Logica de Botones
      vm.newDisabled = false;
      vm.editDisabled = true;
      vm.cancelDisabled = true;
      vm.saveDisabled = true;
      vm.undoDisabled = true;
      vm.dailyDisabled = false;
      vm.searchDisabled = false;
      vm.barcodesDisabled = true;
      vm.interviewDisabled = true;
      vm.ticketDisabled = true;
      vm.requirementDisabled = false;
      vm.quoteDisabled = false;
      vm.recallDisabled = false;
      vm.cashboxDisabled = true;
      vm.viewphoto = false;
      vm.attachmentDisabled = true;
      vm.worklistDisabled = true;
      vm.printReportDisabled = true;
      vm.observationsDisabled = true;
      vm.hasCashbox = false;

      vm.patient = {};
      vm.commentOrder = "";
      //Limpia el formulario de los indicadores de obligatorios
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
      vm.orderDemos.forEach(function (demo, index) {
        demo.showRequired = false;
      });
      vm.disabledTests = true;
      vm.selectedTest = [];
      vm.samples = [];
      vm.orderDemosValues[vm.staticDemoIds["orderDB"]] == null;
      vm.patientDemosValues[vm.staticDemoIds["patientDB"]] == null;
      vm.orderDemosValues[-5] = vm.branch;
      if (vm.orderTypeInit.toString() !== "0") {
        vm.orderDemosValues[-4] = vm.orderTypeDefault;
      }
    }
    function eventSelectDate(date) {
      vm.selectedDate = date;
    }
    function getBarcode() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return barcodeDS.getBarcode(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.listbarcodeadicional = $filter("filter")(data.data, {
              type: "2",
            });
            vm.stickerAditionals = $filter("filter")(vm.listbarcodeadicional, {
              active: true,
            }).length;
            vm.printAddLabel =
              $scope.defaultaditional !== undefined &&
              $scope.defaultaditional === true &&
              vm.stickerAditionals > 0;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function eventBarcodes() {
      vm.loadingdata = true;
      if ($rootScope.serialprint === "") {
        vm.message = $filter("translate")("1067");
        UIkit.modal("#logNoData").show();
        vm.loadingdata = false;
      } else {
        vm.printlabels();
       
      }
    }

    function getProcessPrint() {
      var samples = [];
      if (vm.previewStickersOrder.length > 0) {
        vm.totalCanStickers = 0;
        vm.previewStickersOrder = _.filter(
          vm.previewStickersOrder,
          function (o) {
            return (
              o.cansticker !== "" &&
              o.cansticker !== undefined &&
              o.cansticker !== null
            );
          }
        );
        if (vm.previewStickersOrder.length > 0) {
          vm.previewStickersOrder.forEach(function (value) {
            samples.push({
              idSample: value.idSample,
              quantity: parseInt(value.cansticker),
            });
            vm.totalCanStickers += parseInt(value.cansticker);
          });
          samples = _.filter(samples, function (o) {
            return o.quantity > 0;
          });
          if (samples.length > 0) {
            vm.printbarcode.ordersprint = [{}];
            vm.progressPrint = false;
            vm.printbarcode.samples = samples;
            vm.directImpression();
          } else {
            logger.error($filter("translate")("1906"));
          }
        } else {
          logger.error($filter("translate")("1906"));
        }
      }
    }

    function printlabels() {
      vm.totalorder = 0;
      vm.porcent = 0;
      vm.printbarcode = {};
      vm.printbarcode = {
        order: {},
        rangeType: 1,
        init: vm.orderDemosValues[vm.staticDemoIds["orderDB"]],
        end: vm.orderDemosValues[vm.staticDemoIds["orderDB"]],
        samples: null,
        printAddLabel:
          vm.printAddSticker !== undefined && vm.printAddSticker === true,
        serial: $rootScope.serialprint,
        printingType: 2,
        test: [],
        demographics: [],
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return reportsDS
        .getOrderHeaderBarcode(auth.authToken, vm.printbarcode)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.listOrderHead = data.data;
              vm.ind = 1;
              var stickerAditionals = vm.printAddSticker
                ? vm.stickerAditionals
                : 0;
              vm.previewStickersOrder = [];
              if (vm.editNumberStickers) {
                data.data.forEach(function (value, key) {
                  vm.canStickersOrder = 0;
                  value.samples.forEach(function (valuesample) {
                    var canstickers = valuesample.canstiker;
                    vm.totalCanStickers += canstickers;
                    vm.canStickersOrder += canstickers;
                    vm.previewStickersOrder.push({
                      idSample: valuesample.id,
                      ordersample: valuesample.name,
                      cansticker: canstickers,
                      quantity: canstickers,
                      cansamples: value.samples.length,
                    });
                  });
                });
                vm.loadingdata = false;
                UIkit.modal("#modalNumberStickers", {
                  bgclose: false,
                  escclose: false,
                  modal: false,
                }).show();
              } else {
                vm.totalCanStickers = 0;
                data.data[0].samples.forEach(function (valuesample) {
                  var canstickers = valuesample.canstiker;
                  vm.totalCanStickers += canstickers;
                  valuesample.idSample = valuesample.id;
                  valuesample.quantity = valuesample.canstiker;
                });
                vm.printbarcode.ordersprint = [{}];
                vm.printbarcode.samples = data.data[0].samples;
                vm.totalCanStickers += stickerAditionals;
                vm.progressPrint = false;
                vm.directImpression();
              }
            }
          },
          function (error) {
            vm.loadingdata = false;
            vm.progressPrint = false;
            if (error.data !== undefined && error.data !== null) {
              logger.error($filter("translate")("0787"));
            } else {
              vm.PopupError = true;
              vm.Error = error;
            }
          }
        );
    }
    function directImpression() {
      vm.printbarcode.ordersprint[0] = vm.listOrderHead[vm.totalorder];
      vm.printbarcode.ordersprint[0].samples = _.filter(vm.listOrderHead[vm.totalorder].samples, function(o) { return o.id != 0; }); 
      vm.printbarcode.ordersprint[0].tests = _.filter(vm.listOrderHead[vm.totalorder].tests, function(o) { return o.sample.id != 0; })

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return reportsDS
        .printOrderBodyBarcode(auth.authToken, vm.printbarcode)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.loadingdata = false;
              UIkit.modal("#modalprogressprint", {
                bgclose: false,
                escclose: false,
                modal: false,
              }).show();
              vm.listOrderHead[vm.totalorder].printing = data.data[0].printing;
              setTimeout(function () {
                for (vm.ind; vm.ind <= vm.totalCanStickers; vm.ind++) {
                  vm.porcent = Math.round((vm.ind * 100) / vm.totalCanStickers);
                }
                vm.ind--;
                vm.totalorder = vm.totalorder + 1;
                setTimeout(function () {
                  logger.success(
                    $filter("translate")("0211") +
                      ": " +
                      vm.orderDemosValues[vm.staticDemoIds["orderDB"]]
                  );
                  UIkit.modal("#modalprogressprint", {
                    bgclose: false,
                    keyboard: false,
                  }).hide();
                  vm.listOrderPrint = [];
                }, 2000);
              }, 30);
            }
          },
          function (error) {
            vm.loading = false;
            if (error.data.code === 2) {
              vm.loadingdata = false;
              UIkit.modal("#modalprogressprint").hide();
              vm.message = $filter("translate")("1074");
              setTimeout(function () {
                UIkit.modal("#logNoData", {
                  modal: false,
                  keyboard: false,
                  bgclose: false,
                  center: true,
                }).show();
              }, 1000);
            } else {
              vm.loadingdata = false;
              vm.modalError(error);
              UIkit.modal("#modalprogressprint").hide();
              vm.message = $filter("translate")("1074");
              setTimeout(function () {
                UIkit.modal("#logNoData").show();
              }, 1000);
            }
          }
        );
    }
    function savephotopatient(id) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var datapatient = {
        id: id,
        photoInBase64: vm.patientPhoto,
      };
      patientDS
        .insertphotopatient(auth.authToken, datapatient)
        .then(function (response) {});
    }
    function orderSearchEvent(order) {
      vm.order = order;
      vm.ordercomment = order;
      vm.patientorder(order);
      vm.loadOrder(vm.order);
    }
    vm.patientorder = patientorder;
    function patientorder(order) {
      vm.orderpatient = order;
    }
    function eventSearch() {
      vm.saveedit = false;
      vm.inconsistency = false;
      vm.showModalSearch = true;
    }
    function eventDailySearch() {
      vm.saveedit = false;
      vm.inconsistency = false;
      vm.showModalDailySearch = true;
    }
    function eventTicket() {
      if (
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] !== undefined &&
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] !== null
      ) {
        vm.returncash = true;
        orderDS
          .getTicketTest(
            auth.authToken,
            vm.orderDemosValues[vm.staticDemoIds["orderDB"]]
          )
          .then(
            function (response) {
              if (response.status === 200) {
                vm.returncomment = true;
                setTimeout(function () {
                  vm.loadingdata = false;
                  var cashbox = {
                    subTotal: 0,
                    discountValue: 0,
                    discountPercent: 0,
                    taxValue: 0,
                    discountValueRate: 0,
                    discountPercentRate: 0,
                    copay: 0,
                    fee: 0,
                    totalPaid: 0,
                    balance: 0,
                  };
                  if (vm.priceTicket) {
                    vm.pathreport = "/Report/pre-analitic/ticket/ticket2.mrt";
                    cashbox.subTotal =
                      vm.cash === undefined
                        ? 0
                        : vm.cash.subtotal === null ||
                          vm.cash.subtotal === undefined
                        ? 0
                        : vm.cash.subtotal;
                    cashbox.discountValue =
                      vm.cash === undefined
                        ? 0
                        : vm.cash.discountValue === null ||
                          vm.cash.discountValue === undefined
                        ? 0
                        : vm.cash.discountValue;
                    cashbox.taxValue =
                      vm.cash === undefined
                        ? 0
                        : vm.cash.taxValue === null ||
                          vm.cash.taxValue === undefined
                        ? 0
                        : vm.cash.taxValue;
                    cashbox.copay =
                      vm.cash === undefined
                        ? 0
                        : vm.cash.copay === null || vm.cash.copay === undefined
                        ? 0
                        : vm.cash.copay;
                    cashbox.fee =
                      vm.cash === undefined
                        ? 0
                        : vm.cash.fee === null || vm.cash.fee === undefined
                        ? 0
                        : vm.cash.fee;
                    cashbox.totalPaid =
                      vm.cash === undefined
                        ? 0
                        : vm.cash.totalPaid === null ||
                          vm.cash.totalPaid === undefined
                        ? 0
                        : vm.cash.totalPaid;
                    cashbox.balance =
                      vm.cash === undefined
                        ? 0
                        : vm.cash.balance === null ||
                          vm.cash.balance === undefined
                        ? 0
                        : vm.cash.balance;
                  } else {
                    vm.pathreport = "/Report/pre-analitic/ticket/ticket1.mrt";
                  }
                  vm.datareport = response.data;
                  vm.datareport.forEach(function (value) {
                    value.dateDelivery =
                      value.dateDelivery == null
                        ? ""
                        : moment(value.dateDelivery).format(
                            vm.formatDate.toUpperCase()
                          );
                  });
                  vm.variables = [
                    {
                      entity: "CLTECH",
                      abbreviation: "CLT",
                      username: auth.userName,
                      date: moment().format(
                        "" + vm.formatDate.toUpperCase() + " " + "HH:mm:ss"
                      ),
                      orderNumber:
                        vm.orderDemosValues[vm.staticDemoIds["orderDB"]],
                      orderDate:
                        vm.orderDemosValues[vm.staticDemoIds["orderDate"]],
                      patientId:
                        vm.patientDemosValues[vm.staticDemoIds["patientId"]],
                      lastName:
                        vm.patientDemosValues[vm.staticDemoIds["lastName"]],
                      surName:
                        vm.patientDemosValues[vm.staticDemoIds["surName"]],
                      name1: vm.patientDemosValues[vm.staticDemoIds["name1"]],
                      name2: vm.patientDemosValues[vm.staticDemoIds["name2"]],
                      birthday:
                        vm.patientDemosValues[vm.staticDemoIds["birthday"]],
                      sex: vm.patientDemosValues[vm.staticDemoIds["sex"]].name,
                      age: vm.patientDemosValues[vm.staticDemoIds["age"]],
                      email: vm.patientDemosValues[vm.staticDemoIds["email"]],
                      passwordWebQuery: vm.patient.passwordWebQuery,
                      cashbox: cashbox,
                      account: vm.orderDemosValues[vm.staticDemoIds["account"]],
                      address:
                        vm.patientDemosValues[vm.staticDemoIds["address"]],
                      phone: vm.patientDemosValues[vm.staticDemoIds["phone"]],
                      branch: vm.orderDemosValues[vm.staticDemoIds["branch"]],
                      physician:
                        vm.orderDemosValues[vm.staticDemoIds["physician"]],
                      orderHIS: vm.orderDemosValues[-109]  
                    },
                  ];

                  vm.orderDemos.forEach(function (demo) {
                    if (demo.id > 0) {
                      vm.variables[0]["demo_" + demo.id + "_name"] = demo.name;
                      vm.variables[0]["demo_" + demo.id + "_value"] =
                        demo.encoded === false
                          ? vm.orderDemosValues[demo.id] === undefined
                            ? ""
                            : vm.orderDemosValues[demo.id]
                          : vm.orderDemosValues[demo.id] === undefined
                          ? ""
                          : vm.orderDemosValues[demo.id].showValue;
                    }
                  });

                  var comments = vm.commentsorder;
                  var listComments = [];
                  var content = "";
                  if (comments.length > 0) {
                    comments.forEach(function (valueCont) {
                      if (valueCont.comment !== "") {
                        listComments.push({
                          comment: valueCont.before,
                        });
                        //EL JSON PARSE NO SIRVE PORQUE EL COMENTARIO VIENE CON LA PROPIEDAD FONT-FAMILY = ""
                        // var firshC = JSON.parse(valueCont.comment.replace(/'/g, '"')).content.substring(0, 1);
                        // var pos = firshC == '"' ? 1 : 0;
                        // var cont = JSON.parse(valueCont.comment.replace(/'/g, '"')).content;
                        // content = JSON.parse(valueCont.comment.replace(/'/g, '"')).content.substring(pos, cont.length - pos);
                        // listComments.push({
                        //     comment: content
                        // });
                      }
                    });
                  }
                  vm.variables[0]["comments"] = listComments;
                  vm.returncash = false;
                  vm.windowOpenReport();
                }, 500);
              }
            },
            function (error) {
              vm.loadingdata = false;
              vm.modalError(error);
            }
          );
      }
    }
    function eventRequirement() {
      vm.showModalRequirement = true;
    }
    function eventQuote() {
      vm.showModalQuote = true;
    }
    function eventInterview() {
      vm.showModalInterview = true;
    }
    function eventProfileInfo() {
      vm.showModalProfileInfo = true;
    }
    function eventRecall() {
      vm.showModalSearchRecall = true;
    }
    function eventCashbox() {
      vm.showModalCashbox = true;
    }
    function eventValidityResult(test) {
      vm.resultValidity = {
        photo:
          "data:image/png;base64," + test.resultValidity.userLastResult.photo,
        lastName: test.resultValidity.userLastResult.lastName,
        name: test.resultValidity.userLastResult.name,
        dateLastResult: moment(test.resultValidity.dateLastResult).format(
          vm.formatDate.toUpperCase() + " HH:mm:ss"
        ),
        daysFromLastResult:
          test.resultValidity.daysFromLastResult +
          " " +
          $filter("translate")("0476"),
      };
    }
    function loadOrder(order) {
      vm.loadingdata = true;
      vm.selectedTest = [];
      vm.samples = [];
      vm.deleteTests = [];
      vm.demographicsBarcode = [];
      vm.blockbilling = false;
      vm.permissioncancel = false;
      vm.permit = true;
      orderDS.getOrder(auth.authToken, order).then(
        function (response) {
          if (response.status === 200) {
            vm.servicehospitalary =
              response.data.service !== undefined
                ? response.data.service.hospitalSampling
                : "";
            var teststateprint = $filter("filter")(
              response.data.resultTest,
              function (e) {
                return e.printsample === false;
              }
            );
            vm.teststateprint = teststateprint.length > 0 ? true : false;
            /*  if (vm.addtesservice && !vm.servicehospitalary) {
                             vm.permissioncancel = false;
                         } */
            if (
              vm.addtesservice &&
              vm.teststateprint &&
              vm.servicehospitalary
            ) {
              vm.permissioncancel = false;
            }
            vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
            vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
            vm.blockbilling = response.data.billingAccount;
            vm.patientcoment = response.data.patient.id;
            vm.setdataorder(response.data);
          } else {
            vm.loadingdata = false;
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    function loadOrderRecalled(order) {
      vm.loadingdata = true;
      vm.permissioncancel = false;
      vm.order = order.orderNumber;
      vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
      vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
      vm.selectedTest = [];
      vm.samples = [];
      vm.deleteTests = [];
      vm.demographicsBarcode = [];
      if (order.tests.length !== 0) {
        var listest = [];
        order.tests = _.orderBy(order.tests, "profileId");
        order.tests.forEach(function (value) {
          if (value.profileId === 0) {
            listest.push(value);
          } else {
            var compared = $filter("filter")(
              JSON.parse(JSON.stringify(listest)),
              function (e) {
                return value.profileId === e.id;
              }
            );
            if (compared.length === 0) {
              listest.push(value);
            }
          }
        });
        order.resultTest = listest;
      }
      orderDS.getOrder(auth.authToken, vm.order).then(
        function (response) {
          if (response.status === 200) {
            vm.servicehospitalary =
              response.data.service !== undefined
                ? response.data.service.hospitalSampling
                : "";
            var teststateprint = $filter("filter")(
              response.data.resultTest,
              function (e) {
                return e.printsample === false;
              }
            );
            vm.teststateprint = teststateprint.length > 0 ? true : false;
            /* if (vm.addtesservice && !vm.servicehospitalary) {
                            vm.permissioncancel = true;
                        } */
            if (
              vm.addtesservice &&
              vm.teststateprint &&
              vm.servicehospitalary
            ) {
              vm.permissioncancel = false;
            }
            order.demographics = response.data.demographics;
            order.tests.forEach(function (value) {
              var test = _.find(response.data.resultTest, function (o) {
                return o.testId === value.id;
              });
              if (test) {
                value.billing = test.billing;
                value.homologationCode = test.homologationCode;
              }
            });
            vm.setdataorder(order, true);
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }
    function setdataorder(order, recalled) {
      vm.invoiceDisabledparticular = false;
      vm.invoiceDisabled = false;
      vm.cashreceiptDisabled = false;
      vm.hasCashbox = false;
      vm.loadingdata = false;
      vm.inconsistency = order.inconsistency === true;
      var orderB = order;

      vm.patient = {
        id: order.patient.id,
        document: order.patient.patientId,
        name:
          order.patient.name1 +
          " " +
          order.patient.name2 +
          " " +
          order.patient.lastName,
        birthday: order.patient.birthday,
        age: common.getAgeAsString(
          moment(order.patient.birthday).format(vm.formatDateAge),
          vm.formatDateAge,
          order.createdDate
        ),
        gender:
          $filter("translate")("0000") === "enUsa"
            ? order.patient.sex.enUsa
            : order.patient.sex.esCo,
        typeordercolor: order.type.color,
        typeordercode: order.type.code,
        passwordWebQuery: order.patient.passwordWebQuery,
      };
      vm.commentOrder = order.comments[0];

      var patientDemosValues = {};
      if (orderB.turn !== undefined && orderB.turn !== "") {
        var turn = {
          number: orderB.turn,
        };
        $rootScope.dataturn = turn;
      } else {
        $rootScope.dataturn = null;
      }

      //Carga los datos del paciente
      patientDemosValues[vm.staticDemoIds["patientDB"]] = orderB.patient.id;
      if (vm.managedocumenttype) {
        if (orderB.patient.documentType.id !== undefined) {
          patientDemosValues[vm.staticDemoIds["documentType"]] = {
            id: orderB.patient.documentType.id,
            code: orderB.patient.documentType.abbr.toUpperCase(),
            name: orderB.patient.documentType.name.toUpperCase(),
            showValue:
              orderB.patient.documentType.id === 1
                ? ""
                : orderB.patient.documentType.abbr.toUpperCase() +
                  ". " +
                  orderB.patient.documentType.name.toUpperCase(),
          };
        } else {
          patientDemosValues[vm.staticDemoIds["documentType"]] = {
            id: 0,
            code: "",
            name: "",
            showValue: "",
          };
        }
      }
      patientDemosValues[vm.staticDemoIds["patientId"]] =
        orderB.patient.patientId;
      patientDemosValues[vm.staticDemoIds["lastName"]] =
        orderB.patient.lastName;
      patientDemosValues[vm.staticDemoIds["surName"]] = orderB.patient.surName;
      patientDemosValues[vm.staticDemoIds["name1"]] = orderB.patient.name1;
      patientDemosValues[vm.staticDemoIds["name2"]] = orderB.patient.name2;
      patientDemosValues[vm.staticDemoIds["phone"]] = orderB.patient.phone;
      patientDemosValues[vm.staticDemoIds["sex"]] = {
        id: orderB.patient.sex.id,
        code: orderB.patient.sex.code.toUpperCase(),
        name: orderB.patient.sex.esCo.toUpperCase(),
        showValue:
          orderB.patient.sex.code.toUpperCase() +
          ". " +
          orderB.patient.sex.esCo.toUpperCase(),
      };
      patientDemosValues[vm.staticDemoIds["birthday"]] = moment(
        orderB.patient.birthday
      ).format(vm.formatDate.toUpperCase());
      patientDemosValues[vm.staticDemoIds["age"]] = common.getAge(
        moment(orderB.patient.birthday).format(vm.formatDate.toUpperCase()),
        vm.formatDate.toUpperCase(),
        orderB.createdDate
      );
      patientDemosValues[vm.staticDemoIds["email"]] = orderB.patient.email;
      patientDemosValues[vm.staticDemoIds["address"]] = orderB.patient.address;
      if (vm.manageweight) {
        patientDemosValues[vm.staticDemoIds["weight"]] = orderB.patient.weight;
      }
      if (vm.managesize) {
        patientDemosValues[vm.staticDemoIds["size"]] = orderB.patient.size;
      }
      if (vm.managerace) {
        if (
          orderB.patient.race !== undefined &&
          orderB.patient.race.id !== undefined
        ) {
          patientDemosValues[vm.staticDemoIds["race"]] = {
            id: orderB.patient.race.id,
            code: orderB.patient.race.code.toUpperCase(),
            name: orderB.patient.race.name.toUpperCase(),
            showValue:
              orderB.patient.race.code.toUpperCase() +
              ". " +
              orderB.patient.race.name.toUpperCase(),
          };
          vm.demographicsBarcode.push({
            demographics: vm.staticDemoIds["race"],
            demographicItems: [orderB.patient.race.id],
          });
        }
      }
      orderB.patient.demographics.forEach(function (demographic, index) {
        if (demographic.encoded) {
          patientDemosValues[demographic.idDemographic] = {
            id: demographic.codifiedId,
            code:
              demographic.codifiedCode !== undefined
                ? demographic.codifiedCode
                : "",
            name:
              demographic.codifiedName !== undefined
                ? demographic.codifiedName
                : "",
            description:
              demographic.codifiedDescription !== undefined
                ? demographic.codifiedDescription
                : "",
            showValue:
              demographic.value !== undefined && demographic.value !== "."
                ? demographic.codifiedCode.toUpperCase() +
                  ". " +
                  demographic.codifiedName.toUpperCase()
                : "",
          };
          vm.demographicsBarcode.push({
            demographics: demographic.idDemographic,
            demographicItems: [demographic.codifiedId],
          });
        } else {
          patientDemosValues[demographic.idDemographic] = demographic.value;
          vm.demographicsBarcode.push({
            demographics: demographic.idDemographic,
            demographicItems: [],
          });
        }
      });
      //Carga los datos de la orden
      var orderDemosValues = {};
      orderDemosValues.turn = orderB.turn;
      if (vm.vieworderhis) {
        orderDemosValues[-109] = orderB.externalId; //ExternalId
      }
      vm.externalId = orderB.externalId == "" ? null : orderB.externalId;
      orderDemosValues[vm.staticDemoIds["orderDB"]] =
        recalled === undefined ? orderB.orderNumber : "";
      orderDemosValues[vm.staticDemoIds["order"]] =
        recalled === undefined ? orderB.orderNumber : ""; //Number(('' + orderB.orderNumber).substring(4));
      orderDemosValues[vm.staticDemoIds["orderDate"]] =
        recalled === undefined
          ? moment(orderB.createdDate).format(
              vm.formatDate.toUpperCase() + " HH:mm:ss"
            )
          : "";
      orderDemosValues[vm.staticDemoIds["createUser"]] =
        recalled === undefined ? orderB.createUser.userName : "";

      orderDemosValues[vm.staticDemoIds["orderType"]] = {
        id: orderB.type.id,
        code: orderB.type.code,
        name: orderB.type.name,
        showValue: orderB.type.code + ". " + orderB.type.name,
      };
      vm.demographicsBarcode.push({
        demographics: vm.staticDemoIds["orderType"],
        demographicItems: [orderB.type.id],
      });
      // if (vm.manageBranch) {
      orderDemosValues[vm.staticDemoIds["branch"]] = {
        id: orderB.branch.id,
        code: orderB.branch.code,
        name: orderB.branch.name,
        showValue:
          orderB.branch.id === undefined
            ? ""
            : orderB.branch.code + ". " + orderB.branch.name,
      };
      vm.demographicsBarcode.push({
        demographics: vm.staticDemoIds["branch"],
        demographicItems: [orderB.branch.id],
      });
      // }

      if (vm.manageService) {
        orderDemosValues[vm.staticDemoIds["service"]] = {
          id: orderB.service.id,
          code: orderB.service.code,
          name: orderB.service.name,
          showValue:
            orderB.service.id === undefined
              ? ""
              : orderB.service.code + ". " + orderB.service.name,
        };
        vm.demographicsBarcode.push({
          demographics: vm.staticDemoIds["service"],
          demographicItems: [orderB.service.id],
        });
      }

      if (vm.manageAccount) {
        orderDemosValues[vm.staticDemoIds["account"]] = {
          id: orderB.account.id,
          code: orderB.account.nit,
          name: orderB.account.name,
          showValue:
            orderB.account.id === undefined
              ? ""
              : orderB.account.nit + ". " + orderB.account.name,
        };
        vm.demographicsBarcode.push({
          demographics: vm.staticDemoIds["account"],
          demographicItems: [orderB.account.id],
        });
      }

      if (vm.manageRate) {
        orderDemosValues[vm.staticDemoIds["rate"]] = {
          id: orderB.rate.id,
          code: orderB.rate.code,
          name: orderB.rate.name,
          showValue:
            orderB.rate.id === undefined
              ? ""
              : orderB.rate.code + ". " + orderB.rate.name,
        };
        vm.demographicsBarcode.push({
          demographics: vm.staticDemoIds["rate"],
          demographicItems: [orderB.rate.id],
        });
      }

      if (vm.managePhysician) {
        orderDemosValues[vm.staticDemoIds["physician"]] = {
          id: orderB.physician.id,
          code: orderB.physician.code,
          name: orderB.physician.name,
          showValue:
            orderB.physician.id === undefined
              ? ""
              : orderB.physician.code + ". " + orderB.physician.name,
        };
        vm.demographicsBarcode.push({
          demographics: vm.staticDemoIds["physician"],
          demographicItems: [orderB.physician.id],
        });
      }

      orderB.demographics.forEach(function (demographic, index) {
        if (demographic.encoded) {
          orderDemosValues[demographic.idDemographic] = {
            id: demographic.codifiedId,
            code:
              demographic.codifiedCode !== undefined
                ? demographic.codifiedCode
                : "",
            name:
              demographic.codifiedName !== undefined
                ? demographic.codifiedName
                : "",
            description:
              demographic.codifiedDescription !== undefined
                ? demographic.codifiedDescription
                : "",
            showValue:
              demographic.value !== undefined && demographic.value !== "."
                ? demographic.codifiedCode.toUpperCase() +
                  ". " +
                  demographic.codifiedName.toUpperCase()
                : "",
          };
          vm.demographicsBarcode.push({
            demographics: demographic.idDemographic,
            demographicItems: [demographic.codifiedId],
          });
        } else {
          orderDemosValues[demographic.idDemographic] = demographic.value;
          vm.demographicsBarcode.push({
            demographics: demographic.idDemographic,
            demographicItems: [],
          });
        }
      });

      if (vm.isAuxPhysicians) {
        var indexes = [-201, -202, -203, -204, -205];
        for (var i = 0; i < vm.totalAuxPhysicians; i++) {
          if (orderB.auxiliaryPhysicians[i] !== undefined) {
            orderDemosValues[indexes[i]] = {
              id: orderB.auxiliaryPhysicians[i].id,
              code: orderB.auxiliaryPhysicians[i].code,
              name: orderB.auxiliaryPhysicians[i].name,
              showValue:
                orderB.auxiliaryPhysicians[i].id === undefined
                  ? ""
                  : orderB.auxiliaryPhysicians[i].code +
                    ". " +
                    orderB.auxiliaryPhysicians[i].name,
            };
          } else {
            orderDemosValues[indexes[i]] = "";
          }
        }
      }

      //Carga los examenes
      var selectedTest = [];
      vm.samplesBarcode = [];
      var samples = [];
      orderB.resultTest.forEach(function (test, index) {
        var itemtest = {
          id: recalled === undefined ? test.testId : test.id,
          code: recalled === undefined ? test.testCode : test.code,
          name:
            recalled === undefined ? test.testName.toUpperCase() : test.name,
          deletedtest:
            vm.addtesservice && test.printsample && vm.servicehospitalary,
          rate:
            vm.manageRate && (test.billing !== undefined || recalled === true)
              ? {
                  id:
                    recalled === undefined
                      ? test.billing.rate.id
                      : test.rate.id,
                  code:
                    recalled === undefined
                      ? test.billing.rate.code
                      : test.rate.code,
                  name:
                    recalled === undefined
                      ? test.billing.rate.name
                      : test.rate.name,
                  showValue:
                    recalled === undefined
                      ? test.billing.rate.code + ". " + test.billing.rate.name
                      : test.rate.code + ". " + test.rate.name,
                }
              : "",
          codeCups: test.homologationCode,
          price:
            vm.manageRate && (test.billing !== undefined || recalled === true)
              ? recalled === true
                ? test.price
                : test.billing.servicePrice
              : 0,
          insurancePrice:
            vm.manageRate && (test.billing !== undefined || recalled === true)
              ? recalled === true
                ? test.price
                : test.billing.insurancePrice
              : 0,
          patientPrice:
            vm.manageRate && (test.billing !== undefined || recalled === true)
              ? recalled === true
                ? test.price
                : test.billing.patientPrice
              : 0,
          discount:
            test.billing === undefined
              ? 0
              : test.billing.discount === undefined
              ? 0
              : test.billing.discount,
          Valuediscount: 0,
          state: test.state,
          sample: { id: test.sampleId },
          type: test.testType,
          testType: test.testType,
          resultValidity: null,
          billing: test.billing,
          validatedChilds: test.validatedChilds,
          areaName: recalled === undefined ? test.areaName : test.area.name,
          areaId: recalled === undefined ? test.areaId : test.area.id,
          account:
            vm.manageAccount &&
            (test.billing !== undefined || recalled === true)
              ? test.billing !== undefined && test.billing.account !== undefined
                ? {
                    id:
                      recalled === undefined
                        ? test.billing.account.id
                        : test.account.id,
                    name:
                      recalled === undefined
                        ? test.billing.account.name
                        : test.account.name,
                    showValue:
                      recalled === undefined
                        ? test.billing.account.code +
                          ". " +
                          test.billing.account.name
                        : test.account.code + ". " + test.account.name,
                  }
                : ""
              : "",
        };

        if (itemtest.discount !== 0) {
          /* var calculatediscount = $filter('currency')((itemtest.patientPrice * itemtest.discount) / 100, vm.symbolCurrency, vm.pennycontroller) */
          var penny =
            localStorageService.get("ManejoCentavos") === "True" ? 2 : 0;
          var calculatediscount = $filter("currency")(
            (itemtest.patientPrice * itemtest.discount) / 100,
            vm.symbolCurrency,
            penny
          );
          itemtest.Valuediscount = vm.normalizeNumberFormat(
            calculatediscount,
            vm.symbolCurrency
          );
        }
        selectedTest.push(itemtest);

        if (recalled) {
          orderB.samples = orderB.samples === undefined ? [] : orderB.samples;
          orderB.samples.push(test.sample);
          vm.samplesBarcode.push({
            idSample: test.sample.id,
            quantity: test.sample.canstiker,
          });

          var filtersample = _.filter(samples, {
            id: test.sample.id,
          });

          if (filtersample.length > 0) {
            filtersample[0].tests.push(itemtest);
          } else {
            samples.push({
              id: test.sample.id,
              name: test.sample.name,
              container: {
                name: test.sample.container.name,
                image:
                  test.sample.container.image === "" ||
                  test.sample.container.image === undefined
                    ? "images/empty-container.png"
                    : "data:image/png;base64," + sample.container.image,
              },
              tests: [itemtest],
            });
          }
        }
      });

      if (recalled === undefined) {
        //Carga los recipientes y muestras

        var testsS = null;

        orderB.samples.forEach(function (sample, index) {
          testsS = [];
          sample.tests.forEach(function (testToSample, index2) {
            testsS.push({
              id: testToSample.id,
              code: testToSample.code,
            });
          });
          samples.push({
            id: sample.id,
            name: sample.name,
            container: {
              name: sample.container.name,
              image:
                sample.container.image === ""
                  ? "images/empty-container.png"
                  : "data:image/png;base64," + sample.container.image,
            },
            tests: testsS,
          });
          vm.samplesBarcode.push({
            idSample: sample.id,
            quantity: sample.canstiker,
          });
        });
      }
      //Carga las variables de la vista
      vm.patientDemosValues = patientDemosValues;
      vm.orderDemosValues = orderDemosValues;
      vm.listdiagnosticstest = orderB.listDiagnostic;
      vm.selectedTest = selectedTest;
      vm.testCashReceipt = selectedTest;
      vm.comparetest = JSON.parse(JSON.stringify(vm.selectedTest));
      vm.samples = samples;
      //Habilita botones
      //Logica de Botones

      if (recalled) {
        //Habilita los datos del paciente
        var patientDemosDisabled = disabledAllDemo(
          vm.patientDemosDisabled,
          vm.managehistoryauto
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["documentType"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["patientId"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["lastName"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["surName"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["name1"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["name2"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["sex"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["birthday"],
          true
        );
        patientDemosDisabled = disabledDemo(
          patientDemosDisabled,
          vm.staticDemoIds["age"],
          true
        );
        vm.patientDemosDisabled = patientDemosDisabled;
        vm.patientDemosDisabled.photo = true;
        //Habilita los datos de la orden
        var orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, false);

        orderDemosDisabled = disabledDemo(
          orderDemosDisabled,
          vm.staticDemoIds["order"],
          true
        );
        if (vm.vieworderhis) {
          orderDemosDisabled = disabledDemo(orderDemosDisabled, -109, true);
        }
        // if (vm.customerdefault !== null && vm.customerdefault !== '' && vm.customerdefault !== '0' && vm.manageAccount) {
        //     orderDemosDisabled = disabledDemo(orderDemosDisabled, vm.staticDemoIds['account'], true);
        // }
        orderDemosDisabled = disabledDemo(
          orderDemosDisabled,
          vm.staticDemoIds["orderDate"],
          true
        );
        vm.orderDemosDisabled = orderDemosDisabled;

        //Habilita los examenes
        vm.disabledTests = false;
        //Logica de Botones
        vm.newDisabled = true;
        vm.editDisabled = true;
        vm.cancelDisabled = true;
        vm.saveDisabled = false;
        vm.undoDisabled = false;
        vm.dailyDisabled = true;
        vm.searchDisabled = true;
        vm.barcodesDisabled = true;
        vm.interviewDisabled = true;
        vm.ticketDisabled = true;
        vm.cashboxDisabled = true;
        vm.recallDisabled = true;
        vm.attachmentDisabled = false;
        vm.worklistDisabled = false;
        vm.printReportDisabled = false;
        vm.observationsDisabled = false;
      } else {
        vm.newDisabled = false;
        vm.editDisabled = false;
        vm.cancelDisabled = false;
        vm.saveDisabled = true;
        vm.undoDisabled = true;
        vm.dailyDisabled = false;
        vm.searchDisabled = false;
        vm.barcodesDisabled = false;
        vm.interviewDisabled = false;
        vm.ticketDisabled = false;
        vm.requirementDisabled = false;
        vm.quoteDisabled = false;
        vm.recallDisabled = false;
        vm.cashboxDisabled = false;
        vm.attachmentDisabled = false;
        vm.worklistDisabled = false;
        vm.printReportDisabled = false;
        vm.observationsDisabled = false;
      }
      cashboxDS.getCashbox(auth.authToken, vm.order).then(function (response) {
        vm.cashreceiptDisabled = response.data.payments.length !== 0;

        if (response.data.hasOwnProperty("header")) {
          vm.hasCashbox = true;
          var header = response.data.header;
          var subtotal = header.subTotal;
          var discount = 0;
          var discountPercentRate = 0;
          var taxValue = header.taxValue;

          if (header.discountValueRate !== undefined) {
            discountPercentRate = header.discountPercentRate;
          }

          var totaltest = subtotal - discountPercentRate;
          if (vm.subtracttax) {
            totaltest = $filter("currency")(
              totaltest - taxValue,
              vm.symbolCurrency,
              vm.penny ? 2 : 0
            );
            totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
          } else {
            totaltest = $filter("currency")(
              totaltest + taxValue,
              vm.symbolCurrency,
              vm.penny ? 2 : 0
            );
            totaltest = vm.normalizeNumberFormat(totaltest, vm.symbolCurrency);
          }

          var otherpayments = header.copay + header.fee;
          var balance = header.balance;
          var totalPaid = header.totalPaid;

          if (header.discountValue === 0 && header.discountPercent === 0) {
            discount = 0;
          } else if (header.discountValue !== 0) {
            discount = header.discountValue;
          } else if (header.discountPercent !== 0) {
            var discounttotal = $filter("currency")(
              (totaltest * header.discountPercent) / 100,
              vm.symbolCurrency,
              vm.pennyvalue
            );
            discount = vm.normalizeNumberFormat(
              discounttotal,
              vm.symbolCurrency
            );
          }

          vm.invoice = {
            subtotal: subtotal,
            taxValue: taxValue,
            total: totaltest,
            discountPercentRate: discountPercentRate,
            discountValue: discount,
            copay: header.copay,
            fee: header.fee,
            balance: balance,
            otherpayments: otherpayments,
            totalPaid: totalPaid,
          };
        }
        if (vm.cashreceiptDisabled) {
          var payments = 0;
          response.data.payments.forEach(function (pay) {
            pay.payment = $filter("currency")(
              pay.payment,
              vm.symbolCurrency,
              vm.penny ? 2 : 0
            );
            payments +=
              pay.payment !== null && pay.payment != undefined
                ? vm.normalizeNumberFormat(pay.payment, vm.symbolCurrency)
                : 0;
          });
          if (totalPaid - payments === 0) {
            vm.invoiceDisabled = true;
          }
          cashboxDS
            .getinvoiceparticular(auth.authToken, vm.order)
            .then(function (response) {
              vm.loading = false;
              if (response.status === 200) {
                vm.invoiceDisabledparticular = true;
                vm.blockbilling = true;
                vm.numberinvoice = response.data.invoiceNumber;
              }
            });
        }
      });
      vm.loadingdata = false;
    }
    function loadPatient(patient) {
      vm.loading = true;
      vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
      vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);

      var patientDemosValues = {};
      //Carga los datos del paciente
      patientDemosValues[vm.staticDemoIds["patientDB"]] = patient.id;
      if (vm.managedocumenttype) {
        patientDemosValues[vm.staticDemoIds["documentType"]] = {
          id: patient.documentType.id,
          code: patient.documentType.abbr.toUpperCase(),
          name: patient.documentType.name.toUpperCase(),
          showValue:
            patient.documentType.abbr.toUpperCase() +
            ". " +
            patient.documentType.name.toUpperCase(),
        };
      }
      patientDemosValues[vm.staticDemoIds["patientId"]] = patient.patientId;
      patientDemosValues[vm.staticDemoIds["lastName"]] = patient.lastName;
      patientDemosValues[vm.staticDemoIds["surName"]] = patient.surName;
      patientDemosValues[vm.staticDemoIds["name1"]] = patient.name1;
      patientDemosValues[vm.staticDemoIds["name2"]] = patient.name2;
      patientDemosValues[vm.staticDemoIds["birthday"]] = patient.birthday;
      patientDemosValues[vm.staticDemoIds["age"]] = patient.age;

      if (patient.id !== undefined) {
        patientDemosValues[vm.staticDemoIds["sex"]] = {
          id: patient.sex.id,
          code: patient.sex.code.toUpperCase(),
          name: patient.sex.esCo.toUpperCase(),
          showValue:
            patient.sex.code.toUpperCase() +
            ". " +
            patient.sex.esCo.toUpperCase(),
        };
        patientDemosValues[vm.staticDemoIds["birthday"]] = moment(
          patient.birthday
        ).format(vm.formatDate.toUpperCase());
        patientDemosValues[vm.staticDemoIds["age"]] = common.getAge(
          moment(patient.birthday).format(vm.formatDate.toUpperCase()),
          vm.formatDate.toUpperCase()
        );
        patientDemosValues[vm.staticDemoIds["email"]] = patient.email;
        if (vm.manageweight) {
          patientDemosValues[vm.staticDemoIds["weight"]] = patient.weight;
        }
        if (vm.managesize) {
          patientDemosValues[vm.staticDemoIds["size"]] = patient.size;
        }
        if (vm.managerace) {
          if (patient.race !== undefined && patient.race.id !== undefined) {
            patientDemosValues[vm.staticDemoIds["race"]] = {
              id: patient.race.id,
              name: patient.race.name.toUpperCase(),
              showValue: patient.race.name.toUpperCase(),
            };
          }
        }
      }
      vm.patientDemosValues = patientDemosValues;
      vm.orderDemosValues[-5] = vm.branch;
      if (vm.orderTypeInit.toString() !== "0") {
        vm.orderDemosValues[-4] = vm.orderTypeDefault;
      }
      vm.patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, false);
      // vm.patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, !vm.managehistoryauto);
      vm.patientDemosDisabled.photo = false;
      vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, false);

      disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds["orderDate"], true);
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["documentType"],
        true
      );
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["patientId"],
        true
      );

      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["lastName"],
        patient.id !== undefined ? true : false
      );
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["surName"],
        patient.id !== undefined ? true : false
      );
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["name1"],
        patient.id !== undefined ? true : false
      );
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["name2"],
        patient.id !== undefined ? true : false
      );
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["sex"],
        patient.id !== undefined ? true : false
      );
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["birthday"],
        patient.id !== undefined ? true : false
      );
      disabledDemo(
        vm.patientDemosDisabled,
        vm.staticDemoIds["age"],
        patient.id !== undefined ? true : false
      );
      if (vm.vieworderhis) {
        disabledDemo(vm.orderDemosDisabled, -109, true);
      }
      if (vm.isOrderAutomatic) {
        disabledDemo(vm.orderDemosDisabled, vm.staticDemoIds["order"], true);
        setTimeout(function () {
          document
            .getElementById("demo_" + vm.staticDemoIds["orderType"] + "_value")
            .focus();
        }, 100);
      } else {
        setTimeout(function () {
          document.getElementById("demo_" + vm.staticDemoIds["order"]).focus();
        }, 100);
      }

      //Logica de Botones
      vm.newDisabled = true;
      vm.editDisabled = true;
      vm.cancelDisabled = true;
      vm.saveDisabled = false;
      vm.undoDisabled = false;
      vm.dailyDisabled = true;
      vm.searchDisabled = true;
      vm.barcodesDisabled = true;
      vm.interviewDisabled = true;
      vm.ticketDisabled = true;
      vm.cashboxDisabled = true;
      vm.attachmentDisabled = true;
      vm.worklistDisabled = true;
      vm.printReportDisabled = true;
      vm.observationsDisabled = true;
      vm.patient = {};
      //Habilita el combo de examenes
      vm.disabledTests = false;
      vm.viewphoto = true;
      vm.loading = false;
      vm.comparepatient = _.clone(vm.patientDemosValues);
    }
    /**
     * Valida que el ingreso esta correcto para guardar la orden
     */
    function validateForm() {
      var fieldsComplete = true;
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
        demo.obligatory =
          demo.name === "historia" && vm.managehistoryauto
            ? 0
            : demo.obligatory;
        if (demo.obligatory === 1) {
          if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
            if (demo.encoded) {
              if (typeof vm.patientDemosValues[demo.id] !== "object") {
                demo.showRequired = true;
                fieldsComplete = false;
              } else {
                if (!vm.patientDemosValues[demo.id].hasOwnProperty("id")) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                } else if (vm.patientDemosValues[demo.id].id === undefined) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                }
              }
            } else {
              if (
                demo.date === true &&
                vm.patientDemosValues[demo.id] !== null &&
                demo.date === true &&
                vm.patientDemosValues[demo.id] !== "" &&
                demo.date === true &&
                vm.patientDemosValues[demo.id] !== "Invalid date"
              ) {
              } else if (
                (demo.date === true &&
                  vm.patientDemosValues[demo.id] === null) ||
                (demo.id === -110 && vm.patientDemosValues[demo.id] === null) ||
                (demo.date === true && vm.patientDemosValues[demo.id] === "") ||
                (demo.date === true &&
                  vm.patientDemosValues[demo.id] === "Invalid date")
              ) {
                demo.showRequired = true;
                fieldsComplete = false;
              } else if (
                vm.patientDemosValues[demo.id] === undefined ||
                vm.patientDemosValues[demo.id].trim() === ""
              ) {
                demo.showRequired = true;
                fieldsComplete = false;
              }
            }
          }
        } else if (
          demo.id === -111 &&
          vm.maskphone !== "" &&
          vm.patientDemosValues[demo.id] !== undefined
        ) {
          if (vm.patientDemosValues[demo.id].length < vm.maskphone.length) {
            demo.showInvalidmask = true;
          } else {
            demo.showInvalidmask = false;
          }
        }
      });

      vm.orderDemos.forEach(function (demo, index) {
        demo.showRequired = false;
        if (demo.obligatory === 1) {
          if (vm.orderDemosValues.hasOwnProperty(demo.id)) {
            if (demo.encoded) {
              if (typeof vm.orderDemosValues[demo.id] !== "object") {
                demo.showRequired = true;
                fieldsComplete = false;
              } else {
                if (!vm.orderDemosValues[demo.id].hasOwnProperty("id")) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                } else if (vm.orderDemosValues[demo.id].id === undefined) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                }
              }
            } else {
              if (demo.id === -107) {
                if (vm.orderDemosValues[-4].id === 4) {
                } else if (
                  vm.orderDemosValues[demo.id] === undefined ||
                  vm.orderDemosValues[demo.id].toString().trim() === ""
                ) {
                  demo.showRequired = true;
                  fieldsComplete = false;
                }
              } else if (
                demo.date === true &&
                vm.orderDemosValues[demo.id] !== null &&
                demo.date === true &&
                vm.orderDemosValues[demo.id] !== "" &&
                demo.date === true &&
                vm.orderDemosValues[demo.id] !== "Invalid date"
              ) {
              } else if (
                (demo.date === true && vm.orderDemosValues[demo.id] === null) ||
                (demo.date === true && vm.orderDemosValues[demo.id] === "") ||
                (demo.date === true &&
                  vm.orderDemosValues[demo.id] === "Invalid date")
              ) {
                demo.showRequired = true;
                fieldsComplete = false;
              } else if (
                vm.orderDemosValues[demo.id] === undefined ||
                vm.orderDemosValues[demo.id].toString().trim() === ""
              ) {
                demo.showRequired = true;
                fieldsComplete = false;
              }
            }
          }
        }
      });
      return fieldsComplete;
    }
    /**
     * Obtiene los datos del formulario asociados al paciente
     */
    function getPatientData() {
      var patient = {};
      var patientDemographics = [];

      vm.patientDemos.forEach(function (demo, index) {
        if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
          if (demo.encoded) {
            if (demo.id === vm.staticDemoIds["documentType"]) {
              patient.documentType = {
                id: vm.patientDemosValues[demo.id].id,
              };
            } else if (demo.id === vm.staticDemoIds["sex"]) {
              patient.sex = {
                id: vm.patientDemosValues[demo.id].id,
                name: vm.patientDemosValues[demo.id].name,
              };
            } else if (demo.id === vm.staticDemoIds["race"]) {
              if (
                typeof vm.patientDemosValues[demo.id] === "object" &&
                vm.patientDemosValues[demo.id].hasOwnProperty("id")
              ) {
                patient.race = {
                  id: vm.patientDemosValues[demo.id].id,
                };
              } else {
                patient.race = null;
              }
            } else {
              if (
                typeof vm.patientDemosValues[demo.id] === "object" &&
                vm.patientDemosValues[demo.id].hasOwnProperty("id")
              ) {
                patientDemographics.push({
                  idDemographic: demo.id,
                  encoded: true,
                  notCodifiedValue: "",
                  codifiedId: vm.patientDemosValues[demo.id].id,
                });
              }
            }
          } else {
            if (demo.id !== vm.staticDemoIds["age"]) {
              if (demo.id === vm.staticDemoIds["patientDB"]) {
                patient.id = vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds["patientId"]) {
                patient.patientId =
                  vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds["lastName"]) {
                patient.lastName = vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds["surName"]) {
                patient.surName =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id].toUpperCase()
                    : null;
              } else if (demo.id === vm.staticDemoIds["name1"]) {
                patient.name1 = vm.patientDemosValues[demo.id].toUpperCase();
              } else if (demo.id === vm.staticDemoIds["name2"]) {
                patient.name2 =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id].toUpperCase()
                    : null;
              } else if (demo.id === vm.staticDemoIds["birthday"]) {
                var birthday = moment(
                  vm.patientDemosValues[demo.id],
                  vm.formatDate.toUpperCase()
                ).valueOf();
                if (isNaN(birthday)) {
                  var datebirthday = moment(
                    vm.patientDemosValues[demo.id]
                  ).format(vm.formatDate.toUpperCase());
                  var birthday = moment(
                    datebirthday,
                    vm.formatDate.toUpperCase()
                  ).valueOf();
                }
                patient.birthday = birthday;
              } else if (demo.id === vm.staticDemoIds["email"]) {
                patient.email =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id]
                    : null;
              } else if (demo.id === vm.staticDemoIds["weight"]) {
                patient.weight =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id]
                    : null;
              } else if (demo.id === vm.staticDemoIds["size"]) {
                patient.size =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id]
                    : null;
              } else if (demo.id === vm.staticDemoIds["patientComment"]) {
                patient.diagnostic =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id]
                    : null;
              } else if (demo.id === vm.staticDemoIds["phone"]) {
                patient.phone =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id]
                    : null;
              } else if (demo.id === vm.staticDemoIds["address"]) {
                patient.address =
                  vm.patientDemosValues[demo.id] !== undefined
                    ? vm.patientDemosValues[demo.id]
                    : null;
              } else {
                if (demo.date === true) {
                  if (vm.patientDemosValues[demo.id] !== "") {
                    var format =
                      demo.format === ""
                        ? vm.formatDate.toUpperCase()
                        : demo.format.toUpperCase();
                    var demodate = moment(
                      vm.patientDemosValues[demo.id],
                      format
                    ).valueOf();
                    if (isNaN(demodate)) {
                      vm.patientDemosValues[demo.id] = moment(
                        vm.patientDemosValues[demo.id]
                      ).format(format);
                    } else {
                      vm.patientDemosValues[demo.id] =
                        moment(demodate).format(format);
                    }
                  }
                }
                if (
                  vm.patientDemosValues[demo.id] !== undefined &&
                  vm.patientDemosValues[demo.id] !== "Invalid date" &&
                  vm.patientDemosValues[demo.id] !== null &&
                  vm.patientDemosValues[demo.id] !== ""
                ) {
                  patientDemographics.push({
                    idDemographic: demo.id,
                    encoded: false,
                    notCodifiedValue: vm.patientDemosValues[demo.id],
                    codifiedId: "",
                  });
                } else {
                  if (demo.id === vm.staticDemoIds["surName"]) {
                    patient.surName = "";
                  } else if (demo.id === vm.staticDemoIds["name1"]) {
                    patient.name1 = "";
                  } else if (demo.id === vm.staticDemoIds["email"]) {
                    patient.email = "";
                  } else if (demo.id > 0) {
                    patientDemographics.push({
                      idDemographic: demo.id,
                      encoded: false,
                      notCodifiedValue: "",
                      codifiedId: "",
                    });
                  }
                }
              }
            }
          }
        } else {
          if (demo.id === -997) {
            patient.diagnostic =
              vm.patientDemosValues[demo.id] !== undefined &&
              vm.patientDemosValues[demo.id] !== ""
                ? vm.patientDemosValues[demo.id]
                : [];
          } else if (demo.id === vm.staticDemoIds["surName"]) {
            patient.surName = "";
          } else if (demo.id === vm.staticDemoIds["name1"]) {
            patient.name1 = "";
          } else if (demo.id === vm.staticDemoIds["email"]) {
            patient.email = "";
          } else if (demo.id === vm.staticDemoIds["phone"]) {
            patient.phone = "";
          } else if (demo.id === vm.staticDemoIds["address"]) {
            patient.address = "";
          } else if (demo.id > 0) {
            patientDemographics.push({
              idDemographic: demo.id,
              encoded: demo.encoded,
              notCodifiedValue: "",
              codifiedId: "",
            });
          }
        }
      });

      if (patient.documentType === undefined) {
        patient.documentType = {
          id: 1,
        };
      }
      if (!vm.twoNames) {
        patient.name2 = "";
      }
      if (!vm.twosurnames) {
        patient.surName = "";
      }
      patient.demographics = patientDemographics;
      patient.id =
        patient.id === undefined
          ? vm.patientDemosValues[vm.staticDemoIds["patientDB"]] === undefined
            ? ""
            : vm.patientDemosValues[vm.staticDemoIds["patientDB"]]
          : patient.id;
      return patient;
    }
    /**
     * Obtiene los datos de la orden del formulario
     */
    function getOrderData() {
      var order = {};
      var orderDemographics = [];
      order.createdDateShort = Number(moment().format("YYYYMMDD"));
      order.fatherOrder = vm.fatherOrderRecall;
      vm.orderDemos.forEach(function (demo, index) {
        if (vm.orderDemosValues.hasOwnProperty(demo.id)) {
          if (demo.encoded) {
            if (demo.id === vm.staticDemoIds["orderType"]) {
              order.type = {
                id: vm.orderDemosValues[demo.id].id,
                code: vm.orderDemosValues[demo.id].code,
                name: vm.orderDemosValues[demo.id].name,
              };
            } else if (demo.id === vm.staticDemoIds["branch"]) {
              order.branch = {
                id: vm.orderDemosValues[demo.id].id,
                name: vm.orderDemosValues[demo.id].name,
              };
            } else if (demo.id === vm.staticDemoIds["account"]) {
              order.account = {
                id: vm.orderDemosValues[demo.id].id,
              };
            } else if (demo.id === vm.staticDemoIds["physician"]) {
              order.physician = {
                id: vm.orderDemosValues[demo.id].id,
                name: vm.orderDemosValues[demo.id].name,
              };
            } else if (demo.id === vm.staticDemoIds["rate"]) {
              order.rate = {
                id: vm.orderDemosValues[demo.id].id,
                name: vm.orderDemosValues[demo.id].name,
              };
            } else if (demo.id === vm.staticDemoIds["service"]) {
              order.service = {
                id: vm.orderDemosValues[demo.id].id,
              };
            } else {
              if (
                typeof vm.orderDemosValues[demo.id] === "object" &&
                vm.orderDemosValues[demo.id].hasOwnProperty("id")
              ) {
                orderDemographics.push({
                  idDemographic: demo.id,
                  encoded: true,
                  notCodifiedValue: "",
                  codifiedId: vm.orderDemosValues[demo.id].id,
                });
              }
            }
          } else {
            if (demo.date === true) {
              if (vm.orderDemosValues[demo.id] !== "") {
                var format =
                  demo.format === ""
                    ? vm.formatDate.toUpperCase()
                    : demo.format.toUpperCase();
                var demodate = moment(
                  vm.orderDemosValues[demo.id],
                  format
                ).valueOf();
                if (isNaN(demodate)) {
                  vm.orderDemosValues[demo.id] = moment(
                    vm.orderDemosValues[demo.id]
                  ).format(format);
                } else {
                  vm.orderDemosValues[demo.id] =
                    moment(demodate).format(format);
                }
              }
            }
            if (demo.id === vm.staticDemoIds["order"]) {
              order.orderNumber =
                vm.orderDemosValues[demo.id] !== undefined &&
                vm.orderDemosValues[demo.id] !== ""
                  ? vm.orderDemosValues[demo.id]
                  : null;
            } else if (demo.id === vm.staticDemoIds["orderDate"]) {
              order.date = vm.orderDemosValues[demo.id];
            } else {
              if (
                vm.orderDemosValues[demo.id] !== undefined &&
                vm.orderDemosValues[demo.id] !== "Invalid date" &&
                vm.orderDemosValues[demo.id] !== null &&
                vm.orderDemosValues[demo.id] !== ""
              ) {
                orderDemographics.push({
                  idDemographic: demo.id,
                  encoded: false,
                  notCodifiedValue: vm.orderDemosValues[demo.id],
                  codifiedId: "",
                });
              } else {
                orderDemographics.push({
                  idDemographic: demo.id,
                  encoded: false,
                  notCodifiedValue: "",
                  codifiedId: "",
                });
              }
            }
          }
        } else {
          if (demo.id !== -996) {
            orderDemographics.push({
              idDemographic: demo.id,
              encoded: demo.encoded,
              notCodifiedValue: "",
              codifiedId: "",
            });
          } else {
            order.comment =
              vm.orderDemosValues[demo.id] !== undefined &&
              vm.orderDemosValues[demo.id] !== ""
                ? vm.orderDemosValues[demo.id]
                : null;
          }
        }
      });

      order.demographics = orderDemographics;

      //Médicos Auxiliares
      if (vm.isAuxPhysicians) {
        var indexes = [-201, -202, -203, -204, -205];
        var listPhysicians = _.chain(orderDemographics)
          .keyBy("idDemographic")
          .at(indexes)
          .value();
        order.auxiliaryPhysicians = [];
        listPhysicians.forEach(function (value) {
          if (
            value !== undefined &&
            value.codifiedId !== null &&
            value.codifiedId !== undefined &&
            value.codifiedId !== ""
          ) {
            order.auxiliaryPhysicians.push({
              id: value.codifiedId,
            });
          }
        });
        indexes.forEach(function (value) {
          var indexDemo = _.findIndex(order.demographics, function (o) {
            return o.idDemographic === value;
          });
          if (indexDemo > -1) order.demographics.splice(indexDemo, 1);
        });
      }
      order.orderNumber =
        order.orderNumber === null
          ? null
          : moment().format("YYYY") + order.orderNumber;
      return order;
    }
    /**
     * Se ejecuta despues de guardada o modificada la orden
     * @param {*} response Objeto de respuesta enviado desde el servidor
     */
    function afterSaveOrder(response, insert) {
      vm.searchByDate();
      vm.patientcoment = response.patient.id;
      vm.ordercomment = response.orderNumber;
      //Setea el numero de orden generado en los valores de ids ocultos
      // vm.orderDemosValues[vm.staticDemoIds['orderDB']] = response.orderNumber;
      //vm.patientDemosValues[vm.staticDemoIds['patientDB']] = response.patient.id;
      //Coloca el numero de orden en el campo de orden
      vm.orderDemosValues[vm.staticDemoIds["order"]] =
        "" + Number(("" + response.orderNumber).substring(4));
      if (vm.vieworderhis) {
        vm.orderDemosValues[-109] = response.externalId;
      }
      //Coloca la fecha de creacion en el campo fecha de creacion
      vm.orderDemosValues[vm.staticDemoIds["orderDate"]] = moment(
        response.createdDate
      ).format("" + vm.formatDate.toUpperCase() + " " + "HH:mm:ss");
      //Deshabilita los controles de ingreso de datos
      vm.patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, true);
      vm.patientDemosDisabled.photo = false;
      vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, true);
      vm.disabledTests = true;
      //Logica de Botones
      vm.newDisabled = false;
      vm.editDisabled = false;
      vm.cancelDisabled = false;
      vm.saveDisabled = true;
      vm.undoDisabled = true;
      vm.dailyDisabled = false;
      vm.searchDisabled = false;
      vm.barcodesDisabled = false;
      vm.interviewDisabled = false;
      vm.ticketDisabled = false;
      vm.requirementDisabled = false;
      vm.quoteDisabled = false;
      vm.recallDisabled = false;
      vm.cashboxDisabled = false;
      vm.attachmentDisabled = false;
      vm.worklistDisabled = false;
      vm.printReportDisabled = false;
      vm.observationsDisabled = false;
      vm.quickSave = false;

      vm.order = response.orderNumber;
      vm.patient = {
        id: response.patient.id,
        document: response.patient.patientId,
        name:
          response.patient.name1 +
          " " +
          response.patient.name2 +
          " " +
          response.patient.lastName,
        birthday: response.patient.birthday,
        age: common.getAgeAsString(
          moment(response.patient.birthday).format(vm.formatDateAge),
          vm.formatDateAge,
          response.createdDate
        ),
        gender:
          $filter("translate")("0000") === "enUsa"
            ? response.patient.sex.enUsa
            : response.patient.sex.esCo,
        typeordercolor: response.type.color,
        typeordercode: response.type.code,
        passwordWebQuery: response.patient.passwordWebQuery,
      };
      vm.commentOrder = "";

      $rootScope.cantretakeview = true;
      if (vm.isOrderAutomatic && insert) {
        $rootScope.orderturn = response.orderNumber;
      }
      vm.savephotopatient(response.patient.id);

      vm.loadOrder(response.orderNumber);
      if (vm.manageDiagnostics && insert === undefined) {
        vm.insertdiagnosticorder(response.orderNumber);
      }
      vm.save = false;
      vm.loading = false;
      vm.refreshdashboard = true;
      vm.patientDemosValues[-99] = response.patient.id;
      vm.statediagnostic = 4;
      vm.statecomment = 4;
      if (insert) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] = response.orderNumber;

        return resultsentryDS
          .getresults(auth.authToken, response.orderNumber)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.listestresult = _.filter(data.data, function (e) {
                  return e.resultRequest === true;
                });
                vm.orderresult = response;
                vm.validateresult = vm.listestresult.length > 0;
                if (vm.printStrickerAuto) vm.eventBarcodes();
                if (vm.isOrderAutomatic) {
                  $rootScope.orderturn = response.orderNumber;
                }
              } else {
                logger.success($filter("translate")("0149"));
                if (vm.printStrickerAuto) vm.eventBarcodes();
              }
            },
            function (error) {
              vm.loading = false;
              vm.modalError(error);
            }
          );
      } else {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return resultsentryDS
          .getresults(auth.authToken, response.orderNumber)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.listestresult = _.filter(data.data, function (e) {
                  return e.resultRequest === true;
                });
                vm.orderresult = response;
                vm.validateresult = vm.listestresult.length > 0;
              }
              if (vm.validateresult === false) {
                logger.success($filter("translate")("0149"));
              }
            },
            function (error) {
              vm.loading = false;
              vm.modalError(error);
            }
          );
      }
    }
    function insertdiagnosticorder(order) {
      var data = {
        orderNumber: order,
        listDiagnostic: vm.listdiagnosticstest,
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return orderDS.insertdiagnosticorder(auth.authToken, data).then(
        function (data) {
          if (data.status === 200) {
            vm.loading = false;
          }
        },
        function (error) {
          vm.modalError(error);
        }
      );
    }
    function eventCashReceipt() {
      auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] !== undefined &&
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] !== null
      ) {
        cashboxDS
          .getCashbox(
            auth.authToken,
            vm.orderDemosValues[vm.staticDemoIds["orderDB"]]
          )
          .then(
            function (response) {
              if (response.data.payments.length !== 0) {
                //Carga los registros de caja
                vm.pennyVal = vm.penny ? 2 : 0;
                vm.totalToPaid = 0;
                vm.totalWithDiscount = 0;
                vm.balance = 0;
                vm.discount = 0;
                vm.allpayments = 0;
                vm.discountType = "0";
                vm.discount = $filter("currency")(
                  0,
                  vm.symbolCurrency,
                  vm.pennyVal
                );
                vm.pricetotal = 0;
                vm.testCashReceipt.forEach(function (value) {
                  value.taxs =
                    value.billing.tax === undefined
                      ? vm.taxConfig
                      : value.billing.tax;
                  value.taxsStr = $filter("number")(value.taxs, 2) + " %";
                  value.priceWithTax = value.patientPrice - value.Valuediscount;
                  var taxValueCalculate = $filter("currency")(
                    (value.priceWithTax * value.taxs) / 100,
                    vm.symbolCurrency,
                    vm.pennyvalue
                  );
                  value.taxValueCalculate = vm.normalizeNumberFormat(
                    taxValueCalculate,
                    vm.symbolCurrency
                  );
                  if (vm.subtracttax) {
                    var totaltest = $filter("currency")(
                      value.priceWithTax - value.taxValueCalculate,
                      vm.symbolCurrency,
                      vm.pennyVal
                    );
                    totaltest = vm.normalizeNumberFormat(
                      totaltest,
                      vm.symbolCurrency
                    );
                  } else {
                    var totaltest = $filter("currency")(
                      value.priceWithTax + value.taxValueCalculate,
                      vm.symbolCurrency,
                      vm.pennyVal
                    );
                    totaltest = vm.normalizeNumberFormat(
                      totaltest,
                      vm.symbolCurrency
                    );
                  }
                  vm.pricetotal = vm.pricetotal + value.patientPrice;
                  value.totaltest = totaltest;
                  value.totaltestsrt = $filter("currency")(
                    totaltest,
                    vm.symbolCurrency,
                    vm.pennyVal
                  );
                  value.price = value.patientPrice;
                  value.taxValueCalculateStr = $filter("currency")(
                    value.taxValueCalculate,
                    vm.symbolCurrency,
                    vm.pennyVal
                  );
                  value.priceStr = $filter("currency")(
                    value.patientPrice,
                    vm.symbolCurrency,
                    vm.pennyVal
                  );
                  value.Valuediscount = value.Valuediscount;
                  value.Valuediscountsrt = $filter("currency")(
                    value.Valuediscount,
                    vm.symbolCurrency,
                    vm.pennyVal
                  );
                  value.priceWithTaxStr = $filter("currency")(
                    value.priceWithTax,
                    vm.symbolCurrency,
                    vm.pennyVal
                  );
                  value.idRate = value.rate.id;
                  value.nameRate = value.rate.name;
                });

                //Carga los pagos
                response.data.payments.forEach(function (value, key) {
                  value.bank =
                    !value.paymentType.bank || value.bank === undefined
                      ? "--"
                      : value.bank.name;
                  value.card =
                    !value.paymentType.card || value.card === undefined
                      ? "--"
                      : value.card.name;
                  value.number =
                    !value.paymentType.number || value.number === undefined
                      ? "--"
                      : value.number;
                  value.paymentType = value.paymentType.name;
                  value.paymentStr = $filter("currency")(
                    value.payment,
                    vm.symbolCurrency,
                    vm.pennyVal
                  );
                  value.index = key;
                });
                vm.payments = $filter("filter")(
                  response.data.payments,
                  {
                    active: true,
                  },
                  true
                );

                //Carga los totales de caja.
                var header = response.data.header;
                if (header !== undefined && header !== null) {
                  vm.copay = header.copay;
                  vm.fee = header.fee;
                  vm.totalToPaid = header.subTotal + header.taxValue;
                  vm.allpayments = header.totalPaid;
                  vm.balance = header.balance;
                  vm.charge =
                    header.charge === null || header.charge === undefined
                      ? 0
                      : header.charge;

                  if (
                    header.discountPercent !== 0 ||
                    header.discountPercent !== undefined
                  ) {
                    //Si el descuento es por porcentaje
                    vm.discount =
                      header.discountPercent === undefined
                        ? 0
                        : header.discountPercent;
                    var discounttotal = $filter("currency")(
                      (vm.totalToPaid * vm.discount) / 100,
                      vm.symbolCurrency,
                      vm.pennyvalue
                    );
                    discounttotal = vm.normalizeNumberFormat(
                      discounttotal,
                      vm.symbolCurrency
                    );
                    vm.totalWithDiscount = vm.totalToPaid - discounttotal;
                    vm.discountType = "1";
                    vm.symbol = "(%)";
                    vm.discount =
                      $filter("number")(vm.discount, vm.pennyVal) + " %";
                  } else {
                    //Si el descuento es por valor
                    vm.discount = header.discountValue;
                    vm.totalWithDiscount = vm.totalToPaid - vm.discount;
                    vm.discountType = "0";
                    vm.symbol = "(" + vm.symbolCurrency + ")";
                    vm.discount = $filter("currency")(
                      vm.discount,
                      vm.symbolCurrency,
                      vm.pennyVal
                    );
                  }

                  vm.totals = {
                    copay: $filter("currency")(
                      vm.copay,
                      vm.symbolCurrency,
                      vm.pennyVal
                    ),
                    fee: $filter("currency")(
                      vm.fee,
                      vm.symbolCurrency,
                      vm.pennyVal
                    ),
                    totalToPaid: $filter("currency")(
                      vm.totalToPaid,
                      vm.symbolCurrency,
                      vm.pennyVal
                    ),
                    allpayments: $filter("currency")(
                      vm.allpayments,
                      vm.symbolCurrency,
                      vm.pennyVal
                    ),
                    balance: $filter("currency")(
                      vm.balance,
                      vm.symbolCurrency,
                      vm.pennyVal
                    ),
                    discount: vm.discount,
                    totalWithDiscount: $filter("currency")(
                      vm.totalWithDiscount,
                      vm.symbolCurrency,
                      vm.pennyVal
                    ),
                    symbol: vm.symbol,
                    charge: $filter("currency")(
                      vm.charge,
                      vm.symbolCurrency,
                      vm.pennyVal
                    ),
                  };
                  vm.generalDataReport = {
                    testPrice: vm.testCashReceipt,
                    payments: vm.payments,
                    totals: vm.totals,
                  };
                  if (vm.penny) {
                    vm.pathreport =
                      "/Report/pre-analitic/cashreceipt/cashreceiptpenny.mrt";
                  } else {
                    vm.pathreport =
                      "/Report/pre-analitic/cashreceipt/cashreceipt.mrt";
                  }
                  vm.datareport = vm.generalDataReport;
                  vm.variables = vm.variablesReport();
                  vm.windowOpenReport();
                }
              }
            },
            function (error) {
              vm.modalError(error);
              vm.loading = false;
              logger.error(error);
            }
          );
      }
    }
    function windowOpenReport() {
      if (vm.datareport.testPrice === undefined) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify(
          $translate.getTranslationTable()
        );
        var datareport = LZString.compressToUTF16(
          JSON.stringify(vm.datareport)
        );
        localStorageService.set("parameterReport", parameterReport);
        localStorageService.set("dataReport", datareport);
        window.open("/viewreport/viewreport.html");
        vm.loading = false;
        return;
      }
      if (vm.datareport.testPrice.length > 0) {
        var parameterReport = {};
        parameterReport.variables = vm.variables;
        parameterReport.pathreport = vm.pathreport;
        parameterReport.labelsreport = JSON.stringify(
          $translate.getTranslationTable()
        );
        var datareport = LZString.compressToUTF16(
          JSON.stringify(vm.datareport)
        );
        localStorageService.set("parameterReport", parameterReport);
        localStorageService.set("dataReport", datareport);
        window.open("/viewreport/viewreport.html");
        vm.loading = false;
      } else {
        UIkit.modal("#modalReportError").show();
        vm.loading = false;
      }
    }
    function variablesReport() {
      var customer = vm.abbrCustomer + " (" + vm.nameCustomer;
      var balanceLiteral = convertnumberliteral.getconvertWords(vm.balance);
      var totalToPaid = vm.normalizeNumberFormat(
        vm.totals.totalToPaid,
        vm.symbolCurrency
      );
      var totalLiteral = convertnumberliteral.getconvertWords(totalToPaid);

      var variables = {
        order: vm.orderDemosValues[-998],
        customer: customer,
        username: auth.userName,
        now: moment().format(vm.formatDate.toUpperCase() + " HH:mm:ss"),
        patientId: vm.patientDemosValues[-100],
        lastName: vm.patientDemosValues[-101],
        surName: vm.patientDemosValues[-102],
        name1: vm.patientDemosValues[-103],
        name2: vm.patientDemosValues[-109],
        age: common.getAgeTime(
          vm.patientDemosValues[-105],
          vm.formatDate.toUpperCase()
        ),
        sex: vm.patientDemosValues[-104].name,
        phone:
          vm.patientDemosValues[-111] == undefined
            ? "---"
            : vm.patientDemosValues[-111],
        address:
          vm.patientDemosValues[-112] == undefined
            ? "---"
            : vm.patientDemosValues[-112],
        branch: vm.branch.name,
        service:
          vm.orderDemosValues[-6] === undefined
            ? "---"
            : vm.orderDemosValues[-6].name,
        symbolCurrency: vm.symbolCurrency,
        balanceLiteral: balanceLiteral.toUpperCase(),
        totalLiteral: totalLiteral.toUpperCase(),
      };

      return variables;
    }
    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.vieworderhis = localStorageService.get("verOrdenHis") === "True";
        vm.subtracttax = localStorageService.get("RestarImpuesto") === "True";
        vm.numberqutomatic =
          localStorageService.get("facturacionAutomatica") === "True";
        vm.motiveeditorder =
          localStorageService.get("MotivoModificacionOrden") === "True" ||
          localStorageService.get("MotivoModificacionOrden") === null;
        vm.formatDate = localStorageService.get("FormatoFecha");
        vm.UrlNodeJs = localStorageService.get("UrlNodeJs");
        vm.isOrderAutomatic =
          localStorageService.get("NumeroOrdenAutomatico") === "True";
        vm.typeSave = vm.isOrderAutomatic ? 2 : 1;
        vm.digitsorder = localStorageService.get("DigitosOrden");
        vm.maxLenght = localStorageService.get("DigitosOrden") + 8;
        vm.symbolCurrency = localStorageService.get("SimboloMonetario");
        vm.penny = localStorageService.get("ManejoCentavos") === "True";
        vm.pennyvalue = vm.isPenny ? 2 : 0;
        vm.pennycontroller = vm.penny ? 1 : 0;
        vm.manageweight = localStorageService.get("ManejoPeso");
        vm.managesize = localStorageService.get("ManejoTalla");
        vm.managerace = localStorageService.get("ManejoRaza") === "True";
        vm.managedocumenttype =
          localStorageService.get("ManejoTipoDocumento") === "True";
        vm.managehistoryauto =
          localStorageService.get("HistoriaAutomatica").toLowerCase() ===
          "true";
        vm.manageBranch = localStorageService.get("TrabajoPorSede") === "True";
        vm.manageService = localStorageService.get("ManejoServicio") === "True";
        vm.manageAccount = localStorageService.get("ManejoCliente") === "True";
        vm.customerdefault = localStorageService.get("clientePorDefecto");
        vm.manageRate = localStorageService.get("ManejoTarifa") === "True";
        vm.manageCashbox = localStorageService.get("Caja") === "True";
        vm.managePhysician = localStorageService.get("ManejoMedico") === "True";
        vm.manageDiagnostics =
          localStorageService.get("Diagnostics") === "True";
        vm.abbrCustomer = localStorageService.get("Abreviatura");
        vm.nameCustomer = localStorageService.get("Entidad");
        vm.taxConfig = Number(localStorageService.get("Impuesto"));
        vm.maxDaysEditOrder = Number(
          localStorageService.get("DiasMaximoModificarOrden")
        );
        vm.orderTypeInit = localStorageService.get("ValorInicialTipoOrden");
        vm.maskphone =
          localStorageService.get("FormatoTelefono") === null
            ? ""
            : localStorageService.get("FormatoTelefono");
        vm.digityear = localStorageService.get("DigitoAño");
        vm.printStrickerAuto =
          localStorageService.get("ImprimirEtiquetaAutomaticamente") === "True";
        vm.printAddSticker =
          localStorageService.get("ImprimirEtiquetaAdicional") === "True";
        vm.worksheet =
          localStorageService.get("HojaTrabajoIngresoOrden") === "True";
        vm.priceTicket =
          localStorageService.get("PreciosServicioTalon") === "True";
        vm.manageFac = parseInt(localStorageService.get("Facturacion")) > 0;
        vm.permissionuser = localStorageService.get("user");
        vm.dataviewsiga = localStorageService.get("dataviewsiga");
        vm.serviceEntrySiga =
          localStorageService.get("stateTurnSiga") === null
            ? ""
            : parseInt(localStorageService.get("stateTurnSiga"));
        vm.turnfilter =
          localStorageService.get("OrdenesSIGA") === "" ? false : true;
        vm.activesigaorder = parseInt(localStorageService.get("moduleSiga"));
        vm.dataturn =
          localStorageService.get("turn") === null
            ? null
            : parseInt(localStorageService.get("turn"));
        vm.integrationMINSA =
          localStorageService.get("IntegracionMINSA") === "True";
        vm.IntegracionTribunal =
          localStorageService.get("IntegracionTribunal") === "True";

        vm.updatetestentry =
          localStorageService.get("PermisosEdicionUsuarioIngreso") === "True";
        vm.editypeorder = localStorageService.get("EditarTipoOrden") === "True";
        vm.printReport =
          localStorageService.get("ImprimirIngresoOrdenes") === "True";
        vm.cancelValidatedOrders =
          localStorageService.get("AnularOrdenValidada") === "True";
        vm.editNumberStickers =
          localStorageService.get("EditarCantidadEtiquetas") === "True";

        vm.isAuxPhysicians =
          localStorageService.get("MedicosAuxiliares") === "True";
        vm.totalAuxPhysicians =
          localStorageService.get("TotalMedicosAuxiliares") === null ||
          localStorageService.get("TotalMedicosAuxiliares") === ""
            ? 0
            : parseInt(localStorageService.get("TotalMedicosAuxiliares"));
        vm.idcardreader = localStorageService.get("LectorCedulas") === "True";
        vm.demoidcardreader = localStorageService.get(
          "Lectordecedulademografico"
        );
        vm.twoNames = localStorageService.get("DosNombresPaciente") === "True";
        vm.twosurnames =
          localStorageService.get("DosApellidosPaciente") === "True";
        vm.idscannerseparator =
          localStorageService.get("SeparadorScannerCedula") === null
            ? ","
            : localStorageService.get("SeparadorScannerCedula");
        vm.birthdateformat =
          localStorageService.get("FormatoFechaNacimiento") === null
            ? "YYYYMMDD"
            : localStorageService.get("FormatoFechaNacimiento");

        vm.demoHistory =
          localStorageService.get("HistoricoDemograficos") === "True";
        vm.RequiredAddress =
          localStorageService.get("Direccionobligatoria") === "True";

        if (vm.idcardreader) {
          vm.oneposition =
            localStorageService.get("LectorCedulaPrimeraPosicion") === ""
              ? "3"
              : localStorageService.get("LectorCedulaPrimeraPosicion");
          vm.twoposition =
            localStorageService.get("LectorCedulaSegundaPosicion") === ""
              ? "4"
              : localStorageService.get("LectorCedulaSegundaPosicion");
          vm.threeposition =
            localStorageService.get("LectorCedulaTerceraPosicion") === ""
              ? "1"
              : localStorageService.get("LectorCedulaTerceraPosicion");
          vm.fourposition =
            localStorageService.get("LectorCedulaCuartaPosicion") === ""
              ? "2"
              : localStorageService.get("LectorCedulaCuartaPosicion");

          if (vm.oneposition === "1") {
            vm.positioname1 = 1;
          }
          if (vm.oneposition === "2") {
            vm.positioname2 = 1;
          }
          if (vm.oneposition === "3") {
            vm.positionsurName = 1;
          }
          if (vm.oneposition === "4") {
            vm.positionlastName = 1;
          }

          if (vm.twoposition === "1") {
            vm.positioname1 = 2;
          }
          if (vm.twoposition === "2") {
            vm.positioname2 = 2;
          }
          if (vm.twoposition === "3") {
            vm.positionsurName = 2;
          }
          if (vm.twoposition === "4") {
            vm.positionlastName = 2;
          }

          if (vm.threeposition === "1") {
            vm.positioname1 = 3;
          }
          if (vm.threeposition === "2") {
            vm.positioname2 = 3;
          }
          if (vm.threeposition === "3") {
            vm.positionsurName = 3;
          }
          if (vm.threeposition === "4") {
            vm.positionlastName = 3;
          }

          if (vm.fourposition === "1") {
            vm.positioname1 = 4;
          }
          if (vm.fourposition === "2") {
            vm.positioname2 = 4;
          }
          if (vm.fourposition === "3") {
            vm.positionsurName = 4;
          }
          if (vm.fourposition === "4") {
            vm.positionlastName = 4;
          }
        }

        vm.init();
      }
    }
    function init() {
      vm.saveedit = false;
      if (localStorageService.get("turn") !== undefined) {
        $rootScope.dataturn = localStorageService.get("turn");
      }
      if ($rootScope.orderecall === true) {
        vm.showModalSearchRecall = true;
        $rootScope.orderecall = false;
      }
      vm.searchByDate();
      vm.loadDemographicControls();

      if (localStorageService.get("ExamenesPorDemografico") === "True") {
        vm.getdemographictest();
      }
    }
    function searchByDate() {
      var date = moment(vm.dateToSearch).format("YYYYMMDD");
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      //Invoca el metodo del servicio
      orderDS.getsearchByDate(auth.authToken, date, auth.branch).then(
        function (data) {
          if (data.status === 200) {
            vm.ordersday = data.data.orders.sort();
          } else {
            vm.ordersday = [];
          }
        },
        function (error) {
          vm.Error = error;
          vm.ShowPopupError = true;
        }
      );
    }
    function numLiteral(num) {
      //var balance = $filter('number')(num, 2);
      var numberLiteral = convertnumberliteral.getconvertWords(num);
      alert(numberLiteral.toUpperCase());
    }
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
