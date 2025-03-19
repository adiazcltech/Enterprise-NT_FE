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

  resultreportpreliminary.$inject = ['$filter', 'localStorageService', '$translate', 'dataservice', 'logger'];

  /* @ngInject */
  function resultreportpreliminary($filter, localStorageService, $translate, dataservice, logger) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/widgets/results-reportpreliminary.html',
      scope: {
        order: '=?order',
        tests: '=?tests',
        pathreport: '=?pathreport',
        openreport: '=?openreport',
        type: '=?type',
        listreports: '=?listreports'
      },

      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.getOrder = getOrder;
        vm.printOrder = printOrder;
        vm.getTemplateReport = getTemplateReport;
        vm.getDemographicsALL = getDemographicsALL;
        vm.getlistReportFile = getlistReportFile;
        vm.setReport = setReport;
        vm.copyPages = copyPages;
        vm.sendbuffer = sendbuffer;
        vm.keyConfiguration = keyConfiguration;
        $scope.$watch('openreport', function () {
          if ($scope.openreport) {
            vm.loading = true;
            vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
            vm.demographicTitle = localStorageService.get('DemograficoTituloInforme');
            vm.preliminaryAttachment = localStorageService.get('ImprimirAdjuntosPreliminar');
            vm.preliminaryComplete = localStorageService.get('VerPreliminarRegistro') === 'True';
            vm.listreports = $scope.listreports;
            vm.order = $scope.order;
            vm.pathreport = $scope.pathreport;
            vm.listTest = $scope.tests;           
            vm.type = $scope.type;
            $scope.openreport = false;
            vm.getDemographicsALL();
            vm.keyConfiguration();
          }
        });

        function keyConfiguration() {
          vm.getlistReportFile();
        }
        function getOrder() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var json = {
            'rangeType': 1,
            'init': vm.order,
            'end': vm.order
          };
          return dataservice.getOrderHeader(auth.authToken, json).then(function (data) {
            if (data.data.length > 0) {
              var data = {
                "printOrder": [
                  {
                    "physician": null,
                    "listOrders": [
                      {
                        "order": data.data[0]
                      }
                    ]
                  }
                ],
                "typeReport": 0,
                "isAttached": true
              };
              var auth = localStorageService.get('Enterprise_NT.authorizationData');
              return dataservice.getOrderPreliminaryend(auth.authToken, data).then(function (data) {
                if (data.data !== '') {
                  vm.datareport = data.data.listOrders[0];
                  var dataOrder = data.data.listOrders[0].order;
                  var listechnique = [];
                  if (dataOrder.resultTest.length > 0) {
                    dataOrder.resultTest.forEach(function (value) {
                      value.technique = value.technique === undefined ? '' : value.technique;
                      if (value.profileId === 0) {
                        value.viewvalidationUser = true;
                        value.viewtechnique = true;
                        value.techniqueprofile = value.technique
                      } else {
                        var filtertecnique = $filter("filter")(JSON.parse(JSON.stringify(listechnique)), function (e) {
                          return e.profileId === value.profileId;
                        })
                        if (filtertecnique.length !== 0) {
                          if (value.technique === filtertecnique[0].technique) {
                            value.viewtechnique = false;
                          } else {
                            value.viewtechnique = true;
                          }
                          value.techniqueprofile = filtertecnique[0].technique;
                        } else {
                          var dataperfil = $filter("filter")(dataOrder.resultTest, function (e) {
                            return e.profileId === value.profileId;
                          })
                          var dataperfil = _.orderBy(dataperfil, 'printSort', 'asc');
                          if (dataperfil.length !== 0) {
                            dataperfil.forEach(function (value, key) {
                              if (dataperfil[key].validationUserId != undefined) {
                                if (key === dataperfil.length - 1) {
                                  value.viewvalidationUser = true;
                                } else if (dataperfil[key].validationUserId !== dataperfil[key + 1].validationUserId) {
                                  value.viewvalidationUser = true;
                                } else {
                                  value.viewvalidationUser = false;
                                }
                              } else {
                                value.viewvalidationUser = false;
                              }
                            });
                          }
                          var find = _.map(dataperfil, 'technique').reduce(function (acc, curr) {
                            if (typeof acc[curr] == 'undefined') {
                              acc[curr] = 1;
                            } else {
                              acc[curr] += 1;
                            } return acc;
                          }, {})
                          var find2 = []
                          for (var propiedad in find) {
                            var object = {
                              technique: [propiedad][0],
                              occurrence: find[propiedad]
                            };
                            find2.add(object);
                          }
                          var find = _.orderBy(find2, 'occurrence', 'desc');
                          if (find[0].technique === value.technique) {
                            value.viewtechnique = false;
                          } else {
                            value.viewtechnique = true;
                          }
                          value.techniqueprofile = find[0].technique;
                          var resulttechnique = {
                            "profileId": value.profileId,
                            "technique": value.techniqueprofile,
                          }
                          listechnique.add(resulttechnique);
                        }
                      }
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
                  dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
                  dataOrder.patient.age = dataservice.getAgeAsString(dataOrder.patient.birthday, vm.formatDate);
                  dataOrder.attachments = vm.datareport.attachments === undefined ? [] : vm.datareport.attachments;

                  return dataservice.getUserValidate(vm.order).then(function (datafirm) {

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
                    dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                    vm.printOrder(dataOrder);
                  })
                } else {
                  logger.warning("No existe datos para generar el reporte");
                  vm.loading = false;
                }
              });
            } else {
              logger.warning("No existe datos para generar el reporte");
              vm.loading = false;
            }
          });
        }
        function printOrder(order) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var parameterReport = {};
          parameterReport.variables = {
            'username': auth.userName,
            'titleReport': $filter('translate')('0399'),
            'date': moment().format(vm.formatDate + ' hh:mm:ss a.'),
            'formatDate': vm.formatDate
          };
          parameterReport.pathreport = '/reports/' + vm.getTemplateReport(order);
          parameterReport.labelsreport = $translate.getTranslationTable();
          vm.dataorder = order;
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
                              if (vm.type === 1) {
                                document.getElementById('pdf').src = pdfUrl;
                                vm.sendbuffer();
                                vm.loading = false;
                              } else {
                                window.open(pdfUrl, '_blank');
                                vm.sendbuffer();
                                vm.loading = false;
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
                            if (vm.type === 1) {
                              document.getElementById('pdf').src = pdfUrl;
                              vm.sendbuffer();
                              vm.loading = false;
                            } else {
                              window.open(pdfUrl, '_blank');
                              vm.sendbuffer();
                              vm.loading = false;
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
                          y: page.getHeight() / 2 - pngDims.height / 2,
                          width: pngDims.width,
                          height: pngDims.height,
                        });
                        calcula++;
                        if (calcula === attachments.length) {
                          pdfDoc.save().then(function (pdf) {
                            var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                              type: 'application/pdf'
                            }));
                            if (vm.type === 1) {
                              document.getElementById('pdf').src = pdfUrl;
                              vm.sendbuffer();
                              vm.loading = false;
                            } else {
                              window.open(pdfUrl, '_blank');
                              vm.sendbuffer();
                              vm.loading = false;
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
                    if (vm.type === 1) {
                      document.getElementById('pdf').src = pdfUrl;
                      vm.sendbuffer();
                      vm.loading = false;
                    } else {
                      window.open(pdfUrl, '_blank');
                      vm.sendbuffer();
                      vm.loading = false;
                    }
                  });
                }

              });
            }, function (reason) {
              alert('Failed: ' + reason);
            });
          });
        }       
        function sendbuffer() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          vm.datareport.order.createdDate = null;
          vm.datareport.order.patient.birthday = null;
          for (var i = 0; i < vm.datareport.order.resultTest.length; i++) {
            vm.datareport.order.resultTest[i].resultDate = '';
            vm.datareport.order.resultTest[i].validationDate = '';
            vm.datareport.order.resultTest[i].entryDate = '';
            vm.datareport.order.resultTest[i].takenDate = '';
            vm.datareport.order.resultTest[i].verificationDate = '';
            vm.datareport.order.resultTest[i].printDate = '';
            if (vm.datareport.order.resultTest[i].microbiologyGrowth !== undefined) {
              vm.datareport.order.resultTest[i].microbiologyGrowth.lastTransaction = '';
            }
          }
          var datachange = {
            "filterOrderHeader": { "printingMedium": "4", "typeReport": "1", "personReceive": auth.userName },
            "order": vm.datareport.order,
            "user": auth.id
          }
          return dataservice.changeStateTest(auth.authToken, datachange).then(function (data) {
            if (data.status === 200) {

            }

          }, function (error) {
            /*  vm.loading = false; */
            /*  vm.modalError(error); */
          });
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

              service.exportTo(report, stream, settings);
              var data = stream.toArray();
              var buffer = new Uint8Array(data);

              vm.copyPages(buffer, datareport.attachments);
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
        function getDemographicsALL() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          if (parseInt(vm.demographicTitle) !== 0) {
            return dataservice.getDemographicsALL(auth.authToken).then(function (data) {
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
          if (vm.listreports !== undefined) {
            vm.getOrder();
          }
        }
      }],
      controllerAs: 'vmd'
    };
    return directive;
  }
})();
/* jshint ignore:end */
