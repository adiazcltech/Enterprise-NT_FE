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
        .directive('resultreportfinal', resultreportfinal);

    resultreportfinal.$inject = ['$filter', 'reportsDS', 'localStorageService',
        '$translate', 'demographicDS', 'reportadicional','common', 'keyStimulsoft'
    ];

    /* @ngInject */
    function resultreportfinal($filter, reportsDS, localStorageService,
        $translate, demographicDS, reportadicional,common, keyStimulsoft) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-reportfinal.html',
            scope: {
                order: '=?order',
                openreport: '=?openreport',
                functionexecute: '=?functionexecute'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                vm.demographicTitle = localStorageService.get('DemograficoTituloInforme');
                vm.showadditionalmail = localStorageService.get('PedirCorreoAdicional')==='True';
                vm.UrlNodeJs = localStorageService.get('UrlNodeJs');
                vm.printOrder = printOrder;
                vm.getTemplateReport = getTemplateReport;
                vm.getDemographicsALL = getDemographicsALL;
                vm.getlistReportFile = getlistReportFile;
                vm.modalError = modalError;
                vm.message = '';
                vm.viewreport = viewreport;

                vm.getDemographicsALL();
                vm.getlistReportFile();

                vm.defaulttypeprint = '1';

                $scope.$watch('openreport', function () {
                    if ($scope.openreport) {
                        vm.order = $scope.order;
                        $scope.openreport = false;

                        return reportadicional.testServerPrint(vm.UrlNodeJs).then(function (data) {
                            if (data.status === 200) {
                                UIkit.modal('#modalfinalreport').show();
                            }
                            vm.loading = false;
                        }, function (error) {
                            UIkit.modal('#logNoSerialPrincipal', {
                                modal: false
                            }).show();
                            vm.loading = false;
                        });

                    }
                });

                function printOrder(parameters) {
                    vm.loading = true;
                    vm.parameter = parameters;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var json = {
                        'rangeType': 1,
                        'init': vm.order,
                        'end': vm.order
                    };
                    return reportsDS.getOrderHeader(auth.authToken, json).then(function (data) {
                        if (data.data.length > 0) {

                            var order = data.data[0];

                            var titleReport = (parameters.typeprint === '1' || parameters.typeprint === '0') ? $filter('translate')('0399') : (parameters.typeprint === '3' ? $filter('translate')('1065') : $filter('translate')('1066'));

                            vm.variables = {
                                'entity': vm.nameCustomer,
                                'abbreviation': vm.abbrCustomer,
                                'username': auth.userName,
                                'name': auth.name,
                                'lastName': auth.lastName,
                                'titleReport': titleReport,
                                'date': moment().format(vm.formatDate + ' HH:mm:ss'),
                                'formatDate': vm.formatDate
                            };

                            vm.datageneral = {
                                'printOrder': [],
                                'labelsreport': JSON.stringify($translate.getTranslationTable()),
                                'variables': JSON.stringify(vm.variables),
                                'numberCopies': parameters.quantityCopies,
                                'attached': parameters.attachments,
                                'rangeType': 2,
                                'typeReport': parameters.typeprint,
                                'printingType': 1, //tipo reporte o codigo de barras
                                'printingMedium': parameters.destination,
                                'serial': parameters.serial,
                                'sendEmail': parameters.sendEmail
                            };

                            order.templateorder = vm.getTemplateReport(order);

                            switch (parameters.destination) {
                                case '1':

                                    vm.datageneral.printOrder[0] = {
                                        'listOrders': [{
                                            'order': order
                                        }]
                                    };
                                    break;
                                case '2':


                                    vm.datageneral.printOrder[0] = {
                                        'physician': {
                                            'id': 0
                                        },
                                        'listOrders': [{
                                            'order': order
                                        }]
                                    };
                                    break;
                                case '3':
                                    if (parameters.sendEmail == 1) {

                                        vm.datageneral.printOrder[0] = {
                                            'physician': {
                                                'id': 0
                                            },
                                            'listOrders': [{
                                                'order': order
                                            }]
                                        };
                                    } else {

                                        vm.datageneral.printOrder[0] = {
                                            'physician': order.physician,
                                            'listOrders': [{
                                                'order': order
                                            }]
                                        };
                                    }
                                    break;
                            }

                            vm.datageneral.variables = JSON.stringify(vm.variables);
                            UIkit.modal('#modalfinalreport').hide();

                            return reportsDS.printOrderBody(auth.authToken, vm.datageneral).then(function (data) {
                                if (data.status === 200) {
                                    vm.loading = false;
                                    if (data.data[0].printing) {
                                        if (parameters.typeprint === '1') {
                                            $scope.functionexecute();
                                        }

                                    } else {
                                        vm.message = $filter('translate')('0152');
                                        UIkit.modal('#logNoDataFinal').show();
                                    }
                                }
                            }, function (error) {
                                vm.loading = false;
                                if (error.data.code === 2) {
                                    vm.message = $filter('translate')('1074');
                                    UIkit.modal('#logNoDataFinal').show();
                                } else {
                                    vm.modalError(error);
                                }

                            });
                        } else {
                            vm.message = $filter('translate')('0152');
                            UIkit.modal('#logNoDataFinal').show();
                        }
                    });

                }

                function viewreport(data) {
                    //getOrderPreliminary
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return reportsDS.getOrderPreliminaryend(auth.authToken, data).then(function (data) {
                        if (data.data !== '') {
                            vm.datareport = data.data.listOrders[0];
                            var dataOrder = data.data.listOrders[0].order;
                            if (dataOrder.allDemographics.length > 0) {
                                dataOrder.allDemographics.forEach(function (value2) {
                                    dataOrder['demo_' + value2.idDemographic + '_name'] = value2.demographic;
                                    dataOrder['demo_' + value2.idDemographic + '_value'] = value2.encoded === false ? value2.notCodifiedValue : value2.codifiedName;
                                });
                            }
                            dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' HH:mm:ss');
                            dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
                            dataOrder.patient.age = common.getAgeAsString(dataOrder.patient.birthday, vm.formatDate);
                            dataOrder.attachments = vm.datareport.attachments === undefined ? [] : vm.datareport.attachments;

                            return reportsDS.getUserValidate(vm.order).then(function (datafirm) {

                                dataOrder.listfirm = [];
                                for (var i = 0; i < dataOrder.resultTest.length; i++) {
                                    dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(vm.formatDate + ' HH:mm:ss');
                                    dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(vm.formatDate + ' HH:mm:ss');
                                    dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(vm.formatDate + ' HH:mm:ss');
                                    dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(vm.formatDate + ' HH:mm:ss');
                                    dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(vm.formatDate + ' HH:mm:ss');
                                    dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(vm.formatDate + ' HH:mm:ss');

                                    if(dataOrder.resultTest[i].microbiologyGrowth !== undefined){
                                        dataOrder.resultTest[i].microbiologyGrowth.lastTransaction = moment(dataOrder.resultTest[i].microbiologyGrowth.lastTransaction).format(vm.formatDate + ' HH:mm:ss');
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
                                                'firm': user[0].photo
                                            };
                                            dataOrder.listfirm.push(firm);
                                        }
                                    }
                                }
                                dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                                vm.addreport(dataOrder);
                            })
                        } else {
                            vm.message = $filter('translate')('0152');
                            UIkit.modal('#logNoDataFinal').show();
                            vm.loading = false;
                        }
                    });

                }
                vm.addreport = addreport;
                function addreport(order) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var parameterReport = {};
                    var titleReport = (vm.parameter.typeprint === '1' || vm.parameter.typeprint === '0') ? $filter('translate')('0399') : (vm.parameter.typeprint === '3' ? $filter('translate')('1065') : $filter('translate')('1066'));
                    parameterReport.variables = {
                        'entity': vm.nameCustomer,
                        'abbreviation': vm.abbrCustomer,
                        'username': auth.userName,
                        'name': auth.name,
                        'lastName': auth.lastName,
                        'titleReport': titleReport,
                        'date': moment().format(vm.formatDate + ' HH:mm:ss'),
                        'formatDate': vm.formatDate
                    };
                    parameterReport.pathreport = '/Report/reportsandconsultations/reports/' + vm.getTemplateReport(order);
                    parameterReport.labelsreport = $translate.getTranslationTable();
                    vm.dataorder = order;
                    vm.setReport(parameterReport, order);

                }

                vm.setReport = setReport;
                function setReport(parameterReport, datareport) {

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

                        report.renderAsync(function () {
                            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                            var service = new Stimulsoft.Report.Export.StiPdfExportService();
                            var stream = new Stimulsoft.System.IO.MemoryStream();
                            service.exportToAsync(function () {
                                // Export to PDF (#1)
                                var data = stream.toArray();
                                var buffer = new Uint8Array(data);

                                vm.copyPages(buffer, datareport.attachments);
                                /*
                                // Export to PDF (#2)
                                var data = stream.toArray();
                                Object.saveAs(data, 'SimplePDF2.pdf', 'application/pdf');
                                console.log("Rendered report saved into PDF-file #2.");
                                */
                            }, report, stream, settings);

                            //  service.exportTo(report, stream, settings);

                        });
                    }, 50);
                }

                vm.copyPages = copyPages;
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
                                                            window.open(pdfUrl, '_blank');
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
                                                        window.open(pdfUrl, '_blank');
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
                                                        window.open(pdfUrl, '_blank');
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
                                        window.open(pdfUrl, '_blank');
                                    });
                                }

                            });
                        }, function (reason) {
                            alert('Failed: ' + reason);
                        });
                    });
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

                //Método que devuelve la lista de demofgráficos
                function getDemographicsALL() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    if (parseInt(vm.demographicTitle) !== 0) {
                        return demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
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

                //** Método para sacar el popup de error**//
                function modalError(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                }


            }],
            controllerAs: 'vmd'
        };
        return directive;
    }
})();
/* jshint ignore:end */
