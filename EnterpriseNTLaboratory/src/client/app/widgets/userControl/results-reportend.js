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
        .directive('reportend', reportend)
        .factory('reportend', reportend);

    reportend.$inject = ['$filter', 'reportsDS', 'localStorageService',
        '$translate', 'demographicDS', 'reportadicional', 'common', '$rootScope', 'keyStimulsoft'
    ];

    /* @ngInject */
    function reportend($filter, reportsDS, localStorageService,
        $translate, demographicDS, reportadicional, common, $rootScope, keyStimulsoft) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-reportend.html',
            scope: {
                order: '=?order',
                openreport: '=?openreport',
                filterarea: '=?filterarea',
                area: '=?area',
                dataprint: '=?dataprint',
                filteritems: '=?filteritems',
                sendautomaticemail: '=?sendautomaticemail',
                receiveresult: '=?receiveresult',
                functionexecute: '=?functionexecute',
                test: '=?test'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
                vm.demographicTitle = localStorageService.get('DemograficoTituloInforme');
                vm.namePdfConfig = localStorageService.get('GenerarPDFCon');

                vm.EmailBody = localStorageService.get('EmailBody');
                vm.EmailSubjectPatient = localStorageService.get('EmailSubjectPatient');
                vm.EmailSubjectPhysician = localStorageService.get('EmailSubjectPhysician');
                vm.showadditionalmail = localStorageService.get('PedirCorreoAdicional')==='True';
                vm.UrlNodeJs = localStorageService.get('UrlNodeJs');
                vm.confidencialcodificado = localStorageService.get('Activarconfidencialidadprueba') === 'True';
                vm.areacodificado = parseInt(localStorageService.get('Examenconfidencial'));  
                vm.printOrder = printOrder;
                vm.getTemplateReport = getTemplateReport;
                vm.getDemographicsALL = getDemographicsALL;
                vm.getlistReportFile = getlistReportFile;
                vm.modalError = modalError;
                vm.message = '';
                vm.addreport = addreport;
                vm.setReport = setReport;
                vm.copyPages = copyPages;
                vm.sendbuffer = sendbuffer;
                vm.sendEmailInternal = sendEmailInternal;
                vm.changestatetestInternal = changestatetestInternal;
                vm.getDemographicsALL();
                vm.getlistReportFile();
                vm.querySearch = querySearch;
                vm.pdfPatient = '';
                vm.pdfUrlPatient = '';
                vm.defaulttypeprint = '1';
                vm.areall = [];
                vm.arelist = [];
                vm.loadImages = loadImages;
                vm.isAuxPhysicians = localStorageService.get('MedicosAuxiliares') === 'True';

                vm.printpefilcomplete = false;

                vm.testaidafilter = false;

                $scope.$watch('sendautomaticemail', function () {
                    if ($scope.sendautomaticemail) {
                        vm.order = $scope.order;
                        vm.dataprint = [];
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
                        printOrder(parameters);

                        $scope.sendautomaticemail = false;

                    }
                });

                $scope.$watch('receiveresult', function () {
                    vm.receiveresult = $scope.receiveresult === 1 ? true : false;
                });

                $scope.$watch('openreport', function () {
                    if ($scope.openreport) {
                        vm.update = !vm.update;
                        vm.namereceiveresult = "";
                        vm.order = $scope.order;
                        vm.testpage = $scope.test === undefined ? [] : $scope.test;
                        vm.dataprint = $scope.filterarea === 1 ? $scope.dataprint : [];
                        vm.filterarea = $scope.filterarea === 1 && vm.dataprint.length === 0 ? true : false;
                        if ($scope.filteritems) {
                            vm.Itemsdemo();
                        }
                        if (vm.filterarea) {
                            vm.areall = $filter('orderBy')($scope.area, 'name');
                            vm.arelist = _.clone(vm.areall);
                            var areapackage = {
                                'id': 0,
                                'name': ''
                            }
                            vm.arelist.push(areapackage);
                        }
                        $scope.openreport = false;

                        UIkit.modal('#modalfinalreport').show();
                    }
                });

                vm.Itemsdemo = Itemsdemo;
                function Itemsdemo() {
                    vm.filteritems = false;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return reportsDS.getdemo(auth.authToken, vm.order).then(function (data) {
                        if (data.status === 200) {
                            var email = _.concat(data.data.demographics, data.data.patient.demographics);
                            var data = [];
                            var dataList = [];
                            if (email !== undefined) {
                                if (email.length !== 0) {
                                    email.forEach(function (element, index) {
                                        if (element.email !== undefined && element.email !== '' && element.email !== null) {
                                            if (element.demographic === "ORDERTYPE") {
                                                element.demographic = $filter('translate')('0088');
                                            }
                                            if (element.demographic === "SERVICE") {
                                                element.demographic = $filter('translate')('0090');
                                            }
                                            if (element.demographic === "ACOUNT") {
                                                element.demographic = $filter('translate')('0085');
                                            }
                                            if (element.demographic === "RATE") {
                                                element.demographic = $filter('translate')('0087');
                                            }
                                            if (element.demographic === "RACE") {
                                                element.demographic = $filter('translate')('0091');
                                            }
                                            if (element.demographic === "DOCUMENTYPE") {
                                                element.demographic = $filter('translate')('0233');
                                            }
                                            if (element.demographic !== $filter('translate')('0085')) {
                                                dataList.push(element);
                                            }
                                            data.push(element);
                                        }
                                    });
                                }
                            }
                            if (data.length !== 0) {
                                vm.filteritems = true;
                                vm.emailall = data
                                vm.emailist = dataList;
                            }
                        }
                    }, function (error) {
                        vm.modalError(error);
                    });
                }

                function querySearch(criteria) {
                    if (criteria === '?') {
                        return vm.areall;
                    } else {
                        if (vm.areall.length === vm.arelist.length) {
                            return [];
                        } else {
                            var search = $filter("filter")(vm.areall, function (e) {
                                var validated = $filter("filter")(vm.arelist, function (f) {
                                    return f.id === e.id;
                                })
                                return e.name.indexOf(criteria.toLowerCase()) !== -1 && validated.length === 0 || e.name.indexOf(criteria.toUpperCase()) !== -1 && validated.length === 0;
                            });
                            return criteria ? search : [];
                        }
                    }

                }

                vm.querySearch1 = querySearch1;
                function querySearch1(criteria) {
                    if (criteria === '?') {
                        return vm.emailall;
                    } else {
                        if (vm.emailall.length === vm.emailist.length) {
                            return [];
                        } else {
                            var search = $filter("filter")(vm.emailall, function (e) {
                                var validated = $filter("filter")(vm.emailist, function (f) {
                                    return f.idDemographic === e.idDemographic;
                                })
                                return e.demographic.indexOf(criteria.toLowerCase()) !== -1 && validated.length === 0 || e.demographic.indexOf(criteria.toUpperCase()) !== -1 && validated.length === 0;
                            });
                            return criteria ? search : [];
                        }
                    }

                }

                function printOrder(parameters) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.parameter = parameters;
                    vm.loading = true;
                    UIkit.modal('#modalfinalreport').hide();
                    var json = {
                        'rangeType': 1,
                        'init': vm.order,
                        'end': vm.order
                    };
                    return reportsDS.getOrderHeader(auth.authToken, json).then(function (data) {
                        if (data.data.length > 0) {
                            var data = {
                                'printOrder': [{
                                    'physician': null,
                                    'listOrders': [{
                                        order: data.data[0]
                                    }]
                                }],
                                'typeReport': vm.parameter.typeprint,
                                'isAttached': vm.parameter.attachments,
                                'typeNameFile': vm.namePdfConfig
                            };
                            //getOrderPreliminary
                            return reportsDS.getOrderPreliminaryend(auth.authToken, data).then(function (data) {
                                if (data.data !== '') {
                                    vm.datareport = data.data.listOrders[0];
                                    var dataOrder = data.data.listOrders[0].order;
                                    dataOrder.languageReport = parameters.language == "1" ? "es" : "en";
                                    var resultTestlist = [];
                                    dataOrder.attachments = vm.datareport.attachments === undefined ? [] : vm.datareport.attachments;
                                    if (dataOrder.resultTest.length > 0) {
                                        if (dataOrder.attachments.length !== 0) {
                                            vm.listTestComplete = [];
                                            vm.listTestComplete = _.clone(dataOrder.resultTest);
                                            var printattament = [];
                                            dataOrder.attachments.forEach(function (value) {
                                                if (value.idTest === null && value.viewresul) {
                                                    printattament.push(value);
                                                } else {
                                                    var filter = _.filter(_.clone(vm.listTestComplete), function (o) { return o.testId === value.idTest; });
                                                    if (filter.length > 0 && value.viewresul) {
                                                        printattament.push(value);
                                                    }
                                                }
                                            });
                                            dataOrder.attachments = printattament;

                                        }
                                        dataOrder.resultTest.forEach(function (value) {
                                            value.id = value.testId;
                                            value.technique = value.technique === undefined ? '' : value.technique;
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
                                            if (vm.printpefilcomplete) {
                                                if (value.profileId !== 0) {
                                                    var calculater = _.filter(_.clone(dataOrder.resultTest), function (o) { return o.profileId === value.profileId });
                                                    var comparated = vm.testpage[value.profileId] === undefined ? [] : vm.parameter.typeprint == "1" ? _.filter(_.clone(vm.testpage[value.profileId]), function (o) { return o.state === 4 }) : vm.testpage[value.profileId];
                                                    if (calculater.length === comparated.length) {
                                                        resultTestlist.add(value);
                                                    }
                                                } else {
                                                    resultTestlist.add(value);
                                                }
                                            }
                                        });
                                        if (vm.printpefilcomplete) {
                                            dataOrder.resultTest = resultTestlist;
                                            if (dataOrder.resultTest.length === 0) {
                                                vm.message = $filter('translate')('0152');
                                                UIkit.modal('#logNoDataFinal').show();
                                                vm.loading = false;
                                                return false;
                                            }
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
                                        dataOrder.patient.age = common.getAgeDatePrint(moment(dataOrder.patient.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate, moment(dataOrder.createdDate).format(vm.formatDate.toUpperCase()));
                                        dataOrder.createdDate = moment(dataOrder.createdDate).format(vm.formatDate + ' HH:mm:ss');
                                        dataOrder.patient.birthday = moment(dataOrder.patient.birthday).format(vm.formatDate);
                                        return reportsDS.getUserValidate(vm.order).then(function (datafirm) {
                                            dataOrder.listfirm = [];
                                            for (var i = 0; i < dataOrder.resultTest.length; i++) {
                                                dataOrder.resultTest[i].resultDate = moment(dataOrder.resultTest[i].resultDate).format(vm.formatDate + ' HH:mm:ss');

                                                dataOrder.resultTest[i].validationDate = moment(dataOrder.resultTest[i].validationDate).format(vm.formatDate + ' HH:mm:ss');
                                                dataOrder.resultTest[i].entryDate = moment(dataOrder.resultTest[i].entryDate).format(vm.formatDate + ' HH:mm:ss');
                                                dataOrder.resultTest[i].takenDate = moment(dataOrder.resultTest[i].takenDate).format(vm.formatDate + ' HH:mm:ss');
                                                dataOrder.resultTest[i].verificationDate = moment(dataOrder.resultTest[i].verificationDate).format(vm.formatDate + ' HH:mm:ss');
                                                dataOrder.resultTest[i].printDate = moment(dataOrder.resultTest[i].printDate).format(vm.formatDate + ' HH:mm:ss');

                                                if (dataOrder.resultTest[i].microbiologyGrowth !== undefined) {
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

                                            var dataReportPatient = null;

                                            if (auth.confidential === true && vm.parameter.destination === '3' && vm.parameter.sendEmail === "3") {
                                                var dataReportPatient = _.clone(dataOrder);
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
                                                    vm.testaidafilter = _.filter(dataOrder.resultTest, function (o) {
                                                        return o.testCode === '9222' || o.testCode === '503' || o.testCode === '4003' || o.testCode === '5051' || o.testCode === '5052' || o.testCode === '5053' || o.testCode === '7828' || o.testCode === '7077' || o.testCode === '9721' || o.testCode === '9301' || o.profileId === 1066;
                                                    }).length > 0;

                                                    dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                                                    vm.addreport(dataOrder, null);
                                                }
                                            }
                                            else {

                                                vm.testaidafilter = _.filter(dataOrder.resultTest, function (o) {
                                                    return o.testCode === '9222' || o.testCode === '503' || o.testCode === '4003' || o.testCode === '5051' || o.testCode === '5052' || o.testCode === '5053' || o.testCode === '7828' || o.testCode === '7077' || o.testCode === '9721' || o.testCode === '9301' || o.profileId === 1066;
                                                }).length > 0;

                                                dataOrder.resultTest = _.orderBy(dataOrder.resultTest, ['printSort'], ['asc']);
                                                vm.addreport(dataOrder, dataReportPatient);
                                            }

                                        })
                                    }
                                    else {
                                        vm.message = $filter('translate')('0152');
                                        UIkit.modal('#logNoDataFinal').show();
                                        vm.loading = false;
                                    }
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
                }

                function addreport(order, orderpatient) {
                    if (order.resultTest.length > 0) {
                        if (vm.dataprint.length !== 0) {
                            var test = [];
                            vm.dataprint.forEach(function (value) {
                                var validated = $filter("filter")(_.clone(order.resultTest), function (e) {
                                    return value.testId === e.testId;
                                })
                                if (validated.length !== 0) {
                                    test.push(validated[0]);
                                }
                            });
                            order.resultTest = test;
                            if (order.resultTest.length === 0) {
                                vm.message = $filter('translate')('0152');
                                UIkit.modal('#logNoDataFinal').show();
                                vm.loading = false;
                                return true;
                            }

                        } else if (order.resultTest.length !== 0) {
                            if (vm.arelist.length > 0) {
                                var test = []
                                order.resultTest.forEach(function (value) {
                                    var validated = $filter("filter")(_.clone(vm.arelist), function (e) {
                                        return value.areaId === e.id;
                                    })
                                    if (validated.length !== 0) {
                                        test.push(value);
                                    }
                                });
                                order.resultTest = test;
                                if (order.resultTest.length === 0) {
                                    vm.message = $filter('translate')('0152');
                                    UIkit.modal('#logNoDataFinal').show();
                                    vm.loading = false;
                                    return true;
                                }
                                if (order.attachments.length !== 0) {
                                    vm.listTestComplete = [];
                                    vm.listTestComplete = _.clone(order.resultTest);
                                    var printattament = [];
                                    order.attachments.forEach(function (value) {
                                        if (value.idTest === null && value.viewresul) {
                                            printattament.push(value);
                                        } else {
                                            var filter = _.filter(_.clone(vm.listTestComplete), function (o) { return o.testId === value.idTest; });
                                            if (filter.length > 0 && value.viewresul) {
                                                printattament.push(value);
                                            }
                                        }
                                    });
                                    order.attachments = printattament;
                                }
                            }
                        }

                        if (orderpatient !== null) {
                            if (vm.dataprint.length !== 0) {
                                var test = [];
                                vm.dataprint.forEach(function (value) {
                                    var validated = $filter("filter")(_.clone(orderpatient.resultTest), function (e) {
                                        return value.testId === e.testId;
                                    })
                                    if (validated.length !== 0) {
                                        test.push(validated[0]);
                                    }
                                });
                                orderpatient.resultTest = test;
                                if (orderpatient.resultTest.length === 0) {
                                    vm.message = $filter('translate')('0152');
                                    UIkit.modal('#logNoDataFinal').show();
                                    vm.loading = false;
                                    return true;
                                }

                            } else if (orderpatient.resultTest.length !== 0) {
                                if (vm.arelist.length > 0) {
                                    var test = []
                                    orderpatient.resultTest.forEach(function (value) {
                                        var validated = $filter("filter")(_.clone(vm.arelist), function (e) {
                                            return value.areaId === e.id;
                                        })
                                        if (validated.length !== 0) {
                                            test.push(value);
                                        }
                                    });
                                    orderpatient.resultTest = test;
                                    if (orderpatient.resultTest.length === 0) {
                                        vm.message = $filter('translate')('0152');
                                        UIkit.modal('#logNoDataFinal').show();
                                        vm.loading = false;
                                        return true;
                                    }
                                    if (orderpatient.attachments.length !== 0) {
                                        vm.listTestComplete = [];
                                        vm.listTestComplete = _.clone(orderpatient.resultTest);
                                        var printattament = [];
                                        orderpatient.attachments.forEach(function (value) {
                                            if (value.idTest === null && value.viewresul) {
                                                printattament.push(value);
                                            } else {
                                                var filter = _.filter(_.clone(vm.listTestComplete), function (o) { return o.testId === value.idTest; });
                                                if (filter.length > 0 && value.viewresul) {
                                                    printattament.push(value);
                                                }
                                            }
                                        });
                                        orderpatient.attachments = printattament;
                                    }
                                }
                            }

                        }


                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var parameterReport = {};
                        var titleReport = (vm.parameter.typeprint === '1' || vm.parameter.typeprint === '0') ? $filter('translate')('0399') : (vm.parameter.typeprint === '3' ? $filter('translate')('1065') : $filter('translate')('1066'));
                        var patientnombre=order.patient.lastName+" "+order.patient.surName+" "+order.patient.name1+" "+order.patient.name2 
                        vm.namereport =  order.patient.patientId + "_" + patientnombre.replace(/\s+/g,"_")+ "_" + order.orderNumber +".pdf";
                        parameterReport.variables = {
                            'entity': vm.nameCustomer,
                            'abbreviation': vm.abbrCustomer,
                            'username': auth.userName,
                            'titleReport': titleReport,
                            'date': moment().format(vm.formatDate + ' HH:mm:ss'),
                            'formatDate': vm.formatDate,
                            'destination': vm.parameter.destination,
                            'codeorder': "/orqrm:" + btoa(vm.order),
                            'typeprint': vm.parameter.typeprint,
                            'stamp': vm.parameter.stamp === null || vm.parameter.stamp === undefined ? false : vm.parameter.stamp,
                            'testfilterview': vm.testaidafilter
                        };

                        var labelsreport = JSON.stringify($translate.getTranslationTable());
                        labelsreport = JSON.parse(labelsreport);

                        parameterReport.pathreport = '/Report/reportsandconsultations/reports/' + vm.getTemplateReport(order);
                        parameterReport.labelsreport = labelsreport;
                        vm.dataorder = order;
                        vm.datapatient = orderpatient;

                        if (vm.parameter.destination === '3') {                            
                            order=JSON.parse(JSON.stringify(order));
                            order.resultTest = _.filter(order.resultTest, function(o) { return !o.confidential; });

                            if(order.resultTest.length===0){
                             vm.message = "No existen datos para generar el reporte.";
                             UIkit.modal('#logNoDataFinal').show();
                             vm.loading = false;
                             return true;
                            }
                            if (!vm.demo) {
                                vm.cont = 0;
                                vm.listemail = []
                                var data = {
                                    'parameterReport': parameterReport,
                                    'order': order,
                                    'orderpatient': orderpatient,
                                }
                                vm.listemail.push(data);
                                vm.printall();
                            } else {

                                var printphysician = _.filter(_.clone(vm.emailist), function (o) {
                                    return o.idDemoAux == -201 || o.idDemoAux == -202 || o.idDemoAux == -203 || o.idDemoAux == -204 || o.idDemoAux == -205;
                                })
                                vm.demoemail = _.filter(_.clone(vm.emailist), function (o) {
                                    return o.idDemoAux !== -201 && o.idDemoAux !== -202 && o.idDemoAux !== -203 && o.idDemoAux !== -204 && o.idDemoAux !== -204
                                })

                                if (printphysician.length === 0) {
                                    vm.cont = 0;
                                    vm.listemail = []
                                    var data = {
                                        'parameterReport': parameterReport,
                                        'order': order,
                                        'orderpatient': orderpatient,
                                    }
                                    vm.listemail.push(data);
                                    vm.printall();
                                } else {
                                    vm.cont = 0;
                                    vm.listemail = [];
                                    if (vm.parameter.physician || vm.parameter.patient || vm.parameter.branch || vm.parameter.additionalMail.trim() !== '' || vm.demoemail.length !== 0 && vm.demo) {
                                        var data = {
                                            'parameterReport': parameterReport,
                                            'order': _.clone(order),
                                            'orderpatient': orderpatient,
                                        }
                                        vm.listemail.push(data);
                                    }
                                    for (var index = 0; index < printphysician.length; index++) {
                                        var orderchangue = _.clone(order);
                                        orderchangue.physician = printphysician[index];
                                        var data = {
                                            'parameterReport': parameterReport,
                                            'order': orderchangue,
                                            'orderpatient': orderpatient,
                                            'physician': printphysician[index]
                                        }
                                        vm.listemail.push(data);
                                    }
                                    vm.printall();
                                }
                            }
                        } else {
                            vm.cont = 0;
                            vm.listemail = []
                            if (vm.confidencialcodificado) {
                                var filterareainconfidencial = _.filter(_.clone(order.resultTest), function (o) { return o.areaId !== vm.areacodificado; });
                                if(filterareainconfidencial.length > 0){
                                    var datain = {
                                        'parameterReport': parameterReport,
                                        'order': JSON.parse(JSON.stringify(order)),
                                        'orderpatient': orderpatient,
                                    }
                                    datain.order.resultTest = filterareainconfidencial;
                                    vm.listemail.push(datain);
                                }
                                var filterarea = _.filter(_.clone(order.resultTest), function (o) { return o.areaId === vm.areacodificado; });
                                if (filterarea.length > 0) {
                                    var data = {
                                        'parameterReport': parameterReport,
                                        'order': JSON.parse(JSON.stringify(order)),
                                        'orderpatient': orderpatient,
                                    }
                                    
                                    var namecodificade = data.order.patient.name1.slice(0, 1) + data.order.patient.lastName.slice(0, 1) + data.order.patient.surName.slice(0, 1) + moment(data.order.patient.birthdayinformat).format('DDMMYY')
                                    data.order.resultTest = filterarea;
                                    data.order.patient.name1 = namecodificade;
                                    data.order.patient.name2 = '';
                                    data.order.patient.lastName = '';
                                    data.order.patient.surName = '';
                                    vm.listemail.push(data);
                                }
                            }else{
                                var datain = {
                                    'parameterReport': parameterReport,
                                    'order': order,
                                    'orderpatient': orderpatient,
                                }
                                vm.listemail.push(datain);
                            }
                            vm.printall();
                        }
                    }
                    else {
                        vm.message = $filter('translate')('0152');
                        UIkit.modal('#logNoDataFinal').show();
                        vm.loading = false;
                    }
                }

                vm.printall = printall;
                function printall() {
                    vm.setReport(vm.listemail[vm.cont].parameterReport, vm.listemail[vm.cont].order, vm.listemail[vm.cont].orderpatient);
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

                                    /*  var idsTests = _.map(datareport.resultTest, function (o) { return o.testId });
                                     var listAttachments = _.filter(datareport.attachments, function (o) { return o.viewresul = true }); */
                                    var listAttachments = datareport.attachments;
                                    vm.copyPages(buffer, listAttachments, true);

                                    report.renderAsync(function () {
                                        var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                                        var service = new Stimulsoft.Report.Export.StiPdfExportService();
                                        var stream = new Stimulsoft.System.IO.MemoryStream();
                                        service.exportToAsync(function () {
                                            // Export to PDF (#1)
                                            var data = stream.toArray();
                                            var buffer = new Uint8Array(data);
                                            /* var idsTests = _.map(datareport.resultTest, function (o) { return o.testId });
                                            var listAttachments = _.filter(datareport.attachments, function (o) { return o.viewresul = true }); */
                                            var listAttachments = datareport.attachments;
                                            vm.copyPages(buffer, listAttachments, false);

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
                                    var listAttachments = datareport.attachments;
                                    //var idsTests = _.map(datareport.resultTest, function (o) { return o.testId });
                                    //var listAttachments = _.filter(datareport.attachments, function (o) { return o.viewresul = true });
                                    //listAttachments = _.filter(listAttachments, function (o) { return idsTests.includes(o.idTest) });
                                    vm.copyPages(buffer, listAttachments, false);

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

                                    var mergepdfs = '';
                                    var calcula = 0;

                                    var pdfs = _.filter(attachments, function (o) { return o.extension === 'pdf'; });
                                    var images = _.filter(attachments, function (o) { return o.extension !== 'pdf'; });

                                    if (pdfs.length > 0) {
                                        reportsDS.mergepdf(pdfs).then(function (response) {
                                            if (response.status === 200) {
                                                var reportbasee64 = _base64ToArrayBuffer(response.data);
                                                mergepdfs = PDFDocument.load(reportbasee64, {
                                                    ignoreEncryption: true
                                                });
                                                mergepdfs.then(function (listbufferelement) {
                                                    var auth = localStorageService.get("Enterprise_NT.authorizationData");
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
                                                            vm.loadImages(images, calcula, pdfDoc, patient);
                                                        } else {
                                                            // Establecer metadatos antes de guardar el PDF
                                                            pdfDoc.setTitle(vm.namereport );
                                                            pdfDoc.setAuthor(localStorageService.get("Entidad"));
                                                            pdfDoc.setSubject(auth.userName);
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
                                                });
                                            }
                                        });
                                    } else if (images.length > 0) {
                                        vm.loadImages(images, calcula, pdfDoc, patient);
                                    }
                                } else {
                                     // Establecer metadatos antes de guardar el PDF
                                     var auth = localStorageService.get("Enterprise_NT.authorizationData");
                                     pdfDoc.setTitle(vm.namereport );
                                     pdfDoc.setAuthor(localStorageService.get("Entidad"));
                                     pdfDoc.setSubject(auth.userName);
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

                function loadImages(images, calcula, pdfDoc, patient) {
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
                                     // Establecer metadatos antes de guardar el PDF
                                     var auth = localStorageService.get("Enterprise_NT.authorizationData");
                                     pdfDoc.setTitle(vm.namereport );
                                     pdfDoc.setAuthor(localStorageService.get("Entidad"));
                                     pdfDoc.setSubject(auth.userName);                                    
                                                                       
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
                                     // Establecer metadatos antes de guardar el PDF
                                    var auth = localStorageService.get("Enterprise_NT.authorizationData");
                                    pdfDoc.setTitle(vm.namereport );
                                    pdfDoc.setAuthor(localStorageService.get("Entidad"));
                                    pdfDoc.setSubject(auth.userName);
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
                }

                vm.sendbuffer = sendbuffer;
                function sendbuffer(buffer, pdfUrl) {

                    var byteArray = new Uint8Array(buffer);
                    var byteString = '';
                    for (var i = 0; i < byteArray.byteLength; i++) {
                        byteString += String.fromCharCode(byteArray[i]);
                    }
                    var b64 = window.btoa(byteString);

                    var physicianemails = [];
                    var physicianEmail = '';

                    if (vm.demoemail != undefined && vm.demoemail.length !== 0 && vm.demo) {
                        vm.demoemail.forEach(function (value) {
                            physicianemails.push(value.email);
                        });
                    }
                    if (vm.parameter.physician && vm.dataorder.physician !== undefined && vm.dataorder.physician.email !== "") {
                        physicianemails.push(vm.dataorder.physician.email);
                    }
                    if (vm.parameter.branch && vm.dataorder.branch !== undefined && vm.dataorder.branch !== null && vm.dataorder.branch.email !== "") {
                        physicianemails.push(vm.dataorder.branch.email);
                    }
                    if (vm.parameter.additionalMail !== undefined && vm.parameter.additionalMail !== null && vm.parameter.additionalMail !== "") {
                        physicianemails.push(vm.parameter.additionalMail);
                    }

                    if (vm.listemail[vm.cont].physician === undefined) {
                        physicianEmail = _.uniq(physicianemails).join(";");
                    } else {
                        physicianEmail = vm.listemail[vm.cont].physician.email;
                    }


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
                            encryptionReportResult: vm.datareport.encrypt,
                            branch: vm.dataorder.branch.id,
                            service: vm.dataorder.service !== undefined ? vm.dataorder.service.id : "",
                            printingMedium: vm.parameter.destination,
                            patientEmail: vm.datareport.patientEmail,
                            serial: vm.parameter.serial,
                            NumberCopies: vm.parameter.quantityCopies,
                            physicianEmail: physicianEmail,
                            sendEmail: vm.parameter.sendEmail,
                            patienthistory: vm.dataorder.patient.patientId
                        }
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        return reportsDS.getSendPrintFinalReport(auth.authToken, finalData).then(function (data) {
                            vm.loading = false;
                            if (data.status === 200) {

                            }
                        });
                    }

                    if (vm.parameter.destination === '3') {
                        var patientName = vm.dataorder.patient.name1 + ' ' + vm.dataorder.patient.name2 + ' ' + vm.dataorder.patient.lastName + ' ' + vm.dataorder.patient.surName;
                        vm.sendEmailInternal(b64, physicianEmail, patientName, physicianemails)
                    } else {
                        var finalData = {
                            nameFile: vm.datareport.nameFile,
                            order: vm.dataorder.orderNumber,
                            patientName: vm.dataorder.patient.name1 + ' ' + vm.dataorder.patient.name2 + ' ' + vm.dataorder.patient.lastName + ' ' + vm.dataorder.patient.surName,
                            bufferReport: b64,
                            encryptionReportResult: vm.datareport.encrypt,
                            branch: vm.dataorder.branch.id,
                            service: vm.dataorder.service !== undefined ? vm.dataorder.service.id : "",
                            printingMedium: vm.parameter.destination,
                            patientEmail: vm.datareport.patientEmail,
                            serial: vm.parameter.serial,
                            NumberCopies: vm.parameter.quantityCopies,
                            physicianEmail: physicianEmail,
                            sendEmail: vm.parameter.sendEmail,
                            patienthistory: vm.dataorder.patient.patientId
                        }

                        var auth = localStorageService.get('Enterprise_NT.authorizationData');

                        return reportsDS.getSendPrintFinalReport(auth.authToken, finalData).then(function (data) {
                            if (data.status === 200) {
                                vm.changestatetestInternal(physicianEmail, pdfUrl);
                            }
                        }, function (error) {
                            vm.loading = false;
                            if (error.data.errorFields[0] === "0| the client is not connected" && vm.parameter.destination === '1') {
                                vm.message = $filter('translate')('1074');
                                UIkit.modal('#logNoDataFinal').show();
                            } else if (error.data.errorFields[0] === "0| the client is not connected" && vm.parameter.destination === '2') {
                                //vm.message = "No se encuentra conectado al cliente de impresion por lo tanto los pdf no se descargaran";
                                //UIkit.modal('#logNoDataFinal').show();
                                vm.changestatetestInternal(physicianEmail, pdfUrl);
                            } else {
                                vm.modalError(error);
                            }
                        });
                    }
                }

                //hay se envia  se hace envio simultaneo o lo divide
                function sendEmailInternal(b64, physicianEmail, patientName, physicianemails) {
                    var destination = false;
                    vm.listsendemailaudit = [];
                    if (vm.parameter.patient && vm.datareport.patientEmail !== null && vm.datareport.patientEmail !== undefined && vm.datareport.patientEmail !== '') {
                        var send = [];
                        send = send.concat(vm.datareport.patientEmail.split(";"));
                        destination = true;
                        var EmailBody = vm.EmailBody.replace("||PATIENT||", patientName);
                        var EmailSubjectPatient = vm.EmailSubjectPatient.replace("||PATIENT||", patientName);
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var data = {
                            "recipients": send,
                            "subject": EmailSubjectPatient,
                            "body": EmailBody,
                            "user": auth.id,
                            "order": vm.datareport.orderNumber,
                            "attachment": [
                                {
                                    path: b64,
                                    type: "1",
                                    filename: vm.datareport.nameFile + '.pdf'
                                }
                            ]
                        }
                        reportadicional.sendEmailV2(auth.authToken, data).then(function (response) {
                            if (response.data === 'Se a generado un error a la hora de hacer el envio') {
                                logger.error("Se a generado un error a la hora de hacer el envio");
                                vm.loading = false;
                            }
                            else {
                                vm.listsendemailaudit = vm.listsendemailaudit.concat(vm.datareport.patientEmail.split(";"));
                                if (physicianEmail !== null && physicianEmail !== undefined && physicianEmail !== '') {
                                    var send = [];
                                    send = send.concat(physicianEmail.split(";"));
                                    var EmailBody = vm.EmailBody.replace("||PATIENT||", patientName);
                                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                    var data = {
                                        "recipients": send,
                                        "subject": vm.EmailSubjectPhysician.replace("||PATIENT||", patientName),
                                        "body": EmailBody,
                                        "user": auth.id,
                                        "order": vm.datareport.orderNumber,
                                        "attachment": [
                                            {
                                                path: b64,
                                                type: "1",
                                                filename: vm.datareport.nameFile + '.pdf'
                                            }
                                        ]
                                    }
                                    reportadicional.sendEmailV2(auth.authToken, data).then(function (response) {
                                        if (response.data === 'Se a generado un error a la hora de hacer el envio') {
                                            logger.error("Se a generado un error a la hora de hacer el envio");
                                        }
                                        else {
                                            vm.listsendemailaudit = vm.listsendemailaudit.concat(physicianEmail.split(";"));
                                            vm.changestatetestInternal(physicianEmail);
                                        }
                                    });
                                }
                                else {
                                    vm.changestatetestInternal(physicianEmail, null);
                                }
                            }
                        });
                    } else if (physicianEmail !== null && physicianEmail !== undefined && physicianEmail !== '') {
                        var send = [];
                        send = send.concat(physicianEmail.split(";"));
                        var EmailBody = vm.EmailBody.replace("||PATIENT||", patientName);
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var data = {
                            "recipients": send,
                            "subject": vm.EmailSubjectPhysician===''|| vm.EmailSubjectPhysician===null ? vm.EmailSubjectPatient.replace("||PATIENT||", patientName):vm.EmailSubjectPhysician.replace("||PATIENT||", patientName),
                            "body": EmailBody,
                            "user": auth.id,
                            "order": vm.datareport.orderNumber,
                            "attachment": [
                                {
                                    path: b64,
                                    type: "1",
                                    filename: vm.datareport.nameFile + '.pdf'
                                }
                            ]
                        }
                        reportadicional.sendEmailV2(auth.authToken, data).then(function (response) {
                            if (response.data === 'Se a generado un error a la hora de hacer el envio') {
                                vm.loading = false;
                                logger.error("Se a generado un error a la hora de hacer el envio");
                            }
                            else {
                                vm.listsendemailaudit = vm.listsendemailaudit.concat(physicianEmail.split(";"));
                                vm.changestatetestInternal(physicianEmail);
                            }
                        });
                    }
                    else {
                        if (!destination) {
                            logger.warning("No existen destinatarios para el envio");
                            vm.loading = false;
                        }
                    }
                }

                function changestatetestInternal(physicianEmail, pdfUrl) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var personRecive = "";
                    if (vm.parameter.destination === '1' && vm.parameter.addperson) {
                        personRecive = $filter('translate')('3263') + " " + vm.parameter.namereceiveresult;
                    }
                    if (vm.parameter.destination === '2' && vm.parameter.addperson) {
                        personRecive = $filter('translate')('3263') + " " + vm.parameter.namereceiveresult;
                    }
                    if (vm.parameter.destination === '2') {
                        var a = document.createElement("a");
                        a.setAttribute("download", vm.namereport);
                        a.setAttribute("href", pdfUrl);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.open(pdfUrl, '_blank');
                    }
                    else if (vm.parameter.destination === '3') {
                        personRecive = vm.listsendemailaudit.join();
                    }
                    vm.datareport.order.createdDate = '';
                    vm.datareport.order.patient.birthday = '';
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
                        filterOrderHeader: { printingMedium: vm.parameter.destination, typeReport: vm.parameter.typeprint, personReceive: personRecive },
                        order: vm.datareport.order,
                        user: auth.id
                    }
                    return reportsDS.changeStateTest(auth.authToken, datachange).then(function (data) {
                        if (data.status === 200) {
                            if (vm.listemail.length === vm.cont + 1) {
                                $scope.functionexecute();
                                vm.loading = false;
                            } else {
                                vm.cont++;
                                vm.printall();
                            }
                        }
                    }, function (error) {
                        vm.loading = false;
                        vm.modalError(error);
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
