/* jshint ignore:start */
(function () {
  "use strict";
  angular
    .module("app.reports")
    .controller("ReportsController", ReportsController);
  ReportsController.$inject = [
    "$filter",
    "$rootScope",
    "localStorageService",
    "LZString",
    "$translate",
    "reportsDS",
    "demographicDS",
    "ordertypeDS",
    "$state",
    "moment",
    "reportadicional",
    "common",
    "logger",
    "$q",
    "keyStimulsoft",
  ];

  function ReportsController(
    $filter,
    $rootScope,
    localStorageService,
    LZString,
    $translate,
    reportsDS,
    demographicDS,
    ordertypeDS,
    $state,
    moment,
    reportadicional,
    common,
    logger,
    $q,
    keyStimulsoft
  ) {
    var vm = this;
    var auth = localStorageService.get("Enterprise_NT.authorizationData");
    var language = $filter("translate")("0000");

    vm.isAuthenticate = isAuthenticate;
    vm.init = init;
    vm.title = "Reports";
    vm.modalError = modalError;
    $rootScope.menu = true;
    $rootScope.NamePage = $filter("translate")("0031").toUpperCase();
    $rootScope.helpReference = "04.reportsandconsultations/reports.htm";
    $rootScope.blockView = true;
    vm.loadImages = loadImages;
    $rootScope.pageview = 3;

    vm.EmailBody = localStorageService.get("EmailBody");
    vm.EmailSubjectPatient = localStorageService.get("EmailSubjectPatient");
    vm.EmailSubjectPhysician = localStorageService.get("EmailSubjectPhysician");
    vm.formatDate = localStorageService.get("FormatoFecha").toUpperCase();
    vm.isPrintAttached = localStorageService.get("ImprimirAdjuntos") === "True";
    vm.historySend = true;
    vm.ordersSend = true;
    vm.demographicTitle = localStorageService.get("DemograficoTituloInforme");
    vm.pathReports = localStorageService.get("RutaReportes");
    vm.namePdfConfig = localStorageService.get("GenerarPDFCon");
    vm.PrefijoResultadosPDF = localStorageService.get("PrefijoResultadosPDF");
    vm.abbreviation = localStorageService.get("Abreviatura");
    vm.finalReport = localStorageService.get("ImprimirInformeFinal");
    vm.keynamereport = localStorageService.get("ExpresionRegularPDF");
    localStorageService.get("EnviarCopiaInformes") === "True";
    vm.SmtpAuthUser = localStorageService.get("SmtpAuthUser");
    vm.EmailBody = localStorageService.get("EmailBody");
    vm.confidencialcodificado =
      localStorageService.get("Activarconfidencialidadprueba") === "True";
    vm.areacodificado = parseInt(localStorageService.get("Examenconfidencial"));

    vm.getOrderType = getOrderType;
    vm.getDemographicsALL = getDemographicsALL;
    vm.getlistReportFile = getlistReportFile;
    vm.getTemplateReport = getTemplateReport;

    vm.printControlOrder = printControlOrder;

    vm.groupOrderByPhysician = groupOrderByPhysician;
    vm.jsonPrint = jsonPrint;
    vm.variableReport = variableReport;
    vm.generateFile = generateFile;
    vm.directImpression = directImpression;
    vm.generationPDF = generationPDF;
    vm.sendEmailProcess = sendEmailProcess;

    vm.changeListReportPrint = changeListReportPrint;
    vm.changeStatePrint = changeStatePrint;

    vm.listreportzip = [];
    vm.listreportEmailPatient = [];
    vm.listreportEmailphysician = [];
    vm.listreportAccount = [];
    vm.sendemailaccount = sendemailaccount;

    ///CORREO PARA CLIENTES
    vm.listreportXlsx = [];
    vm.customerMail = "";
    vm.iddCustome = 0;
    vm.listreportzipXlsx = [];
    vm.totalEmailPatien = 0;

    vm.totalorderemailaccount = 0;
    vm.porcentemailaccount = 0;
    vm.countaccount = 0;

    vm.totalordervalid = 0;

    vm.testaidafilter = false;

    vm.all = "-- " + $filter("translate")("0353") + " --";

    vm.controlOrdersPrint = false;
    vm.printAddLabel = false;
    vm.reprint = false;
    vm.attachments = true;
    vm.orderingPrint = true;
    vm.progressPrint = false;
    vm.isOpenReport = false;
    vm.activateExecution = false;

    vm.filterRange = "1";
    vm.rangeInit = "";
    vm.rangeEnd = "";
    vm.numFilterAreaTest = 0;
    vm.listAreas = [];
    vm.listTests = [];
    vm.listLaboratories = [];
    vm.demographics = [];
    vm.listSamples = [];

    vm.typeSample = "true";
    vm.dataReport = [];
    vm.fileReport = "";
    vm.getOrderType();

    vm.destination = "1";
    vm.typePrint = "1";
    vm.quantityCopies = "1";
    vm.prepotition = $filter("translate")("0000") === "esCo" ? "de" : "of";

    $rootScope.$watch("ipUser", function () {
      vm.ipUser = $rootScope.ipUser;
    });

    function jsonPrint(prmfilterprint) {
      vm.listreportzip = [];
      vm.attachments = prmfilterprint.attachments;
      vm.typePrint = prmfilterprint.typeprint;
      vm.filterDemo = prmfilterprint.filterdemo;
      vm.historySend = prmfilterprint.historysend;
      vm.ordersSend = prmfilterprint.orderssend;
      vm.quantityCopies = prmfilterprint.quantitycopies;
      vm.orderingPrint = prmfilterprint.orderingprint;
      vm.destination = prmfilterprint.destination;
      vm.sendEmail = prmfilterprint.sendEmail;
      vm.serial = prmfilterprint.serial;
      var json = {
        rangeType: 1,
        init: vm.rangeInit,
        end: vm.rangeEnd,
        orderType: vm.modelOrderType.id, // Agregar en lista de demográficos
        check: null,
        testFilterType: vm.numFilterAreaTest,
        tests:
          vm.numFilterAreaTest === 1 || vm.flange === 2
            ? vm.listAreas
            : vm.listTests,
        demographics: vm.demographics,
        packageDescription: false,
        listType: 0,
        laboratories: [],
        apply: true,
        samples: vm.listSamples,
        printerId: vm.ipUser,
        printAddLabel: true,
        basic: true,
        reprintFinalReport: vm.typePrint.toString() === "0",
        attached: vm.attachments,
        typeReport: vm.typePrint,
        numberCopies: vm.quantityCopies,
        serial: prmfilterprint.serial,
        printingType: 1,
        orderingPrint: prmfilterprint.orderingprint,
        orderingfilterDemo: prmfilterprint.filterdemo,
      };

      return json;
    }

    function variableReport() {
      var titleReport =
        vm.typePrint === "1" || vm.typePrint === "0"
          ? $filter("translate")("0399")
          : vm.typePrint === "3"
          ? $filter("translate")("1065")
          : $filter("translate")("1066");

      vm.variables = {
        entity: vm.nameCustomer,
        abbreviation: vm.abbrCustomer,
        username: auth.userName,
        name: auth.name,
        lastName: auth.lastName,
        titleReport: titleReport,
        date: moment().format(vm.formatDate + " HH:mm:ss"),
        formatDate: vm.formatDate,
        templateReport: "reports.mrt",
        typePrint: parseInt(vm.typePrint),
        testfilterview: vm.testaidafilter,
        confidencialcodificado:
          localStorageService.get("Activarconfidencialidadprueba") === "True",
        areacodificado: parseInt(localStorageService.get("Examenconfidencial")),
      };
    }

    function generateFile(prmfilterprint) {
      if (!vm.isOpenReport) {
        return;
      }
      vm.progressPrint = true;
      vm.validsendemailaccount = prmfilterprint.account;
      var json = vm.jsonPrint(prmfilterprint);

      vm.variableReport();
      vm.totalorder = 0;
      vm.porcent = 0;
      vm.totalorderemail = 0;
      vm.porcentemail = 0;
      vm.count = 0;
      vm.listreportzip = [];
      vm.listreportEmailPatient = [];
      vm.listreportEmailphysician = [];
      vm.totalordervalid = 0;
      vm.listreportXlsx = [];
      return reportsDS.getOrderHeader(auth.authToken, json).then(
        function (data) {
          if (data.data.length > 0) {
            vm.progressPrint = false;
            vm.listOrderHead = _.orderBy(data.data, "orderNumber", "asc");
            UIkit.modal("#modalprogressprint", {
              bgclose: false,
              escclose: false,
              modal: false,
            }).show();

            vm.datageneral = {
              printOrder: [],
              labelsreport: JSON.stringify($translate.getTranslationTable()),
              variables: JSON.stringify(vm.variables),
              numberCopies: vm.quantityCopies,
              attached: vm.attachments,
              rangeType: 2,
              typeReport: vm.typePrint,
              printingType: 1, //tipo reporte o codigo de barras
              printingMedium: vm.destination,
              serial: $rootScope.serialprint,
              sendEmail: vm.sendEmail,
              completeOrder: vm.finalReport,
              typeNameFile: vm.namePdfConfig,
            };

            switch (vm.destination) {
              case "1":
                vm.directImpression();
                break;
              case "2":
                vm.count = 0;
                vm.printOrder(vm.listOrderHead[vm.count]);
                break;
              case "3":
                //              vm.listOrderHead = _.filter(vm.listOrderHead, function (o) { return o.patient.email !== "" });
                vm.printOrder(vm.listOrderHead[vm.count]);
                break;
            }

            vm.progressPrint = false;
          } else {
            vm.message = $filter("translate")("0962");
            UIkit.modal("#logNoData").show();
            vm.progressPrint = false;
          }
        },
        function (error) {
          vm.progressPrint = false;
          vm.modalError(error);
        }
      );
    }

    vm.printOrder = printOrder;
    function printOrder(order) {
      vm.loading = true;
      var data = {
        printOrder: [
          {
            physician: null,
            listOrders: [
              {
                order: order,
              },
            ],
          },
        ],
        typeReport: vm.typePrint,
        isAttached: vm.attachments,
      };

      //getOrderPreliminary
      return reportsDS
        .getOrderPreliminaryend(auth.authToken, data)
        .then(function (data) {
          if (data.data !== "") {
            vm.totalordervalid = vm.totalordervalid + 1;
            vm.datareport = data.data.listOrders[0];
            var dataOrder = data.data.listOrders[0].order;
            if (dataOrder.resultTest.length !== 0) {
              dataOrder.resultTest.forEach(function (value) {
                value.refMin =
                  value.refMin === null ||
                  value.refMin === "" ||
                  value.refMin === undefined
                    ? 0
                    : value.refMin;
                value.refMax =
                  value.refMax === null ||
                  value.refMax === "" ||
                  value.refMax === undefined
                    ? 0
                    : value.refMax;
                value.panicMin =
                  value.panicMin === null ||
                  value.panicMin === "" ||
                  value.panicMin === undefined
                    ? 0
                    : value.panicMin;
                value.panicMax =
                  value.panicMax === null ||
                  value.panicMax === "" ||
                  value.panicMax === undefined
                    ? 0
                    : value.panicMax;
                value.reportedMin =
                  value.reportedMin === null ||
                  value.reportedMin === "" ||
                  value.reportedMin === undefined
                    ? 0
                    : value.reportedMin;
                value.reportedMax =
                  value.reportedMax === null ||
                  value.reportedMax === "" ||
                  value.reportedMax === undefined
                    ? 0
                    : value.reportedMax;
                value.digits =
                  value.digits === null ||
                  value.digits === "" ||
                  value.digits === undefined
                    ? 0
                    : value.digits;
                value.refMinview = parseFloat(value.refMin).toFixed(
                  value.digits
                );
                value.refMaxview = parseFloat(value.refMax).toFixed(
                  value.digits
                );
                value.panicMinview = parseFloat(value.panicMin).toFixed(
                  value.digits
                );
                value.panicMaxview = parseFloat(value.panicMax).toFixed(
                  value.digits
                );
                value.reportedMinview = parseFloat(value.reportedMin).toFixed(
                  value.digits
                );
                value.reportedMaxview = parseFloat(value.reportedMax).toFixed(
                  value.digits
                );

                if (vm.validsendemailaccount) {
                  //Objeto para reporte en excel CLIENTE
                  var resultExcel = {
                    orderNumber: value.order,
                    "createdDate:": moment(dataOrder.createdDate).format(
                      vm.formatDate + " HH:mm:ss"
                    ),
                    documentType: dataOrder.patient.documentType.name,
                    patientName: vm.datareport.patientName,
                    patientId: dataOrder.patient.patientId,
                    testName: value.testName,
                    testCode: value.testCode,
                    result: value.result,
                    account: dataOrder.account.id,
                  };
                  vm.listreportXlsx.push(resultExcel);
                }
              });
            }
            if (dataOrder.allDemographics.length > 0) {
              dataOrder.allDemographics.forEach(function (value2) {
                dataOrder["demo_" + value2.idDemographic + "_name"] =
                  value2.demographic;
                dataOrder["demo_" + value2.idDemographic + "_value"] =
                  value2.encoded === false
                    ? value2.notCodifiedValue
                    : value2.codifiedName;
              });
            }

            dataOrder.patient.age = common.getAgeDatePrint(
              moment(dataOrder.patient.birthday).format(
                vm.formatDate.toUpperCase()
              ),
              vm.formatDate,
              moment(dataOrder.createdDate).format(vm.formatDate.toUpperCase())
            );
            dataOrder.createdDate = moment(dataOrder.createdDate).format(
              vm.formatDate + " HH:mm:ss"
            );
            dataOrder.patient.birthdayinformat = dataOrder.patient.birthday;
            dataOrder.patient.birthday = moment(
              dataOrder.patient.birthday
            ).format(vm.formatDate);

            dataOrder.attachments =
              vm.datareport.attachments === undefined
                ? []
                : vm.datareport.attachments;
            return reportsDS
              .getUserValidate(order.orderNumber)
              .then(function (datafirm) {
                dataOrder.listfirm = [];
                for (var i = 0; i < dataOrder.resultTest.length; i++) {
                  dataOrder.resultTest[i].resultDate = moment(
                    dataOrder.resultTest[i].resultDate
                  ).format(vm.formatDate + " HH:mm:ss");
                  dataOrder.resultTest[i].validationDate = moment(
                    dataOrder.resultTest[i].validationDate
                  ).format(vm.formatDate + " HH:mm:ss");
                  dataOrder.resultTest[i].entryDate = moment(
                    dataOrder.resultTest[i].entryDate
                  ).format(vm.formatDate + " HH:mm:ss");
                  dataOrder.resultTest[i].takenDate = moment(
                    dataOrder.resultTest[i].takenDate
                  ).format(vm.formatDate + " HH:mm:ss");
                  dataOrder.resultTest[i].verificationDate = moment(
                    dataOrder.resultTest[i].verificationDate
                  ).format(vm.formatDate + " HH:mm:ss");
                  dataOrder.resultTest[i].printDate = moment(
                    dataOrder.resultTest[i].printDate
                  ).format(vm.formatDate + " HH:mm:ss");

                  if (dataOrder.resultTest[i].hasAntibiogram) {
                    dataOrder.resultTest[i].antibiogram =
                      dataOrder.resultTest[i].microbialDetection.microorganisms;
                  }
                  if (dataOrder.resultTest[i].validationUserId !== undefined) {
                    var findfirm = _.filter(dataOrder.listfirm, function (o) {
                      return (
                        o.areaId === dataOrder.resultTest[i].areaId &&
                        o.validationUserId ===
                          dataOrder.resultTest[i].validationUserId
                      );
                    })[0];

                    var user = _.filter(datafirm.data, function (o) {
                      return o.id === dataOrder.resultTest[i].validationUserId;
                    });

                    if (findfirm === undefined) {
                      var firm = {
                        areaId: dataOrder.resultTest[i].areaId,
                        areaName: dataOrder.resultTest[i].areaName,
                        validationUserId:
                          dataOrder.resultTest[i].validationUserId,
                        validationUserIdentification:
                          dataOrder.resultTest[i].validationUserIdentification,
                        validationUserName:
                          dataOrder.resultTest[i].validationUserName,
                        validationUserLastName:
                          dataOrder.resultTest[i].validationUserLastName,
                        firm: user[0].photo,
                      };
                      dataOrder.listfirm.push(firm);
                    }
                  }
                }
                vm.testaidafilter =
                  _.filter(dataOrder.resultTest, function (o) {
                    return (
                      o.testCode === "9222" ||
                      o.testCode === "503" ||
                      o.testCode === "4003" ||
                      o.testCode === "5051" ||
                      o.testCode === "5052" ||
                      o.testCode === "5053" ||
                      o.testCode === "7828" ||
                      o.testCode === "7077" ||
                      o.testCode === "9721" ||
                      o.testCode === "9301" ||
                      o.profileId === 1066
                    );
                  }).length > 0;

                dataOrder.resultTest = _.orderBy(
                  dataOrder.resultTest,
                  ["printSort"],
                  ["asc"]
                );
                vm.addreport(dataOrder);
              });
          } else {
            vm.count = vm.count === undefined ? 0 : vm.count;
            vm.listOrderHead[vm.count].printing = false;
            vm.totalorder = vm.totalorder + 1;
            vm.count = vm.count + 1;
            if (vm.listOrderHead.length === vm.count) {
              vm.porcent = Math.round(
                (vm.totalorder * 100) / vm.listOrderHead.length
              );
              UIkit.modal("#modalprogressprint", {
                bgclose: false,
                keyboard: false,
              }).hide();
              vm.listOrderPrint = [];

              if (vm.totalordervalid > 0) {
                if (vm.destination == "2") {
                  if (vm.listreportzip.length > 0) {
                    reportadicional.saveReportPdfAll(vm.listreportzip);
                  }
                  vm.changeListReportPrint(1);
                } else if (vm.destination == "3") {
                  if (vm.listreportEmailPatient.length > 0) {
                    vm.totalorder = 0;
                    vm.porcent = 0;
                    vm.count = 0;
                    UIkit.modal("#modalprogressprintEmail", {
                      bgclose: false,
                      keyboard: false,
                    }).show();
                    vm.sendEmailProcess();
                  } else if (vm.listreportAccount.length > 0) {
                    vm.totalorderaccount = 0;
                    vm.porcentaccount = 0;
                    vm.countaccount = 0;
                    UIkit.modal("#modalprogressprintaccount", {
                      bgclose: false,
                      keyboard: false,
                    }).show();
                    vm.sendemailaccount();
                  }
                } else {
                  vm.changeListReportPrint(1);
                }
              } else {
                logger.warning(
                  "Ninguna orden aplica para la generación del pdf"
                );
              }
            } else {
              vm.porcent = Math.round(
                (vm.totalorder * 100) / vm.listOrderHead.length
              );
              vm.printOrder(vm.listOrderHead[vm.count]);
            }
          }
        });
    }

    vm.addreport = addreport;
    function addreport(order) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var parameterReport = {};
      var titleReport =
        vm.datageneral.typeReport === "1" || vm.datageneral.typeReport === "0"
          ? $filter("translate")("0399")
          : vm.datageneral.typeReport === "3"
          ? $filter("translate")("1065")
          : $filter("translate")("1066");

      parameterReport.variables = {
        entity: vm.nameCustomer,
        abbreviation: vm.abbrCustomer,
        username: auth.userName,
        name: auth.name,
        lastName: auth.lastName,
        titleReport: titleReport,
        date: moment().format(vm.formatDate + " HH:mm:ss"),
        formatDate: vm.formatDate,
        destination: vm.destination,
        testfilterview: vm.testaidafilter,
      };

      parameterReport.pathreport =
        "/Report/reportsandconsultations/reports/" +
        vm.getTemplateReport(order);
      parameterReport.labelsreport = $translate.getTranslationTable();
      if (vm.confidencialcodificado && vm.destination !== "3") {
        var filterareainconfidencial = _.filter(
          _.clone(order.resultTest),
          function (o) {
            return o.areaId !== vm.areacodificado;
          }
        );
        if (filterareainconfidencial.length > 0) {
          vm.dataorder = JSON.parse(JSON.stringify(order));
          vm.dataorder.resultTest = filterareainconfidencial;
          vm.setReport(parameterReport, vm.dataorder);
        }
        var filterarea = _.filter(_.clone(order.resultTest), function (o) {
          return o.areaId === vm.areacodificado;
        });
        if (filterareainconfidencial.length === 0 && filterarea.length > 0) {
          vm.dataorder = JSON.parse(JSON.stringify(order));
          var namecodificade =
            order.patient.name1.slice(0, 1) +
            order.patient.lastName.slice(0, 1) +
            order.patient.surName.slice(0, 1) +
            moment(order.patient.birthdayinformat).format("DDMMYY");
          vm.dataorder.resultTest = filterarea;
          vm.dataorder.patient.name1 = namecodificade;
          vm.dataorder.patient.name2 = "";
          vm.dataorder.patient.lastName = "";
          vm.dataorder.patient.surName = "";
          vm.dataorder.confidencial = true;
          vm.setReport(parameterReport, vm.dataorder);
        }
        if (filterarea.length > 0 && filterareainconfidencial.length !== 0) {
          if (vm.dataorder.confidencial) {
            vm.dataorder = JSON.parse(JSON.stringify(order));
            var namecodificade =
              order.patient.name1.slice(0, 1) +
              order.patient.lastName.slice(0, 1) +
              order.patient.surName.slice(0, 1) +
              moment(order.patient.birthdayinformat).format("DDMMYY");
            vm.dataorder.resultTest = filterarea;
            vm.dataorder.patient.name1 = namecodificade;
            vm.dataorder.patient.name2 = "";
            vm.dataorder.patient.lastName = "";
            vm.dataorder.patient.surName = "";
            vm.dataorder.confidencial = true;
            vm.setReport(parameterReport, vm.dataorder);
          } else {
            var dataorder = JSON.parse(JSON.stringify(order));
            dataorder.confidencial = true;
            dataorder.resultTest = filterarea;
            vm.listOrderHead.add(dataorder);
            vm.listOrderHead = _.orderBy(
              vm.listOrderHead,
              "orderNumber",
              "asc"
            );
          }
        }
      } else {
        if (vm.destination === "3") {
          vm.dataorder = JSON.parse(JSON.stringify(order));
          vm.dataorder.resultTest = _.filter(order.resultTest, function (o) {
            return !o.confidential;
          });
          if (vm.dataorder.resultTest.length === 0) {
            vm.listOrderHead[vm.count].printing = false;
            vm.totalorder = vm.totalorder + 1;
            vm.count = vm.count + 1;
            if (vm.listOrderHead.length === vm.count) {
              vm.porcent = Math.round(
                (vm.totalorder * 100) / vm.listOrderHead.length
              );
              UIkit.modal("#modalprogressprint", {
                bgclose: false,
                keyboard: false,
              }).hide();
              vm.listOrderPrint = [];
              if (vm.listreportEmailPatient.length > 0) {
                vm.totalorder = 0;
                vm.porcent = 0;
                vm.count = 0;
                UIkit.modal("#modalprogressprintEmail", {
                  bgclose: false,
                  keyboard: false,
                }).show();
                vm.sendEmailProcess();
              } else if (vm.listreportAccount.length > 0) {
                vm.totalorderaccount = 0;
                vm.porcentaccount = 0;
                vm.countaccount = 0;
                UIkit.modal("#modalprogressprintaccount", {
                  bgclose: false,
                  keyboard: false,
                }).show();
                vm.sendemailaccount();
              }
            } else {
              vm.porcent = Math.round(
                (vm.totalorder * 100) / vm.listOrderHead.length
              );
              if (vm.listOrderHead[vm.count].confidencial) {
                vm.addreport(vm.listOrderHead[vm.count]);
              } else {
                vm.printOrder(vm.listOrderHead[vm.count]);
              }
            }
          } else {
            vm.setReport(parameterReport, vm.dataorder);
          }
        } else {
          vm.dataorder = order;
          vm.setReport(parameterReport, order);
        }
      }
    }

    vm.setReport = setReport;
    function setReport(parameterReport, datareport) {
      setTimeout(function () {
        Stimulsoft.Base.StiLicense.key = keyStimulsoft;
        var report = new Stimulsoft.Report.StiReport();
        report.loadFile(parameterReport.pathreport);
        var jsonData = {
          order: datareport,
          Labels: [parameterReport.labelsreport],
          variables: [parameterReport.variables],
        };

        var dataSet = new Stimulsoft.System.Data.DataSet();
        dataSet.readJson(jsonData);

        report.dictionary.databases.clear();
        report.regData("Demo", "Demo", dataSet);

        report.renderAsync(function () {
          var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
          var service = new Stimulsoft.Report.Export.StiPdfExportService();
          var stream = new Stimulsoft.System.IO.MemoryStream();
          service.exportToAsync(
            function () {
              var data = stream.toArray();
              var buffer = new Uint8Array(data);
              vm.copyPages(buffer, datareport.attachments);
            },
            report,
            stream,
            settings
          );
        });
      }, 50);
    }

    vm.copyPages = copyPages;
    function copyPages(reportpreview, attachments) {
      var PDFDocument = PDFLib.PDFDocument;
      var pdfDocRes = PDFDocument.create();

      pdfDocRes.then(function (pdfDoc) {
        var firstDonorPdfDoc = PDFDocument.load(reportpreview, {
          ignoreEncryption: true,
        });
        firstDonorPdfDoc.then(
          function (greeting) {
            var firstDonorPageRes = pdfDoc.copyPages(
              greeting,
              greeting.getPageIndices()
            );

            firstDonorPageRes.then(function (firstDonorPage) {
              firstDonorPage.forEach(function (page) {
                pdfDoc.addPage(page);
              });
              if (vm.attachments && attachments.length > 0) {
                var mergepdfs = "";
                var calcula = 0;

                var pdfs = _.filter(attachments, function (o) {
                  return o.extension === "pdf";
                });
                var images = _.filter(attachments, function (o) {
                  return o.extension !== "pdf";
                });

                if (pdfs.length > 0) {
                  reportsDS.mergepdf(pdfs).then(function (response) {
                    if (response.status === 200) {
                      var reportbasee64 = _base64ToArrayBuffer(response.data);
                      mergepdfs = PDFDocument.load(reportbasee64, {
                        ignoreEncryption: true,
                      });
                      mergepdfs.then(function (listbufferelement) {
                        var copiedPagesRes = pdfDoc.copyPages(
                          listbufferelement,
                          listbufferelement.getPageIndices()
                        );
                        copiedPagesRes.then(function (copiedPages) {
                          copiedPages.forEach(function (page) {
                            pdfDoc.addPage(page);
                          });
                          if (pdfs.length === 1) {
                            var totalpages = pdfDoc.getPages().length;
                            pdfDoc.removePage(totalpages - 1);
                          }
                          if (images.length > 0) {
                            vm.loadImages(images, calcula, pdfDoc);
                          } else {
                            pdfDoc.save().then(function (pdf) {
                              var pdfUrl = URL.createObjectURL(
                                new Blob([pdf], {
                                  type: "application/pdf",
                                })
                              );
                              vm.loading = false;
                              sendbuffer(pdf, pdfUrl);
                            });
                          }
                        });
                      });
                    }
                  });
                } else if (images.length > 0) {
                  vm.loadImages(images, calcula, pdfDoc);
                }
              } else {
                pdfDoc.save().then(function (pdf) {
                  var pdfUrl = URL.createObjectURL(
                    new Blob([pdf], {
                      type: "application/pdf",
                    })
                  );
                  sendbuffer(pdf, pdfUrl);
                });
              }
            });
          },
          function (reason) {
            alert("Failed: " + reason);
          }
        );
      });
    }

    function loadImages(images, calcula, pdfDoc) {
      for (var i = 0; i < images.length; i++) {
        var reportbasee64 = _base64ToArrayBuffer(images[i].file);
        if (images[i].extension === "jpg" || images[i].extension === "jpeg") {
          var jpgImageRes = pdfDoc.embedJpg(reportbasee64);
          jpgImageRes.then(function (jpgImage) {
            var jpgDims;
            var xwidth = false;
            if (jpgImage.scale(0.5).width <= 576) {
              jpgDims = jpgImage.scale(0.5);
            } else if (jpgImage.scale(0.4).width <= 576) {
              jpgDims = jpgImage.scale(0.4);
            } else if (jpgImage.scale(0.3).width <= 576) {
              jpgDims = jpgImage.scale(0.3);
              xwidth = true;
            } else {
              jpgDims = jpgImage.scale(0.2);
              xwidth = true;
            }
            var page = pdfDoc.addPage();
            page.drawImage(jpgImage, {
              x: xwidth ? 10 : page.getWidth() / 2 - jpgDims.width / 2,
              y: page.getHeight() / 2 - jpgDims.height / 2,
              width: jpgDims.width,
              height: jpgDims.height,
            });
            calcula++;
            if (calcula === images.length) {
              pdfDoc.save().then(function (pdf) {
                var pdfUrl = URL.createObjectURL(
                  new Blob([pdf], {
                    type: "application/pdf",
                  })
                );
                vm.loading = false;
                window.open(pdfUrl, "_blank");
              });
            }
          });
        } else {
          var pngImageRes = pdfDoc.embedPng(reportbasee64);
          pngImageRes.then(function (pngImage) {
            var pngDims;
            var xwidth = false;
            if (pngImage.scale(0.5).width <= 576) {
              pngDims = pngImage.scale(0.5);
            } else if (pngImage.scale(0.4).width <= 576) {
              pngDims = pngImage.scale(0.4);
            } else if (pngImage.scale(0.3).width <= 576) {
              pngDims = pngImage.scale(0.3);
              xwidth = true;
            } else {
              pngDims = pngImage.scale(0.2);
              xwidth = true;
            }
            var page = pdfDoc.addPage();
            // Draw the PNG image near the lower right corner of the JPG image
            page.drawImage(pngImage, {
              x: xwidth ? 10 : page.getWidth() / 2 - pngDims.width / 2,
              y: page.getHeight() / 2 - pngDims.height / 2,
              width: pngDims.width,
              height: pngDims.height,
            });
            calcula++;
            if (calcula === images.length) {
              pdfDoc.save().then(function (pdf) {
                var pdfUrl = URL.createObjectURL(
                  new Blob([pdf], {
                    type: "application/pdf",
                  })
                );
                vm.loading = false;
                window.open(pdfUrl, "_blank");
              });
            }
          });
        }
      }
    }

    function _base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    vm.sendbuffer = sendbuffer;
    function sendbuffer(buffer) {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      var byteArray = new Uint8Array(buffer);
      var byteString = "";
      for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
      }

      var b64 = window.btoa(byteString);
      var nameFinalPDF = "";
      var patienthistory = vm.datareport.patientName
        .replace(/ /g, "")
        .toUpperCase();
      switch (vm.namePdfConfig) {
        case "1":
          if (vm.dataorder.confidencial) {
            nameFinalPDF = vm.dataorder.orderNumber + "_c";
          } else {
            nameFinalPDF = vm.dataorder.orderNumber;
          }
          break;
        case "2":
          nameFinalPDF =
            vm.dataorder.orderNumber + "_" + vm.datareport.patientHistory;
          break;
        case "3":
          if (vm.abbreviation === "ADL") {
            nameFinalPDF = patienthistory + "_" + vm.dataorder.orderNumber;
          } else {
            nameFinalPDF = vm.dataorder.orderNumber + "_" + patienthistory;
          }
          break;
        case "4":
          nameFinalPDF =
            vm.datareport.patientHistory + "_" + vm.dataorder.orderNumber;
          break;
        case "5":
          nameFinalPDF = patienthistory + "_" + vm.dataorder.orderNumber;
        case "6":
          var texto = vm.keynamereport.split("||");
          var FinalPDF = "";
          for (var i = 0; i < texto.length; i++) {
            if (texto[i].indexOf("DATE:") !== -1) {
              FinalPDF =
                FinalPDF + moment().format(texto[i].replace("DATE:", ""));
            } else if (texto[i].indexOf("DATA:") !== -1) {
              var cleantext = texto[i].replace("DATA:", "");
              FinalPDF =
                FinalPDF + vm.datareport.order[cleantext].replace(/ /g, "");
            } else {
              FinalPDF = FinalPDF + texto[i];
            }
            if (i !== texto.length - 1) {
              FinalPDF = FinalPDF + "_";
            }
          }
          nameFinalPDF = FinalPDF;
          break;
        default:
          nameFinalPDF = vm.dataorder.orderNumber;
          break;
      }

      if (vm.PrefijoResultadosPDF && vm.namePdfConfig !== "6") {
        nameFinalPDF = vm.PrefijoResultadosPDF + "_" + nameFinalPDF;
      }

      if (vm.namePdfConfig === "100") {
        var findOrders = _.filter(vm.listOrderHead, function (o) {
          return (
            o.createdDateShort === vm.dataorder.createdDateShort &&
            o.patient.id === vm.dataorder.patient.id
          );
        });
        if (findOrders.length > 1) {
          var indexOrder = _.findIndex(findOrders, function (o) {
            return o.orderNumber === vm.dataorder.orderNumber;
          });
          if (indexOrder > -1) {
            nameFinalPDF =
              "LCAC" +
              vm.dataorder.createdDateShort +
              vm.dataorder.patient.patientId +
              "-" +
              (indexOrder + 1);
          } else {
            nameFinalPDF =
              "LCAC" +
              vm.dataorder.createdDateShort +
              vm.dataorder.patient.patientId;
          }
        } else {
          nameFinalPDF =
            "LCAC" +
            vm.dataorder.createdDateShort +
            vm.dataorder.patient.patientId;
        }
      }

      var finalData = {
        nameFile: nameFinalPDF,
        order: vm.dataorder.orderNumber,
        bufferReport: b64,
        encrypt: vm.datareport.encrypt,
        branch: vm.dataorder.branch.id,
        service:
          vm.dataorder.service !== undefined ? vm.dataorder.service.id : "",
        printingMedium: vm.destination,
        patientEmail: vm.datareport.patientEmail,
        serial: vm.serial,
        NumberCopies: vm.quantityCopies,
        physicianEmail:
          vm.dataorder.physician !== undefined
            ? vm.dataorder.physician.email
            : "",
        sendEmail: vm.sendEmail,
      };

      if (vm.destination == "2") {
        var listreport = {
          nameReport: finalData.nameFile,
          buffer: byteString,
        };
        vm.listreportzip.push(listreport);
        vm.changeStatePrint();
      } else if (vm.destination == "3") {
        var listreport = {
          nameReport: finalData.nameFile,
          buffer: byteString,
        };
        if (
          vm.sendEmail === "1" &&
          (vm.datareport.patientEmail !== undefined ||
            vm.datareport.patientEmail !== null ||
            vm.datareport.patientEmail === "")
        ) {
          if (vm.listreportEmailPatient.length === 0) {
            var patientemail = {
              patientid: vm.datareport.patientHistory,
              correo: vm.datareport.patientEmail,
              listreportzip: [listreport],
            };
            vm.listreportEmailPatient.push(patientemail);
          } else {
            var findreport = _.filter(vm.listreportEmailPatient, function (v) {
              return v.patientid === vm.datareport.patientHistory;
            });
            if (findreport.length > 0) {
              findreport[0].listreportzip.push(listreport);
            } else {
              var patientemail = {
                patientid: vm.datareport.patientHistory,
                correo: vm.datareport.patientEmail,
                listreportzip: [listreport],
              };
              vm.listreportEmailPatient.push(patientemail);
            }
          }
        }

        if (
          vm.validsendemailaccount &&
          (vm.datareport.order.account.email !== undefined ||
            vm.datareport.order.account.email !== null ||
            vm.datareport.order.account.email === "")
        ) {
          if (vm.datareport.order.account !== undefined) {
            if (vm.listreportAccount.length === 0) {
              var accountemail = {
                account: vm.datareport.order.account.id,
                correo: vm.datareport.order.account.email,
                listreportzip: [listreport],
              };
              vm.listreportAccount.push(accountemail);
            } else {
              var findreport = _.filter(vm.listreportAccount, function (v) {
                return v.account === vm.datareport.order.account.id;
              });
              if (findreport.length > 0) {
                findreport[0].listreportzip.push(listreport);
              } else {
                var accountemail = {
                  account: vm.datareport.order.account.id,
                  correo: vm.datareport.order.account.email,
                  listreportzip: [listreport],
                };
                vm.listreportAccount.push(accountemail);
              }
            }
          }
        }
        vm.changeStatePrint();
      } else {
        return reportsDS
          .getSendPrintFinalReport(auth.authToken, finalData)
          .then(
            function (data) {
              if (data.status === 200) {
                vm.changeStatePrint();
              }
            },
            function (error) {
              vm.loading = false;
              if (
                error.data.errorFields[0] === "0| the client is not connected"
              ) {
                vm.message = $filter("translate")("1074");
                UIkit.modal("#logNoDataFinal").show();
              } else {
                vm.modalError(error);
              }
            }
          );
      }
    }

    function changeStatePrint() {
      var personRecive = "";
      if (vm.destination === "3") {
        switch (vm.sendEmail) {
          case "1":
            personRecive = vm.datareport.patientEmail;
            break;
          case "2":
            if (vm.validsendemailaccount) {
              personRecive =
                vm.dataorder.account !== undefined
                  ? vm.dataorder.account.email
                  : "";
            } else {
              personRecive =
                vm.dataorder.physician !== undefined
                  ? vm.dataorder.physician.email
                  : "";
            }
            break;
          case "3":
            personRecive =
              vm.datareport.patientEmail + " " + vm.dataorder.physician !==
              undefined
                ? "; " + vm.dataorder.physician.email
                : "";
            break;
        }
      }
      vm.datareport.order.createdDate = "";
      vm.datareport.order.patient.birthday = "";
      for (var i = 0; i < vm.datareport.order.resultTest.length; i++) {
        vm.datareport.order.resultTest[i].resultDate = "";
        vm.datareport.order.resultTest[i].validationDate = "";
        vm.datareport.order.resultTest[i].entryDate = "";
        vm.datareport.order.resultTest[i].takenDate = "";
        vm.datareport.order.resultTest[i].verificationDate = "";
        vm.datareport.order.resultTest[i].printDate = "";
      }
      var datachange = {
        filterOrderHeader: {
          printingMedium: vm.destination,
          typeReport: vm.typePrint,
          personReceive: personRecive,
        },
        order: vm.datareport.order,
        user: auth.id,
      };
      return reportsDS.changeStateTest(auth.authToken, datachange).then(
        function (data) {
          vm.listOrderHead[vm.count].printing = true;
          vm.totalorder = vm.totalorder + 1;
          vm.count = vm.count + 1;
          if (vm.listOrderHead.length === vm.count) {
            vm.porcent = Math.round(
              (vm.totalorder * 100) / vm.listOrderHead.length
            );
            UIkit.modal("#modalprogressprint", {
              bgclose: false,
              keyboard: false,
            }).hide();
            vm.listOrderPrint = [];

            if (vm.destination == "2") {
              reportadicional.saveReportPdfAll(vm.listreportzip);
              vm.changeListReportPrint(1);
            } else if (vm.destination == "3") {
              if (vm.listreportEmailPatient.length > 0) {
                vm.totalorder = 0;
                vm.porcent = 0;
                vm.count = 0;
                UIkit.modal("#modalprogressprintEmail", {
                  bgclose: false,
                  keyboard: false,
                }).show();
                vm.sendEmailProcess();
              } else if (vm.listreportAccount.length > 0) {
                vm.totalorderaccount = 0;
                vm.porcentaccount = 0;
                vm.countaccount = 0;
                UIkit.modal("#modalprogressprintaccount", {
                  bgclose: false,
                  keyboard: false,
                }).show();
                vm.sendemailaccount();
              }
            } else {
              vm.changeListReportPrint(1);
            }
          } else {
            vm.porcent = Math.round(
              (vm.totalorder * 100) / vm.listOrderHead.length
            );
            if (vm.listOrderHead[vm.count].confidencial) {
              vm.addreport(vm.listOrderHead[vm.count]);
            } else {
              vm.printOrder(vm.listOrderHead[vm.count]);
            }
          }
        },
        function (error) {
          vm.loading = false;
          vm.modalError(error);
        }
      );
    }
    function directImpression() {
      vm.listOrderHead[vm.totalorder].templateorder = vm.getTemplateReport(
        vm.listOrderHead[vm.totalorder]
      );
      vm.datageneral.printOrder[0] = {
        listOrders: [{ order: vm.listOrderHead[vm.totalorder] }],
      };
      vm.datageneral.variables = JSON.stringify(vm.variables);
      vm.datageneral.personReceive = "";
      return reportsDS.printOrderBody(auth.authToken, vm.datageneral).then(
        function (data) {
          if (data.status === 200) {
            vm.listOrderHead[vm.totalorder].printing = data.data[0].printing;
            vm.totalorder = vm.totalorder + 1;
            vm.porcent = Math.round(
              (vm.totalorder * 100) / vm.listOrderHead.length
            );
            if (vm.totalorder < vm.listOrderHead.length) {
              vm.directImpression();
            } else {
              setTimeout(function () {
                UIkit.modal("#modalprogressprint", {
                  bgclose: false,
                  keyboard: false,
                }).hide();
                vm.listOrderPrint = [];
                vm.changeListReportPrint(1);
              }, 3000);
            }
          }
        },
        function (error) {
          vm.loading = false;
          if (error.data.code === 2) {
            UIkit.modal("#modalprogressprint").hide();
            vm.message = $filter("translate")("1074");
            setTimeout(function () {
              UIkit.modal("#logNoData").show();
            }, 1000);
          } else {
            vm.modalError(error);
          }
        }
      );
    }

    function generationPDF() {
      vm.listOrderHead.forEach(function (element) {
        element.templateorder = vm.getTemplateReport(element);
      });

      vm.datageneral.printOrder[0] = {
        physician: { id: 0 },
        listOrders: _.flatMap(vm.listOrderHead, function (e) {
          return { order: e };
        }),
      };
      vm.datageneral.variables = JSON.stringify(vm.variables);

      return reportsDS.printOrderBody(auth.authToken, vm.datageneral).then(
        function (data) {
          if (data.status === 200) {
            vm.listOrderHead = _.zipWith(
              data.data,
              vm.listOrderHead,
              function (a, b) {
                return {
                  orderNumber: b.orderNumber,
                  patient: b.patient,
                  printing: a.printing,
                };
              }
            );
            vm.totalorder = vm.listOrderHead.length;
            vm.porcent = 100;

            setTimeout(function () {
              UIkit.modal("#modalprogressprint", {
                bgclose: false,
                keyboard: false,
              }).hide();
              vm.listOrderPrint = [];
              vm.changeListReportPrint(1);
            }, 3000);
          }
        },
        function (error) {
          vm.loading = false;
          if (error.data.code === 2) {
            UIkit.modal("#modalprogressprint").hide();
            vm.message = $filter("translate")("1074");
            setTimeout(function () {
              UIkit.modal("#logNoData").show();
            }, 1000);
          } else {
            vm.modalError(error);
          }
        }
      );
    }

    function sendEmailProcess() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");

      if (vm.listreportEmailPatient.length === vm.count) {
        if (vm.listreportAccount.length === 0) {
          UIkit.modal("#modalprogressprintEmail", {
            bgclose: false,
            keyboard: false,
          }).hide();
          vm.changeListReportPrint(1);
        } else {
          vm.countaccount = 0;
          vm.totalorderaccount = 0;
          vm.porcentaccount = 0;
          vm.sendemailaccount();
        }
      } else {
        var zip = new JSZip();
        vm.totalEmailPatien++;
        vm.listreportEmailPatient[vm.count].listreportzip.forEach(function (
          value2
        ) {
          zip.file(value2.nameReport + ".pdf", value2.buffer, { binary: true });
        });

        var nameZip =
          $filter("translate")("0360") +
          "[" +
          vm.listreportEmailPatient[vm.count].listreportzip.length.toString() +
          "].zip";
        var blob = zip.generate();

        var correosend = [vm.listreportEmailPatient[vm.countaccount].correo];
        if (vm.EnviarCopiaInformes) {
          correosend.push(vm.SmtpAuthUser);
        }

        var data = {
          recipients: correosend,
          subject: vm.EmailSubjectPatient,
          body: vm.EmailBody,
          attachment: [
            {
              path: blob,
              type: "1",
              filename: nameZip,
            },
          ],
        };
        reportadicional.sendEmailCompress(auth.authToken, data).then(
          function (response) {
            if (response.status === 200) {
              vm.totalorderemail = vm.totalorderemail + 1; //CONTEO EMAIL DE PACIENTES
              vm.porcentemail = Math.round(
                (vm.totalorderemail * 100) / vm.listreportEmailPatient.length
              );
              vm.count = vm.count + 1;
              UIkit.modal("#modalprogressprintEmail", {
                bgclose: false,
                keyboard: false,
              }).hide();
              vm.sendEmailProcess();
            }
          },
          function (error) {
            return false;
          }
        );
      }
      saveAs(blob, nameZip);
    }

    function sendemailaccount() {
      if (vm.listreportAccount.length === vm.countaccount) {
        UIkit.modal("#modalprogressprintaccount", {
          bgclose: false,
          keyboard: false,
        }).hide();
        vm.changeListReportPrint(1);
      } else {
        var datareport = _.filter(vm.listreportXlsx, function (v) {
          return v.account === vm.listreportAccount[vm.countaccount].account;
        });
        var promise = createreportExcel(datareport);
        promise.then(function (buffer) {
          var listreport = {
            nameReport: "Resumen",
            buffer: buffer,
          };
          vm.listreportAccount[vm.countaccount].listreportzip.push(listreport);
          var zip = new JSZip();
          vm.listreportAccount[vm.countaccount].listreportzip.forEach(function (
            archivo
          ) {
            if (archivo.nameReport == "Resumen") {
              zip.file(archivo.nameReport + ".xlsx", archivo.buffer, {
                binary: true,
              });
            } else {
              zip.file(archivo.nameReport + ".pdf", archivo.buffer, {
                binary: true,
              });
            }
          });
          var nameZip =
            $filter("translate")("0360") +
            "[" +
            vm.listreportAccount[
              vm.countaccount
            ].listreportzip.length.toString() +
            "].zip";
          var blob = zip.generate();
          var correosend = [vm.listreportAccount[vm.countaccount].correo];
          if (vm.EnviarCopiaInformes) {
            correosend.push(vm.SmtpAuthUser);
          }

          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          var datacL = {
            recipients: correosend,
            subject: vm.EmailSubjectPatient,
            body: vm.EmailBody,
            attachment: [
              {
                path: blob,
                type: "1",
                filename: nameZip,
              },
            ],
          };
          return reportadicional
            .sendEmailCompress(auth.authToken, datacL)
            .then(function (response) {
              if (response.status === 200) {
                vm.totalorderemailaccount = vm.totalorderemailaccount + 1;
                vm.porcentemailaccount = Math.round(
                  (vm.totalorderemailaccount * 100) /
                    vm.listreportAccount.length
                );
                vm.countaccount = vm.countaccount + 1;
                UIkit.modal("#modalprogressprintaccount", {
                  bgclose: false,
                  keyboard: false,
                }).hide();
                vm.sendemailaccount();
              }
            })
            .catch(function (error) {
              return false;
            });
        });
      }
    }

    //REPORTE DE EXCEL PARA CLIENTES
    vm.createreportExcel = createreportExcel;
    function createreportExcel(data) {
      return $q(function (resolve, reject) {
        setTimeout(function () {
          var parameterReport = {};
          var auth = localStorageService.get("Enterprise_NT.authorizationData");
          parameterReport.datareport = data;
          parameterReport.variables = {
            entity: "CLTECH",
            abbreviation: "CLT",
            date: moment().format(vm.formatDate + " HH:mm:ss"),
            title: "COMPILADO DE RESULTADOS",
            username: auth.userName,
            name: auth.name,
            lastName: auth.lastName, 
          };
          parameterReport.pathreport =
            "/Report/reportsandconsultations/reports/recordOflOrdersXLSX/reports.mrt";
          parameterReport.labelsreport = labelsreport;
          var labelsreport = JSON.stringify($translate.getTranslationTable());
          labelsreport = JSON.parse(labelsreport);
          var report = new Stimulsoft.Report.StiReport();
          report.loadFile(parameterReport.pathreport);
          // Load reports from JSON object
          var jsonData = {
            data: [parameterReport.datareport],
            Labels: [labelsreport],
            Variables: [parameterReport.variables],
          };
          var dataSet = new Stimulsoft.System.Data.DataSet();
          dataSet.readJson(jsonData);
          // Remove all connections from the report template
          report.dictionary.databases.clear();
          // Register DataSet object
          report.regData("Demo", "Demo", dataSet);
          report.renderAsync(function () {
            var data = report.exportDocument(
              Stimulsoft.Report.StiExportFormat.Excel2007
            );
            resolve(new Uint8Array(data));
          });
        }, 5000);
      });
    }

    function groupOrderByPhysician(data) {
      vm.listordernogroup = data;
      data.forEach(function (element) {
        element.templateorder = vm.getTemplateReport(element);
      });

      var groupOrder = _.groupBy(data, function (b) {
        return b.physician.name;
      });
      var listgroupphisician = [];
      for (var physician in groupOrder) {
        var order = _.flatMap(groupOrder[physician], function (e) {
          return { order: e };
        });
        var prueba = groupOrder[physician];
        listgroupphisician.push({
          physician: prueba[0].physician,
          listOrders: order,
        });
      }
      return listgroupphisician;
    }

    function changeListReportPrint(type) {
      if (type === 1) {
        vm.listOrderPrint = $filter("filter")(vm.listOrderHead, function (e) {
          return e.printing === true;
        });
        vm.listOrderPrint = _.uniqBy(vm.listOrderPrint, "orderNumber");
        vm.titleReport = $filter("translate")("0383");
      } else {
        vm.listOrderPrint = $filter("filter")(vm.listOrderHead, function (e) {
          return e.printing === false;
        });
        vm.listOrderPrint = _.uniqBy(vm.listOrderPrint, "orderNumber");
        vm.titleReport = $filter("translate")("1072");
      }
      UIkit.modal("#modallistorder").show();
    }

    function printControlOrder(type) {
      var parameterReport = {};

      parameterReport.variables = {
        entity: vm.nameCustomer,
        abbreviation: vm.abbrCustomer,
        date: moment().format(vm.formatDate + ", HH:mm:ss"),
        title: vm.titleReport,
        username: auth.userName,
        name: auth.name,
        lastName: auth.lastName,
        typePrint: vm.typePrint,
        testfilterview: vm.testaidafilter,
      };

      parameterReport.pathreport =
        "/Report/reportsandconsultations/reports/reportprintedorders.mrt";
      parameterReport.labelsreport = JSON.stringify(
        $translate.getTranslationTable()
      );

      var datareport = LZString.compressToUTF16(
        JSON.stringify(vm.listOrderPrint)
      );

      localStorageService.set("parameterReport", parameterReport);
      localStorageService.set("dataReport", datareport);

      window.open("/viewreport/viewreport.html");
    }

    function getOrderType() {
      vm.listOrderType = [{ id: 0, name: vm.all }];
      vm.modelOrderType = { id: 0, name: vm.all };
      return ordertypeDS.getlistOrderType(auth.authToken).then(function (data) {
        if (data.status === 200) {
          data.data.forEach(function (value) {
            vm.listOrderType.push({ id: value.id, name: value.name });
          });
          vm.getDemographicsALL();
          vm.getlistReportFile();
        }

        $rootScope.blockView = false;
      });
    }

    //Método que devuelve la lista de demofgráficos
    function getDemographicsALL() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (parseInt(vm.demographicTitle) !== 0) {
        return demographicDS.getDemographicsALL(auth.authToken).then(
          function (data) {
            vm.demographicTemplate = _.filter(data.data, function (v) {
              return v.id === parseInt(vm.demographicTitle);
            })[0];
            vm.nameDemographic = "reports_" + vm.demographicTemplate.name;
            vm.referenceDemographic = vm.demographicTemplate.name;

            if (parseInt(vm.demographicTitle) < 0) {
              switch (parseInt(vm.demographicTitle)) {
                case -1:
                  vm.demographicTemplate.name = $filter("translate")("0085");
                  vm.referenceDemographic = "account";
                  break; //Cliente
                case -2:
                  vm.demographicTemplate.name = $filter("translate")("0086");
                  vm.referenceDemographic = "physician";
                  break; //Médico
                case -3:
                  vm.demographicTemplate.name = $filter("translate")("0087");
                  vm.referenceDemographic = "rate";
                  break; //Tarifa
                case -4:
                  vm.demographicTemplate.name = $filter("translate")("0088");
                  vm.referenceDemographic = "type";
                  break; //Tipo de orden
                case -5:
                  vm.demographicTemplate.name = $filter("translate")("0003");
                  vm.referenceDemographic = "branch";
                  break; //Sede
                case -6:
                  vm.demographicTemplate.name = $filter("translate")("0090");
                  vm.referenceDemographic = "service";
                  break; //Servicio
                case -7:
                  vm.demographicTemplate.name = $filter("translate")("0091");
                  vm.referenceDemographic = "race";
                  break; //Raza
              }
              vm.nameDemographic = "reports_" + vm.demographicTemplate.name;
            }
          },
          function (error) {
            vm.modalError();
          }
        );
      } else {
        vm.demographicTemplate = null;
        vm.nameDemographic = "reports";
      }
    }

    function getlistReportFile() {
      reportadicional.getlistReportFile().then(
        function (response) {
          if (response.status === 200) {
            vm.listreports = response.data;
          } else {
            vm.listreports = [];
          }
        },
        function (error) {
          return false;
        }
      );
    }

    function getTemplateReport(order) {
      var template = "";
      if (vm.demographicTemplate === null) {
        return "reports.mrt";
      } else {
        if (vm.demographicTemplate.encoded && vm.demographicTemplate.id > 0) {
          order.demographicItemTemplate = _.filter(
            order.allDemographics,
            function (o) {
              return o.idDemographic === vm.demographicTemplate.id;
            }
          )[0];
          template =
            vm.nameDemographic +
            "_" +
            order.demographicItemTemplate.codifiedCode +
            ".mrt";
        } else if (
          vm.demographicTemplate.encoded &&
          vm.demographicTemplate.id < 0
        ) {
          order.demographicItemTemplate = order[vm.referenceDemographic];
          template =
            vm.nameDemographic +
            "_" +
            order.demographicItemTemplate.code +
            ".mrt";
        } else {
          template = vm.nameDemographic + ".mrt";
        }

        if (vm.demographicTemplate !== null) {
          if (
            _.filter(vm.listreports, function (o) {
              return o.name === template;
            }).length > 0
          ) {
            return template;
          } else {
            return "reports.mrt";
          }
        }
      }
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.Error = {};
      vm.Error = error.data;
      vm.ShowPopupError = true;
    }

    function isAuthenticate() {
      var auth = localStorageService.get("Enterprise_NT.authorizationData");
      if (auth === null || auth.token) {
        $state.go("login");
      } else {
        vm.init();
      }
    }
    function init() {
      if ($filter("translate")("0000") === "esCo") {
        moment.locale("es");
      } else {
        moment.locale("en");
      }
    }

    vm.isAuthenticate();
  }
})();
/* jshint ignore:end */
