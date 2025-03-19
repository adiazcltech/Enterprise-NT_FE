/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:   Generacion del reporte preliminar de una orden.
  PARAMETROS:   order @numero de orden para generar el informe preliminar.
                tests @lista de pruebas que aplican para el reporte


  AUTOR:        Angelica Diaz
  FECHA:        2019-05-29
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/analytical/resultsentry/resultsentry.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/

(function () {
  "use strict";

  angular
    .module("app.widgets")
    .directive("resultreportpreliminary", resultreportpreliminary);

  resultreportpreliminary.$inject = [
    "$filter",
    "reportsDS",
    "localStorageService",
    "$translate",
    "demographicDS",
    "reportadicional",
    "common",
    "keyStimulsoft",
  ];

  /* @ngInject */
  function resultreportpreliminary(
    $filter,
    reportsDS,
    localStorageService,
    $translate,
    demographicDS,
    reportadicional,
    common,
    keyStimulsoft
  ) {
    var directive = {
      restrict: "EA",
      templateUrl: "app/widgets/userControl/results-reportpreliminary.html",
      scope: {
        order: "=?order",
        tests: "=?tests",
        openreport: "=?openreport",
      },

      controller: [
        "$scope",
        function ($scope) {
          var vm = this;
          vm.formatDate = localStorageService.get("FormatoFecha").toUpperCase();
          vm.preliminaryComplete =
            localStorageService.get("VerPreliminarRegistro") === "True";
          vm.demographicTitle = localStorageService.get(
            "DemograficoTituloInforme"
          );
          vm.preliminaryAttachment = localStorageService.get(
            "ImprimirAdjuntosPreliminar"
          );

          vm.testaidafilter = false;
          vm.getOrder = getOrder;
          vm.printOrder = printOrder;
          vm.getTemplateReport = getTemplateReport;
          vm.getDemographicsALL = getDemographicsALL;
          vm.getlistReportFile = getlistReportFile;
          vm.setReport = setReport;
          vm.copyPages = copyPages;
          vm.loadImages = loadImages;
          vm.getDemographicsALL();
          vm.getlistReportFile();

          $scope.$watch("openreport", function () {
            if ($scope.openreport) {
              vm.loadingpreliminari = true;
              vm.order = $scope.order;
              vm.listTest = $scope.tests;
              vm.getOrder();
              $scope.openreport = false;
            }
          });
          function getOrder() {
            vm.listTestComplete = [];
            for (var prop in vm.listTest) {
              vm.listTestComplete = vm.listTestComplete.concat(
                vm.listTest[prop]
              );
            }
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            var json = {
              rangeType: 1,
              init: vm.order,
              end: vm.order,
            };

            return reportsDS
              .getOrderHeader(auth.authToken, json)
              .then(function (data) {
                if (data.data.length > 0) {
                  var data = {
                    printOrder: [
                      {
                        physician: null,
                        listOrders: [
                          {
                            order: data.data[0],
                          },
                        ],
                      },
                    ],
                    typeReport: 2,
                    isAttached: true,
                  };

                  return reportsDS
                    .getOrderPreliminary(auth.authToken, data)
                    .then(function (data) {
                      if (data.data !== "") {
                        if (!vm.preliminaryComplete) {
                          data.data.resultTest = _.intersectionBy(
                            data.data.resultTest,
                            vm.listTestComplete,
                            "testId"
                          );
                        }

                        if (data.data.resultTest.length !== 0) {
                          if (data.data.attachments.length !== 0) {
                            var attachments = _.clone(data.data.resultTest);
                            if (attachments.length !== 0) {
                              var printattament = [];
                              data.data.attachments.forEach(function (value) {
                                if (value.idTest === null && value.viewresul) {
                                  printattament.push(value);
                                } else {
                                  var filter = _.filter(
                                    _.clone(attachments),
                                    function (o) {
                                      return o.testId === value.idTest;
                                    }
                                  );
                                  if (filter.length > 0) {
                                    printattament.push(value);
                                  }
                                }
                              });
                              data.data.attachments = printattament;
                            }
                          }

                          data.data.resultTest.forEach(function (value) {
                            value.technique =
                              value.technique === undefined
                                ? ""
                                : value.technique;
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
                            value.panicMinview = parseFloat(
                              value.panicMin
                            ).toFixed(value.digits);
                            value.panicMaxview = parseFloat(
                              value.panicMax
                            ).toFixed(value.digits);
                            value.reportedMinview = parseFloat(
                              value.reportedMin
                            ).toFixed(value.digits);
                            value.reportedMaxview = parseFloat(
                              value.reportedMax
                            ).toFixed(value.digits);
                          });
                        }
                        var dataOrder = data.data;
                        if (dataOrder.allDemographics.length > 0) {
                          dataOrder.allDemographics.forEach(function (value2) {
                            dataOrder[
                              "demo_" + value2.idDemographic + "_name"
                            ] = value2.demographic;
                            dataOrder[
                              "demo_" + value2.idDemographic + "_value"
                            ] =
                              value2.encoded === false
                                ? value2.notCodifiedValue
                                : value2.codifiedName;
                          });
                        }

                        if (dataOrder.comments.length > 0) {
                          dataOrder.comments.forEach(function (value) {
                            try {
                              var comment = JSON.parse(value.comment);

                              comment = comment.content;
                              value.comment = comment.substring(
                                1,
                                comment.length - 1
                              );
                            } catch (e) {
                              value.comment = value.comment;
                            }
                          });
                        }
                        dataOrder.patient.age = common.getAgeDatePrint(
                          moment(dataOrder.patient.birthday).format(
                            vm.formatDate.toUpperCase()
                          ),
                          vm.formatDate,
                          moment(dataOrder.createdDate).format(
                            vm.formatDate.toUpperCase()
                          )
                        );
                        dataOrder.createdDate = moment(
                          dataOrder.createdDate
                        ).format(vm.formatDate + " HH:mm:ss");
                        dataOrder.patient.birthday = moment(
                          dataOrder.patient.birthday
                        ).format(vm.formatDate);

                        return reportsDS
                          .getUserValidate(vm.order)
                          .then(function (datafirm) {
                            dataOrder.listfirm = [];
                            for (
                              var i = 0;
                              i < dataOrder.resultTest.length;
                              i++
                            ) {
                              dataOrder.resultTest[i].resultDate = moment(
                                dataOrder.resultTest[i].resultDate
                              ).format(vm.formatDate + " HH:mm:ss");
                              dataOrder.resultTest[i].validationDate =
                                dataOrder.resultTest[i].validationDate !== null
                                  ? moment(
                                      dataOrder.resultTest[i].validationDate
                                    ).format(vm.formatDate + " HH:mm:ss")
                                  : null;
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

                              if (
                                dataOrder.resultTest[i].microbiologyGrowth !==
                                undefined
                              ) {
                                dataOrder.resultTest[
                                  i
                                ].microbiologyGrowth.lastTransaction = moment(
                                  dataOrder.resultTest[i].microbiologyGrowth
                                    .lastTransaction
                                ).format(vm.formatDate + " HH:mm:ss");
                              }

                              if (dataOrder.resultTest[i].hasAntibiogram) {
                                dataOrder.resultTest[i].antibiogram =
                                  dataOrder.resultTest[
                                    i
                                  ].microbialDetection.microorganisms;
                              }
                              if (
                                dataOrder.resultTest[i].validationUserId !==
                                undefined
                              ) {
                                var findfirm = _.filter(
                                  dataOrder.listfirm,
                                  function (o) {
                                    return (
                                      o.areaId ===
                                        dataOrder.resultTest[i].areaId &&
                                      o.validationUserId ===
                                        dataOrder.resultTest[i].validationUserId
                                    );
                                  }
                                )[0];

                                var user = _.filter(
                                  datafirm.data,
                                  function (o) {
                                    return (
                                      o.id ===
                                      dataOrder.resultTest[i].validationUserId
                                    );
                                  }
                                );

                                if (findfirm === undefined) {
                                  var firm = {
                                    areaId: dataOrder.resultTest[i].areaId,
                                    areaName: dataOrder.resultTest[i].areaName,
                                    validationUserId:
                                      dataOrder.resultTest[i].validationUserId,
                                    validationUserIdentification:
                                      dataOrder.resultTest[i]
                                        .validationUserIdentification,
                                    validationUserName:
                                      dataOrder.resultTest[i]
                                        .validationUserName,
                                    validationUserLastName:
                                      dataOrder.resultTest[i]
                                        .validationUserLastName,
                                    firm:
                                      user.length === 0 ? "" : user[0].photo,
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
                            vm.printOrder(dataOrder);
                          });
                      } else {
                        UIkit.modal("#logNoDataPreliminary").show();
                        vm.loadingpreliminari = false;
                      }
                    });
                } else {
                  UIkit.modal("#logNoDataPreliminary").show();
                  vm.loadingpreliminari = false;
                }
              });
          }

          function printOrder(order) {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
            var parameterReport = {};
            var patientnombre=order.patient.lastName+" "+order.patient.surName+" "+order.patient.name1+" "+order.patient.name2 
              vm.namereport =
              order.patient.patientId +
              "_" +
              patientnombre.replace(/\s+/g,"_")+
              "_" +
              order.orderNumber +
              ".pdf";
            parameterReport.variables = {
              username: auth.userName,
              name: auth.name,
              lastName: auth.lastName,
              titleReport: $filter("translate")("0395"),
              date: moment().format(vm.formatDate + " HH:mm:ss"),
              formatDate: vm.formatDate,
              reportOrder: true,
              destination: "2",
              typeprint: "4",
              codeorder: "/orqrm:" + btoa(vm.order),
              testfilterview: vm.testaidafilter,
            };
            order.languageReport = localStorageService.get(
              "IdiomaReporteResultados"
            );
            var labelsreport = JSON.stringify($translate.getTranslationTable());
            labelsreport = JSON.parse(labelsreport);
            parameterReport.pathreport =
              "/Report/reportsandconsultations/reports/" +
              vm.getTemplateReport(order);
            parameterReport.labelsreport = labelsreport;
            vm.setReport(parameterReport, order);
            vm.loadingpreliminari = false;
          }

          function copyPages(reportpreview, attachments) {
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
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

                    if (
                      vm.preliminaryAttachment === "True" &&
                      attachments.length > 0
                    ) {
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
                            var reportbasee64 = _base64ToArrayBuffer(
                              response.data
                            );
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
                                  vm.loadingpreliminari = false;

                                 // Establecer metadatos antes de guardar el PDF
                                 pdfDoc.setTitle(vm.namereport );
                                 pdfDoc.setAuthor(localStorageService.get("Entidad"));
                                 pdfDoc.setSubject(auth.userName);

                                  pdfDoc.save().then(function (pdf) {
                                    var pdfUrl = URL.createObjectURL(
                                      new Blob([pdf], {
                                        type: "application/pdf",
                                      })
                                    );                            
                                    var a = document.createElement("a");
                                    a.setAttribute("download", vm.namereport);
                                    a.setAttribute("href", pdfUrl);
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    // Abrir el archivo en una nueva pestaña
                                    window.open(pdfUrl, "_blank");
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
                      vm.loadingpreliminari = false;
                      // Establecer metadatos antes de guardar el PDF
                      pdfDoc.setTitle(vm.namereport );
                      pdfDoc.setAuthor(localStorageService.get("Entidad"));
                      pdfDoc.setSubject(auth.userName);
                      pdfDoc.save().then(function (pdf) {
                        var pdfUrl = URL.createObjectURL(
                          new Blob([pdf], {
                            type: "application/pdf",
                          })
                        );
                        var a = document.createElement("a");
                        a.setAttribute("download", vm.namereport);
                        a.setAttribute("href", pdfUrl);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);                      
                        window.open(pdfUrl, "_blank");                      
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
            var auth = localStorageService.get("Enterprise_NT.authorizationData");
            for (var i = 0; i < images.length; i++) {
              var reportbasee64 = _base64ToArrayBuffer(images[i].file);
              if (
                images[i].extension === "jpg" ||
                images[i].extension === "jpeg"
              ) {
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
                    vm.loadingpreliminari = false;
                    pdfDoc.setTitle(vm.namereport);
                    pdfDoc.setAuthor(localStorageService.get("Entidad"));
                    pdfDoc.setSubject(auth.userName);

                    pdfDoc.save().then(function (pdf) {
                      var pdfUrl = URL.createObjectURL(
                        new Blob([pdf], {
                          type: "application/pdf",
                        })
                      );
                      var a = document.createElement("a");
                      a.setAttribute("download", vm.namereport);
                      a.setAttribute("href", pdfUrl);
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      // Abrir el archivo en una nueva pestaña
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
                    vm.loadingpreliminari = false;
                    pdfDoc.setTitle(vm.namereport);
                    pdfDoc.setAuthor(localStorageService.get("Entidad"));
                    pdfDoc.setSubject(auth.userName);

                    pdfDoc.save().then(function (pdf) {
                      var pdfUrl = URL.createObjectURL(
                        new Blob([pdf], {
                          type: "application/pdf",
                        })
                      );
                      var a = document.createElement("a");
                      a.setAttribute("download", vm.namereport);
                      a.setAttribute("href", pdfUrl);
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      // Abrir el archivo en una nueva pestaña
                      window.open(pdfUrl, "_blank");
                    });
                  }
                });
              }
            }
          }

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
                var settings =
                  new Stimulsoft.Report.Export.StiPdfExportSettings();
                var service =
                  new Stimulsoft.Report.Export.StiPdfExportService();
                var stream = new Stimulsoft.System.IO.MemoryStream();
                service.exportToAsync(
                  function () {
                    // Export to PDF (#1)
                    var data = stream.toArray();
                    var buffer = new Uint8Array(data);

                    vm.copyPages(buffer, datareport.attachments);

                    // Export to PDF (#2)
                  },
                  report,
                  stream,
                  settings
                );

                //  service.exportTo(report, stream, settings);
              });
            }, 50);
            vm.loadingpreliminari = false;
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

          function getTemplateReport(order) {
            var template = "";
            if (vm.demographicTemplate !== null) {
              if (
                vm.demographicTemplate.encoded &&
                vm.demographicTemplate.id > 0
              ) {
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
                (vm.demographicTemplate.encoded &&
                  vm.demographicTemplate.id === -7) ||
                (vm.demographicTemplate.encoded &&
                  vm.demographicTemplate.id === -10)
              ) {
                if (vm.demographicTemplate.id === -7) {
                  order.demographicItemTemplate = order.patient.race;
                  template =
                    vm.nameDemographic +
                    "_" +
                    order.demographicItemTemplate.code +
                    ".mrt";
                } else {
                  order.demographicItemTemplate = order.patient.documentType;
                  template =
                    vm.nameDemographic +
                    "_" +
                    order.demographicItemTemplate.abbr +
                    ".mrt";
                }
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

              if (
                _.filter(vm.listreports, function (o) {
                  return o.name === template;
                }).length > 0
              ) {
                return template;
              } else {
                return "reports.mrt";
              }
            } else {
              return "reports.mrt";
            }
          }

          //Método que devuelve la lista de demofgráficos
          function getDemographicsALL() {
            var auth = localStorageService.get(
              "Enterprise_NT.authorizationData"
            );
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
                        vm.demographicTemplate.name =
                          $filter("translate")("0085");
                        vm.referenceDemographic = "account";
                        break; //Cliente
                      case -2:
                        vm.demographicTemplate.name =
                          $filter("translate")("0086");
                        vm.referenceDemographic = "physician";
                        break; //Médico
                      case -3:
                        vm.demographicTemplate.name =
                          $filter("translate")("0087");
                        vm.referenceDemographic = "rate";
                        break; //Tarifa
                      case -4:
                        vm.demographicTemplate.name =
                          $filter("translate")("0088");
                        vm.referenceDemographic = "type";
                        break; //Tipo de orden
                      case -5:
                        vm.demographicTemplate.name =
                          $filter("translate")("0003");
                        vm.referenceDemographic = "branch";
                        break; //Sede
                      case -6:
                        vm.demographicTemplate.name =
                          $filter("translate")("0090");
                        vm.referenceDemographic = "service";
                        break; //Servicio
                      case -7:
                        vm.demographicTemplate.name =
                          $filter("translate")("0091");
                        vm.referenceDemographic = "race";
                        break; //Raza
                    }
                    vm.nameDemographic =
                      "reports_" + vm.demographicTemplate.name;
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
        },
      ],
      controllerAs: "vmd",
    };
    return directive;
  }
})();
/* jshint ignore:end */
