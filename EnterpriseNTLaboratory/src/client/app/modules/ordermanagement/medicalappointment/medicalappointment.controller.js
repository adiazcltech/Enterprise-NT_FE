/* jshint ignore:start */
(function () {
  "use strict";
  angular
    .module("app.medicalappointment")
    .controller("medicalappointmentController", medicalappointmentController);

  medicalappointmentController.$inject = [
    "localStorageService",
    "barcodeDS",
    "logger",
    "orderDS",
    "patientDS",
    "orderentryDS",
    "cashboxDS",
    "convertnumberliteral",
    "motiveDS",
    "userDS",
    "serviceDS",
    "TribunalDS",
    "reportsDS",
    "reportadicional",
    "$filter",
    "$state",
    "LZString",
    "moment",
    "$rootScope",
    "common",
    "$translate",
    "$hotkey",
    "$scope",
    "appointmentDS",
    "demographicDS",
    "sigaDS",
  ];

  function medicalappointmentController(
    localStorageService,
    barcodeDS,
    logger,
    orderDS,
    patientDS,
    orderentryDS,
    cashboxDS,
    convertnumberliteral,
    motiveDS,
    userDS,
    serviceDS,
    TribunalDS,
    reportsDS,
    reportadicional,
    $filter,
    $state,
    LZString,
    moment,
    $rootScope,
    common,
    $translate,
    $hotkey,
    $scope,
    appointmentDS,
    demographicDS,
    sigaDS
  ) {
    var vm = this;
    vm.loadingdata = true;
    var auth = localStorageService.get("Enterprise_NT.authorizationData");
    $rootScope.pageview = 3;
    vm.administrator = auth.administrator;
    $rootScope.helpReference = "01. LaboratoryOrders/appoinment.htm";
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
      physician1: -201,
      physician2: -202,
      physician3: -203,
      physician4: -204,
      physician5: -205,
    };
    vm.listestresult = [];
    vm.packageTracking = [];
    vm.saveedit = false;
    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = "MedicalAppointment";
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0012");
    vm.stateControl = 8;

    //turno
    vm.disabledendturn = disabledendturn;
    vm.endturn = endturn;
    vm.eventTransferTurn = eventTransferTurn;

    vm.searchByDate = searchByDate;
    vm.ordercomment = "";
    vm.patientcoment = "";
    vm.permissioncancel = false;
    vm.statecomment = 1;
    vm.statediagnostic = 1;
    vm.getBarcode = getBarcode;
    vm.printlabels = printlabels;
    vm.directImpression = directImpression;
    vm.sendEmailPatient = sendEmailPatient;

    vm.normalizeNumberFormat = normalizeNumberFormat;
    vm.motiveeditsave = motiveeditsave;
    vm.ipuser = null;
    vm.save = false;
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

    vm.showModalProfileInfo = false;

    vm.showModalPackage = false;
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

    vm.loadPatient = loadPatient;
    vm.loadOrder = loadOrder;
    vm.setdataorder = setdataorder;

    //Eventos de botones
    vm.eventNew = eventNew;
    vm.eventEdit = eventEdit;
    vm.eventCancel = eventCancel;
    vm.eventConfirmCancel = eventConfirmCancel;
    vm.eventUndo = eventUndo;
    vm.eventSave = eventSave;
    vm.eventSearch = eventSearch;
    vm.eventDailySearch = eventDailySearch;
    vm.eventBarcodes = eventBarcodes;
    vm.eventRequirement = eventRequirement;
    vm.eventValidityResult = eventValidityResult;
    vm.eventProfileInfo = eventProfileInfo;
    vm.variablesReport = variablesReport;
    vm.getdemographictest = getdemographictest;
    vm.packagesInsertEvent = packagesInsertEvent;
    vm.setPackageTracking = setPackageTracking;
    vm.insertPackageTracking = insertPackageTracking;

    //Botones
    vm.ticketDisabled = true;
    vm.newDisabled = false;
    vm.editDisabled = true;
    vm.cancelDisabled = true;
    vm.scheduleAppointment = true;
    vm.saveDisabled = true;
    vm.undoDisabled = true;
    vm.dailyDisabled = false;
    vm.searchDisabled = false;
    vm.barcodesDisabled = true;
    vm.requirementDisabled = false;
    vm.hasCashbox = false;
    vm.invoiceDisabled = false;
    vm.loading = false;
    vm.openSearch = false;
    vm.listenerDemographic = listenerDemographic;
    vm.orderTestByDemographics = orderTestByDemographics;
    //Combo Examenes
    vm.tests = [];
    vm.selectedTest = [];
    vm.testCashReceipt = [];
    vm.selectTest = selectTest;
    vm.disabledTests = true;
    vm.focusOutListTest = focusOutListTest;
    vm.insertdiagnosticorder = insertdiagnosticorder;
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
    vm.eventScheduleAppointment = eventScheduleAppointment;
    vm.getProcessPrint = getProcessPrint;

    vm.formatDateAppointment = function (dateNum) {
      if (!dateNum) return dateNum;
      var dateStr = dateNum.toString();
      return (
        dateStr.slice(0, 4) + "/" + dateStr.slice(4, 6) + "/" + dateStr.slice(6)
      );
    };
    // //Asigna eventos a los hotkeys
    $hotkey.bind("F2", function (event) {
      if (
        !vm.newDisabled &&
        $state.$current.controller === "medicalappointmentController"
      ) {
        eventNew(1);
      }
    });
    $hotkey.bind("F3", function (event) {
      event.preventDefault();
      if (
        !vm.editDisabled &&
        $state.$current.controller === "medicalappointmentController"
      ) {
        eventEdit();
      }
    });
    $hotkey.bind("F4", function (event) {
      if (
        !vm.cancelDisabled &&
        $state.$current.controller === "medicalappointmentController"
      ) {
        eventCancel();
      }
    });
    $hotkey.bind("alt+S", function (event) {
      if (
        !vm.saveDisabled &&
        $state.$current.controller === "medicalappointmentController"
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
        $state.$current.controller === "medicalappointmentController"
      ) {
        eventSearch();
      }
    });
    $hotkey.bind("F10", function (event) {
      if (
        !vm.barcodesDisabled &&
        $state.$current.controller === "medicalappointmentController"
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
    $rootScope.$watch("viewturnnew", function () {
      vm.viewturnnew = $rootScope.viewturnnew;
    });

    vm.consult = consult;
    //** Método que válida que la fecha y la zona esten seleccionadas**//
    function consult() {
      vm.Detail = [];
      if (vm.date === null || vm.date === undefined) {
        logger.warning("Seleccione la Fecha");
      } else {
        vm.getAppointment();
      }
    }
    vm.eventTicket = eventTicket;
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
                  }
                  vm.pathreport = "/Report/pre-analitic/appointment/ticket.mrt";
                  var list = [];
                  var tests = _.filter(response.data, function (o) {
                    return o.idPackage === 0 && o.type !== 2;
                  });
                  if (tests.length > 0) {
                    list.push(tests);
                  }
                  var packages = _.filter(response.data, function (o) {
                    return o.idPackage === 0 && o.type === 2;
                  });
                  packages.forEach(function (value) {
                    if (value.deployPackage === 0) {
                      list.push(value);
                    } else {
                      var childs = _.filter(response.data, function (o) {
                        return o.idPackage === value.id;
                      });
                      if (childs.length > 0) {
                        list.push(childs);
                      }
                    }
                  });

                  vm.datareport = list;

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
                      age: common.getAgeAsString(
                        vm.patientDemosValues[vm.staticDemoIds["birthday"]],
                        vm.formatDate.toUpperCase()
                      ),
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
                      priceTicket: vm.priceTicket,
                      appointmentday: $rootScope.appointmentday,
                      shift: $rootScope.appointment,
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
                    } else {
                      if (
                        demo.id === -201 ||
                        demo.id === -202 ||
                        demo.id === -203 ||
                        demo.id === -204 ||
                        demo.id === -205
                      ) {
                        if (
                          vm.orderDemosValues[demo.id] !== null &&
                          vm.orderDemosValues[demo.id] !== undefined &&
                          vm.orderDemosValues[demo.id] !== ""
                        ) {
                          vm.variables[0]["demo_" + demo.id + "_name"] =
                            demo.name;
                          vm.variables[0]["demo_" + demo.id + "_value"] =
                            vm.orderDemosValues[demo.id].name;
                        }
                      }
                    }
                  });
                  vm.patientDemos.forEach(function (demo) {
                    if (demo.id > 0) {
                      vm.variables[0]["demo_" + demo.id + "_name"] = demo.name;
                      vm.variables[0]["demo_" + demo.id + "_value"] =
                        demo.encoded === false
                          ? vm.patientDemosValues[demo.id] === undefined
                            ? ""
                            : vm.patientDemosValues[demo.id]
                          : vm.patientDemosValues[demo.id] === undefined
                          ? ""
                          : vm.patientDemosValues[demo.id].showValue;
                    }
                  });
                  var listComments = [];
                  vm.variables[0]["comments"] = listComments;
                  vm.returncash = false;
                  orderDS
                    .getrequirement(
                      auth.authToken,
                      vm.orderDemosValues[vm.staticDemoIds["orderDB"]]
                    )
                    .then(
                      function (response) {
                        if (response.status === 200) {
                          vm.variables[0].requirement = response.data;
                          vm.windowOpenReport();
                        } else {
                          vm.windowOpenReport();
                        }
                      },
                      function (error) {
                        vm.modalError(error);
                      }
                    );
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
    function endturn() {
      vm.loading = true;
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
      };

      var auth = localStorageService.get("Enterprise_NT.authorizationData");
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
    function eventTransferTurn() {
      vm.loadingmodalscheduleAppointment = true;
      var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];

      var data = {
        orderNumber: order,
      };
      appointmentDS.changeappointment(auth.authToken, data).then(
        function (data) {
          if (data.status === 200) {
            vm.loadingmodalscheduleAppointment = false;
            vm.refreshdashboard = true;
            eventUndo();
          }
        },
        function (error) {
          vm.loadingmodalscheduleAppointment = false;
          vm.modalError(error);
        }
      );
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
      vm.statecomment = 1;
      vm.statediagnostic = 1;
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
      vm.statecomment = 3;
      vm.statediagnostic = 3;
      if (
        (documentType === 1 && vm.managedocumenttype === false) ||
        (documentType !== undefined && vm.managedocumenttype === true)
      ) {
        patientDS
          .getPatientbyIddocument(
            auth.authToken,
            patientId.toUpperCase(),
            documentType
          )
          .then(
            function (response) {
              vm.statecomment = 3;
              vm.statediagnostic = 3;
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
                vm.patientDemosValues[-100] = Patient.patientId;
                vm.patientDemosValues[-101] = Patient.lastName;
                vm.patientDemosValues[-102] = Patient.surName;
                vm.patientDemosValues[-103] = Patient.name;
                vm.patientDemosValues[-109] = "";
                vm.patientDemosValues[-105] = moment(Patient.birthday).format(
                  vm.formatDate.toUpperCase()
                );
                vm.patientDemosValues[-110] = common.getAge(
                  moment(Patient.birthday).format(vm.formatDate.toUpperCase()),
                  vm.formatDate.toUpperCase()
                );
                if (Patient.sex === "8") {
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
                if (Patient.sex === "7") {
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
        vm.loading = false;
        if (vm.managedocumenttype === true) {
          logger.warning("Seleccione el tipo de documento");
        }
      }
    }
    vm.windowOpenReport = windowOpenReport;
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
    vm.ConfirmscheduleAppointment = ConfirmscheduleAppointment;
    function ConfirmscheduleAppointment() {
      vm.loadinappoinment = true;
      if (vm.samplepoint) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return appointmentDS.getuseravailable(auth.authToken).then(
          function (data) {
            if (data.status === 200) {
              data.data.forEach(function (cubicle) {
                cubicle.namecubicle =  
                cubicle.name +
                " - " +
                cubicle.nameDesignatedPerson +
                " ( " +
                cubicle.numberOfAssignedPeople +
                " ) ";
              });
              vm.samplingpoints = data.data;
              if (vm.samplingpoints.length === 0) {
                logger.info(
                  "No se encontraron usuarios disponibles consulte con el administrador"
                );
              } else {
                vm.samplingpoints =_.orderBy(vm.samplingpoints, ['numberOfAssignedPeople', 'name'], ['asc', 'desc']);
                vm.points = { id: vm.samplingpoints[0].id };
                vm.loadinappoinment = false;
                UIkit.modal("#modalConfirmscheduleAppointment").show();
              }
            } else {
              logger.info(
                "No se encontraron usuarios disponibles consulte con el administrador"
              );
            }
          },
          function (error) {
            vm.modalError(error);
            vm.loadinappoinment = false;
          }
        );
      } else {
        UIkit.modal("#modalConfirmscheduleAppointment").show();
      }
    }
    vm.ConfirmscheduleAppointmentautomatic = ConfirmscheduleAppointmentautomatic;
    function ConfirmscheduleAppointmentautomatic() {
      vm.loadinappoinment = true;    
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return appointmentDS.getuseravailable(auth.authToken).then(
          function (data) {
            if (data.status === 200) {
              data.data.forEach(function (cubicle) {
                cubicle.namecubicle =  
                cubicle.name +
                " - " +
                cubicle.nameDesignatedPerson +
                " ( " +
                cubicle.numberOfAssignedPeople +
                " ) ";
              });
              vm.samplingpoints = data.data;
              if (vm.samplingpoints.length === 0) {
                logger.info(
                  "No se encontraron usuarios disponibles consulte con el administrador"
                );
              } else {
                vm.samplingpoints =_.orderBy(vm.samplingpoints, ['numberOfAssignedPeople', 'name'], ['asc', 'desc']);
                var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
                var auth = localStorageService.get("Enterprise_NT.authorizationData");
                var asignetakesample = {
                  'orderNumber': order,
                  'id': vm.samplingpoints[0].id 
                };
                vm.assigneappoinment(asignetakesample);
                var data = {
                  orderNumber: order,
                };
                appointmentDS.changeappointment(auth.authToken, data).then(
                  function (data) {
                    if (data.status === 200) {
                      vm.loadingmodalscheduleAppointment = false;              //La orden ha sido cancelada
                      eventUndo();
                      logger.success( "La cita se asigno " + vm.samplingpoints[0].namecubicle);
                    }
                  },
                  function (error) {
                    vm.loadingmodalscheduleAppointment = false;
                    vm.modalError(error);
                  }
                );
              }
            } else {
              logger.info(
                "No se encontraron usuarios disponibles consulte con el administrador"
              );
            }
          },
          function (error) {
            vm.modalError(error);
            vm.loadinappoinment = false;
          }
        );      
    }
    //** Método que trae la lista de ruteros con las jornadas consultadas en la zona y el dia**//
    vm.getAppointment = getAppointment;
    function getAppointment() {
      vm.loadinappoinment = true;
      vm.Detail = [];
      var date = moment(vm.date).format("YYYYMMDD");
      var dayOfWeek = moment(date).weekday();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      return appointmentDS
        .getappointment(auth.authToken, auth.branch, date, dayOfWeek + 1)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.Detail = data.data;
              vm.Detail.users = [{ shifts: data.data.shifts }];
              vm.Detail.users.forEach(function (value, key) {
                value.listhours = vm.listhours;
                value.totalshifts = 0;
                value.totalshiftsassigment = 0;
                var hourinit = parseInt(vm.RangoInicialCitas.replace(":", ""));
                var hourend = parseInt(vm.RangoFinalCitas.replace(":", ""));
                value.shifts = _.orderBy(
                  _.filter(value.shifts, function (o) {
                    return o.init >= hourinit && o.end <= hourend;
                  }),
                  ["init"],
                  ["asc"]
                );
                value.shiftsdiurnal = _.filter(
                  _.clone(value.shifts),
                  function (o) {
                    return o.init < 1300;
                  }
                );
                value.shiftsnight = _.filter(
                  _.clone(value.shifts),
                  function (o) {
                    return o.init >= 1300;
                  }
                );
                if (value.shiftsdiurnal.length > 0) {
                  value.shiftsdiurnal.forEach(function (
                    valueshifts,
                    keyshifts
                  ) {
                    var min = 0;
                    valueshifts.init =
                      valueshifts.init.toString().length === 2
                        ? "00" + valueshifts.init
                        : valueshifts.init;
                    valueshifts.end =
                      valueshifts.end.toString().length === 2
                        ? "00" + valueshifts.end
                        : valueshifts.end;
                    var widthelement = angular
                      .element(document.querySelectorAll(".th-subheader")[0])
                      .width();

                    var hourinitial = valueshifts.init.toString().split("");
                    if (hourinitial.length === 2) {
                      hourinitial = "00" + hourinitial[0] + hourinitial[1];
                    } else if (hourinitial.length === 4) {
                      hourinitial = valueshifts.init.toString();
                    } else {
                      hourinitial =
                        "0" + hourinitial[0] + hourinitial[1] + hourinitial[2];
                    }

                    hourinitial = moment(hourinitial, "HH:mm");

                    var hourfinal = valueshifts.end.toString().split("");
                    if (hourfinal.length === 2) {
                      hourfinal = "00" + hourfinal[0] + hourfinal[1];
                    } else if (hourfinal.length === 4) {
                      hourfinal = valueshifts.end.toString();
                    } else {
                      hourfinal =
                        "0" + hourfinal[0] + hourfinal[1] + hourfinal[2];
                    }

                    hourfinal = moment(hourfinal, "HH:mm");
                    var hourinit = valueshifts.init.toString().split("");

                    if (hourinit.length === 2) {
                      hourinit = "00";
                    } else if (hourinit.length === 4) {
                      hourinit = hourinit[0] + hourinit[1] + "00";
                    } else {
                      hourinit = hourinit[0] + "00";
                    }

                    hourinit = parseInt(hourinit);
                    min = hourfinal.diff(hourinitial, "minutes");

                    var lengthTime = moment.duration(
                      hourfinal.diff(hourinitial)
                    );
                    var hours = parseInt(lengthTime.asHours());
                    var minutes = parseInt(lengthTime.asMinutes()) % 60;
                    var duration = hours >= 1 ? 60 : minutes;
                    var totalSpaces = min === 0 ? 0 : 1;

                    if (min > 0 && hours < 1) {
                      totalSpaces = duration / min;
                    } else if (hours >= 1) {
                      totalSpaces = duration / min;
                    }
                    var index = _.findIndex(
                      vm.listhoursformatdiurnal,
                      function (o) {
                        return o.time === valueshifts.init;
                      }
                    );
                    if (index === -1) {
                      index = _.findIndex(
                        vm.listhoursformatdiurnal,
                        function (o) {
                          return o.time >= valueshifts.init - 100;
                        }
                      );
                    }
                    if (index >= 0) {
                      var marginend = 0;
                      if (
                        valueshifts.end < vm.listhoursformatdiurnal[index].time
                      ) {
                        if (
                          vm.listhoursformatdiurnal[index].time + min >
                            valueshifts.end &&
                          min > 0
                        ) {
                          marginend =
                            vm.listhoursformatdiurnal[index].time +
                            min -
                            valueshifts.end;
                          marginend = (widthelement * marginend) / min;
                        }
                      }

                      var margininit = 0;

                      if (
                        vm.listhoursformatdiurnal[index].time >
                          valueshifts.init &&
                        min > 0
                      ) {
                        var initialtime = vm.listhoursformatdiurnal[index].time
                          .toString()
                          .split("");
                        if (initialtime.length === 2) {
                          initialtime = "00" + initialtime[0] + initialtime[1];
                        } else if (initialtime.length === 4) {
                          initialtime =
                            vm.listhoursformatdiurnal[index].time.toString();
                        } else {
                          initialtime =
                            "0" +
                            initialtime[0] +
                            initialtime[1] +
                            initialtime[2];
                        }

                        initialtime = moment(initialtime, "HH:mm");
                        var difftime = moment.duration(
                          initialtime.diff(hourinitial)
                        );
                        var hoursmargininit = parseInt(difftime.asHours());
                        var minutesmargininit =
                          parseInt(difftime.asMinutes()) % 60;
                        var durationmargininit =
                          hoursmargininit >= 1 ? 60 : minutesmargininit;
                        margininit = (widthelement * durationmargininit) / min;
                      }

                      var calcule =
                        valueshifts.init -
                        vm.listhoursformatdiurnal[index].time;
                      var calculemargingleft =
                        calcule >= 15 && calcule < 30
                          ? 60
                          : calcule >= 30 && calcule < 45
                          ? 120
                          : calcule >= 45 && calcule < 60
                          ? 180
                          : 0;
                      valueshifts.widthshift = min * 4 + "px";
                      valueshifts.marginshift =
                        index +
                        widthelement * index -
                        margininit +
                        calculemargingleft +
                        "px";
                      valueshifts.hourstext =
                        vm.formathours(valueshifts.init) +
                        " - " +
                        vm.formathours(valueshifts.end);
                      valueshifts.textinit = vm.formathours(valueshifts.init);
                      valueshifts.textend = vm.formathours(valueshifts.end);
                      valueshifts.zindexshift = value.shifts.length - keyshifts;
                      value.totalshifts =
                        value.totalshifts + valueshifts.quantity;
                      value.totalshiftsassigment =
                        value.totalshiftsassigment +
                        (valueshifts.quantity - valueshifts.amount);
                      value.disableduser =
                        value.totalshiftsassigment === 0 ? false : true;
                    }
                  });
                }
                if (value.shiftsnight.length > 0) {
                  value.shiftsnight.forEach(function (valueshifts, keyshifts) {
                    var min = 0;
                    valueshifts.init =
                      valueshifts.init.toString().length === 2
                        ? "00" + valueshifts.init
                        : valueshifts.init;
                    valueshifts.end =
                      valueshifts.end.toString().length === 2
                        ? "00" + valueshifts.end
                        : valueshifts.end;
                    var widthelement = angular
                      .element(document.querySelectorAll(".th-subheader")[0])
                      .width();

                    var hourinitial = valueshifts.init.toString().split("");
                    if (hourinitial.length === 2) {
                      hourinitial = "00" + hourinitial[0] + hourinitial[1];
                    } else if (hourinitial.length === 4) {
                      hourinitial = valueshifts.init.toString();
                    } else {
                      hourinitial =
                        "0" + hourinitial[0] + hourinitial[1] + hourinitial[2];
                    }

                    hourinitial = moment(hourinitial, "HH:mm");

                    var hourfinal = valueshifts.end.toString().split("");
                    if (hourfinal.length === 2) {
                      hourfinal = "00" + hourfinal[0] + hourfinal[1];
                    } else if (hourfinal.length === 4) {
                      hourfinal = valueshifts.end.toString();
                    } else {
                      hourfinal =
                        "0" + hourfinal[0] + hourfinal[1] + hourfinal[2];
                    }

                    hourfinal = moment(hourfinal, "HH:mm");
                    var hourinit = valueshifts.init.toString().split("");

                    if (hourinit.length === 2) {
                      hourinit = "00";
                    } else if (hourinit.length === 4) {
                      hourinit = hourinit[0] + hourinit[1] + "00";
                    } else {
                      hourinit = hourinit[0] + "00";
                    }

                    hourinit = parseInt(hourinit);
                    min = hourfinal.diff(hourinitial, "minutes");

                    var lengthTime = moment.duration(
                      hourfinal.diff(hourinitial)
                    );
                    var hours = parseInt(lengthTime.asHours());
                    var minutes = parseInt(lengthTime.asMinutes()) % 60;
                    var duration = hours >= 1 ? 60 : minutes;
                    var totalSpaces = min === 0 ? 0 : 1;

                    if (min > 0 && hours < 1) {
                      totalSpaces = duration / min;
                    } else if (hours >= 1) {
                      totalSpaces = duration / min;
                    }
                    var index = _.findIndex(
                      vm.listhoursformatnight,
                      function (o) {
                        return o.time === valueshifts.init;
                      }
                    );
                    if (index === -1) {
                      index = _.findIndex(
                        vm.listhoursformatnight,
                        function (o) {
                          return o.time >= valueshifts.init - 100;
                        }
                      );
                    }
                    if (index >= 0) {
                      var marginend = 0;
                      if (
                        valueshifts.end < vm.listhoursformatnight[index].time
                      ) {
                        if (
                          vm.listhoursformatnight[index].time + min >
                            valueshifts.end &&
                          min > 0
                        ) {
                          marginend =
                            vm.listhoursformatnight[index].time +
                            min -
                            valueshifts.end;
                          marginend = (widthelement * marginend) / min;
                        }
                      }

                      var margininit = 0;

                      if (
                        vm.listhoursformatnight[index].time >
                          valueshifts.init &&
                        min > 0
                      ) {
                        var initialtime = vm.listhoursformatnight[index].time
                          .toString()
                          .split("");
                        if (initialtime.length === 2) {
                          initialtime = "00" + initialtime[0] + initialtime[1];
                        } else if (initialtime.length === 4) {
                          initialtime =
                            vm.listhoursformatnight[index].time.toString();
                        } else {
                          initialtime =
                            "0" +
                            initialtime[0] +
                            initialtime[1] +
                            initialtime[2];
                        }

                        initialtime = moment(initialtime, "HH:mm");
                        var difftime = moment.duration(
                          initialtime.diff(hourinitial)
                        );
                        var hoursmargininit = parseInt(difftime.asHours());
                        var minutesmargininit =
                          parseInt(difftime.asMinutes()) % 60;
                        var durationmargininit =
                          hoursmargininit >= 1 ? 60 : minutesmargininit;
                        margininit = (widthelement * durationmargininit) / min;
                      }

                      var calcule =
                        valueshifts.init - vm.listhoursformatnight[index].time;
                      var calculemargingleft =
                        calcule >= 15 && calcule < 30
                          ? 60
                          : calcule >= 30 && calcule < 45
                          ? 120
                          : calcule >= 45 && calcule < 60
                          ? 180
                          : 0;
                      valueshifts.widthshift = min * 4 + "px";
                      valueshifts.marginshift =
                        index +
                        widthelement * index -
                        margininit +
                        calculemargingleft +
                        "px";
                      valueshifts.hourstext =
                        vm.formathours(valueshifts.init) +
                        " - " +
                        vm.formathours(valueshifts.end);
                      valueshifts.textinit = vm.formathours(valueshifts.init);
                      valueshifts.textend = vm.formathours(valueshifts.end);
                      valueshifts.zindexshift = value.shifts.length - keyshifts;
                      value.totalshifts =
                        value.totalshifts + valueshifts.quantity;
                      value.totalshiftsassigment =
                        value.totalshiftsassigment +
                        (valueshifts.quantity - valueshifts.amount);
                      value.disableduser =
                        value.totalshiftsassigment === 0 ? false : true;
                    }
                  });
                }
              });
              vm.loadinappoinment = false;
            }
            vm.loadinappoinment = false;
          },
          function (error) {
            vm.modalError(error);
            vm.loadinappoinment = false;
          }
        );
    }
    //** Método que muestra un popup con lad disponibilidad seleccionada**//
    vm.assigmentrouter = assigmentrouter;
    function assigmentrouter(route, shift) {
      if (shift.quantity - shift.amount !== 0) {
        vm.Detailmodal = route;
        vm.horary = shift;
        if (vm.typeappointment === 1) {
          UIkit.modal("#messageinformative", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
          }).show();
        } else {
          UIkit.modal("#reprogramming", {
            modal: false,
            keyboard: false,
            bgclose: false,
            center: true,
          }).show();
        }
      }
    }
    //** Método reporta la concurrencia de el la disponibilidad escogida**//
    vm.appointmentConcurrence = appointmentConcurrence;
    function appointmentConcurrence() {
      UIkit.modal("#appointment").hide();
      UIkit.modal("#messageinformative").hide();
      vm.openmodal = true;
      vm.loadingdata = true;
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var json = {
        date: moment(vm.date).format("YYYYMMDD"),
        branch: {
          id: auth.branch,
        },
        shift: {
          id: vm.horary.id,
        },
      };
      return appointmentDS.appointmentconcurrence(auth.authToken, json).then(
        function (data) {
          if (data.status === 200) {
            vm.concurrence = {
              shift: {
                id: vm.horary.id,
              },
              idConcurrence: data.data,
            };
            kendo.culture("en-US");
            vm.dateselectedappointment = moment(vm.date).format("YYYYMMDD");
            localStorageService.set("concurrence", json);
            vm.blockbilling = false;
            vm.blockservice = false;
            vm.permissioncancel = false;
            vm.ordercomment = "";
            vm.saveedit = false;
            vm.patientcoment = "";
            $rootScope.dataturn = localStorageService.get("turn");
            vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
            vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
            vm.cleanTests = 1;
            vm.patientDemosValues[-99] = "";
            vm.orderDemosValues[-998] = "";
            vm.patientDemosDisabled["-100"] = vm.managehistoryauto;

            vm.patientDemos.forEach(function (demo, index) {
              demo.showRequired = false;
            });
            vm.orderDemos.forEach(function (demo, index) {
              demo.showRequired = false;
            });

            vm.selectedTest = [];
            vm.samples = [];
            vm.deleteTests = [];
            vm.packageTracking = [];

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

              if (
                vm.servicedefault !== null &&
                vm.servicedefault !== "" &&
                vm.servicedefault !== "0" &&
                manageService
              ) {
                var data = _.filter(
                  JSON.parse(JSON.stringify(vm.orderDemos)),
                  function (o) {
                    o.items = _.filter(o.items, function (p) {
                      return p.id === parseInt(vm.servicedefault);
                    });
                    return o.items.length > 0 && o.id === -6;
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
              vm.orderDemosDisabled = disabledAllDemo(
                vm.orderDemosDisabled,
                true
              );
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
              vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
                if (demo.encoded && demo.viewdefault) {
                  vm.patientDemosValues[demo.id] = demo.itemsdefault;
                }
                if (demo.promiseTime) {
                  vm.patientDemosValues[demo.id] = new Date();
                }
              });

              if (vm.appoinmentpatient.fecha_sol !== undefined) {
                if (vm.appoinmentpatient.aseg_cedula.split("-").length === 3) {
                  //Cedula
                  vm.patientDemosValues[-10] = {
                    id: 2,
                    code: "CC",
                    name: "CEDULA",
                    state: false,
                    canCreateItemInOrder: false,
                    idDemo: -10,
                    showValue: "CC. CEDULA",
                  };
                } else {
                  //pasaporte
                  vm.patientDemosValues[-10] = {
                    id: 3,
                    code: "PA",
                    name: "PASAPORTE",
                    state: false,
                    canCreateItemInOrder: false,
                    idDemo: -10,
                    showValue: "PA. PASAPORTE",
                  };
                }

                $scope.$broadcast(
                  "angucomplete-alt:changeInput",
                  "demo_-10",
                  vm.patientDemosValues[-10]
                );
                vm.patientDemosValues[-100] = vm.appoinmentpatient.aseg_cedula;

                var documentType = vm.patientDemosValues[-10].id;
                var patientId = vm.patientDemosValues[-100];

                vm.statecomment = 3;
                vm.statediagnostic = 3;
                patientDS
                  .getPatientbyIddocument(
                    auth.authToken,
                    patientId.toUpperCase(),
                    documentType
                  )
                  .then(
                    function (response) {
                      vm.statecomment = 3;
                      vm.statediagnostic = 3;
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
                                "demo_" +
                                  vm.staticDemoIds["orderType"] +
                                  "_value"
                              )
                              .focus();
                          }, 100);
                        } else {
                          setTimeout(function () {
                            document
                              .getElementById(
                                "demo_" + vm.staticDemoIds["order"]
                              )
                              .focus();
                          }, 100);
                        }
                        vm.comparepatient = _.clone(vm.patientDemosValues);
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

                        vm.orderDemos.forEach(function (demo, index) {
                          demo.showRequired = false;
                          if (
                            demo.encoded &&
                            demo.viewdefault &&
                            demo.id !== 28
                          ) {
                            vm.orderDemosValues[demo.id] = demo.itemsdefault;
                          }
                          if (demo.promiseTime) {
                            vm.orderDemosValues[demo.id] = new Date();
                          }
                        });

                        vm.samples = [];
                        vm.deleteTests = [];
                        vm.orderDemosValues[-5] = vm.branch;
                        $scope.$broadcast(
                          "angucomplete-alt:changeInput",
                          "demo_-5",
                          vm.orderDemosValues[-5]
                        );

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
                          $scope.$broadcast(
                            "angucomplete-alt:changeInput",
                            "demo_-1",
                            vm.orderDemosValues[-1]
                          );
                        }
                        if (
                          vm.servicedefault !== null &&
                          vm.servicedefault !== "" &&
                          vm.servicedefault !== "0" &&
                          vm.manageService
                        ) {
                          var data = _.filter(
                            JSON.parse(JSON.stringify(vm.orderDemos)),
                            function (o) {
                              o.items = _.filter(o.items, function (p) {
                                return p.id === parseInt(vm.servicedefault);
                              });
                              return o.items.length > 0 && o.id === -6;
                            }
                          );
                          vm.orderDemosValues[-6] = data[0].items[0];
                          $scope.$broadcast(
                            "angucomplete-alt:changeInput",
                            "demo_-6",
                            vm.orderDemosValues[-6]
                          );
                        }
                        if (vm.orderTypeInit.toString() !== "0") {
                          vm.orderDemosValues[-4] = vm.orderTypeDefault;
                          $scope.$broadcast(
                            "angucomplete-alt:changeInput",
                            "demo_-4",
                            vm.orderDemosValues[-4]
                          );
                        }
                        //Logica de Botones
                        vm.newDisabled = true;
                        vm.editDisabled = true;
                        vm.cancelDisabled = true;
                        vm.scheduleAppointment = true;
                        vm.saveDisabled = false;
                        vm.undoDisabled = false;
                        vm.dailyDisabled = true;
                        vm.searchDisabled = true;
                        vm.barcodesDisabled = true;
                        vm.requirementDisabled = true;
                        vm.ticketDisabled = true;
                        //Habilita el combo de examenes
                        vm.loadingdata = false;
                      }
                    },
                    function (error) {
                      vm.Error = error;
                      vm.ShowPopupError = true;
                      vm.loading = false;
                    }
                  );
              } else {
                vm.orderDemos.forEach(function (demo, index) {
                  demo.showRequired = false;
                  if (demo.encoded && demo.viewdefault && demo.id !== 28) {
                    vm.orderDemosValues[demo.id] = demo.itemsdefault;
                  }
                  if (demo.promiseTime) {
                    vm.orderDemosValues[demo.id] = new Date();
                  }
                });

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
                if (
                  vm.servicedefault !== null &&
                  vm.servicedefault !== "" &&
                  vm.servicedefault !== "0" &&
                  vm.manageService
                ) {
                  var data = _.filter(
                    JSON.parse(JSON.stringify(vm.orderDemos)),
                    function (o) {
                      o.items = _.filter(o.items, function (p) {
                        return p.id === parseInt(vm.servicedefault);
                      });
                      return o.items.length > 0 && o.id === -6;
                    }
                  );
                  vm.orderDemosValues[-6] = data[0].items[0];
                }
                if (vm.orderTypeInit.toString() !== "0") {
                  vm.orderDemosValues[-4] = vm.orderTypeDefault;
                }

                vm.newDisabled = true;
                vm.editDisabled = true;
                vm.cancelDisabled = true;
                vm.scheduleAppointment = true;
                vm.saveDisabled = true;
                vm.undoDisabled = false;
                vm.dailyDisabled = true;
                vm.searchDisabled = true;
                vm.barcodesDisabled = true;
                vm.requirementDisabled = true;
                vm.ticketDisabled = true;
                vm.loadingdata = false;
              }
            }
          } else {
            vm.loadingdata = false;
          }
        },
        function (error) {
          vm.message = "";
          error.data.errorFields.forEach(function (value) {
            if (value === "0|shift") {
              vm.message = vm.message + "Jornada no valida,  ";
            } else if (value === "0|user") {
              vm.message = vm.message + "Usuario no valida,  ";
            } else if (value === "1|concurrences not available") {
              vm.message = vm.message + "Espacio asignado a otro usuario,  ";
            } else if (value === "1|apointments not available") {
              vm.message = vm.message + "Espacio asignado a otro usuario,  ";
            }
          });
          if (vm.message !== "") {
            UIkit.modal("#errorConcurrenceappointmenr").show();
            setTimeout(function () {
              vm.getAppointment();
            }, 3000);
          } else {
            //vm.getAppointment();
            vm.modalError(error);
          }
          vm.loadingdata = false;
        }
      );
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
          response.data.forEach(function (value, key) {
            value.tabIndex = index;
            value.name = $filter("translate")(value.name).toLowerCase();
            value.format =
              value.format === undefined || value.format === ""
                ? ""
                : value.format;
            if (value.id === -8 || value.id === -9) {
              value.placeholder = "";
              value.format = "";
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
            index++;
          });
          //Actualiza la vista de paciente
          vm.patientDemos = response.data;
          vm.patientDemosValues = patientDemosValues;
          vm.patientDemosDisabled = patientDemosDisabled;
          vm.patientDemosDisabled.photo = false;

          //Carga la orden
          var orderDemosValues = {};
          var orderDemosDisabled = {};
          orderentryDS.getDemographics(auth.authToken, "O").then(
            function (response) {
              var databranch = JSON.parse(JSON.stringify(response.data));
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

              var datatype = JSON.parse(JSON.stringify(response.data));
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
                    JSON.parse(JSON.stringify(databranch)),
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
                  if (value.id === -108 && value.name === "Orden HIS") {
                    value.id = -109;
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
    function focusOutListTest() {
      $scope.$broadcast("angucomplete-alt:clearInput", "orderentry_tests");
    }
    /**
     * Evento que se realiza al seleccionar la historia de un paciente
     */
    function selectedPatientId() {
      vm.loading = true;
      vm.validaterepons = false;
      var searchById_DB = vm.managehistoryauto ? "patientDB" : "patientId";
      var patientId = vm.patientDemosValues[vm.staticDemoIds[searchById_DB]];
      var patientDemosValues = {};
      vm.patientcoment = "";
      if (patientId.search("/") === -1) {
        if (patientId.toString().trim() !== "") {
          var documentType =
            vm.patientDemosValues[vm.staticDemoIds["documentType"]];
          if (!vm.managehistoryauto) {
            vm.statecomment = 3;
            vm.statediagnostic = 3;

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
                .getPatientbyIddocument(
                  auth.authToken,
                  patientId.toUpperCase(),
                  documentType
                )
                .then(
                  function (response) {
                    vm.statecomment = 3;
                    vm.statediagnostic = 3;
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
                      vm.comparepatient = _.clone(vm.patientDemosValues);
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
                    }
                    //Logica de Botones
                    vm.newDisabled = true;
                    vm.editDisabled = true;
                    vm.cancelDisabled = true;
                    vm.scheduleAppointment = true;
                    vm.saveDisabled = false;
                    vm.undoDisabled = false;
                    vm.dailyDisabled = true;
                    vm.searchDisabled = true;
                    vm.barcodesDisabled = true;
                    vm.ticketDisabled = true;
                    //Habilita el combo de examenes
                    vm.disabledTests = false;
                    vm.loading = false;
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
            patientDS
              .getPatientbyIddocument(
                auth.authToken,
                patientId.toUpperCase(),
                0
              )
              .then(
                function (response) {
                  //vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, response.status === 200);
                  vm.patientDemosDisabled[-100] = true;
                  //vm.editDisabled = response.statusText !== 'OK';
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
                  vm.statecomment = 3;
                  vm.statediagnostic = 3;
                  disabledDemo(
                    vm.patientDemosDisabled,
                    vm.staticDemoIds["orderDate"],
                    true
                  );
                  if (response.data.length > 0) {
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
                  vm.scheduleAppointment = true;
                  vm.saveDisabled = false;
                  vm.undoDisabled = false;
                  vm.dailyDisabled = true;
                  vm.searchDisabled = true;
                  vm.barcodesDisabled = true;
                  vm.ticketDisabled = true;
                  vm.comparepatient = _.clone(vm.patientDemosValues);
                  //Habilita el combo de examenes
                  vm.disabledTests = false;
                  vm.loading = false;
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
                          : null
                        : null,
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
                          : null
                        : null,
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
                    appointmentDS
                      .updateAppointment(auth.authToken, vm.orderedit)
                      .then(
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
                                            v.id ===
                                            parseInt(value.split("|")[2])
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
        if (
          localStorageService.get("ManejoTarifa") === "True" &&
          localStorageService.get("DescuentoPorPrueba") === "True"
        ) {
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
        } else if (localStorageService.get("ManejoTarifa") === "True") {
          if (tests.length === vm.comparetest.length) {
            tests.forEach(function (value, key) {
              var validatedfilter = $filter("filter")(
                vm.comparetest,
                function (e) {
                  return e.id === value.id && e.rate.id === value.rate.id;
                }
              );
              if (validatedfilter.length === 0) {
                vm.validatedtest = false;
              }
            });
          } else {
            vm.validatedtest = false;
          }
        } else {
          if (tests.length === vm.comparetest.length) {
            tests.forEach(function (value, key) {
              var validatedfilter = $filter("filter")(
                vm.comparetest,
                function (e) {
                  return e.id === value.id;
                }
              );
              if (validatedfilter.length === 0) {
                vm.validatedtest = false;
              }
            });
          } else {
            vm.validatedtest = false;
          }
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
          vm.scheduleAppointment = false;
          vm.saveDisabled = true;
          vm.undoDisabled = true;
          vm.dailyDisabled = false;
          vm.ticketDisabled = false;
          vm.searchDisabled = false;
          vm.barcodesDisabled = false;
          vm.requirementDisabled = false;
          vm.loading = false;
          vm.statecomment = 1;
          vm.statediagnostic = 1;
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
            appointmentDS.updateAppointment(auth.authToken, order).then(
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
        vm.dateappointment = order.createdDateShort;
        orderDS.insertOrder(auth.authToken, order).then(
          function (data) {
            if (data.status === 200) {
              if (vm.appoinmentpatient.fecha_sol !== undefined) {
                vm.confirmappointment();
              }

              vm.testemailappointment = data.data.tests.filter(function (test) {
                return test.hasprofile === false;
              });
              if (data.data.turn !== "") {
                Sigaturnorder(
                  data.data.orderNumber,
                  localStorageService.get("turn").id
                );
              }
              vm.typeappointment = 1;
              vm.sendEmailPatient(data.data.orderNumber);
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

    vm.confirmappointment = confirmappointment;
    function confirmappointment() {
      vm.urlappoinmentpatient = localStorageService.get("URLCitas");
      var confirmation = {
        url: vm.urlappoinmentpatient + "/admin/ws_xconfirma_solicitud_lab.php",
        appointment: {
          cod_cita: vm.appoinmentpatient.cod_cita,
          estado: "asignado",
          fecha_estado: moment().format("YYYY-MM-DD"),
        },
      };
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return TribunalDS.updateappointments(auth.authToken, confirmation).then(
        function (data) {
          var time = moment(vm.horary.textinit, "H:mm"); // Parsear "1:00" en formato de horas y minutos
          var formattedTime = time.format("HH:mm");

          var schedulerequest = {
            url: vm.urlappoinmentpatient + "/admin/ws_agenda_solicitud_lab.php",
            appointment: {
              cod_cita: vm.appoinmentpatient.cod_cita,
              usuario: vm.appoinmentpatient.aseg_nombre,
              estado: "aceptado",
              motivo: "",
              fecha_estado: moment.format("YYYY-MM-DD"),
              fecha_cita: moment(vm.date).format("YYYY-MM-DD"),
              hora_cita: formattedTime,
            },
          };
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          return TribunalDS.updateappointments(
            auth.authToken,
            schedulerequest
          ).then(
            function (data) {
              vm.appoinmentpatient = {};
            },
            function (error) {}
          );
        },
        function (error) {}
      );
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

    function sendEmailPatient(order) {
      vm.requirementorder = [];
      vm.viewrequirement = false;
      setTimeout(function () {
        orderDS.getrequirement(auth.authToken, order).then(
          function (response) {
            if (response.status === 200) {
              vm.requirementorder = response.data;
              vm.viewrequirement = true;
              setTimeout(function () {
                vm.sendcontentEmail();
              }, 500);
            } else {
              vm.sendcontentEmail();
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
      }, 300);
    }

    vm.sendcontentEmail = sendcontentEmail;
    function sendcontentEmail() {
      var subject = "";
      switch (vm.typeappointment) {
        case 1:
          subject = $filter("translate")("3295");
          break;
        case 2:
          subject = $filter("translate")("3297");
          break;
        case 3:
          subject = $filter("translate")("3296");
      }

      var contentemail = $("#templateemail").html();
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var data = {
        recipients: [vm.patientDemosValues[vm.staticDemoIds["email"]]],
        subject: subject,
        body: contentemail,
        user: auth.id,
        order: 0,
        attachment: [],
      };
      reportadicional
        .sendEmailAppointmentV2(auth.authToken, data)
        .then(function (response) {
          if (
            response.data ===
            "Se a generado un error a la hora de hacer el envio"
          ) {
            logger.error("Se a generado un error a la hora de hacer el envio");
          } else {
            if (vm.typeappointment === 3) {
              eventUndo();
            }
            logger.success("Correo enviado al paciente");
          }
        });
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
      appointmentDS.updateAppointment(auth.authToken, vm.editmotiveorder).then(
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
     * vm.appoinmentpatient = {};
     */
    function eventNew(type) {
      vm.Detail = [];
      vm.appoinmentpatient = {};
      vm.typeappointment = type;
      if (vm.typeappointment === 2 && vm.listMotivesrescheduling.length === 0) {
        logger.error("Debe crear motivos de reprogramación de cita");
      } else {
        if (vm.selectedpatientappoinment !== undefined) {
          vm.appoinmentpatient = vm.selectedpatientappoinment;
          vm.selectedpatientappoinment = {};
        }
        vm.loadingdata = true;
        vm.date = new Date();
        var date = moment(vm.date).format("YYYYMMDD");
        var dayOfWeek = moment(date).weekday();
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return appointmentDS
          .getappointment(auth.authToken, auth.branch, date, dayOfWeek + 1)
          .then(
            function (data) {
              if (data.status === 200) {
                UIkit.modal("#appointment").show();
                vm.Detail = data.data;
                vm.Detail.users = [{ shifts: data.data.shifts }];
                vm.Detail.users.forEach(function (value, key) {
                  value.listhours = vm.listhours;
                  value.totalshifts = 0;
                  value.totalshiftsassigment = 0;
                  var hourinit = parseInt(
                    vm.RangoInicialCitas.replace(":", "")
                  );
                  var hourend = parseInt(vm.RangoFinalCitas.replace(":", ""));
                  value.shifts = _.orderBy(
                    _.filter(value.shifts, function (o) {
                      return o.init >= hourinit && o.end <= hourend;
                    }),
                    ["init"],
                    ["asc"]
                  );
                  value.shiftsdiurnal = _.filter(
                    _.clone(value.shifts),
                    function (o) {
                      return o.init < 1300;
                    }
                  );
                  value.shiftsnight = _.filter(
                    _.clone(value.shifts),
                    function (o) {
                      return o.init >= 1300;
                    }
                  );

                  if (value.shiftsdiurnal.length > 0) {
                    value.shiftsdiurnal.forEach(function (
                      valueshifts,
                      keyshifts
                    ) {
                      var min = 0;
                      valueshifts.init =
                        valueshifts.init.toString().length === 2
                          ? "00" + valueshifts.init
                          : valueshifts.init;
                      valueshifts.end =
                        valueshifts.end.toString().length === 2
                          ? "00" + valueshifts.end
                          : valueshifts.end;
                      var widthelement = angular
                        .element(document.querySelectorAll(".th-subheader")[0])
                        .width();

                      var hourinitial = valueshifts.init.toString().split("");
                      if (hourinitial.length === 2) {
                        hourinitial = "00" + hourinitial[0] + hourinitial[1];
                      } else if (hourinitial.length === 4) {
                        hourinitial = valueshifts.init.toString();
                      } else {
                        hourinitial =
                          "0" +
                          hourinitial[0] +
                          hourinitial[1] +
                          hourinitial[2];
                      }

                      hourinitial = moment(hourinitial, "HH:mm");

                      var hourfinal = valueshifts.end.toString().split("");
                      if (hourfinal.length === 2) {
                        hourfinal = "00" + hourfinal[0] + hourfinal[1];
                      } else if (hourfinal.length === 4) {
                        hourfinal = valueshifts.end.toString();
                      } else {
                        hourfinal =
                          "0" + hourfinal[0] + hourfinal[1] + hourfinal[2];
                      }

                      hourfinal = moment(hourfinal, "HH:mm");
                      var hourinit = valueshifts.init.toString().split("");

                      if (hourinit.length === 2) {
                        hourinit = "00";
                      } else if (hourinit.length === 4) {
                        hourinit = hourinit[0] + hourinit[1] + "00";
                      } else {
                        hourinit = hourinit[0] + "00";
                      }

                      hourinit = parseInt(hourinit);
                      min = hourfinal.diff(hourinitial, "minutes");

                      var lengthTime = moment.duration(
                        hourfinal.diff(hourinitial)
                      );
                      var hours = parseInt(lengthTime.asHours());
                      var minutes = parseInt(lengthTime.asMinutes()) % 60;
                      var duration = hours >= 1 ? 60 : minutes;
                      var totalSpaces = min === 0 ? 0 : 1;

                      if (min > 0 && hours < 1) {
                        totalSpaces = duration / min;
                      } else if (hours >= 1) {
                        totalSpaces = duration / min;
                      }
                      var index = _.findIndex(
                        vm.listhoursformatdiurnal,
                        function (o) {
                          return o.time === valueshifts.init;
                        }
                      );
                      if (index === -1) {
                        index = _.findIndex(
                          vm.listhoursformatdiurnal,
                          function (o) {
                            return o.time >= valueshifts.init - 100;
                          }
                        );
                      }
                      if (index >= 0) {
                        var marginend = 0;
                        if (
                          valueshifts.end <
                          vm.listhoursformatdiurnal[index].time
                        ) {
                          if (
                            vm.listhoursformatdiurnal[index].time + min >
                              valueshifts.end &&
                            min > 0
                          ) {
                            marginend =
                              vm.listhoursformatdiurnal[index].time +
                              min -
                              valueshifts.end;
                            marginend = (widthelement * marginend) / min;
                          }
                        }

                        var margininit = 0;

                        if (
                          vm.listhoursformatdiurnal[index].time >
                            valueshifts.init &&
                          min > 0
                        ) {
                          var initialtime = vm.listhoursformatdiurnal[
                            index
                          ].time
                            .toString()
                            .split("");
                          if (initialtime.length === 2) {
                            initialtime =
                              "00" + initialtime[0] + initialtime[1];
                          } else if (initialtime.length === 4) {
                            initialtime =
                              vm.listhoursformatdiurnal[index].time.toString();
                          } else {
                            initialtime =
                              "0" +
                              initialtime[0] +
                              initialtime[1] +
                              initialtime[2];
                          }

                          initialtime = moment(initialtime, "HH:mm");
                          var difftime = moment.duration(
                            initialtime.diff(hourinitial)
                          );
                          var hoursmargininit = parseInt(difftime.asHours());
                          var minutesmargininit =
                            parseInt(difftime.asMinutes()) % 60;
                          var durationmargininit =
                            hoursmargininit >= 1 ? 60 : minutesmargininit;
                          margininit =
                            (widthelement * durationmargininit) / min;
                        }

                        var calcule =
                          valueshifts.init -
                          vm.listhoursformatdiurnal[index].time;
                        var calculemargingleft =
                          calcule >= 15 && calcule < 30
                            ? 60
                            : calcule >= 30 && calcule < 45
                            ? 120
                            : calcule >= 45 && calcule < 60
                            ? 180
                            : 0;
                        valueshifts.widthshift = min * 4 + "px";
                        valueshifts.marginshift =
                          index +
                          widthelement * index -
                          margininit +
                          calculemargingleft +
                          "px";
                        valueshifts.hourstext =
                          vm.formathours(valueshifts.init) +
                          " - " +
                          vm.formathours(valueshifts.end);
                        valueshifts.textinit = vm.formathours(valueshifts.init);
                        valueshifts.textend = vm.formathours(valueshifts.end);
                        valueshifts.zindexshift =
                          value.shifts.length - keyshifts;
                        value.totalshifts =
                          value.totalshifts + valueshifts.quantity;
                        value.totalshiftsassigment =
                          value.totalshiftsassigment +
                          (valueshifts.quantity - valueshifts.amount);
                        value.disableduser =
                          value.totalshiftsassigment === 0 ? false : true;
                      }
                    });
                  }
                  if (value.shiftsnight.length > 0) {
                    value.shiftsnight.forEach(function (
                      valueshifts,
                      keyshifts
                    ) {
                      var min = 0;
                      valueshifts.init =
                        valueshifts.init.toString().length === 2
                          ? "00" + valueshifts.init
                          : valueshifts.init;
                      valueshifts.end =
                        valueshifts.end.toString().length === 2
                          ? "00" + valueshifts.end
                          : valueshifts.end;
                      var widthelement = angular
                        .element(document.querySelectorAll(".th-subheader")[0])
                        .width();

                      var hourinitial = valueshifts.init.toString().split("");
                      if (hourinitial.length === 2) {
                        hourinitial = "00" + hourinitial[0] + hourinitial[1];
                      } else if (hourinitial.length === 4) {
                        hourinitial = valueshifts.init.toString();
                      } else {
                        hourinitial =
                          "0" +
                          hourinitial[0] +
                          hourinitial[1] +
                          hourinitial[2];
                      }

                      hourinitial = moment(hourinitial, "HH:mm");

                      var hourfinal = valueshifts.end.toString().split("");
                      if (hourfinal.length === 2) {
                        hourfinal = "00" + hourfinal[0] + hourfinal[1];
                      } else if (hourfinal.length === 4) {
                        hourfinal = valueshifts.end.toString();
                      } else {
                        hourfinal =
                          "0" + hourfinal[0] + hourfinal[1] + hourfinal[2];
                      }

                      hourfinal = moment(hourfinal, "HH:mm");
                      var hourinit = valueshifts.init.toString().split("");

                      if (hourinit.length === 2) {
                        hourinit = "00";
                      } else if (hourinit.length === 4) {
                        hourinit = hourinit[0] + hourinit[1] + "00";
                      } else {
                        hourinit = hourinit[0] + "00";
                      }

                      hourinit = parseInt(hourinit);
                      min = hourfinal.diff(hourinitial, "minutes");

                      var lengthTime = moment.duration(
                        hourfinal.diff(hourinitial)
                      );
                      var hours = parseInt(lengthTime.asHours());
                      var minutes = parseInt(lengthTime.asMinutes()) % 60;
                      var duration = hours >= 1 ? 60 : minutes;
                      var totalSpaces = min === 0 ? 0 : 1;

                      if (min > 0 && hours < 1) {
                        totalSpaces = duration / min;
                      } else if (hours >= 1) {
                        totalSpaces = duration / min;
                      }
                      var index = _.findIndex(
                        vm.listhoursformatnight,
                        function (o) {
                          return o.time === valueshifts.init;
                        }
                      );
                      if (index === -1) {
                        index = _.findIndex(
                          vm.listhoursformatnight,
                          function (o) {
                            return o.time >= valueshifts.init - 100;
                          }
                        );
                      }
                      if (index >= 0) {
                        var marginend = 0;
                        if (
                          valueshifts.end < vm.listhoursformatnight[index].time
                        ) {
                          if (
                            vm.listhoursformatnight[index].time + min >
                              valueshifts.end &&
                            min > 0
                          ) {
                            marginend =
                              vm.listhoursformatnight[index].time +
                              min -
                              valueshifts.end;
                            marginend = (widthelement * marginend) / min;
                          }
                        }

                        var margininit = 0;

                        if (
                          vm.listhoursformatnight[index].time >
                            valueshifts.init &&
                          min > 0
                        ) {
                          var initialtime = vm.listhoursformatnight[index].time
                            .toString()
                            .split("");
                          if (initialtime.length === 2) {
                            initialtime =
                              "00" + initialtime[0] + initialtime[1];
                          } else if (initialtime.length === 4) {
                            initialtime =
                              vm.listhoursformatnight[index].time.toString();
                          } else {
                            initialtime =
                              "0" +
                              initialtime[0] +
                              initialtime[1] +
                              initialtime[2];
                          }

                          initialtime = moment(initialtime, "HH:mm");
                          var difftime = moment.duration(
                            initialtime.diff(hourinitial)
                          );
                          var hoursmargininit = parseInt(difftime.asHours());
                          var minutesmargininit =
                            parseInt(difftime.asMinutes()) % 60;
                          var durationmargininit =
                            hoursmargininit >= 1 ? 60 : minutesmargininit;
                          margininit =
                            (widthelement * durationmargininit) / min;
                        }

                        var calcule =
                          valueshifts.init -
                          vm.listhoursformatnight[index].time;
                        var calculemargingleft =
                          calcule >= 15 && calcule < 30
                            ? 60
                            : calcule >= 30 && calcule < 45
                            ? 120
                            : calcule >= 45 && calcule < 60
                            ? 180
                            : 0;
                        valueshifts.widthshift = min * 4 + "px";
                        valueshifts.marginshift =
                          index +
                          widthelement * index -
                          margininit +
                          calculemargingleft +
                          "px";
                        valueshifts.hourstext =
                          vm.formathours(valueshifts.init) +
                          " - " +
                          vm.formathours(valueshifts.end);
                        valueshifts.textinit = vm.formathours(valueshifts.init);
                        valueshifts.textend = vm.formathours(valueshifts.end);
                        valueshifts.zindexshift =
                          value.shifts.length - keyshifts;
                        value.totalshifts =
                          value.totalshifts + valueshifts.quantity;
                        value.totalshiftsassigment =
                          value.totalshiftsassigment +
                          (valueshifts.quantity - valueshifts.amount);
                        value.disableduser =
                          value.totalshiftsassigment === 0 ? false : true;
                      }
                    });
                  }
                });
                vm.loadingdata = false;
              }
              vm.loadingdata = false;
            },
            function (error) {
              vm.modalError(error);
              vm.loadingdata = false;
            }
          );
      }
    }
    vm.moverightdiurnal = moverightdiurnal;
    function moverightdiurnal() {
      var contenedor = document.getElementById("diurnal");
      contenedor.scrollLeft = contenedor.scrollLeft + 100;
    }
    vm.moveleftdiurnal = moveleftdiurnal;
    function moveleftdiurnal() {
      var contenedor = document.getElementById("diurnal");
      contenedor.scrollLeft = contenedor.scrollLeft - 100;
    }

    vm.moverightnight = moverightnight;
    function moverightnight() {
      var contenedor = document.getElementById("night");
      contenedor.scrollLeft = contenedor.scrollLeft + 100;
    }
    vm.moveleftnight = moveleftnight;
    function moveleftnight() {
      var contenedor = document.getElementById("night");
      contenedor.scrollLeft = contenedor.scrollLeft - 100;
    }

    function eventEdit() {
      vm.saveedit = true;
      vm.openSearch = false;
      vm.deleteTests = [];
      vm.listDataTest[1] = [];
      vm.statecomment = 2;
      vm.statediagnostic = 2;
      vm.inconsistency = false;

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

    function eventCancel() {
      vm.loadingdata = true;
      vm.Comment = "";
      vm.motive = { id: -1 };
      if (vm.listMotivescancellation.length === 0) {
        vm.loadingdata = false;
        logger.error("Debe crear motivos de cancelación");
      } else {
        UIkit.modal("#deletemodal").show();
      }
    }

    function eventConfirmCancel() {
      vm.loadingmodalConfirmCancel = true;
      var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
      vm.typeappointment = 3;
      var dateorder = moment(
        vm.orderDemosValues[vm.staticDemoIds["orderDate"]],
        vm.formatDate.toUpperCase() + " HH:mm"
      );
      var createdDateShort = dateorder.format("YYYYMMDD");
      vm.dateappointment = createdDateShort;
      vm.detailAppointment.reason = {
        id: vm.motive.id,
        name: vm.motive.name,
        description: vm.Comment,
      };

      var deletedata = {
        orderNumber: order,
        createdDateShort: createdDateShort,
        appointment: vm.detailAppointment,
      };
      vm.testemailappointment = vm.appoimentTest;
      vm.horary = {
        hourstext:
          vm.formathours(vm.detailAppointment.shift.init) +
          " - " +
          vm.formathours(vm.detailAppointment.shift.end),
      };

      appointmentDS.cancelAppointment(auth.authToken, deletedata).then(
        function (data) {
          if (data.status === 200) {
            vm.loadingmodalConfirmCancel = false;
            //La orden ha sido cancelada

            vm.sendEmailPatient(
              vm.orderDemosValues[vm.staticDemoIds["orderDB"]]
            );
            UIkit.modal("#modalConfirmCancel").hide();
            logger.success(
              $filter("translate")("1143").replace("@@@@", vm.order)
            );
          }
        },
        function (error) {
          vm.loadingmodalConfirmCancel = false;
          vm.modalError(error);
        }
      );
    }

    vm.assigneappoinment=assigneappoinment;
    function assigneappoinment(data) {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        appointmentDS.NumberOfAssignedPeople(auth.authToken, data).then(
          function (data) {
            if (data.status === 200) {
            }
          },
          function (error) {
            vm.modalError(error);
          }
        );
    }

    function eventScheduleAppointment() {
      if (vm.samplepoint) {
        vm.loadingmodalscheduleAppointment = true;
        var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var asignetakesample = {
          'orderNumber': order,
          'id': vm.points.id
        };
        vm.assigneappoinment(asignetakesample);
        var data = {
          orderNumber: order,
        };
        appointmentDS.changeappointment(auth.authToken, data).then(
          function (data) {
            if (data.status === 200) {
              vm.loadingmodalscheduleAppointment = false;              //La orden ha sido cancelada
              eventUndo();
              UIkit.modal("#modalConfirmscheduleAppointment").hide();
              logger.success(
                "La cita @@@@ a sido tranferida al modulo de ingreso de ordenes ".replace(
                  "@@@@",
                  vm.order
                )
              );
            }
          },
          function (error) {
            vm.loadingmodalscheduleAppointment = false;
            vm.modalError(error);
          }
        );
      }
      else if (
        vm.serviceEntrySiga === 1 &&
        vm.turnfilter &&
        vm.activesigaorder === 1 &&
        vm.dataviewsiga
      ) {
        vm.loadingmodalscheduleAppointment = true;
        vm.loading = true;
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
        };

        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return sigaDS.cancelturn(auth.authToken, dataend).then(
          function (data) {
            if (data.status === 200) {
              var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
              var data = {
                orderNumber: order,
              };
              appointmentDS.changeappointment(auth.authToken, data).then(
                function (data) {
                  if (data.status === 200) {
                    vm.loadingmodalscheduleAppointment = false;
                    $rootScope.dataturn = null;
                    localStorageService.remove("turn");
                    vm.refreshdashboard = true;
                    //La orden ha sido cancelada
                    vm.eventUndo();
                    UIkit.modal("#modalConfirmscheduleAppointment").hide();
                    logger.success(
                      "La cita @@@@ a sido tranferida al modulo de ingreso de ordenes ".replace(
                        "@@@@",
                        vm.order
                      )
                    );
                  }
                },
                function (error) {
                  vm.loadingmodalscheduleAppointment = false;
                  vm.modalError(error);
                }
              );
            }
            vm.loading = false;
          },
          function (error) {
            vm.loading = false;
            vm.modalError(error);
          }
        );
      } else {
        vm.loadingmodalscheduleAppointment = true;
        var order = vm.orderDemosValues[vm.staticDemoIds["orderDB"]];
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        var data = {
          orderNumber: order,
        };

        appointmentDS.changeappointment(auth.authToken, data).then(
          function (data) {
            if (data.status === 200) {
              vm.loadingmodalscheduleAppointment = false;
              //La orden ha sido cancelada
              eventUndo();
              UIkit.modal("#modalConfirmscheduleAppointment").hide();
              logger.success(
                "La cita @@@@ a sido tranferida al modulo de ingreso de ordenes ".replace(
                  "@@@@",
                  vm.order
                )
              );
            }
          },
          function (error) {
            vm.loadingmodalscheduleAppointment = false;
            vm.modalError(error);
          }
        );
      }
    }

    /**
     * Evento de Deshacer
     */
    function eventUndo() {
      vm.appoinmentpatient = {};
      vm.loadingdata = true;
      if (vm.orderDemosValues[-107] === "") {
        var auth = localStorageService.get("Enterprise_NT.authorizationData");
        return appointmentDS
          .deleteconcurrencebyId(auth.authToken, vm.concurrence.idConcurrence)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.blockbilling = false;
                vm.blockservice = false;
                vm.permissioncancel = false;
                vm.ordercomment = "";
                vm.patientcoment = "";
                vm.saveedit = false;
                vm.statecomment = 1;
                vm.statediagnostic = 1;
                vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
                vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
                vm.patientDemosDisabled = disabledAllDemo(
                  vm.patientDemosDisabled,
                  true
                );
                vm.patientDemosDisabled.photo = false;
                vm.orderDemosDisabled = disabledAllDemo(
                  vm.orderDemosDisabled,
                  true
                );
                //Logica de Botones
                vm.newDisabled = false;
                vm.editDisabled = true;
                vm.cancelDisabled = true;
                vm.scheduleAppointment = true;
                vm.saveDisabled = true;
                vm.undoDisabled = true;
                vm.dailyDisabled = false;
                vm.searchDisabled = false;
                vm.barcodesDisabled = true;
                vm.requirementDisabled = false;
                vm.viewphoto = false;
                vm.hasCashbox = false;
                vm.ticketDisabled = true;
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
                vm.packageTracking = [];
                vm.orderDemosValues[vm.staticDemoIds["orderDB"]] == null;
                vm.patientDemosValues[vm.staticDemoIds["patientDB"]] == null;
                vm.orderDemosValues[-5] = vm.branch;
                if (vm.orderTypeInit.toString() !== "0") {
                  vm.orderDemosValues[-4] = vm.orderTypeDefault;
                }
                vm.loadingdata = false;
              }
            },
            function (error) {
              vm.loadingdata = false;
              vm.modalError(error);
            }
          );
      } else {
        vm.blockbilling = false;
        vm.blockservice = false;
        vm.permissioncancel = false;
        vm.ordercomment = "";
        vm.patientcoment = "";
        vm.saveedit = false;
        vm.statecomment = 1;
        vm.statediagnostic = 1;
        vm.patientDemosValues = cleanAllDemos(vm.patientDemosValues);
        vm.orderDemosValues = cleanAllDemos(vm.orderDemosValues);
        vm.patientDemosDisabled = disabledAllDemo(
          vm.patientDemosDisabled,
          true
        );
        vm.patientDemosDisabled.photo = false;
        vm.orderDemosDisabled = disabledAllDemo(vm.orderDemosDisabled, true);
        //Logica de Botones
        vm.newDisabled = false;
        vm.editDisabled = true;
        vm.cancelDisabled = true;
        vm.scheduleAppointment = true;
        vm.saveDisabled = true;
        vm.undoDisabled = true;
        vm.ticketDisabled = true;
        vm.dailyDisabled = false;
        vm.searchDisabled = false;
        vm.barcodesDisabled = true;
        vm.requirementDisabled = false;
        vm.viewphoto = false;
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
        vm.packageTracking = [];
        vm.orderDemosValues[vm.staticDemoIds["orderDB"]] == null;
        vm.patientDemosValues[vm.staticDemoIds["patientDB"]] == null;
        vm.orderDemosValues[-5] = vm.branch;
        if (vm.orderTypeInit.toString() !== "0") {
          vm.orderDemosValues[-4] = vm.orderTypeDefault;
        }
        vm.loadingdata = false;
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
        return reportadicional.testServerPrint(vm.UrlNodeJs).then(
          function (data) {
            if (data.status === 200) {
              vm.printlabels();
            }
          },
          function (error) {
            vm.message = $filter("translate")("1085");
            UIkit.modal("#logNoData").show();
            vm.loadingdata = false;
          }
        );
      }
    }
    function getProcessPrint() {
      var samples = [];
      if (vm.previewStickersOrder.length > 0) {
        vm.totalCanStickers = 0;
        vm.previewStickersOrder = _.filter(
          vm.previewStickersOrder,
          function (o) {
            return o.cansticker > 0;
          }
        );
        vm.previewStickersOrder.forEach(function (value) {
          samples.push({
            idSample: value.idSample,
            quantity: parseInt(value.cansticker),
          });
          vm.totalCanStickers += parseInt(value.cansticker);
        });
        vm.printbarcode.ordersprint = [{}];
        vm.progressPrint = false;
        vm.printbarcode.samples = samples;
        vm.directImpression();
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
    function setPackageTracking(tracking) {
      if (tracking !== undefined && tracking !== null) {
        if (Object.keys(tracking).length > 0) {
          Object.keys(tracking).forEach(function (value, key) {
            var find = _.filter(vm.packageTracking, function (o) {
              return o.idPackage === value;
            });
            if (find.length === 0) {
              var idChilds = _.map(
                _.filter(tracking[value].childs, function (o) {
                  return o.selected;
                }),
                "id"
              );
              vm.packageTracking.push({
                idPackage: value,
                idChilds: idChilds.length > 0 ? idChilds.join(",") : "",
                partial:
                  tracking[value].allchilds === null ||
                  tracking[value].allchilds === undefined
                    ? 0
                    : tracking[value].allchilds
                    ? 1
                    : 0,
              });
            }
          });
        }
      }
    }

    function packagesInsertEvent(list) {
      vm.listTestsByDemographics = [];
      vm.setPackageTracking(list);
      if (Object.keys(list).length > 0) {
        vm.loadingdata = true;
        var tests = [];
        Object.keys(list).forEach(function (value, key) {
          if (list[value].allchilds) {
            tests.push(parseInt(value));
          } else {
            var idtests = _.map(
              _.filter(list[value].childs, function (o) {
                return o.selected;
              }),
              "id"
            );
            if (idtests.length > 0) {
              idtests.forEach(function (val) {
                tests.push(val);
              });
            }
          }
        });
        if (tests.length > 0) {
          tests = vm.orderTestByDemographics(_.uniq(tests));
          if (tests.length > 0) {
            vm.listTestsByDemographics = tests;
          }
        }
        vm.loadingdata = false;
      }
    }

    function orderSearchEvent(order) {
      vm.order = order;
      vm.ordercomment = order;
      vm.loadOrder(vm.order);
    }
    function eventSearch() {
      vm.saveedit = false;
      vm.showModalSearch = true;
    }
    function eventDailySearch() {
      vm.saveedit = false;
      vm.showModalDailySearch = true;
    }

    vm.eventDailappoinment = eventDailappoinment;
    function eventDailappoinment() {
      vm.saveedit = false;
      vm.showModalDailyAppoinment = true;
    }

    function eventRequirement() {
      vm.showModalRequirement = true;
    }
    function eventProfileInfo() {
      vm.showModalProfileInfo = true;
    }
    function eventValidityResult(test) {
      vm.resultValidity = {
        photo:
          "data:image/png;base64," + test.resultValidity.userLastResult.photo,
        lastName: test.resultValidity.userLastResult.lastName,
        name: test.resultValidity.userLastResult.name,
        dateLastResult: moment(test.resultValidity.dateLastResult).format(
          vm.formatDate.toUpperCase() + " HH:mm"
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
      vm.packageTracking = [];
      vm.samples = [];
      vm.deleteTests = [];
      vm.demographicsBarcode = [];
      vm.blockbilling = false;
      vm.permissioncancel = false;
      vm.permit = true;
      appointmentDS.getAppointment(auth.authToken, order).then(
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
            vm.dataorderrescheduling = response.data;
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

    function setdataorder(order, recalled) {
      $rootScope.appointmentday = moment(
        order.appointment.date.toString()
      ).format(vm.formatDate.toUpperCase());
      $rootScope.appointment =
        vm.formathours(order.appointment.shift.init) +
        " - " +
        vm.formathours(order.appointment.shift.end);
      vm.invoiceDisabled = false;
      vm.cashreceiptDisabled = false;
      vm.hasCashbox = false;
      vm.loadingdata = false;
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
          vm.formatDateAge
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
        vm.formatDate.toUpperCase()
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
      vm.externalId = orderB.externalId;
      orderDemosValues[vm.staticDemoIds["orderDB"]] =
        recalled === undefined ? orderB.orderNumber : "";
      orderDemosValues[vm.staticDemoIds["order"]] =
        recalled === undefined ? orderB.orderNumber : ""; //Number(('' + orderB.orderNumber).substring(4));
      orderDemosValues[vm.staticDemoIds["orderDate"]] =
        recalled === undefined
          ? moment(orderB.createdDate).format(
              vm.formatDate.toUpperCase() + " HH:mm"
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

      if (orderB.auxiliaryPhysicians !== undefined) {
        if (vm.isAuxPhysicians && orderB.auxiliaryPhysicians.length !== 0) {
          var indexes = [-201, -202, -203, -204, -205];
          var cont = 0;
          var t = 0;
          for (var i = 0; i < vm.totalAuxPhysicians; i++) {
            if (
              orderB.auxiliaryPhysicians[t].idDemoAux !== undefined &&
              orderB.auxiliaryPhysicians[t].idDemoAux !== 0 &&
              orderB.auxiliaryPhysicians[t].idDemoAux !== null &&
              orderB.auxiliaryPhysicians[t].idDemoAux !== ""
            ) {
              if (indexes[cont] === orderB.auxiliaryPhysicians[t].idDemoAux) {
                orderDemosValues[orderB.auxiliaryPhysicians[t].idDemoAux] = {
                  id: orderB.auxiliaryPhysicians[t].id,
                  code: orderB.auxiliaryPhysicians[t].code,
                  name: orderB.auxiliaryPhysicians[t].name,
                  showValue:
                    orderB.auxiliaryPhysicians[t].id === undefined
                      ? ""
                      : orderB.auxiliaryPhysicians[t].code +
                        ". " +
                        orderB.auxiliaryPhysicians[t].name,
                };
                if (orderB.auxiliaryPhysicians.length !== t + 1) {
                  t++;
                }
                cont++;
              } else {
                orderDemosValues[indexes[cont]] = "";
                cont++;
              }
            } else {
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
        } else {
          orderDemosValues[vm.staticDemoIds.physician1] = "";
          orderDemosValues[vm.staticDemoIds.physician2] = "";
          orderDemosValues[vm.staticDemoIds.physician3] = "";
          orderDemosValues[vm.staticDemoIds.physician4] = "";
          orderDemosValues[vm.staticDemoIds.physician5] = "";
        }
      } else {
        orderDemosValues[vm.staticDemoIds.physician1] = "";
        orderDemosValues[vm.staticDemoIds.physician2] = "";
        orderDemosValues[vm.staticDemoIds.physician3] = "";
        orderDemosValues[vm.staticDemoIds.physician4] = "";
        orderDemosValues[vm.staticDemoIds.physician5] = "";
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
              : null,
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
                : null
              : null,
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
      vm.detailAppointment = orderB.appointment;
      vm.selectedTest = selectedTest;
      vm.appoimentTest = _.clone(selectedTest);
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
        vm.scheduleAppointment = true;
        vm.saveDisabled = false;
        vm.undoDisabled = false;
        vm.ticketDisabled = true;
        vm.dailyDisabled = true;
        vm.searchDisabled = true;
        vm.barcodesDisabled = true;
      } else {
        vm.newDisabled = false;
        vm.editDisabled = false;
        vm.cancelDisabled = false;
        vm.scheduleAppointment = false;
        vm.saveDisabled = true;
        vm.ticketDisabled = false;
        vm.undoDisabled = true;
        vm.dailyDisabled = false;
        vm.searchDisabled = false;
        vm.barcodesDisabled = false;
        vm.requirementDisabled = false;
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

      vm.patientDemosDisabled = disabledAllDemo(
        vm.patientDemosDisabled,
        !vm.managehistoryauto
      );
      vm.patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, false);
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

      //Limpia los examenes
      vm.selectedTest = [];
      vm.samples = [];
      vm.deleteTests = [];
      vm.packageTracking = [];
      //Adjuntos
      vm.patient = {};
      vm.commentOrder = "";
      vm.ordercomment = "";

      //Limpia el formulario de los indicadores de obligatorios
      vm.patientDemos.forEach(function (demo, index) {
        demo.showRequired = false;
        if (demo.encoded && demo.viewdefault) {
          vm.patientDemosValues[demo.id] = demo.itemsdefault;
        }
        if (demo.promiseTime) {
          vm.patientDemosValues[demo.id] = new Date();
        }
      });
      vm.orderDemos.forEach(function (demo, index) {
        demo.showRequired = false;
        if (demo.encoded && demo.viewdefault) {
          vm.orderDemosValues[demo.id] = demo.itemsdefault;
        }
        if (demo.promiseTime) {
          vm.orderDemosValues[demo.id] = new Date();
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
      if (
        vm.servicedefault !== null &&
        vm.servicedefault !== "" &&
        vm.servicedefault !== "0" &&
        vm.manageService
      ) {
        var data = _.filter(
          JSON.parse(JSON.stringify(vm.orderDemos)),
          function (o) {
            o.items = _.filter(o.items, function (p) {
              return p.id === parseInt(vm.servicedefault);
            });
            return o.items.length > 0 && o.id === -6;
          }
        );
        vm.orderDemosValues[-6] = data[0].items[0];
      }
      if (vm.orderTypeInit.toString() !== "0") {
        vm.orderDemosValues[-4] = vm.orderTypeDefault;
      }

      //Logica de Botones
      vm.newDisabled = true;
      vm.editDisabled = true;
      vm.cancelDisabled = true;
      vm.scheduleAppointment = true;
      vm.saveDisabled = false;
      vm.undoDisabled = false;
      vm.dailyDisabled = true;
      vm.ticketDisabled = true;
      vm.searchDisabled = true;
      vm.barcodesDisabled = true;
      vm.patient = {};
      //Habilita el combo de examenes
      vm.disabledTests = false;
      vm.viewphoto = true;
      vm.loading = false;
      vm.comparepatient = JSON.parse(JSON.stringify(vm.patientDemosValues));
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
                    if (demo.format === "") {
                      var format = vm.formatDate.toUpperCase();
                    } else {
                      var format = demo.format.replace("yyyy", "YYYY");
                      format = format.replace("dd", "DD");
                    }
                    var demodate = moment(
                      vm.patientDemosValues[demo.id]
                    ).format(format);
                    if (!moment(demodate).isValid()) {
                      vm.patientDemosValues[demo.id] = moment().format(format);
                    } else {
                      vm.patientDemosValues[demo.id] = moment(
                        vm.patientDemosValues[demo.id]
                      ).format(format);
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
      patient.demographics = patientDemographics;
      patient.id = patient.id === undefined ? vm.patient.id : patient.id;
      return patient;
    }
    /**
     * Obtiene los datos de la orden del formulario
     */
    function getOrderData() {
      var order = {};
      var orderDemographics = [];
      order.createdDateShort = parseInt(moment(vm.date).format("YYYYMMDD"));
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
                if (demo.format === "") {
                  var format = vm.formatDate.toUpperCase();
                } else {
                  var format = demo.format.replace("yyyy", "YYYY");
                  format = format.replace("dd", "DD");
                }
                var demodate = moment(vm.orderDemosValues[demo.id]).format(
                  format
                );
                if (!moment(demodate).isValid()) {
                  vm.orderDemosValues[demo.id] = moment().format(format);
                } else {
                  vm.orderDemosValues[demo.id] = moment(
                    vm.orderDemosValues[demo.id]
                  ).format(format);
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
              idDemoAux: value.idDemographic,
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
      order.appointment = vm.concurrence;
      order.hasAppointment = 1;
      // vm.demographics = _.union(vm.patient.demographics, vm.order.demographics);
      return order;
    }

    function insertPackageTracking(response) {
      var tests = vm.listDataTest[0];
      for (var i = vm.packageTracking.length - 1; i >= 0; i--) {
        if (vm.packageTracking[i].partial === 1) {
          var find = _.filter(tests, function (o) {
            return o.id === parseInt(vm.packageTracking[i].idPackage);
          });
          if (find.length === 0) {
            vm.packageTracking.splice(i, 1);
          } else {
            vm.packageTracking[i].order = response.orderNumber;
          }
        } else if (vm.packageTracking[i].partial === 0) {
          if (vm.packageTracking[i].idChilds !== "") {
            var idsChilds = vm.packageTracking[i].idChilds.split(",");
            if (idsChilds.length > 0) {
              for (var j = idsChilds.length - 1; j >= 0; j--) {
                var findChild = _.filter(tests, function (o) {
                  return o.id === parseInt(idsChilds[j]);
                });
                if (findChild.length === 0) {
                  idsChilds.splice(j, 1);
                }
              }
              if (idsChilds.length === 0) {
                vm.packageTracking.splice(i, 1);
              } else {
                vm.packageTracking[i].idChilds = idsChilds.join(",");
                vm.packageTracking[i].order = response.orderNumber;
              }
            }
          } else {
            vm.packageTracking.splice(i, 1);
          }
        }
      }

      if (vm.packageTracking.length > 0) {
        vm.loading = true;
        return orderDS
          .insertPackageTracking(auth.authToken, vm.packageTracking)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.loading = false;
                vm.packageTracking = [];
              }
            },
            function (error) {
              vm.loading = true;
              vm.modalError(error);
            }
          );
      }
    }

    /**
     * Se ejecuta despues de guardada o modificada la orden
     * @param {*} response Objeto de respuesta enviado desde el servidor
     */
    function afterSaveOrder(response, insert) {
      vm.searchByDate();
      // vm.insertPackageTracking(response);
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
      vm.scheduleAppointment = false;
      vm.saveDisabled = true;
      vm.undoDisabled = true;
      vm.dailyDisabled = false;
      vm.searchDisabled = false;
      vm.ticketDisabled = false;
      vm.barcodesDisabled = false;
      vm.requirementDisabled = false;
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
          vm.formatDateAge
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
      vm.patientcoment = response.patient.id;
      vm.ordercomment = response.orderNumber;
      vm.statecomment = 4;
      vm.statediagnostic = 4;
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
        now: moment().format(vm.formatDate.toUpperCase() + " hh:mm:ss a."),
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
        /* cita */
        vm.tomorrow = new Date();
        vm.tomorrow.setDate(vm.tomorrow.getDate());
        var today = new Date();
        vm.date = vm.tomorrow;
        if ($filter("translate")("0000") === "es") {
          kendo.culture("es-ES");
        }
        vm.birthdays = [new Date(today.getFullYear(), today.getMonth(), 29)];
        vm.monthSelectorOptions = {
          dates: vm.birthdays,
        };

        vm.RangoInicialCitas =
          localStorageService.get("HorarioInicialCitas") === ""
            ? "00:00"
            : localStorageService.get("HorarioInicialCitas");
        vm.RangoFinalCitas =
          localStorageService.get("HorarioFinalCitas") === ""
            ? "23:00"
            : localStorageService.get("HorarioFinalCitas");

        vm.listhoursformat = [];
        vm.listhours = [];

        vm.listhoursformatdiurnal = [];
        vm.listhoursdiurnal = [];

        vm.listhoursformatnight = [];
        vm.listhoursnight = [];

        var validhoursinit = vm.RangoInicialCitas.split(":");
        if (validhoursinit[1] === "30") {
          vm.RangoInicialCitas = validhoursinit[0] + ":00";
        }

        var validhoursend = vm.RangoFinalCitas.split(":");
        if (validhoursend[0] === "30") {
          vm.RangoFinalCitas = parseInt(validhoursinit[1]) + 1 + ":00";
        }

        var hourinit = parseInt(vm.RangoInicialCitas.replace(":", ""));
        var hourend = parseInt(vm.RangoFinalCitas.replace(":", ""));
        var index = (hourend - hourinit) / 100;

        for (var i = 0; i <= index; i++) {
          var hour = hourinit + i * 100;
          var end = hourinit + i * 100 + 59;
          var shifts = _.filter(vm.shifts, function (o) {
            return o.init >= hour && o.end < end;
          });
          if (shifts.length === 0) {
            shifts = _.filter(vm.shifts, function (o) {
              return o.init >= hour && o.init < end;
            });
          }
          vm.min = 0;
          if (shifts.length > 0) {
            vm.min = _.min(
              _.map(shifts, function (value) {
                return value.end - value.init >= 60
                  ? end + 1 - value.init
                  : value.end - value.init;
              })
            );
            while (60 % vm.min !== 0) {
              vm.min++;
            }
          }
          if (hour < 1300) {
            vm.listhoursformatdiurnal.push({
              hour: moment(
                moment(localStorageService.get("HorarioInicialCitas"), "HH:mm")
              )
                .add(i, "hours")
                .format("HH:mm"),
              time: hour,
            });

            if (vm.min !== null && vm.min !== undefined && vm.min > 0) {
              for (var j = vm.min; j < 60; j = j + vm.min) {
                vm.listhoursformatdiurnal.push({
                  hour: moment(
                    moment(
                      localStorageService.get("HorarioInicialCitas"),
                      "HH:mm"
                    )
                  )
                    .add(i, "hours")
                    .add(j, "minutes")
                    .format("HH:mm"),
                  time: hour + j,
                });
              }
            }
            vm.listhoursdiurnal[i] = {
              hour: hour,
              end: end,
              minute: new Array(60),
              index: index - i,
            };
          } else {
            vm.listhoursformatnight.push({
              hour: moment(
                moment(localStorageService.get("HorarioInicialCitas"), "HH:mm")
              )
                .add(i, "hours")
                .format("HH:mm"),
              time: hour,
            });
            if (vm.min !== null && vm.min !== undefined && vm.min > 0) {
              for (var j = vm.min; j < 60; j = j + vm.min) {
                vm.listhoursformatnight.push({
                  hour: moment(
                    moment(
                      localStorageService.get("HorarioInicialCitas"),
                      "HH:mm"
                    )
                  )
                    .add(i, "hours")
                    .add(j, "minutes")
                    .format("HH:mm"),
                  time: hour + j,
                });
              }
            }
            vm.listhoursnight[i] = {
              hour: hour,
              end: end,
              minute: new Array(60),
              index: index - i,
            };
          }
        }

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
        vm.samplepoint =
          localStorageService.get("Manejodepuntodetomamuestra") === "True";
        vm.manageBranch = localStorageService.get("TrabajoPorSede") === "True";
        vm.manageService = localStorageService.get("ManejoServicio") === "True";
        vm.manageAccount = localStorageService.get("ManejoCliente") === "True";
        vm.customerdefault = localStorageService.get("clientePorDefecto");

        vm.servicedefault = localStorageService.get("CitaServicio");

        vm.manageRate = localStorageService.get("ManejoTarifa") === "True";

        vm.managePhysician = localStorageService.get("ManejoMedico") === "True";
        vm.manageDiagnostics =
          localStorageService.get("Diagnostics") === "True";
        vm.abbrCustomer = localStorageService.get("Abreviatura");
        vm.nameCustomer = localStorageService.get("Entidad");
        vm.taxConfig = Number(localStorageService.get("Impuesto"));
        vm.maxDaysEditOrder = Number(
          localStorageService.get("DiasMaximoModificarOrden")
        );
        vm.orderTypeInit = localStorageService.get("CitaTipodeorden");
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
        vm.appoinmentpatient = {};
        vm.ItemNoRightValidator = localStorageService.get(
          "ITemNoDerechoValidador"
        );
        vm.init();
      }
    }
    function init() {
      vm.saveedit = false;
      if (localStorageService.get("turn") !== undefined) {
        $rootScope.dataturn = localStorageService.get("turn");
      }
      vm.searchByDate();
      vm.loadDemographicControls();
      vm.getshift();
      if (localStorageService.get("ExamenesPorDemografico") === "True") {
        vm.getdemographictest();
      }
    }

    vm.getshift = getshift;
    function getshift() {
      vm.shifts = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return appointmentDS.getshift(auth.authToken).then(
        function (data) {
          vm.getmotiveappoiment();
          if (data.status === 200) {
            vm.shifts = _.filter(data.data, function (o) {
              return o.state;
            });
          }
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    vm.getmotiveappoiment = getmotiveappoiment;
    function getmotiveappoiment() {
      vm.listMotivescancellation = [];
      vm.listMotivesrescheduling = [];
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return motiveDS.getMotiveByState(auth.authToken).then(
        function (data) {
          if (data.status === 200) {
            vm.listMotivescancellation = _.filter(
              _.clone(data.data),
              function (m) {
                return m.type.id === 67;
              }
            );
            vm.listMotivesrescheduling = _.filter(
              _.clone(data.data),
              function (m) {
                return m.type.id === 66;
              }
            );
          }
          vm.loading = false;
        },
        function (error) {
          vm.loadingdata = false;
          vm.modalError(error);
        }
      );
    }

    vm.insertreprogram = insertreprogram;
    function insertreprogram() {
      vm.typeappointment = 2;
      vm.loadingdata = true;
      vm.dataorderrescheduling.createdDateShort = parseInt(
        moment(vm.date).format("YYYYMMDD")
      );
      vm.dataorderrescheduling.appointment.shift.id = vm.horary.id;
      vm.dataorderrescheduling.appointment.reason = {
        id: vm.selectmotivereprogram.id,
        description: vm.motivedescriptionreprogram,
      };
      vm.dataorderrescheduling.tests = vm.appoimentTest;

      vm.dateappointment = parseInt(moment(vm.date).format("YYYYMMDD"));
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      return appointmentDS
        .reprogramappointment(auth.authToken, vm.dataorderrescheduling)
        .then(
          function (data) {
            if (data.status === 200) {
              vm.testemailappointment = data.data.tests;
              vm.orderSearchEvent(data.data.orderNumber);
              vm.sendEmailPatient(data.data.orderNumber);
              UIkit.modal("#appointment").hide();
              UIkit.modal("#reprogramming").hide();
            }
          },
          function (error) {
            vm.modalError(error);
            vm.loadingdata = false;
          }
        );
    }

    //Metodo par convertir las horas a militar
    vm.formathours = formathours;
    function formathours(hour) {
      hour = hour + "";
      if (hour === "0") {
        var hourInicial = "00:00";
        return hourInicial;
      } else if (hour.length === 2) {
        return "00:" + hour;
      } else {
        hour =
          hour.substring(0, hour.length - 2) +
          ":" +
          hour.substring(hour.length - 2, hour.length);
        return hour;
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
    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
