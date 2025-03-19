/* jshint ignore:start */
(function () {
  'use strict';

  angular
    .module('app.sendEmailAutomaticResult')
    .controller('SendEmailAutomaticResultController', SendEmailAutomaticResultController);


  SendEmailAutomaticResultController.$inject = ["authService",
    "branchDS",
    "userDS",
    "logger",
    "$state",
    "$translate",
    "localStorageService",
    "$filter",
    "$rootScope",
    'reportadicional',
    'reportsDS',
    "configurationDS",
    'demographicDS',
    'resultsentryDS',
    'keyStimulsoft'
  ];

  function SendEmailAutomaticResultController(
    branchDS,
    userDS,
    logger,
    $state,
    $translate,
    localStorageService,
    $filter,
    $rootScope,
    configurationDS,
    reportadicional,
    reportsDS,
    demographicDS,
    resultsentryDS,
    keyStimulsoft
  ) {

    var vm = this;
    vm.title = 'sendEmailAutomaticResult';
    vm.user = {};
    vm.addreport = addreport;
    vm.setReport = setReport;
    vm.copyPages = copyPages;
    $rootScope.pageview = 3;
    vm.indexOrder;
    vm.indexOrderState;
    vm.indexDataReport;
    var dataReportSend;
    var dataAllReport;
    var dataArrayReport;
    //vm.printOrder = printOrder;
    vm.demographicTitle = '0';
    /*vm.getDemographicsALL = getDemographicsALL;
    vm.getlistReportFile = getlistReportFile;*/
    /*vm.getDemographicsALL();
    vm.getlistReportFile();*/
    /*vm.getTemplateReport = getTemplateReport;*/
    vm.visibleBranch = false;
    vm.invalidUser = false;
    vm.invalidDate = false;
    // vm.user.location = 1;
    $rootScope.menu = false;
    vm.passwordrecovery = false;
    vm.typepassword = "password";
    vm.userchangepassword = {};
    vm.userchangepassword.password2 = "";
    vm.userchangepassword.password1 = "";
    vm.errorservice = 0;
    vm.modalError = modalError;
    vm.strength = "";
    vm.strengthlabel = "Weak";
    vm.color = "#999";
    vm.strength0 = true;
    vm.strength1 = true;
    vm.strength2 = true;
    vm.strength3 = true;
    vm.strength4 = true;
    vm.SendAutomaticResult = SendAutomaticResult;
    //prueba
    vm.nameReport = "";

    var variables = window.location.search;

    //Creamos la instancia
    var urlParams = new URLSearchParams(variables);

    //Accedemos a los valores
    var token = urlParams.get('token');

    SendAutomaticResult(token);

    //Mostramos los valores en consola:

    function SendAutomaticResult(token) {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) {
        month = '0' + month;
      }

      if (day.length < 2) {
        day = '0' + day;
      }
      var orderInit = [year, month, day].join('');
      var orderFinal = [year, month, day].join('');

      var digitOrder = 4;

      if (digitOrder == 3) {
        orderInit = orderInit + '001';
        orderFinal = orderFinal + '999';
      } else if (digitOrder == 4) {
        orderInit = orderInit + '0001';
        orderFinal = orderFinal + '9999';
      } else if (digitOrder == 5) {
        orderInit = orderInit + '00001';
        orderFinal = orderFinal + '99999';
      }

      //      var token = localStorageService.get("Enterprise_NT.authorizationData");
      /*HILO CONSULTA DE ORDENES PARA ENVIO DE RESULTADOS AUTOMATICOS POR EMAIL*/
      // var myInt = setInterval(function () {
      return reportsDS.getOrdersResults(token, orderInit, orderFinal).then(function (data) {
        vm.getTemplateReport = getTemplateReport;
        vm.getDemographicsALL = getDemographicsALL;
        vm.getlistReportFile = getlistReportFile;
        vm.getDemographicsALL();
        vm.getlistReportFile();
        dataReportSend = [];
        dataAllReport = [];
        dataArrayReport = [];
        var orders = 0;
        vm.indexOrder = 0;
        vm.indexOrderState = 0;
        vm.indexDataReport = 0;
        if (data.data.length > 0) {
          vm.orderTests = [];
          vm.arelist = [{
            'id': 0,
            'name': ''
          }];
          data.data.forEach(function (value) {
            dataReportSend.push(value.orderId);
            var data = {
              'orderId': value.orderId,
              'sex': value.sex,
              'race': value.race,
              'size': 0,
              'weight': 0,
              'tests': value.tests,
            }
            getValueOrders(token, data);
            vm.order = data.orderId;
            vm.pdfPatient = '';
            var parameters = {
              'typeprint': "1",
              'attachments': true,
              'printingMedium': "3",
              'serial': $rootScope.serialprint,
              'NumberCopies': 0,
              'sendEmail': "1",
              'quantityCopies': 1,
              'destination': "3"
            }
            vm.parameter = parameters;
            var auth = token;
            var json = {
              'rangeType': 1,
              'init': vm.order,
              'end': vm.order
            };

            reportsDS.getOrderHeader(auth, json).then(function (data) {
              if (data.data.length > 0) {
                var data = {
                  'printOrder': [{
                    'physician': null,
                    'listOrders': [{
                      order: data.data[0]
                    }]
                  }],
                  'typeReport': vm.parameter.typeprint,
                  'isAttached': vm.parameter.attachments
                };
                //getOrderPreliminary
                reportsDS.getOrderPreliminaryend(auth, data).then(function (data) {
                  if (data.data !== '') {
                    vm.datareport = data.data.listOrders[0];
                    dataArrayReport.push(data.data.listOrders[0]);
                    dataAllReport.push(data.data.listOrders[0].order);
                    var dataOrder = data.data.listOrders[0].order;
                    if (dataOrder.resultTest.length !== 0) {
                      dataOrder.resultTest.forEach(function (value) {
                        value.refMin = value.refMin === null || value.refMin === '' || value.refMin === undefined ? 0 : value.refMin;
                        value.refMax = value.refMax === null || value.refMax === '' || value.refMax === undefined ? 0 : value.refMax;
                        value.panicMin = value.panicMin === null || value.panicMin === '' || value.panicMin === undefined ? 0 : value.panicMin;
                        value.panicMax = value.panicMax === null || value.panicMax === '' || value.panicMax === undefined ? 0 : value.panicMax;
                        value.reportedMin = value.reportedMin === null || value.reportedMin === '' || value.reportedMin === undefined ? 0 : value.reportedMin;
                        value.reportedMax = value.reportedMax === null || value.reportedMax === '' || value.reportedMax === undefined ? 0 : value.reportedMax;
                        value.digits = value.digits === null || value.digits === '' || value.digits === undefined ? 0 : value.digits;
                        value.refMinview = parseFloat(value.refMin).toFixed(value.digits);
                        value.refMaxview = parseFloat(value.refMax).toFixed(value.digits);
                        value.panicMinview = parseFloat(value.panicMin).toFixed(value.digits);
                        value.panicMaxview = parseFloat(value.panicMax).toFixed(value.digits);
                        value.reportedMinview = parseFloat(value.reportedMin).toFixed(value.digits);
                        value.reportedMaxview = parseFloat(value.reportedMax).toFixed(value.digits);
                        vm.nameReport = vm.datareport.nameFile;
                      });
                    }
                    if (dataOrder.allDemographics.length > 0) {
                      dataOrder.allDemographics.forEach(function (value2) {
                        dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                        dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
                      });
                    }
                    dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' HH:mm:ss');
                    dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
                    dataOrder.patient.age = common.getAgeAsString(dataOrder.patient.birthday, vm.formatDate);
                    dataOrder.attachments = vm.datareport.attachments === '' || vm.datareport.attachments === undefined ? [] : vm.datareport.attachments;
                    reportsDS.getUserValidate(vm.order).then(function (datafirm) {
                      dataOrder.listfirm = [];
                      for (var i = 0; i < dataOrder.resultTest.length; i++) {
                        dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(vm.formatDate + ' HH:mm:ss');
                        dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(vm.formatDate + ' HH:mm:ss');
                        dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(vm.formatDate + ' HH:mm:ss');
                        dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(vm.formatDate + ' HH:mm:ss');
                        dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(vm.formatDate + ' HH:mm:ss');
                        dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(vm.formatDate + ' HH:mm:ss');

                        if (dataOrder.resultTest[i].hasAntibiogram) {
                          dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
                        }
                        if (dataOrder.resultTest[i].validationUserId !== undefined) {
                          var findfirm = _.filter(dataOrder.listfirm, function (o) {
                            return o.areaId === dataOrder.resultTest[i].areaId && o.validationUserId === dataOrder.resultTest[i].validationUserId;
                          })[0];

                          var user = _.filter(datafirm.data, function (o) { return o.id === dataOrder.resultTest[i].validationUserId });

                          if (findfirm === undefined) {
                            var firm = {
                              'areaId': dataOrder.resultTest[i].areaId,
                              'areaName': dataOrder.resultTest[i].areaName,
                              'validationUserId': dataOrder.resultTest[i].validationUserId,
                              'validationUserIdentification': dataOrder.resultTest[i].validationUserIdentification,
                              'validationUserName': dataOrder.resultTest[i].validationUserName,
                              'validationUserLastName': dataOrder.resultTest[i].validationUserLastName,
                              'firm': user[0].photo
                            };
                            dataOrder.listfirm.push(firm);
                          }
                        }
                      }

                      var dataReportPatient = null;

                      if (auth.confidential === true && vm.parameter.destination === '3' && vm.parameter.sendEmail === "3") {
                        var dataReportPatient = JSON.parse(JSON.stringify(dataOrder))
                        dataReportPatient.resultTest = _.filter(dataReportPatient.resultTest, function (o) {
                          return !o.confidential;
                        });

                        if (dataReportPatient.resultTest.length === 0 || dataReportPatient.resultTest.length === dataOrder.resultTest.length) {
                          vm.addreport(dataOrder, null);
                        }
                        else {
                          dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                          dataReportPatient.resultTest = _.orderBy(dataReportPatient.resultTest, ['printSort'], ['asc']);
                          vm.addreport(dataOrder, dataReportPatient);
                        }
                      }
                      else if (auth.confidential === true && vm.parameter.destination === '3' && vm.parameter.sendEmail === "1") {
                        dataOrder.resultTest = _.filter(dataOrder.resultTest, function (o) {
                          return !o.confidential;
                        });

                        if (dataOrder.resultTest.length === 0) {
                          vm.message = $filter('translate')('0152');
                          UIkit.modal('#logNoDataFinal').show();
                          vm.loading = false;
                        }
                        else {
                          dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                          vm.addreport(dataOrder, null);
                        }
                      }
                      else {
                        dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                        vm.addreport(dataOrder, dataReportPatient);
                      }

                    });
                  } else {
                    vm.message = $filter('translate')('0152');
                    UIkit.modal('#logNoDataFinal').show();
                    vm.loading = false;
                  }
                });

              } else {
                vm.message = $filter('translate')('0152');
                UIkit.modal('#logNoDataFinal').show();
                vm.loading = false;
              }
            });

          });
        }
      });
      //}, 60000);
    }

    function getValueOrders(token, dataReceive) {
      return resultsentryDS.assignformulavalue(token, dataReceive).then(function (data) {
        vm.orderTests = _.groupBy(data.data.tests, 'areaName');
        var listTestUniqueprint = [];
        vm.dataprint = [];
        angular.forEach(vm.orderTests, function (item) {
          angular.forEach(item, function (dataitem) {
            listTestUniqueprint.push(dataitem);
          });
        });
        vm.dataprint = listTestUniqueprint;
      });
    }

    function addreport(order, orderpatient) {
      if (vm.dataprint.length !== 0) {
        var test = [];
        vm.dataprint.forEach(function (value) {
          var validated = $filter("filter")(JSON.parse(JSON.stringify(order.resultTest)), function (e) {
            return value.testId === e.testId;
          })
          if (validated.length !== 0) {
            test.push(validated[0]);
          }
        });
        order.resultTest = test;

      } else if (order.resultTest.length !== 0) {
        if (vm.arelist.length > 0) {
          var test = []
          order.resultTest.forEach(function (value) {
            var validated = $filter("filter")(JSON.parse(JSON.stringify(vm.arelist)), function (e) {
              return value.areaId === e.id;
            })
            if (validated.length !== 0) {
              test.push(value);
            }
          });
          order.resultTest = test;
        }
      }

      if (orderpatient !== null) {
        if (vm.dataprint.length !== 0) {
          var test = [];
          vm.dataprint.forEach(function (value) {
            var validated = $filter("filter")(JSON.parse(JSON.stringify(orderpatient.resultTest)), function (e) {
              return value.testId === e.testId;
            })
            if (validated.length !== 0) {
              test.push(validated[0]);
            }
          });
          orderpatient.resultTest = test;

        } else if (orderpatient.resultTest.length !== 0) {
          if (vm.arelist.length > 0) {
            var test = []
            orderpatient.resultTest.forEach(function (value) {
              var validated = $filter("filter")(JSON.parse(JSON.stringify(vm.arelist)), function (e) {
                return value.areaId === e.id;
              })
              if (validated.length !== 0) {
                test.push(value);
              }
            });
            orderpatient.resultTest = test;
          }
        }

      }
      var auth = token;
      var parameterReport = {};

      var titleReport = (vm.parameter.typeprint === '1' || vm.parameter.typeprint === '0') ? $filter('translate')('0399') : (vm.parameter.typeprint === '3' ? $filter('translate')('1065') : $filter('translate')('1066'));
      parameterReport.variables = {
        'entity': vm.nameCustomer,
        'abbreviation': vm.abbrCustomer,
        'username': auth.userName,
        'titleReport': titleReport,
        'date': moment().format(vm.formatDate + ' HH:mm:ss'),
        'formatDate': vm.formatDate,
        'destination': vm.parameter.destination
      };
      parameterReport.pathreport = '/Report/reportsandconsultations/reports/' + vm.getTemplateReport(order);
      parameterReport.labelsreport = $translate.getTranslationTable();
      vm.dataorder = order;
      vm.datapatient = orderpatient;
      vm.setReport(parameterReport, order, orderpatient);
    }

    function setReport(parameterReport, datareport, datareportpatient) {
      setTimeout(function () {
        Stimulsoft.Base.StiLicense.key = keyStimulsoft;
        var report = new Stimulsoft.Report.StiReport();
        report.loadFile(parameterReport.pathreport);

        var jsonData = {
          'order': datareport,
          'Labels': [parameterReport.labelsreport],
          'variables': [parameterReport.variables]
        };

        var dataSet = new Stimulsoft.System.Data.DataSet();
        dataSet.readJson(jsonData);

        report.dictionary.databases.clear();
        report.regData('Demo', 'Demo', dataSet);

        //condicional para armar pdf de paciente sin confidenciales
        if (datareportpatient !== null) {
          var reportPatient = new Stimulsoft.Report.StiReport();
          reportPatient.loadFile(parameterReport.pathreport);

          var jsonDataPatient = {
            'order': datareportpatient,
            'Labels': [parameterReport.labelsreport],
            'variables': [parameterReport.variables]
          };

          var dataSetPatient = new Stimulsoft.System.Data.DataSet();
          dataSetPatient.readJson(jsonDataPatient);

          reportPatient.dictionary.databases.clear();
          reportPatient.regData('Demo', 'Demo', dataSetPatient);

          reportPatient.renderAsync(function () {
            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();
            var stream = new Stimulsoft.System.IO.MemoryStream();
            service.exportToAsync(function () {
              // Export to PDF (#1)
              var data = stream.toArray();
              var buffer = new Uint8Array(data);

              vm.copyPages(buffer, datareport.attachments, true);

              report.renderAsync(function () {
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                var stream = new Stimulsoft.System.IO.MemoryStream();
                service.exportToAsync(function () {
                  // Export to PDF (#1)
                  var data = stream.toArray();
                  var buffer = new Uint8Array(data);

                  vm.copyPages(buffer, datareport.attachments, false);

                }, report, stream, settings);
              });
            }, report, stream, settings);
          });

        }
        else {
          report.renderAsync(function () {
            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();
            var stream = new Stimulsoft.System.IO.MemoryStream();
            service.exportToAsync(function () {
              // Export to PDF (#1)
              var data = stream.toArray();
              var buffer = new Uint8Array(data);
              vm.copyPages(buffer, datareport.attachments, false);

            }, report, stream, settings);
          });
        }
      }, 50);
    }

    function copyPages(reportpreview, attachments, patient) {

      var PDFDocument = PDFLib.PDFDocument;
      var pdfDocRes = PDFDocument.create();

      pdfDocRes.then(function (pdfDoc) {
        var firstDonorPdfDoc = PDFDocument.load(reportpreview, {
          ignoreEncryption: true
        });
        firstDonorPdfDoc.then(function (greeting) {
          var firstDonorPageRes = pdfDoc.copyPages(greeting, greeting.getPageIndices());

          firstDonorPageRes.then(function (firstDonorPage) {

            firstDonorPage.forEach(function (page) {
              pdfDoc.addPage(page);
            });
            if (vm.parameter.attachments && attachments.length > 0) {
              var listbuffer = [];
              var calcula = 0;
              for (var i = 0; i < attachments.length; i++) {
                var reportbasee64 = _base64ToArrayBuffer(attachments[i].file);
                if (attachments[i].extension === 'pdf') {
                  listbuffer[i] = PDFDocument.load(reportbasee64, {
                    ignoreEncryption: true
                  });
                  listbuffer[i].then(function (listbufferelement) {
                    var copiedPagesRes = pdfDoc.copyPages(listbufferelement, listbufferelement.getPageIndices());
                    copiedPagesRes.then(function (copiedPages) {
                      copiedPages.forEach(function (page) {
                        pdfDoc.addPage(page);
                      });
                      calcula++;
                      if (calcula === attachments.length) {
                        pdfDoc.save().then(function (pdf) {
                          var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                            type: 'application/pdf'
                          }));
                          //window.open(pdfUrl, '_blank');
                          if (patient === true) {
                            vm.pdfPatient = pdf;
                            vm.pdfUrlPatient = pdfUrl;
                          }
                          else {
                            sendbuffer(pdf, pdfUrl);
                          }

                        });
                      }
                    });
                  });
                } else if (attachments[i].extension === 'jpg' || attachments[i].extension === 'jpeg') {
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
                    if (calcula === attachments.length) {
                      pdfDoc.save().then(function (pdf) {
                        var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                          type: 'application/pdf'
                        }));
                        //window.open(pdfUrl, '_blank');
                        if (patient === true) {
                          vm.pdfPatient = pdf;
                          vm.pdfUrlPatient = pdfUrl;
                        }
                        else {
                          sendbuffer(pdf, pdfUrl);
                        }
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
                      y: page.getHeight() / 2 - pngDims.height,
                      width: pngDims.width,
                      height: pngDims.height,
                    });
                    calcula++;
                    if (calcula === attachments.length) {
                      pdfDoc.save().then(function (pdf) {
                        var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                          type: 'application/pdf'
                        }));
                        if (patient === true) {
                          vm.pdfPatient = pdf;
                          vm.pdfUrlPatient = pdfUrl;
                        }
                        else {
                          sendbuffer(pdf, pdfUrl);
                        }
                      });
                    }
                  });
                }
              }
            } else {
              pdfDoc.save().then(function (pdf) {
                var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                  type: 'application/pdf'
                }));
                if (patient === true) {
                  vm.pdfPatient = pdf;
                  vm.pdfUrlPatient = pdfUrl;
                }
                else {
                  sendbuffer(pdf, pdfUrl);
                }
              });
            }

          });
        }, function (reason) {
          alert('Failed: ' + reason);
        });
      });
    }

    vm.sendbuffer = sendbuffer;
    function sendbuffer(buffer, pdfUrl) {
      //vm.datareport.nameFile = dataReportSend[vm.indexOrder];
      vm.datareport = dataArrayReport[vm.indexOrder];
      vm.dataorder.orderNumber = dataReportSend[vm.indexOrder];

      vm.indexOrder = vm.indexOrder + 1;

      var byteArray = new Uint8Array(buffer);
      var byteString = '';
      for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
      }
      var b64 = window.btoa(byteString);

      if (vm.pdfPatient !== '') {
        var byteArray = new Uint8Array(vm.pdfPatient);
        var byteString = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
          byteString += String.fromCharCode(byteArray[i]);
        }
        var b64patient = window.btoa(byteString);

        var finalData = {
          nameFile: vm.datareport.nameFile,
          order: vm.dataorder.orderNumber,
          bufferReport: b64patient,
          encrypt: vm.datareport.encrypt,
          branch: vm.dataorder.branch.id,
          service: vm.dataorder.service !== undefined ? vm.dataorder.service.id : "",
          printingMedium: vm.parameter.destination,
          patientEmail: vm.datareport.patientEmail,
          serial: vm.parameter.serial,
          NumberCopies: vm.parameter.quantityCopies,
          physicianEmail: vm.dataorder.physician !== undefined ? vm.dataorder.physician.email : "",
          sendEmail: vm.parameter.sendEmail,
        }

        var auth = token;

        reportsDS.getSendPrintFinalReport(auth, finalData).then(function (data) {
          if (data.status === 200) {

          }
        })
      }
      var finalData = {
        nameFile: vm.datareport.nameFile,
        order: vm.dataorder.orderNumber,
        bufferReport: b64,
        encrypt: vm.datareport.encrypt,
        branch: vm.dataorder.branch.id,
        service: vm.dataorder.service !== undefined ? vm.dataorder.service.id : "",
        printingMedium: vm.parameter.destination,
        patientEmail: vm.datareport.patientEmail,
        serial: vm.parameter.serial,
        NumberCopies: vm.parameter.quantityCopies,
        physicianEmail: vm.dataorder.physician !== undefined ? vm.dataorder.physician.email : "",
        sendEmail: vm.parameter.sendEmail,
      }

      var auth = token;

      reportsDS.getSendPrintFinalReport(auth, finalData).then(function (data) {
        if (data.status === 200) {
          var personRecive = "";
          if (vm.parameter.destination === '2') {
            window.open(pdfUrl, '_blank');
          }
          else if (vm.parameter.destination === '3') {

            switch (vm.parameter.sendEmail) {
              case '1':
                personRecive = vm.datareport.patientEmail;
                break;
              case '2':
                personRecive = vm.dataorder.physician !== undefined ? vm.dataorder.physician.email : "";
                break;
              case '3':
                personRecive = vm.datareport.patientEmail + " " + vm.dataorder.physician !== undefined ? "; " + vm.dataorder.physician.email : ""
                break;
            }
          }
          vm.datareport.order = dataAllReport[vm.indexOrderState];
          vm.indexOrderState = vm.indexOrderState + 1;

          vm.datareport.order.createdDate = '';
          vm.datareport.order.patient.birthday = '';
          for (var i = 0; i < vm.datareport.order.resultTest.length; i++) {
            vm.datareport.order.resultTest[i].resultDate = '';
            vm.datareport.order.resultTest[i].validationDate = '';
            vm.datareport.order.resultTest[i].entryDate = '';
            vm.datareport.order.resultTest[i].takenDate = '';
            vm.datareport.order.resultTest[i].verificationDate = '';
            vm.datareport.order.resultTest[i].printDate = '';
          }

          var datachange = {
            filterOrderHeader: { printingMedium: vm.parameter.destination, typeReport: vm.parameter.typeprint, personRecieve: personRecive },
            order: vm.datareport.order,
            user: auth.id
          }

          reportsDS.changeStateTest(auth, datachange).then(function (data) {
            if (data.status === 200) {
              $scope.functionexecute();
              vm.loading = false;
            }
          }, function (error) {
            vm.loading = false;
            vm.modalError(error);
          });

        }
      }, function (error) {
        vm.loading = false;
        if (error.data.errorFields[0] === "0| the client is not connected") {
          vm.message = $filter('translate')('1074');
          UIkit.modal('#logNoDataFinal').show();
        } else {
          vm.modalError(error);
        }
      });
    }

    function getDemographicsALL() {
      var auth = token;
      if (parseInt(vm.demographicTitle) !== 0) {
        return demographicDS.getDemographicsALL(auth).then(function (data) {
          vm.demographicTemplate = _.filter(data.data, function (v) {
            return v.id === parseInt(vm.demographicTitle);
          })[0];
          vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          vm.referenceDemographic = vm.demographicTemplate.name;

          if (parseInt(vm.demographicTitle) < 0) {
            switch (parseInt(vm.demographicTitle)) {
              case -1:
                vm.demographicTemplate.name = $filter('translate')('0085');
                vm.referenceDemographic = 'account';
                break; //Cliente
              case -2:
                vm.demographicTemplate.name = $filter('translate')('0086');
                vm.referenceDemographic = 'physician';
                break; //Médico
              case -3:
                vm.demographicTemplate.name = $filter('translate')('0087');
                vm.referenceDemographic = 'rate';
                break; //Tarifa
              case -4:
                vm.demographicTemplate.name = $filter('translate')('0088');
                vm.referenceDemographic = 'type';
                break; //Tipo de orden
              case -5:
                vm.demographicTemplate.name = $filter('translate')('0003');
                vm.referenceDemographic = 'branch';
                break; //Sede
              case -6:
                vm.demographicTemplate.name = $filter('translate')('0090');
                vm.referenceDemographic = 'service';
                break; //Servicio
              case -7:
                vm.demographicTemplate.name = $filter('translate')('0091');
                vm.referenceDemographic = 'race';
                break; //Raza
            }
            vm.nameDemographic = 'reports_' + vm.demographicTemplate.name;
          }

        }, function (error) {
          vm.modalError();
        });
      } else {
        vm.demographicTemplate = null;
        vm.nameDemographic = 'reports';
      }
    }

    function getlistReportFile() {
      reportadicional.getlistReportFile().then(function (response) {
        if (response.status === 200) {
          vm.listreports = response.data;
        } else {
          vm.listreports = [];
        }
      }, function (error) {
        return false;
      });
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
      var template = '';
      if (vm.demographicTemplate !== null) {
        if (vm.demographicTemplate.encoded && vm.demographicTemplate.id > 0) {
          order.demographicItemTemplate = _.filter(order.allDemographics, function (o) {
            return o.idDemographic === vm.demographicTemplate.id;
          })[0];
          template = vm.nameDemographic + '_' + order.demographicItemTemplate.codifiedCode + '.mrt';
        } else if (vm.demographicTemplate.encoded && vm.demographicTemplate.id < 0) {
          order.demographicItemTemplate = order[vm.referenceDemographic];
          template = vm.nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
        } else {
          template = vm.nameDemographic + '.mrt';
        }


        if (_.filter(vm.listreports, function (o) {
          return o.name === template;
        }).length > 0) {
          return template;
        } else {
          return 'reports.mrt';
        }
      } else {
        return 'reports.mrt';
      }
    }

    //** Método para sacar el popup de error**//
    function modalError(error) {
      vm.loadingdata = false;
      vm.PopupError = true;
      vm.Error = error;
    }


  }

})();
/* jshint ignore:end */
