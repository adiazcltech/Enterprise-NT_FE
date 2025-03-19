
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
  'use strict';

  angular
    .module('app.widgets')
    .directive('resultreportpreliminary', resultreportpreliminary);

  resultreportpreliminary.$inject = ['$filter', 'localStorageService', 'common', 'orderDS', 'logger'];

  /* @ngInject */
  function resultreportpreliminary($filter, localStorageService, common, orderDS, logger) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/results-reportpreliminary.html',
      scope: {
        openreport: '=?openreport',
        order: '=?order',
        tests: '=?tests',
        listreports: '=?listreports',
        demographictemplate: '=?demographictemplate',
        referencedemographic: '=?referencedemographic',
        namedemographic: '=?namedemographic',
        type: '=?type',
        idiome: '=?idiome',
        blob: '=?blob',
      },


      controller: ['$scope', function ($scope) {
        var vm = this;


        vm.getOrder = getOrder;
        vm.openReport = openReport;
        vm.getTemplateReport = getTemplateReport;
        vm.setReport = setReport;
        vm.copyPages = copyPages;
        vm.keyConfiguration = keyConfiguration;
        vm.loadImages = loadImages;

        vm.viewResult = parseInt(localStorageService.get('MostrarResultado'));

        $scope.$watch('openreport', function () {
          if ($scope.openreport) {
            vm.loading = true;
            vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
            vm.formatDate = vm.formatDate === '' ? 'DD/MM/YYYY' : vm.formatDate;
            vm.listreports = $scope.listreports;
            vm.order = $scope.order;
            vm.listTest = $scope.tests;
            vm.type = $scope.type;
            vm.demographicTemplate = $scope.demographictemplate;
            vm.referenceDemographic = $scope.referencedemographic;
            vm.nameDemographic = $scope.namedemographic;
            vm.idiome = $scope.idiome;
            $scope.openreport = false;
            vm.keyConfiguration();
          }
        });

        function keyConfiguration() {
          if (vm.listreports !== undefined) {
            vm.getOrder();
          }
        }

        function getOrder() {
          var listTest = [];
          vm.listTest.forEach(function (value) {
            listTest.push(value.testId);
          });

          var json = {
            'rangeType': 1,
            'init': vm.order,
            'end': vm.order,
            'orderType': 0,
            'check': null,
            'testFilterType': 2,
            'tests': listTest,
            'demographics': [],
            'packageDescription': false,
            'listType': 0,
            'laboratories': [],
            'apply': true,
            'samples': [],
            'printAddLabel': true,
            'basic': true,
            'reprintFinalReport': false,
            'typeReport': vm.viewResult,
            'printedOrders': false,
            'attached': true
          }
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          return orderDS.printreport(auth.authToken, json).then(function (data) {
            if (data.status === 200) {
              if (data.data !== "") {

                var dataOrder = data.data[0];
                dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' hh:mm:ss a.');
                dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
                dataOrder.patient.age = common.getAgeAsString(dataOrder.patient.birthday, vm.formatDate);
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
                  });
                }
                if (dataOrder.allDemographics.length > 0) {
                  dataOrder.allDemographics.forEach(function (value2) {
                    dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                    dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
                  });
                }
                var urlLIS = localStorageService.get('ServiciosLISUrl');
                return orderDS.getUserValidate(vm.order, urlLIS).then(function (datafirm) {
                  dataOrder.listfirm = [];
                  for (var i = 0; i < dataOrder.resultTest.length; i++) {
                    dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(vm.formatDate + ' hh:mm:ss a.');
                    dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(vm.formatDate + ' hh:mm:ss a.');
                    dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(vm.formatDate + ' hh:mm:ss a.');
                    dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(vm.formatDate + ' hh:mm:ss a.');
                    dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(vm.formatDate + ' hh:mm:ss a.');
                    dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(vm.formatDate + ' hh:mm:ss a.');

                    if (dataOrder.resultTest[i].hasAntibiogram) {
                      dataOrder.resultTest[i].antibiogram = dataOrder.resultTest[i].microbialDetection.microorganisms;
                    }

                    if (dataOrder.resultTest[i].validationUserId !== undefined) {
                      var findfirm = _.filter(dataOrder.listfirm, function (o) {
                        return o.areaId === dataOrder.resultTest[i].areaId && o.validationUserId === dataOrder.resultTest[i].validationUserId
                      })[0];

                      if (findfirm === undefined) {
                        var user = _.filter(datafirm.data, function (o) { return o.id === dataOrder.resultTest[i].validationUserId });
                        var firm = {
                          "areaId": dataOrder.resultTest[i].areaId,
                          "areaName": dataOrder.resultTest[i].areaName,
                          "validationUserId": dataOrder.resultTest[i].validationUserId,
                          "validationUserIdentification": dataOrder.resultTest[i].validationUserIdentification,
                          "validationUserName": dataOrder.resultTest[i].validationUserName,
                          "validationUserLastName": dataOrder.resultTest[i].validationUserLastName,
                          "firm": user[0].photo
                        }
                        dataOrder.listfirm.push(firm)
                      }
                    }
                  }
                  vm.openReport(dataOrder);
                })
              } else {
                UIkit.modal('#logNoDataPreliminary').show();
                vm.loading = false;
              }
            } else {
              UIkit.modal('#logNoDataPreliminary').show();
              vm.loading = false;
            }
          }, function (error) {
            vm.loading = false;
            vm.modalError(error);
          });


        }

        function openReport(order) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var parameterReport = {};
          parameterReport.variables = {
            'username': auth.userName,
            'titleReport': '',
            'date': moment().format(vm.formatDate + ' hh:mm:ss a.'),
            'formatDate': vm.formatDate,
            'reportOrder': true
          };
          parameterReport.pathreport = 'reports/' + vm.getTemplateReport(order);
          parameterReport.labelsreport = vm.idiome;
          vm.setReport(parameterReport, order);
        }

        function copyPages(reportpreview, attachments) {

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
                if (attachments.length > 0) {

                  var mergepdfs = '';
                  var calcula = 0;

                  var pdfs = _.filter(attachments, function(o) { return o.extension === 'pdf'; });
                  var images = _.filter(attachments, function(o) { return o.extension !== 'pdf'; });

                  if(pdfs.length > 0) {
                    orderDS.mergepdf(pdfs).then(function (response) {
                      if(response.status === 200) {
                        var reportbasee64 = _base64ToArrayBuffer(response.data);
                        mergepdfs = PDFDocument.load(reportbasee64, {
                          ignoreEncryption: true
                        });
                        mergepdfs.then(function (listbufferelement) {
                          var copiedPagesRes = pdfDoc.copyPages(listbufferelement, listbufferelement.getPageIndices());
                          copiedPagesRes.then(function (copiedPages) {
                            copiedPages.forEach(function (page) {
                              pdfDoc.addPage(page);
                            });
                            if(pdfs.length === 1 ) {
                              var totalpages = pdfDoc.getPages().length;
                              pdfDoc.removePage(totalpages-1);
                            }
                            if(images.length > 0) {
                              vm.loadImages(images, calcula, pdfDoc);
                            } else {
                              pdfDoc.save().then(function (pdf) {
                                var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                                  type: 'application/pdf'
                                }));
                                if (vm.type === 1) {
                                  var a = document.createElement("a");
                                  a.setAttribute("download", vm.order + ".pdf");
                                  a.setAttribute("href", pdfUrl);
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  logger.info($filter('translate')('0211'));
                                } else {
                                  document.getElementById('pdf').src = pdfUrl;
                                }
                                $scope.$apply(function () {
                                  vm.loading = false;
                                });
                              });
                            }
                          });
                        });
                      }
                    });
                  } else if(images.length > 0) {
                    vm.loadImages(images, calcula, pdfDoc);
                  }
                } else {
                  pdfDoc.save().then(function (pdf) {
                    var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                      type: 'application/pdf'
                    }));
                    if (vm.type === 1) {
                      var a = document.createElement("a");
                      a.setAttribute("download", vm.order + ".pdf");
                      a.setAttribute("href", pdfUrl);
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      logger.info($filter('translate')('0211'));
                    } else {
                      document.getElementById('pdf').src = pdfUrl;
                    }
                    $scope.$apply(function () {
                      vm.loading = false;
                    });
                  });
                }

              });
            }, function (reason) {
              alert('Failed: ' + reason);
            });
          });
        }

        function loadImages(images, calcula, pdfDoc) {
          for (var i = 0; i < images.length; i++) {
            var reportbasee64 = _base64ToArrayBuffer(images[i].file);
            if (images[i].extension === 'jpg' || images[i].extension === 'jpeg') {
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
                    var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                      type: 'application/pdf'
                    }));
                    if (vm.type === 1) {
                      var a = document.createElement("a");
                      a.setAttribute("download", vm.order + ".pdf");
                      a.setAttribute("href", pdfUrl);
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      logger.info($filter('translate')('0211'));
                    } else {
                      document.getElementById('pdf').src = pdfUrl;
                    }
                    $scope.$apply(function () {
                      vm.loading = false;
                    });
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
                    var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                      type: 'application/pdf'
                    }));
                    if (vm.type === 1) {
                      var a = document.createElement("a");
                      a.setAttribute("download", vm.order + ".pdf");
                      a.setAttribute("href", pdfUrl);
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      logger.info($filter('translate')('0211'));
                    } else {
                      document.getElementById('pdf').src = pdfUrl;
                    }
                    $scope.$apply(function () {
                      vm.loading = false;
                    });
                  });
                }
              });
            }
          }
        }


        function setReport(parameterReport, datareport) {

          setTimeout(function () {
            Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkLGVcN+bpBmun+R2BRIKs8z3U9Q3qMl9QZwpdoqVEoeTR5v9" +
              "9NEVUdMFq0E8GmiSgDVUpjdje4mRPlh9ChdF5D/dsLbKw4o0RukpfbtVI2RxkdSpv9D35WHQUGab9FX4+LJdMJQvlh" +
              "5KvpRTwawH95BNVJAMNn6wPznC+40WjzxgXipSOKnjMGArxsoAynOnZlNFJ4GGdnaz7Hwxqz091IWnszsoCxqIG+5e" +
              "x5Ztsj4y6KQ5Dfu1E5g8atl99q7fBRZDXZNG3CNnb/jXuRHB6mwS88AmejPFdPkkaNiMeUDliFoiKivbylMnTh7Gnl" +
              "QyV+BtOH0xQ/BwnAOmtkMTI0QcAujH9IRJ50ClaaHhJxZFVLaYZLWV/oAWrk2TIQGhVCl48g58hZ72XmMNUgMtBEhz" +
              "5J6gyjEGKwZQfL8GDqMc1JqftgW6ONC4BFwM+evU7QUfnF6Qlr+dYdBMhBwfFOyM71leMi9q2fA3VQHbVwXkPTFahY" +
              "KgBSOEI2nk1Y99FUGk0zkDjx6duWpy98jAxd5Nzu4VCitvXK14mGo88O1A==";
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
            report.renderAsync(function () {
              var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
              var service = new Stimulsoft.Report.Export.StiPdfExportService();
              var stream = new Stimulsoft.System.IO.MemoryStream();
              service.exportToAsync(function () {
                // Export to PDF (#1)
                var data = stream.toArray();
                var buffer = new Uint8Array(data);

                vm.copyPages(buffer, datareport.attachments);

                // Export to PDF (#2)


              }, report, stream, settings);

              //  service.exportTo(report, stream, settings);
            });
          }, 50);
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
            } else if (vm.demographicTemplate.encoded && vm.demographicTemplate.id === -7 || vm.demographicTemplate.encoded && vm.demographicTemplate.id === -10) {
              if (vm.demographicTemplate.id === -7) {
                order.demographicItemTemplate = order.patient.race;
                template = vm.nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
              } else {
                order.demographicItemTemplate = order.patient.documentType;
                template = vm.nameDemographic + '_' + order.demographicItemTemplate.abbr + '.mrt';

              }
            } else if (vm.demographicTemplate.encoded && vm.demographicTemplate.id < 0) {
              order.demographicItemTemplate = order[vm.referenceDemographic];
              template = vm.nameDemographic + '_' + order.demographicItemTemplate.code + '.mrt';
            } else {
              template = vm.nameDemographic + '.mrt';
            }

            if (_.filter(vm.listreports, function (o) {
              return o.name === template
            }).length > 0) {
              return template;
            } else {
              return 'reports.mrt';
            }
          } else {
            return 'reports.mrt';
          }
        }

      }],
      controllerAs: 'vmd'
    };
    return directive;
  }
})();
/* jshint ignore:end */
