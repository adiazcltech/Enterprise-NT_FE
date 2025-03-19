
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
        idiome: '=?idiome',
        type: '=?type',
        download: '=?download'
      },
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.getOrder = getOrder;
        vm.openReport = openReport;
        vm.getTemplateReport = getTemplateReport;
        vm.setReport = setReport;
        vm.copyPages = copyPages;
        vm.keyConfiguration = keyConfiguration;
        vm.getOrderend = getOrderend;
        vm.printOrder = printOrder;
        vm.sendbuffer = sendbuffer;
        vm.loadImages = loadImages;
        vm.testaidafilter = false;

        $scope.$watch('openreport', function () {
          if ($scope.openreport) {
            vm.loading = true;
            vm.type = $scope.type;
            vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
            vm.formatDate = vm.formatDate === '' ? 'DD/MM/YYYY' : vm.formatDate;
            vm.VerReporteResultados = localStorageService.get('VerReporteResultados') == 'true' ? true : false;
            vm.listreports = $scope.listreports;
            vm.order = $scope.order;
            vm.listTest = $scope.tests;
            vm.demographicTemplate = $scope.demographictemplate;
            vm.referenceDemographic = $scope.referencedemographic;
            vm.nameDemographic = $scope.namedemographic;
            vm.idiome = $scope.idiome;
            vm.download = $scope.download;
            $scope.openreport = false;
            vm.keyConfiguration();
          }
        });
        function keyConfiguration() {
          if (vm.listreports !== undefined) {
            if (vm.type === 1) {
              vm.getOrder();
            } else {
              vm.getOrderend();
            }
          }
        }
        function getOrderend() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var json = {
            'rangeType': 1,
            'init': vm.order,
            'end': vm.order
          };
          return orderDS.getOrderHeader(auth.authToken, json).then(function (data) {
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
              return orderDS.getOrderPreliminaryend(auth.authToken, data).then(function (data) {
                if (data.data !== '') {
                  vm.datareport = data.data.listOrders[0];
                  var dataOrder = data.data.listOrders[0].order;
                  if (dataOrder.resultTest.length > 0) {
                    var listechnique = [];
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
                            find2.push(object);
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
                          listechnique.push(resulttechnique);
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
                  if (dataOrder.comments.length > 0) {
                    dataOrder.comments.forEach(function (value) {
                      try {
                        var comment = JSON.parse(value.comment);

                        comment = comment.content;
                        value.comment = comment.substring(1, comment.length - 1)
                      }
                      catch (e) {
                        value.comment = value.comment;
                      }
                    });
                  }
                  dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
                  dataOrder.patient.age = common.getAgeAsString(dataOrder.patient.birthday, vm.formatDate);
                  dataOrder.attachments = vm.datareport.attachments === undefined ? [] : vm.datareport.attachments;

                  return orderDS.getUserValidate(vm.order).then(function (datafirm) {

                    dataOrder.listfirm = [];
                    for (var i = 0; i < dataOrder.resultTest.length; i++) {
                      dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(vm.formatDate + ' hh:mm:ss a.');
                      if (dataOrder.resultTest[i].microbiologyGrowth !== undefined) {
                        dataOrder.resultTest[i].microbiologyGrowth.lastTransaction = moment(dataOrder.resultTest[i].microbiologyGrowth.lastTransaction).format(vm.formatDate + ' hh:mm:ss a.');
                      }
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
                            'firm': user.length === 0 ? '' : user[0].photo
                          };
                          dataOrder.listfirm.push(firm);
                        }
                      }
                    }

                    vm.testaidafilter = _.filter(dataOrder.resultTest, function (o) {
                      return o.testCode === '9222' || o.testCode === '503' || o.testCode === '4003' || o.testCode === '5051' || o.testCode === '5052' || o.testCode === '5053' || o.testCode === '7828' || o.testCode === '7077' || o.testCode === '9721' || o.testCode === '9301' || o.profileId === 1066;
                    }).length > 0;

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
        function getOrder() {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var json = {
            'rangeType': 1,
            'init': vm.order,
            'end': vm.order
          };

          return orderDS.getOrderHeader(auth.authToken, json).then(function (data) {
            if (data.data.length > 0) {
              var data = {
                'printOrder': [{
                  'physician': null,
                  'listOrders': [{
                    order: data.data[0]
                  }]
                }],
                'typeReport': 2,
                'isAttached': true
              };

              return orderDS.printreport(auth.authToken, data).then(function (data) {
                if (data.data !== '') {
                  if (data.data.resultTest.length !== 0) {
                    var listechnique = [];
                    data.data.resultTest.forEach(function (value) {
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
                          var dataperfil = $filter("filter")(data.data.resultTest, function (e) {
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
                      // value.result = vm.type === 1 ? $filter('translate')('0233') : value.result;
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
                  var dataOrder = data.data;
                  if (dataOrder.allDemographics.length > 0) {
                    dataOrder.allDemographics.forEach(function (value2) {
                      dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                      dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
                    });
                  }
                  if (dataOrder.comments.length > 0) {
                    dataOrder.comments.forEach(function (value) {
                      try {
                        var comment = JSON.parse(value.comment);

                        comment = comment.content;
                        value.comment = comment.substring(1, comment.length - 1)
                      }
                      catch (e) {
                        value.comment = value.comment;
                      }
                    });
                  }
                  dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' hh:mm:ss a.');
                  dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
                  dataOrder.patient.age = common.getAgeAsString(dataOrder.patient.birthday, vm.formatDate);


                  return orderDS.getUserValidate(vm.order).then(function (datafirm) {

                    dataOrder.listfirm = [];
                    for (var i = 0; i < dataOrder.resultTest.length; i++) {
                      dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(vm.formatDate + ' hh:mm:ss a.');
                      dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(vm.formatDate + ' hh:mm:ss a.');
                      if (dataOrder.resultTest[i].microbiologyGrowth !== undefined) {
                        dataOrder.resultTest[i].microbiologyGrowth.lastTransaction = moment(dataOrder.resultTest[i].microbiologyGrowth.lastTransaction).format(vm.formatDate + ' hh:mm:ss a.');
                      }
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
                            'firm': user.length === 0 ? '' : user[0].photo
                          };
                          dataOrder.listfirm.push(firm);
                        }
                      }
                    }

                    vm.testaidafilter = _.filter(dataOrder.resultTest, function (o) {
                      return o.testCode === '9222' || o.testCode === '503' || o.testCode === '4003' || o.testCode === '5051' || o.testCode === '5052' || o.testCode === '5053' || o.testCode === '7828' || o.testCode === '7077' || o.testCode === '9721' || o.testCode === '9301' || o.profileId === 1066;
                    }).length > 0;

                    dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                    vm.openReport(dataOrder);
                  })
                } else {
                  logger.info("No existen datos para generar el reporte");
                  vm.loading = false;
                }
              });

            } else {
              logger.info("No existen datos para generar el reporte");
              vm.loading = false;
            }
          });
        }
        function openReport(order) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var parameterReport = {};
          parameterReport.variables = {
            'username': auth.userName,
            'titleReport': 'Informe preliminar',
            'date': moment().format(vm.formatDate + ' hh:mm:ss a.'),
            'formatDate': vm.formatDate,
            'reportOrder': true,
            'codeorder': "/orqrm:" + btoa(vm.order),
            'destination': "2",
            'typeprint': "4",
            'testfilterview': vm.testaidafilter
          };
          parameterReport.pathreport = 'reports/' + vm.getTemplateReport(order);
          parameterReport.labelsreport = vm.idiome;
          vm.setReport(parameterReport, order);
        }
        function printOrder(order) {
          var auth = localStorageService.get('Enterprise_NT.authorizationData');
          var parameterReport = {};
          parameterReport.variables = {
            'username': auth.userName,
            'titleReport': 'Informe final',
            'date': moment().format(vm.formatDate + ' hh:mm:ss a.'),
            'formatDate': vm.formatDate,
            'codeorder': "/orqrm:" + btoa(vm.order),
            'destination': "2",
            'typeprint': "1",
            'testfilterview': vm.testaidafilter
          };
          parameterReport.pathreport = '/reports/' + vm.getTemplateReport(order);
          parameterReport.labelsreport = vm.idiome;
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

                  var mergepdfs = '';
                  var calcula = 0;

                  var pdfs = _.filter(attachments, function (o) { return o.extension === 'pdf'; });
                  var images = _.filter(attachments, function (o) { return o.extension !== 'pdf'; });

                  if (pdfs.length > 0) {
                    orderDS.mergepdf(pdfs).then(function (response) {
                      if (response.status === 200) {
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
                            if (pdfs.length === 1) {
                              var totalpages = pdfDoc.getPages().length;
                              pdfDoc.removePage(totalpages - 1);
                            }
                            if (images.length > 0) {
                              vm.loadImages(images, calcula, pdfDoc);
                            } else {
                              pdfDoc.save().then(function (pdf) {
                                var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                                  type: 'application/pdf'
                                }));
                                $scope.$apply(function () {
                                  vm.loading = false;
                                });
                                if (vm.VerReporteResultados) {
                                  var a = document.getElementById("previreport");
                                  var binary = '';
                                  for (var i = 0; i < pdf.length; i++) {
                                    binary += String.fromCharCode(pdf[i]);
                                  }
                                  var base64String = btoa(binary);
                                  a.type = 'application/pdf';
                                   a.src = 'data:application/pdf;base64,' + base64String;
                                  a.height = '100%'
                                } else {
                                  if (vm.download === 1) {
                                    var a = document.createElement("a");
                                    a.setAttribute("download", vm.order + ".pdf");
                                    a.setAttribute("href", pdfUrl);
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  } else {
                                    window.open(pdfUrl, '_blank');
                                  }
                                  if (vm.type === 2) {
                                    vm.sendbuffer();
                                  }
                                }
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
                    var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                      type: 'application/pdf'
                    }));
                    $scope.$apply(function () {
                      vm.loading = false;
                    });
                    if (vm.VerReporteResultados) {
                      var a = document.getElementById("previreport");
                      var binary = '';
                      for (var i = 0; i < pdf.length; i++) {
                        binary += String.fromCharCode(pdf[i]);
                      }
                      var base64String = btoa(binary);
                      a.type = 'application/pdf';
                       a.src = 'data:application/pdf;base64,' + base64String;
                      a.height = '100%'
                    } else {
                      if (vm.download === 1) {
                        var a = document.createElement("a");
                        a.setAttribute("download", vm.order + ".pdf");
                        a.setAttribute("href", pdfUrl);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      } else {
                        window.open(pdfUrl, '_blank');
                      }
                      if (vm.type === 2) {
                        vm.sendbuffer();
                      }
                    }
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
                    $scope.$apply(function () {
                      vm.loading = false;
                    });
                    if (vm.VerReporteResultados) {
                      var a = document.getElementById("previreport");
                      var binary = '';
                      for (var i = 0; i < pdf.length; i++) {
                        binary += String.fromCharCode(pdf[i]);
                      }
                      var base64String = btoa(binary);
                      a.type = 'application/pdf';
                       a.src = 'data:application/pdf;base64,' + base64String;
                      a.height = '100%'
                    } else {
                      if (vm.download === 1) {
                        var a = document.createElement("a");
                        a.setAttribute("download", vm.order + ".pdf");
                        a.setAttribute("href", pdfUrl);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      } else {
                        window.open(pdfUrl, '_blank');
                      }
                      if (vm.type === 2) {
                        vm.sendbuffer();
                      }
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
                if (calcula === images.length) {
                  pdfDoc.save().then(function (pdf) {
                    var pdfUrl = URL.createObjectURL(new Blob([pdf], {
                      type: 'application/pdf'
                    }));
                    $scope.$apply(function () {
                      vm.loading = false;
                    });
                    if (vm.VerReporteResultados) {
                      var a = document.getElementById("previreport");
                      var binary = '';
                      for (var i = 0; i < pdf.length; i++) {
                        binary += String.fromCharCode(pdf[i]);
                      }
                      var base64String = btoa(binary);
                      a.type = 'application/pdf';
                       a.src = 'data:application/pdf;base64,' + base64String;
                      a.height = '100%'
                    } else {
                      if (vm.download === 1) {
                        var a = document.createElement("a");
                        a.setAttribute("download", vm.order + ".pdf");
                        a.setAttribute("href", pdfUrl);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      } else {
                        window.open(pdfUrl, '_blank');
                      }
                      if (vm.type === 2) {
                        vm.sendbuffer();
                      }
                    }
                  });
                }
              });
            }
          }
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
              vm.datareport.order.resultTest[i].microbiologyGrowth.lastTransaction = null;
            }
          }
          var personRecive = auth.userName;

          var datachange = {
            "filterOrderHeader": { "printingMedium": "4", "typeReport": "1", "personReceive": personRecive },
            "order": vm.datareport.order,
            "user": auth.id
          }
          return orderDS.changeStateTest(auth.authToken, datachange).then(function (data) {
            if (data.status === 200) {
            }
          }, function (error) {
          });
        }
        function setReport(parameterReport, datareport) {
          setTimeout(function () {
            Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHmi1+A2EZ9zb8Cp0WbC0Q+eBLvK6rTKzvDhnH1zVHS3ylMnUl" +
              "AtX6dHzjEekruj9gmsLFvIKulyE3C3uBe+uG4cI04/SEEhDHE0ztmhTdTnEFdImPyIX5Lxjcfy+KQ3geG1zLyTPftv" +
              "JZDI7EFE7oxupw6zohAj6d4YFHQagDcUq+cG09zEnLaWgMGJp0tkrpEBOzgtjfvHAth2Jwa7qDm3sySiHxZqDF1lSi" +
              "97C8ThN3K3IlrOjKmbHEe/UNR5QWIJywhTtFke6wUN6Tt2KISuwe/2KoA1EIQoYLbG3f8llGJHljzTNLlwGGM6e2/5" +
              "kHoIo/HrTAWk+DAeoMdXb8I/d0Xtu3GhoT9NTUa9JMF+3mMR23G+amasdVEu1Eb0oT8pwkvZYl/zs0ByOLlPRcKiYF" +
              "DC/NA33nTRR56dFn2Z78ycvYwrJMxIh06TWP/dcE5fDtADp7I73ow+m25XZnhpjxqWkJ54PA6YqTqaZVSidoHImBlz" +
              "FjNbTwZ3af9jO6IBoyOoQK7IAvQLBpLx0ZsZ4UbOnxMd8ZrHIUnpn9UmeQ==";
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
