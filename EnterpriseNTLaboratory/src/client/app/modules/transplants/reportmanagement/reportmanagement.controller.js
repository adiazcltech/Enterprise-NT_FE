/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.reportmanagement')
        .controller('reportmanagementController', reportmanagementController);
    reportmanagementController.$inject = ['localStorageService', 'logger', '$translate', 'patientDS', '$scope', 'reportransDS',
        '$filter', '$state', 'moment', '$rootScope', 'common', 'recepctionDS', 'keyStimulsoft', 'userDS'];
    function reportmanagementController(localStorageService, logger, $translate, patientDS, $scope, reportransDS,
        $filter, $state, moment, $rootScope, common, recepctionDS, keyStimulsoft, userDS) {
        var vm = this;
        vm.title = 'reportmanagement';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.NamePage = $filter('translate')('3322');
        $rootScope.pageview = 3;
        vm.selected = -1;
        vm.sortableOptions = {
            items: "li:not(.not-sortable)",
            cancel: ".not-sortable",
            update: function (e, ui) {
                console.log('Item moved');
            }
        }
        $scope.$watch('vm.selectedIndex', function (newIndex) {
            if (newIndex === 1) {
                vm.typeparticipants = '0';
                vm.Listparticipants = [];
                vm.participants = {
                    dateinit: new Date(),
                    dateend: new Date(),
                    institution: {},
                    organparticipants: {},
                    approver: {}
                }
                vm.requeriddateI = false;
                vm.requeriddateF = false;
                vm.requeridinstitution = false;
                vm.requeridapproverparticipants = false;
                vm.requeridorgan = false;
            }

            if (newIndex === 2) {
                vm.donordeath = {
                    donor: {},
                    typeTransplant: 0,
                    deliveryresults: new Date(),
                    approver: {}
                }
                vm.viewpreliminardonor = false;
                vm.Listorderparticipants = [];
                vm.listSearchorgandonor = [];
                vm.requeriddonordeliveryresults = false;
                vm.requeriddonor = false;
                vm.requeridtypeTransplant = false;
                vm.requeridapproverdonor = false;
                vm.hidebutton = false;
            }
            if (newIndex === 3) {
                vm.donordeath = {
                    donor: {},
                    typeTransplant: 0,
                    deliveryresults: new Date(),
                    approver: {},
                    typeReport: 1
                }
                vm.viewpreliminardonor = false;
                vm.Listorderparticipants = [];
                vm.listSearchorgandonor = [];
                vm.requeriddonordeliveryresults = false;
                vm.requeriddonor = false;
                vm.requeridtypeTransplant = false;
                vm.requeridapproverdonor = false;
                vm.hidebutton = false;
            }

        });
        vm.items = [
            { label: 'Nuevos', checked: true },
            { label: 'Participantes', checked: true },
            { label: 'Reingresos', checked: true }
        ];
        vm.toggleItem = toggleItem;
        function toggleItem(item) {
            item.checked = !item.checked;
            vm.preliminaryparticipants(3)
        }
        vm.changefilter = changefilter;
        function changefilter() {
            vm.searchreception = '';
            vm.organsearchname = {
                id: 0,
                name: 'Todos los organos'
            }
            vm.ListOrder = [];
            vm.getseach();
            setTimeout(function () {
                document.getElementById('searchgrille').focus();
            }, 400);
        }
        vm.getseach = getseach;
        function getseach() {
            var data = {
                "typeFilter": 0
            }
            if (vm.organsearchname.id !== 0) {
                data.idOrgan = vm.organsearchname.id
            }
            vm.loadingdata = true;
            vm.ListOrder = [];
            vm.generateReport = false;
            vm.selected = -1;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS
                .getreceiverpatient(auth.authToken, data)
                .then(
                    function (data) {
                        vm.getUser();
                        if (data.data.length !== 0) {
                            var listdata = [];
                            var key = 0;
                            data.data.forEach(function (data) {
                                if (data.listTransplant.length !== 0) {
                                    data.listTransplant.forEach(function (dataOrgan) {
                                        key = key + 1;
                                        var dataListreceptor = {
                                            'key': key,
                                            'id': data.id,
                                            'documentType': data.documentType,
                                            'patientId': data.patientId,
                                            'name1': data.name1,
                                            'name2': data.name2,
                                            'lastName': data.lastName,
                                            'surName': data.surName,
                                            'idOgan': dataOrgan.organ,
                                            'nameogan': vm.changuenameOrgan(dataOrgan.organ)
                                        }
                                        listdata.push(dataListreceptor);
                                    });
                                }
                            });
                            vm.ListOrder = listdata;
                            vm.loadingdata = false;
                        } else {
                            logger.info($filter('translate')('3379'));
                            vm.loadingdata = false;
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                        vm.loadingdata = false;
                    }
                );

        }
        vm.changuenameOrgan = changuenameOrgan;
        function changuenameOrgan(number) {
            if (number === 1) {
                return vm.organ[0].name;
            } else if (number === 2) {
                return vm.organ[1].name;
            } else if (number === 3) {
                return vm.organ[2].name;
            } else if (number === 4) {
                return vm.organ[3].name;
            } else if (number === 5) {
                return vm.organ[4].name;
            } else if (number === 6) {
                return vm.organ[5].name;
            } else if (number === 7) {
                return vm.organ[6].name;
            } else if (number === 8) {
                return vm.organ[7].name;
            } else if (number === 9) {
                return vm.organ[8].name;
            } else if (number === 10) {
                return vm.organ[9].name;
            } else if (number === 11) {
                return vm.organ[10].name;
            } else if (number === 12) {
                return vm.organ[11].name;
            } else if (number === 13) {
                return vm.organ[12].name;
            }
        }
        vm.getUser = getUser;
        function getUser() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListUser = [];
            return recepctionDS.getUserTransplant(auth.authToken).then(
                function (data) {
                    if (data.status === 200) {
                        data.data.forEach(function (value) {
                            value.name = value.name + ' ' + value.lastName;
                        });
                        vm.ListUser = data.data;
                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        vm.getUseranalyst = getUseranalyst;
        function getUseranalyst() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.analyst = {};
            return userDS.getUsersId(auth.authToken, auth.id).then(
                function (data) {
                    vm.getdonordeath();
                    if (data.status === 200) {
                        data.data.name = data.data.name + ' ' + data.data.lastName;
                        data.data.rolelabel = _.filter(data.data.roles, function(o) { return o.access; })[0].role.name;  
                        vm.analyst = data.data;
                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        vm.eventEdit = eventEdit;
        function eventEdit(Order) {
            vm.selected = Order.key;
            vm.requeridanalyst = false;
            vm.requeridapprover = false;
            vm.requeriddeliveryresults = false;
            vm.datareport = {};
            vm.datareport.deliveryresults = new Date();
            vm.datareport.approver = {};

            vm.viewpreliminar = false;
            vm.datapatientReport = Order;
            vm.generateReport = true;
            vm.Test = {};
            var datareception = {
                "typeFilter": 1,
                "patientId": vm.datapatientReport.patientId,
                "documentType": { "id": vm.datapatientReport.documentType.id }
            }
            vm.listTransplant = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS
                .getreceiverpatient(auth.authToken, datareception)
                .then(
                    function (data) {
                        vm.listTransplant = _.filter(data.data[0].listTransplant, function (o) { return o.organ === vm.datapatientReport.idOgan; })[0];
                        vm.listTransplant.nameogan = vm.changuenameOrgan(vm.listTransplant.organ)
                        vm.detailTest(vm.listTransplant.idTransplant);
                    },
                    function (error) {
                        vm.modalError(error);
                        vm.loadingdata = false;
                    }
                );
        }
        vm.detailDemo = detailDemo;
        function detailDemo() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            patientDS.getPatientbyIddocument(auth.authToken, vm.datapatientReport.patientId, vm.datapatientReport.documentType.id).then(function (response) {
                if (response.data.length > 0) {
                    response.data.forEach(function (value) {
                        if (value.idDemographic === -105) {
                            vm.Test["demo_age_valuename"] = common.getAgeAsString(value.notCodifiedValue, vm.formatDate.toUpperCase())
                        }
                        if (value.encoded) {
                            vm.Test["demo_" + value.idDemographic + "_valuename"] = value.codifiedName;
                            vm.Test["demo_" + value.idDemographic + "_valuecode"] = value.codifiedCode;
                        } else {
                            vm.Test["demo_" + value.idDemographic + "_valuename"] = value.notCodifiedValue;
                            vm.Test["demo_" + value.idDemographic + "_valuecode"] = '';
                        }
                    });
                }
            }, function (error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
        }
        vm.detailTest = detailTest;
        function detailTest(idTransplant) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.getTesttransplant(auth.authToken, idTransplant).then(
                function (data) {
                    vm.detailDemo();
                    vm.detailRemmision();
                    if (data.status === 200) {
                        vm.loading = false;
                        vm.Test = data.data;
                        vm.Test.transplant = vm.listTransplant;
                        vm.Test.receiverTestEntry.transfusiondate = vm.Test.receiverTestEntry.transfusiondate === undefined ? 'N/A' : moment(vm.Test.receiverTestEntry.transfusiondate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverTestEntry.previoustransplantdate = vm.Test.receiverTestEntry.previoustransplantdate === undefined ? 'N/A' : moment(vm.Test.receiverTestEntry.previoustransplantdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverTestEntry.dateinclusionwaitinglist = vm.Test.receiverTestEntry.dateinclusionwaitinglist === undefined ? 'N/A' : moment(vm.Test.receiverTestEntry.dateinclusionwaitinglist).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverHLAMolecular.datesamplecollection = vm.Test.receiverHLAMolecular.datesamplecollection === undefined ? 'N/A' : moment(vm.Test.receiverHLAMolecular.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverHLAMolecular.observation = vm.Test.receiverHLAMolecular.observation === undefined ? '' : vm.Test.receiverHLAMolecular.observation;
                        vm.Test.receiverHLAMolecular.trialdate = vm.Test.receiverHLAMolecular.trialdate === undefined ? 'N/A' : moment(vm.Test.receiverHLAMolecular.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCualitativo.datesamplecollection = vm.Test.receiverPRALuminexCualitativo.datesamplecollection === undefined ? 'N/A' : moment(vm.Test.receiverPRALuminexCualitativo.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCualitativo.trialdate = vm.Test.receiverPRALuminexCualitativo.trialdate === undefined ? 'N/A' : moment(vm.Test.receiverPRALuminexCualitativo.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCuantitativo.datesamplecollection = vm.Test.receiverPRALuminexCuantitativo.datesamplecollection === undefined ? 'N/A' : moment(vm.Test.receiverPRALuminexCuantitativo.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCuantitativo.trialdate = vm.Test.receiverPRALuminexCuantitativo.trialdate === undefined ? 'N/A' : moment(vm.Test.receiverPRALuminexCuantitativo.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexAntigeno.datesamplecollection = vm.Test.receiverPRALuminexAntigeno.datesamplecollection === undefined ? 'N/A' : moment(vm.Test.receiverPRALuminexAntigeno.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexAntigeno.trialdate = vm.Test.receiverPRALuminexAntigeno.trialdate === undefined ? 'N/A' : moment(vm.Test.receiverPRALuminexAntigeno.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverFlowCytometry.datesamplecollection = vm.Test.receiverFlowCytometry.datesamplecollection === undefined ? 'N/A' : moment(vm.Test.receiverFlowCytometry.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverFlowCytometry.trialdate = vm.Test.receiverFlowCytometry.trialdate === undefined ? 'N/A' : moment(vm.Test.receiverFlowCytometry.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.transplant.dateTransplant = vm.Test.transplant.dateTransplant === undefined ? 'N/A' : moment(vm.Test.transplant.dateTransplant).format(vm.formatDate.toUpperCase());
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.changuerequerid = changuerequerid;
        function changuerequerid() {
            $scope.$apply(function () {
                vm.requeridapprover = false;
            });
        }
        vm.changuereport = changuereport;
        function changuereport() {
            vm.viewpreliminar = false;
            vm.requeridanalyst = false;
            vm.requeridapprover = false;
            vm.requeriddeliveryresults = false;
        }
        vm.eventUndo = eventUndo;
        function eventUndo() {
            vm.viewpreliminar = false;
            vm.requeridanalyst = false;
            vm.requeridapprover = false;
            vm.requeriddeliveryresults = false;
        }
        vm.detailRemmision = detailRemmision;
        function detailRemmision() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.listremision = [];
            return recepctionDS.getinsuranceidremission(auth.authToken, vm.datapatientReport.id).then(
                function (response) {
                    if (response.status === 200) {
                        vm.getdetailinstitution(response.data[0]);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.getdetailinstitution = getdetailinstitution;
        function getdetailinstitution(detailInstitution) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.getinstitutionId(auth.authToken, detailInstitution.institution.id).then(
                function (data) {
                    if (data.status === 200) {
                        var institution = {
                            id: detailInstitution.institution.id,
                            code: detailInstitution.institution.code,
                            name: detailInstitution.institution.name,
                        }
                        detailInstitution.institution = {
                            id: detailInstitution.institution.id,
                            code: detailInstitution.institution.code,
                            name: detailInstitution.institution.name,
                            phone: data.data.phone,
                            adress: data.data.address,
                            selected: institution
                        }

                        var insurance = {
                            id: detailInstitution.insurance.id,
                            code: detailInstitution.insurance.code,
                            name: detailInstitution.insurance.name,
                        }
                        detailInstitution.insurance = {
                            id: detailInstitution.insurance.id,
                            code: detailInstitution.insurance.code,
                            name: detailInstitution.insurance.name,
                            selected: insurance
                        }
                        vm.listremision = detailInstitution;
                        vm.Test.listremision = vm.listremision;
                        vm.Test.listremision.dateRemission = moment(vm.Test.listremision.dateRemission).format(vm.formatDate.toUpperCase());
                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        vm.savepdfReport = savepdfReport;
        function savepdfReport() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return reportransDS.getsavetypereport(auth.authToken, vm.selectReport.id).then(
                function (response) {
                    if (response.status === 200) {
                        vm.idReport = response.data;
                        vm.preliminary(2);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.preliminary = preliminary;
        function preliminary(validate) {
            vm.loadingdata = true;
            vm.validatedsavereport = validate;
            if (vm.datareport.approver.selected === undefined || vm.datareport.deliveryresults === null) {
                vm.requeridapprover = vm.datareport.approver.selected === undefined ? true : false;
                vm.requeriddeliveryresults = vm.datareport.deliveryresults === null ? true : false;
                vm.loadingdata = false;
            } else {
                if (vm.selectReport.id !== 10) {
                    vm.viewpreliminar = true;
                }
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                var parameterReport = {};
                parameterReport.variables = {
                    'date': moment().format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
                    'dateEntryResult': moment(vm.datareport.deliveryresults).format(vm.formatDate.toUpperCase()),
                    'abbreviation': localStorageService.get("Abreviatura"),
                    'entity': localStorageService.get("Entidad"),
                    'username': auth.userName,
                    'analyst': vm.analyst.name,
                    'labelAnalisty': vm.analyst.rolelabel,
                    'numbeReport': vm.validatedsavereport === 2 ? vm.idReport : 'Reporte preliminar',
                    'analystsignature': 'data:image/jpeg;base64,' + vm.analyst.signature,
                    'regiterAnalyst': vm.analyst.identification,
                    'approver': vm.datareport.approver.selected.name,
                    'approversignature': 'data:image/jpeg;base64,' + vm.datareport.approver.selected.signature,
                    'regiterApprover': vm.datareport.approver.selected.identification,
                };

                if (vm.selectReport.id === 1) {
                    parameterReport.pathreport = '/Reportransplants/receivers/immunological_studies_with_haplotypes/immunological_studies_with_haplotypes.mrt';
                }
                if (vm.selectReport.id === 2) {
                    parameterReport.pathreport = '/Reportransplants/receivers/immunological_studies_without_haplotypes/immunological_studies_without_haplotypes.mrt';
                }
                if (vm.selectReport.id === 3) {
                    parameterReport.pathreport = '/Reportransplants/receivers/multiple_results/multiple_results.mrt';
                }
                if (vm.selectReport.id === 4) {
                    parameterReport.pathreport = '/Reportransplants/receivers/qualitative_pra/qualitative_pra.mrt';
                }
                if (vm.selectReport.id === 5) {
                    parameterReport.pathreport = '/Reportransplants/receivers/quantum_pra_class_I_II/quantum_pra_class_I_II.mrt';
                }
                if (vm.selectReport.id === 6) {
                    parameterReport.pathreport = '/Reportransplants/receivers/single_class_I_II_antigen/single_class_I_II_antigen.mrt';
                }
                if (vm.selectReport.id === 7) {
                    parameterReport.pathreport = '/Reportransplants/receivers/flow_cytometry/flow_cytometry.mrt';
                }
                if (vm.selectReport.id === 10) {
                    parameterReport.pathreport = '/Reportransplants/receivers/antibody_history/antibody_history.mrt';
                }

                parameterReport.labelsreport = $translate.getTranslationTable();
                vm.dataorder = [vm.Test];
                if (vm.selectReport.id === 1 || vm.selectReport.id === 2) {
                    vm.gethaplotypes(parameterReport, vm.dataorder);
                } else if (vm.selectReport.id === 7) {
                    vm.getdonorflowcytometry(parameterReport, vm.dataorder);
                } else if (vm.selectReport.id === 10) {
                    vm.gethistoricalantibodies(parameterReport, vm.dataorder);
                } else {
                    vm.setReport(parameterReport, vm.dataorder);
                }
            }
        }
        vm.gethistoricalantibodies = gethistoricalantibodies;
        function gethistoricalantibodies(parameterReport, dataorder) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.donorflowcytometry = [];
            return reportransDS.gethistoricalcytotoxico(auth.authToken, vm.datapatientReport.id).then(
                function (response) {
                    if (response.status === 200) {
                        if (response.data.length === 0) {
                            logger.info($filter('translate')('3636'));
                            vm.loadingdata = false;
                        } else {
                            vm.viewpreliminar = true;
                            response.data.forEach(function (value) {
                                value.datesamplecollection = value.datesamplecollection === undefined ? 'N/A' : moment(value.datesamplecollection).format(vm.formatDate.toUpperCase());
                                value.datestudy = moment(value.datestudy).format(vm.formatDate.toUpperCase());
                            });
                            dataorder[0].orderhistorical = response.data;
                            vm.setReport(parameterReport, dataorder);
                        }
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.getdonorflowcytometry = getdonorflowcytometry;
        function getdonorflowcytometry(parameterReport, dataorder) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.donorflowcytometry = [];
            return reportransDS.getdonorcitometria(auth.authToken, vm.datapatientReport.id).then(
                function (response) {
                    if (response.status === 200) {
                        dataorder[0].donorName = response.data.name1 + ' ' + response.data.name2 + ' ' + response.data.surName + ' ' + response.data.lastName;
                        dataorder[0].donoridentification = response.data.patientId;
                        vm.setReport(parameterReport, dataorder);
                    } else {
                        dataorder[0].donorName = $filter('translate')('3637');
                        dataorder[0].donorName = $filter('translate')('3637');
                        vm.setReport(parameterReport, dataorder);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.gethaplotypes = gethaplotypes;
        function gethaplotypes(parameterReport, dataorder) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return reportransDS.gethaplotypes(auth.authToken, vm.datapatientReport.id).then(
                function (response) {
                    if (response.status === 200) {
                        var recephlaa = dataorder[0].receiverHLAMolecular.a.split(',');
                        dataorder[0].receiverHLAMolecular.a1 = recephlaa[0] === undefined ? 'N/A' : recephlaa[0].trim();
                        dataorder[0].receiverHLAMolecular.a2 = recephlaa[1] === undefined ? 'N/A' : recephlaa[1].trim();
                        var recephlab = dataorder[0].receiverHLAMolecular.b.split(',');
                        dataorder[0].receiverHLAMolecular.b1 = recephlab[0] === undefined ? 'N/A' : recephlab[0].trim();
                        dataorder[0].receiverHLAMolecular.b2 = recephlab[1] === undefined ? 'N/A' : recephlab[1].trim();
                        var recephlac = dataorder[0].receiverHLAMolecular.c.split(',');
                        dataorder[0].receiverHLAMolecular.c1 = recephlac[0] === undefined ? 'N/A' : recephlac[0].trim();
                        dataorder[0].receiverHLAMolecular.c2 = recephlac[1] === undefined ? 'N/A' : recephlac[1].trim();
                        var recephladrb1 = dataorder[0].receiverHLAMolecular.drb1.split(',');
                        dataorder[0].receiverHLAMolecular.drb11 = recephladrb1[0] === undefined ? 'N/A' : recephladrb1[0].trim();
                        dataorder[0].receiverHLAMolecular.drb12 = recephladrb1[1] === undefined ? 'N/A' : recephladrb1[1].trim();
                        var recephladqa = dataorder[0].receiverHLAMolecular.dqa.split(',');
                        dataorder[0].receiverHLAMolecular.dqa1 = recephladqa[0] === undefined ? 'N/A' : recephladqa[0].trim();
                        dataorder[0].receiverHLAMolecular.dqa2 = recephladqa[1] === undefined ? 'N/A' : recephladqa[1].trim();
                        var recephladqb = dataorder[0].receiverHLAMolecular.dqb.split(',');
                        dataorder[0].receiverHLAMolecular.dqb1 = recephladqb[0] === undefined ? 'N/A' : recephladqb[0].trim();
                        dataorder[0].receiverHLAMolecular.dqb2 = recephladqb[1] === undefined ? 'N/A' : recephladqb[1].trim();
                        if (response.data.length === 0) {
                            dataorder[0].donor = [];
                        } else {
                            response.data.forEach(function (haplotipos) {
                                var hlaa = haplotipos.a.split(',')
                                haplotipos.a1 = hlaa[0] === undefined ? 'N/A' : hlaa[0].trim();
                                haplotipos.a2 = hlaa[1] === undefined ? 'N/A' : hlaa[1].trim();
                                var hlab = haplotipos.b.split(',')
                                haplotipos.b1 = hlab[0] === undefined ? 'N/A' : hlab[0].trim();
                                haplotipos.b2 = hlab[1] === undefined ? 'N/A' : hlab[1].trim();
                                var hlac = haplotipos.c.split(',')
                                haplotipos.c1 = hlac[0] === undefined ? 'N/A' : hlac[0].trim();
                                haplotipos.c2 = hlac[1] === undefined ? 'N/A' : hlac[1].trim();
                                var hladrb1 = haplotipos.drb1.split(',')
                                haplotipos.drb11 = hladrb1[0] === undefined ? 'N/A' : hladrb1[0].trim();
                                haplotipos.drb12 = hladrb1[1] === undefined ? 'N/A' : hladrb1[1].trim();
                                var hladqa = haplotipos.dqa.split(',')
                                haplotipos.dqa1 = hladqa[0] === undefined ? 'N/A' : hladqa[0].trim();
                                haplotipos.dqa2 = hladqa[1] === undefined ? 'N/A' : hladqa[1].trim();
                                var hladqb = haplotipos.dqb.split(',')
                                haplotipos.dqb1 = hladqb[0] === undefined ? 'N/A' : hladqb[0].trim();
                                haplotipos.dqb2 = hladqb[1] === undefined ? 'N/A' : hladqb[1].trim();
                                haplotipos.comparationalelo1 = 0;
                                haplotipos.comparationalelo2 = 0;
                                haplotipos.comparationcomplete = 0;

                                if (dataorder[0].receiverHLAMolecular.a1 === haplotipos.a1 &&
                                    dataorder[0].receiverHLAMolecular.b1 === haplotipos.b1 &&
                                    dataorder[0].receiverHLAMolecular.c1 === haplotipos.c1 &&
                                    dataorder[0].receiverHLAMolecular.drb11 === haplotipos.drb11 &&
                                    dataorder[0].receiverHLAMolecular.dqa1 === haplotipos.dqa1 &&
                                    dataorder[0].receiverHLAMolecular.dqb1 === haplotipos.dqb1
                                ) {
                                    haplotipos.comparationalelo1 = 1;
                                    haplotipos.comparationcomplete = haplotipos.comparationcomplete + 1;
                                }

                                if (dataorder[0].receiverHLAMolecular.a2 === haplotipos.a2 &&
                                    dataorder[0].receiverHLAMolecular.b2 === haplotipos.b2 &&
                                    dataorder[0].receiverHLAMolecular.c2 === haplotipos.c2 &&
                                    dataorder[0].receiverHLAMolecular.drb12 === haplotipos.drb12 &&
                                    dataorder[0].receiverHLAMolecular.dqa2 === haplotipos.dqa2 &&
                                    dataorder[0].receiverHLAMolecular.dqb2 === haplotipos.dqb2
                                ) {
                                    haplotipos.comparationalelo2 = 1;
                                    haplotipos.comparationcomplete = haplotipos.comparationcomplete + 1;
                                }

                            });
                            dataorder[0].donor = _.orderBy(response.data, ['comparationcomplete', 'name1'], ['desc', 'asc']);
                        }
                        vm.setReport(parameterReport, dataorder);
                    } else {
                        dataorder[0].donor = [];
                        vm.setReport(parameterReport, dataorder);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.setReport = setReport;
        function setReport(parameterReport, datareport) {
            setTimeout(function () {
                Stimulsoft.Base.StiLicense.key = keyStimulsoft;
                var report = new Stimulsoft.Report.StiReport();
                report.loadFile(parameterReport.pathreport);

                var jsonData = {
                    'data': datareport,
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
                        var a = document.getElementById("previreport");
                        var binary = '';
                        for (var i = 0; i < buffer.length; i++) {
                            binary += String.fromCharCode(buffer[i]);
                        }
                        var base64String = btoa(binary);
                        if (vm.validatedsavereport === 1) {
                            $scope.$apply(function () {
                                vm.loadingdata = false;
                            });
                            a.type = 'application/pdf';
                            a.src = 'data:application/pdf;base64,' + base64String;
                            a.height = '100%';
                        }
                        if (vm.validatedsavereport === 2) {
                            vm.saveReport(base64String)
                        }
                    }, report, stream, settings);

                });
            }, 10);
        }
        vm.saveReport = saveReport;
        function saveReport(base64) {
            vm.loadingdata = false;
            var data = {
                "idReport": vm.idReport,
                "nameReceptor": vm.datapatientReport.name1 + ' ' + vm.datapatientReport.name2 + ' ' + vm.datapatientReport.lastName + ' ' + vm.datapatientReport.surName,
                "identificationReceptor": vm.datapatientReport.patientId,
                "institution": vm.Test.listremision.institution.name,
                "deliverDate": new Date(moment(vm.datareport.deliveryresults).format()).getTime(),
                "receptionDate": vm.Test.receiverTestEntry.datecreated,
                "generationDate": new Date(moment().format()).getTime(),
                "reportType": vm.selectReport.id,
                "file": base64,
                "extension": ".pdf",
                "approveruser": vm.datareport.approver.selected.name,
                "analystuser": vm.analyst.name
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.saveReport(auth.authToken, data).then(
                function (response) {
                    if (response.status === 200) {
                        var a = document.getElementById("previreport");
                        a.type = 'application/pdf';
                        a.src = 'data:application/pdf;base64,' + response.data.file;
                        a.height = '100%';
                        logger.success($filter('translate')('0149'));
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        //participante
        vm.getInstitution = getInstitution;
        function getInstitution() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListInstitution = [];
            return recepctionDS.getinstitution(auth.authToken).then(
                function (data) {
                    vm.getUseranalyst();
                    if (data.status === 200) {
                        vm.ListInstitution = data.data;
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.changeDatePicker = changeDatePicker;
        function changeDatePicker(obj) {
            if (obj === 1) {
                vm.dateI = false;
                if (moment(vm.participants.dateinit).format('YYYY-MM-DD') > moment(vm.participants.dateend).format('YYYY-MM-DD')) {
                    vm.participants.dateend = moment(vm.participants.dateinit).format();
                } else if (vm.participants.dateinit === undefined) {
                    vm.participants.dateinit = null;
                }

            } else {
                vm.dateF = false;
                if (moment(vm.participants.dateinit).format('YYYY-MM-DD') > moment(vm.participants.dateend).format('YYYY-MM-DD')) {
                    vm.participants.dateinit = moment(vm.participants.dateend).format();
                } else if (vm.participants.dateend === undefined) {
                    vm.participants.dateend = null;
                }
            }
            vm.preliminaryparticipants(3);
        }
        vm.focusdateInit = focusdateInit;
        function focusdateInit() {
            if (vm.participants.dateinit !== null) {
                vm.participants.dateinit = new Date(vm.participants.dateinit);
            } else {
                vm.participants.dateinit = null;
            }
        }
        vm.focusdateend = focusdateend;
        function focusdateend() {
            if (vm.participants.dateend !== null) {
                vm.participants.dateend = new Date(vm.participants.dateend);
            } else {
                vm.participants.dateend = null;
            }
        }
        vm.changue = changue;
        function changue() {
            vm.preliminaryparticipants(3);
            $scope.$apply(function () {
                vm.requeridinstitution = false;
            });
        }
        vm.changueapprover = changueapprover;
        function changueapprover() {
            vm.preliminaryparticipants(3);
            $scope.$apply(function () {
                vm.requeridapproverparticipants = false;
            });
        }
        vm.preliminaryparticipants = preliminaryparticipants;
        function preliminaryparticipants(validate) {
            vm.Listparticipants = [];
            vm.loadingdata = true;
            vm.validatedsavereport = validate;
            if (validate === 3) {
                if (vm.participants.dateinit === null || vm.participants.dateend === null || vm.participants.institution.selected === undefined || vm.participants.organparticipants.id === undefined || vm.participants.approver.selected === undefined) {
                    vm.loadingdata = false;
                } else {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var data = {
                        "dateEnd": moment(vm.participants.dateend).format('YYYYMMDD'),
                        "dateInit": moment(vm.participants.dateinit).format('YYYYMMDD'),
                        "institution": vm.participants.institution.selected.id,
                        "organ": vm.participants.organparticipants.id,
                        "typerreceptor": vm.typeparticipants
                    }
                    return recepctionDS.getparticipantsReport(auth.authToken, data).then(
                        function (data) {
                            if (data.status === 200) {
                                if (data.data.length !== 0) {
                                    data.data.forEach(function (data, key) {
                                        data.birthday = moment(data.birthday).format(vm.formatDate.toUpperCase());
                                        data.age = common.getAgeAsString(data.birthday, vm.formatDate.toUpperCase());
                                        data.labelNew = data.partaker === 0 ? $filter('translate')('3632') : data.partaker === 1 ? $filter('translate')('0220') : data.reEntry === 1 ? $filter('translate')('3633') : '';
                                    });
                                    vm.loadingdata = false;
                                    vm.Listparticipants = data.data;
                                } else {
                                    logger.info($filter('translate')('3379'));
                                    vm.loadingdata = false;
                                }
                            } else {
                                logger.info($filter('translate')('3379'));
                                vm.loadingdata = false;
                            }
                        },
                        function (error) {
                            vm.loadingdata = false;
                            vm.modalError(error);
                        }
                    );
                }

            } else {
                if (vm.participants.dateinit === null || vm.participants.dateend === null || vm.participants.institution.selected === undefined || vm.participants.organparticipants.id === undefined || vm.participants.approver.selected === undefined) {
                    vm.requeriddateI = vm.participants.dateinit === null ? true : false;
                    vm.requeriddateF = vm.participants.dateend === null ? true : false;
                    vm.requeridinstitution = vm.participants.institution.selected === undefined ? true : false;
                    vm.requeridorgan = vm.participants.organparticipants.id === undefined ? true : false;
                    vm.requeridapproverparticipants = vm.participants.approver.selected === undefined ? true : false;
                    vm.loadingdata = false;
                } else {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var data = {
                        "dateInit": moment(vm.participants.dateinit).format('YYYYMMDD'),
                        "dateEnd": moment(vm.participants.dateend).format('YYYYMMDD'),
                        "institution": vm.participants.institution.selected.id,
                        "organ": vm.participants.organparticipants.id,
                        "typerreceptor": vm.typeparticipants
                    }
                    return recepctionDS.getparticipantsReport(auth.authToken, data).then(
                        function (data) {
                            if (data.status === 200) {
                                if (data.data.length !== 0) {
                                    data.data.forEach(function (data, key) {
                                        data.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                                        data.labelNew = data.partaker === 0 ? 'Nuevos' : data.partaker === 1 ? 'No' : data.reEntry === 1 ? 'Reingresos' : '';
                                    });
                                    vm.loadingdata = false;
                                    vm.Listparticipants = data.data;
                                } else {
                                    logger.info($filter('translate')('3379'));
                                    vm.loadingdata = false;
                                }
                            } else {
                                logger.info($filter('translate')('3379'));
                                vm.loadingdata = false;
                            }
                        },
                        function (error) {
                            vm.loadingdata = false;
                            vm.modalError(error);
                        }
                    );
                }
            }
        }
        vm.saveparticipants = saveparticipants;
        function saveparticipants() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return reportransDS.getsavetypereport(auth.authToken, 9).then(
                function (response) {
                    if (response.status === 200) {
                        vm.idReport = response.data;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var parameterReport = {};
                        parameterReport.variables = {
                            "dateInit": moment(vm.participants.dateinit).format('DD/MM/YYYY'),
                            "dateEnd": moment(vm.participants.dateend).format('DD/MM/YYYY'),
                            "institution": vm.participants.institution.selected,
                            "organ": vm.changuenameOrgan(vm.participants.organparticipants.id),
                            "typerreceptor": vm.typeparticipants,
                            'abbreviation': localStorageService.get("Abreviatura"),
                            'entity': localStorageService.get("Entidad"),
                            'approver': vm.participants.approver.selected.name,
                            'approversignature': vm.participants.approver.selected.signature === "" ? "" : 'data:image/jpeg;base64,' + vm.participants.approver.selected.signature,
                            'analyst': vm.analyst.name,
                            'analystsignature': vm.analyst.signature === "" ? "" : 'data:image/jpeg;base64,' + vm.analyst.signature,
                            'numbeReport': vm.idReport,
                            'labelAnalisty': vm.analyst.rolelabel,
                            'regiterAnalyst': vm.analyst.identification,
                            'date': moment().format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
                            'username': auth.userName,
                            'regiterApprover': vm.participants.approver.selected.identification,
                        };
                        parameterReport.pathreport = 'Reportransplants/participants/list_of_Contestants/list_of_Contestants.mrt';
                        parameterReport.labelsreport = $translate.getTranslationTable();
                        vm.setReportExcel(parameterReport, vm.Listparticipants);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.setReportExcel = setReportExcel;
        function setReportExcel(parameterReport, datareport) {
            setTimeout(function () {
                Stimulsoft.Base.StiLicense.key = keyStimulsoft;
                var report = new Stimulsoft.Report.StiReport();
                report.loadFile(parameterReport.pathreport);

                var jsonData = {
                    'data': datareport,
                    'Labels': [parameterReport.labelsreport],
                    'variables': [parameterReport.variables]
                };

                var dataSet = new Stimulsoft.System.Data.DataSet();
                dataSet.readJson(jsonData);

                report.dictionary.databases.clear();
                report.regData('Demo', 'Demo', dataSet);

                report.renderAsync(function () {
                    var settings = new Stimulsoft.Report.Export.StiExcel2007ExportSettings();
                    var service = new Stimulsoft.Report.Export.StiExcel2007ExportService();
                    var stream = new Stimulsoft.System.IO.MemoryStream();
                    service.exportToAsync(function () {
                        var bytes = stream.toArray();
                        var base64String = Stimulsoft.System.Convert.toBase64String(bytes);
                        vm.saveparticipantesReport(base64String);
                    }, report, stream, settings);

                });
            }, 10);
        }
        vm.saveparticipantesReport = saveparticipantesReport;
        function saveparticipantesReport(base64) {
            var data = {
                "idReport": vm.idReport,
                "nameReceptor": vm.changuenameOrgan(vm.participants.organparticipants.id),
                "institution": vm.participants.institution.selected.name,
                "deliverDate": new Date(moment().format()).getTime(),
                "receptionDate": new Date(moment(vm.participants.dateinit).format()).getTime(),
                "generationDate": new Date(moment().format()).getTime(),
                "reportType": 9,
                "file": base64,
                "extension": ".xlsx",
                'approveruser': vm.participants.approver.selected.name,
                "analystuser": vm.analyst.name
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.saveReport(auth.authToken, data).then(
                function (response) {
                    if (response.status === 200) {
                        logger.success($filter('translate')('0149'));
                        vm.loadingdata = false;
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        //donante fallecido
        vm.getdonordeath = getdonordeath;
        function getdonordeath() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Listgetdonordeath = [];
            return reportransDS.getdonordeath(auth.authToken, 0).then(
                function (data) {
                    vm.getdonorliving();
                    if (data.status === 200) {
                        data.data.forEach(function (value) {
                            value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName;
                        });
                        vm.Listgetdonordeath = data.data;
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.getseachtypedonor = getseachtypedonor;
        function getseachtypedonor() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.listSearchorgandonor = [];
            return reportransDS.getdetaildonor(auth.authToken, vm.donordeath.donor.selected.id).then(
                function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        var dateentry = new Date(moment(data.data.dateentry).format()).getTime();
                        var trialdate = new Date(moment(data.data.trialdate).format()).getTime();
                        var datesamplecollection = new Date(moment(data.data.datesamplecollection).format()).getTime();

                        data.data.dateentry = moment(dateentry).format(vm.formatDate.toUpperCase());
                        data.data.trialdate = moment(trialdate).format(vm.formatDate.toUpperCase());
                        data.data.datesamplecollection = moment(datesamplecollection).format(vm.formatDate.toUpperCase());

                        vm.Listorderparticipants = [];
                        var recephlaa = data.data.a.split(',');
                        data.data.a1 = recephlaa[0] === undefined ? 'N/A' : recephlaa[0].trim();
                        data.data.a2 = recephlaa[1] === undefined ? 'N/A' : recephlaa[1].trim();

                        var recephlab = data.data.b.split(',');
                        data.data.b1 = recephlab[0] === undefined ? 'N/A' : recephlab[0].trim();
                        data.data.b2 = recephlab[1] === undefined ? 'N/A' : recephlab[1].trim();

                        var recephlac = data.data.c.split(',');
                        data.data.c1 = recephlac[0] === undefined ? 'N/A' : recephlac[0].trim();
                        data.data.c2 = recephlac[1] === undefined ? 'N/A' : recephlac[1].trim();

                        var recephladrb1 = data.data.drb1.split(',');
                        data.data.drb11 = recephladrb1[0] === undefined ? 'N/A' : recephladrb1[0].trim();
                        data.data.drb12 = recephladrb1[1] === undefined ? 'N/A' : recephladrb1[1].trim();

                        var recephldqa = data.data.dqa.split(',');
                        data.data.dqa1 = recephldqa[0] === undefined ? 'N/A' : recephldqa[0].trim();
                        data.data.dqa2 = recephldqa[1] === undefined ? 'N/A' : recephldqa[1].trim();

                        var recephldqb = data.data.dqb.split(',');
                        data.data.dqb1 = recephldqb[0] === undefined ? 'N/A' : recephldqb[0].trim();
                        data.data.dqb2 = recephldqb[1] === undefined ? 'N/A' : recephldqb[1].trim();


                        vm.detaildonor = data.data;
                        if (vm.detaildonor.institution.id === 0) {
                            vm.detaildonor.institution.name = '';
                            vm.detaildonor.institution.phone = '';
                            vm.detaildonor.institution.address = '';

                        } else {
                            vm.institutiondonor(data.data.institution.id);
                        }
                        var organ = _.split(data.data.donatedorgan, ',');
                        var listSearchorgandonor = [];
                        organ.forEach(function (value) {
                            var organ = {
                                'id': value,
                                'name': vm.changuenameOrgan(parseInt(value))
                            }
                            listSearchorgandonor.push(organ);
                        })
                        vm.listSearchorgandonor = listSearchorgandonor;
                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        vm.institutiondonor = institutiondonor;
        function institutiondonor(institution) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.getinstitutionId(auth.authToken, institution).then(
                function (data) {
                    if (data.status === 200) {
                        vm.detaildonor.institution.name = data.data.name;
                        vm.detaildonor.institution.phone = data.data.phone;
                        vm.detaildonor.institution.address = data.data.address;
                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        vm.detailDemoreceptor = detailDemoreceptor;
        function detailDemoreceptor(patientId, documentType, type) {
            vm.datadetailreceptor = {
                'age': '',
                'sex': '',
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            patientDS.getPatientbyIddocument(auth.authToken, patientId, documentType).then(function (response) {
                if (response.data.length > 0) {
                    response.data.forEach(function (value) {
                        if (value.idDemographic === -105) {
                            vm.datadetailreceptor.age = common.getAgeAsString(value.notCodifiedValue, vm.formatDate.toUpperCase())
                        }
                        if (value.idDemographic === -104) {
                            vm.datadetailreceptor.sex = value.codifiedName;
                        }
                    });
                    if (type === 2) {
                        vm.preliminardonorview(1, 2);
                    }
                    if (type === 3) {
                        vm.savepdfReportDonor(2);
                    }
                }
            }, function (error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });
        }
        vm.preliminarydonor = preliminarydonor;
        function preliminarydonor(validate, type) {
            vm.Listorderparticipants = [];
            vm.hidebutton = false;
            vm.loadingdata = true;
            if (type === 2) {
                vm.viewpreliminardonor = false;
            }
            if (validate === 3) {
                if (vm.donordeath.deliveryresults === null || vm.donordeath.donor.selected === undefined || vm.donordeath.typeTransplant === 0 || vm.donordeath.approver.selected === undefined) {
                    vm.loadingdata = false;
                } else {
                    vm.viewpreliminardonor = false;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return reportransDS.getListParticipants(auth.authToken, vm.donordeath.donor.selected.idDonor, vm.donordeath.typeTransplant).then(
                        function (data) {
                            if (data.status === 200) {
                                if (data.data.length !== 0) {
                                    data.data.forEach(function (value) {
                                        if (value.a !== '') {
                                            var recephlaa = value.a.split(',');
                                            value.a1 = recephlaa[0] === undefined ? 'N/A' : recephlaa[0].trim();
                                            value.a2 = recephlaa[1] === undefined ? 'N/A' : recephlaa[1].trim();
                                        } else {
                                            value.a1 = 'N/A';
                                            value.a2 = 'N/A';
                                        }
                                        if (value.b !== '') {
                                            var recephlab = value.b.split(',');
                                            value.b1 = recephlab[0] === undefined ? 'N/A' : recephlab[0].trim();
                                            value.b2 = recephlab[1] === undefined ? 'N/A' : recephlab[1].trim();
                                        } else {
                                            value.b1 = 'N/A';
                                            value.b2 = 'N/A';
                                        }

                                        if (value.drb1 !== '') {
                                            var recephladrb1 = value.drb1.split(',');
                                            value.drb11 = recephladrb1[0] === undefined ? 'N/A' : recephladrb1[0].trim();
                                            value.drb12 = recephladrb1[1] === undefined ? 'N/A' : recephladrb1[1].trim();
                                        } else {
                                            value.drb11 = 'N/A';
                                            value.drb12 = 'N/A';
                                        }

                                        if (type === 2) {
                                            if (value.c !== '') {
                                                var recephlac = value.c.split(',');
                                                value.c1 = recephlac[0] === undefined ? 'N/A' : recephlac[0].trim();
                                                value.c2 = recephlac[1] === undefined ? 'N/A' : recephlac[1].trim();
                                            } else {
                                                value.c1 = 'N/A';
                                                value.c2 = 'N/A';
                                            }
                                            if (value.dqa !== '') {
                                                var recephldqa = value.dqa.split(',');
                                                value.dqa1 = recephldqa[0] === undefined ? 'N/A' : recephldqa[0].trim();
                                                value.dqa2 = recephldqa[1] === undefined ? 'N/A' : recephldqa[1].trim();
                                            } else {
                                                value.dqa1 = 'N/A';
                                                value.dqa2 = 'N/A';
                                            }

                                            if (value.dqb !== '') {
                                                var recephldqb = value.dqb.split(',');
                                                value.dqb1 = recephldqb[0] === undefined ? 'N/A' : recephldqb[0].trim();
                                                value.dqb2 = recephldqb[1] === undefined ? 'N/A' : recephldqb[1].trim();
                                            } else {
                                                value.dqb1 = 'N/A';
                                                value.dqb2 = 'N/A';
                                            }
                                        }

                                        if (value.a === '' && vm.detaildonor.a === '') {
                                            value.incompatibilityscorea = 'N/A';
                                        } else {
                                            if (vm.detaildonor.a1 === vm.detaildonor.a2) {
                                                if (value.a1 === vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 0;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2 || value.a1 === vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 0;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 1;
                                                }
                                            } else {
                                                if (value.a1 === vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 0;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2 || value.a1 === vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 1;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 2;
                                                }
                                            }
                                        }

                                        if (value.b === '' && vm.detaildonor.b === '') {
                                            value.incompatibilityscoreb = 'N/A';
                                        } else {
                                            if (vm.detaildonor.b1 === vm.detaildonor.b2) {
                                                if (value.b1 === vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 0;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2 || value.b1 === vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 0;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 1;
                                                }

                                            } else {
                                                if (value.b1 === vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 0;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2 || value.b1 === vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 1;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 2;
                                                }
                                            }
                                        }

                                        if (type === 2) {
                                            if (value.c === '' && vm.detaildonor.c === '') {
                                                value.incompatibilityscorec = 'N/A';
                                            } else {
                                                if (vm.detaildonor.c1 === vm.detaildonor.c2) {
                                                    if (value.c1 === vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 0;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2 || value.c1 === vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 0;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 1;
                                                    }

                                                } else {
                                                    if (value.c1 === vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 0;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2 || value.c1 === vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 1;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 2;
                                                    }
                                                }
                                            }
                                        }
                                        if (value.drb1 === '' && vm.detaildonor.drb1 === '') {
                                            value.incompatibilityscoredrb1 = 'N/A';
                                        } else {
                                            if (vm.detaildonor.drb11 === vm.detaildonor.drb12) {
                                                if (value.drb11 === vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 0;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12 || value.drb11 === vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 0;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 1;
                                                }

                                            } else {
                                                if (value.drb11 === vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 0;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12 || value.drb11 === vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 1;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 2;
                                                }
                                            }
                                        }
                                    });
                                    vm.Listorderparticipants = data.data;
                                    if (type === 2) {
                                        vm.detailDemoreceptor(data.data[0].patientId, data.data[0].documentType.id, type);
                                    }
                                    if (type === 3) {
                                        vm.detailDemoreceptor(data.data[0].patientId, data.data[0].documentType.id, type);
                                    }
                                    vm.loadingdata = false;
                                } else {
                                    logger.info($filter('translate')('3379'));
                                    vm.loadingdata = false;
                                }

                            } else {
                                logger.info($filter('translate')('3379'));
                                vm.loadingdata = false;
                            }
                        },
                        function (error) {
                            vm.loadingdata = false;
                            vm.modalError(error);
                        }
                    );
                }
            } else {
                if (vm.donordeath.deliveryresults === null || vm.donordeath.donor.selected === undefined || vm.donordeath.typeTransplant === 0 || vm.donordeath.approver.selected === undefined) {
                    vm.requeriddonordeliveryresults = vm.donordeath.deliveryresults === null ? true : false;
                    vm.requeriddonor = vm.donordeath.donor.selected === undefined ? true : false;
                    vm.requeridtypeTransplant = vm.donordeath.typeTransplant === 0 ? true : false;
                    vm.requeridapproverdonor = vm.donordeath.approver.selected === undefined ? true : false;
                    vm.loadingdata = false;
                } else {
                    vm.viewpreliminardonor = false;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return reportransDS.getListParticipants(auth.authToken, vm.donordeath.donor.selected.idDonor, vm.donordeath.typeTransplant).then(
                        function (data) {
                            if (data.status === 200) {
                                if (data.data.length !== 0) {
                                    data.data.forEach(function (value) {
                                        if (value.a !== '') {
                                            var recephlaa = value.a.split(',');
                                            value.a1 = recephlaa[0] === undefined ? 'N/A' : recephlaa[0].trim();
                                            value.a2 = recephlaa[1] === undefined ? 'N/A' : recephlaa[1].trim();
                                        } else {
                                            value.a1 = 'N/A';
                                            value.a2 = 'N/A';
                                        }
                                        if (value.b !== '') {
                                            var recephlab = value.b.split(',');
                                            value.b1 = recephlab[0] === undefined ? 'N/A' : recephlab[0].trim();
                                            value.b2 = recephlab[1] === undefined ? 'N/A' : recephlab[1].trim();
                                        } else {
                                            value.b1 = 'N/A';
                                            value.b2 = 'N/A';
                                        }

                                        if (value.drb1 !== '') {
                                            var recephladrb1 = value.drb1.split(',');
                                            value.drb11 = recephladrb1[0] === undefined ? 'N/A' : recephladrb1[0].trim();
                                            value.drb12 = recephladrb1[1] === undefined ? 'N/A' : recephladrb1[1].trim();
                                        } else {
                                            value.drb11 = 'N/A';
                                            value.drb12 = 'N/A';
                                        }

                                        if (type === 2) {
                                            if (value.c !== '') {
                                                var recephlac = value.c.split(',');
                                                value.c1 = recephlac[0] === undefined ? 'N/A' : recephlac[0].trim();
                                                value.c2 = recephlac[1] === undefined ? 'N/A' : recephlac[1].trim();
                                            } else {
                                                value.c1 = 'N/A';
                                                value.c2 = 'N/A';
                                            }
                                            if (value.dqa !== '') {
                                                var recephldqa = value.dqa.split(',');
                                                value.dqa1 = recephldqa[0] === undefined ? 'N/A' : recephldqa[0].trim();
                                                value.dqa2 = recephldqa[1] === undefined ? 'N/A' : recephldqa[1].trim();
                                            } else {
                                                value.dqa1 = 'N/A';
                                                value.dqa2 = 'N/A';
                                            }

                                            if (value.dqb !== '') {
                                                var recephldqb = value.dqb.split(',');
                                                value.dqb1 = recephldqb[0] === undefined ? 'N/A' : recephldqb[0].trim();
                                                value.dqb2 = recephldqb[1] === undefined ? 'N/A' : recephldqb[1].trim();
                                            } else {
                                                value.dqb1 = 'N/A';
                                                value.dqb2 = 'N/A';
                                            }
                                        }

                                        if (value.a === '' && vm.detaildonor.a === '') {
                                            value.incompatibilityscorea = 'N/A';
                                        } else {
                                            if (vm.detaildonor.a1 === vm.detaildonor.a2) {
                                                if (value.a1 === vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 0;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2 || value.a1 === vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 0;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 1;
                                                }
                                            } else {
                                                if (value.a1 === vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 0;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 === vm.detaildonor.a2 || value.a1 === vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 1;
                                                }
                                                if (value.a1 !== vm.detaildonor.a1 && value.a2 !== vm.detaildonor.a2) {
                                                    value.incompatibilityscorea = 2;
                                                }
                                            }
                                        }

                                        if (value.b === '' && vm.detaildonor.b === '') {
                                            value.incompatibilityscoreb = 'N/A';
                                        } else {
                                            if (vm.detaildonor.b1 === vm.detaildonor.b2) {
                                                if (value.b1 === vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 0;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2 || value.b1 === vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 0;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 1;
                                                }

                                            } else {
                                                if (value.b1 === vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 0;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 === vm.detaildonor.b2 || value.b1 === vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 1;
                                                }
                                                if (value.b1 !== vm.detaildonor.b1 && value.b2 !== vm.detaildonor.b2) {
                                                    value.incompatibilityscoreb = 2;
                                                }
                                            }
                                        }

                                        if (type === 2) {
                                            if (value.c === '' && vm.detaildonor.c === '') {
                                                value.incompatibilityscorec = 'N/A';
                                            } else {
                                                if (vm.detaildonor.c1 === vm.detaildonor.c2) {
                                                    if (value.c1 === vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 0;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2 || value.c1 === vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 0;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 1;
                                                    }

                                                } else {
                                                    if (value.c1 === vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 0;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 === vm.detaildonor.c2 || value.c1 === vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 1;
                                                    }
                                                    if (value.c1 !== vm.detaildonor.c1 && value.c2 !== vm.detaildonor.c2) {
                                                        value.incompatibilityscorec = 2;
                                                    }
                                                }
                                            }
                                        }
                                        if (value.drb1 === '' && vm.detaildonor.drb1 === '') {
                                            value.incompatibilityscoredrb1 = 'N/A';
                                        } else {
                                            if (vm.detaildonor.drb11 === vm.detaildonor.drb12) {
                                                if (value.drb11 === vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 0;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12 || value.drb11 === vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 0;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 1;
                                                }

                                            } else {
                                                if (value.drb11 === vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 0;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 === vm.detaildonor.drb12 || value.drb11 === vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 1;
                                                }
                                                if (value.drb11 !== vm.detaildonor.drb11 && value.drb12 !== vm.detaildonor.drb12) {
                                                    value.incompatibilityscoredrb1 = 2;
                                                }
                                            }
                                        }
                                    });
                                    vm.Listorderparticipants = data.data;
                                    if (type === 2) {
                                        vm.detailDemoreceptor(data.data[0].patientId, data.data[0].documentType.id, type);
                                    }
                                    if (type === 3) {
                                        vm.detailDemoreceptor(data.data[0].patientId, data.data[0].documentType.id, type);
                                    }
                                    vm.loadingdata = false;
                                } else {
                                    logger.info($filter('translate')('3379'));
                                    vm.loadingdata = false;
                                }

                            } else {
                                logger.info($filter('translate')('3379'));
                                vm.loadingdata = false;
                            }
                        },
                        function (error) {
                            vm.loadingdata = false;
                            vm.modalError(error);
                        }
                    );
                }
            }
        }
        vm.eventUndodonorliving = eventUndodonorliving;
        function eventUndodonorliving() {
            vm.donordeath = {
                donor: {},
                typeTransplant: 0,
                deliveryresults: new Date(),
                approver: {},
                typeReport: 1
            }
            vm.viewpreliminardonor = false;
            vm.Listorderparticipants = [];
            vm.listSearchorgandonor = [];
            vm.requeriddonordeliveryresults = false;
            vm.requeriddonor = false;
            vm.requeridtypeTransplant = false;
            vm.requeridapproverdonor = false;
            vm.hidebutton = false;
        }
        vm.savepdfReportDonor = savepdfReportDonor;
        function savepdfReportDonor(type) {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var typereportdonor = type === 1 ? 11 : 12
            return reportransDS.getsavetypereport(auth.authToken, typereportdonor).then(
                function (response) {
                    if (response.status === 200) {
                        vm.idReportdonor = response.data;
                        vm.preliminardonorview(2, type);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.preliminardonorview = preliminardonorview;
        function preliminardonorview(validate, type) {
            vm.loadingdata = true;
            vm.typereportdonor = type;
            vm.validatedsavereportdonor = validate;
            vm.viewpreliminardonor = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var parameterReport = {};
            parameterReport.variables = {
                'date': moment().format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
                'dateEntryResult': moment(vm.donordeath.deliveryresults).format(vm.formatDate.toUpperCase()),
                'abbreviation': localStorageService.get("Abreviatura"),
                'entity': localStorageService.get("Entidad"),
                'username': auth.userName,
                'analyst': vm.analyst.name,
                'numbeReport': vm.validatedsavereportdonor === 2 ? vm.idReportdonor : 'Reporte preliminar',
                'analystsignature': 'data:image/jpeg;base64,' + vm.analyst.signature,
                'regiterAnalyst': vm.analyst.identification,
                'labelAnalisty': vm.analyst.rolelabel,
                'approver': vm.donordeath.approver.selected.name,
                'approversignature': 'data:image/jpeg;base64,' + vm.donordeath.approver.selected.signature,
                'regiterApprover': vm.donordeath.approver.selected.identification,
            };
            if (type === 1) {
                parameterReport.pathreport = '/Reportransplants/donor/allograft_recipients_deceased_donor/allograft_recipients_deceased_donor.mrt';
            } else {
                if (vm.donordeath.typeReport === 1) {
                    parameterReport.pathreport = '/Reportransplants/donor/livingdonorallograftrecipientshaplotipos/livingdonorallograftrecipientshaplotipos.mrt';
                } else {
                    parameterReport.pathreport = '/Reportransplants/donor/livingdonorallograftrecipientsinhaplotipos/livingdonorallograftrecipientsinhaplotipos.mrt';
                }

            }
            parameterReport.labelsreport = $translate.getTranslationTable();
            vm.detaildonor.donor = vm.donordeath.donor.selected;
            vm.detaildonor.organ = vm.changuenameOrgan(parseInt(vm.donordeath.typeTransplant))
            vm.detaildonor.Listorderparticipants = vm.Listorderparticipants;
            vm.detaildonor.detailreceptor = vm.datadetailreceptor;
            vm.dataorder = [vm.detaildonor];
            vm.setReportDonor(parameterReport, vm.dataorder, type);
        }
        vm.eventUndoDonor = eventUndoDonor;
        function eventUndoDonor() {
            vm.viewpreliminardonor = false;
            vm.hidebutton = false;
        }
        vm.setReportDonor = setReportDonor;
        function setReportDonor(parameterReport, datareport, type) {
            setTimeout(function () {
                Stimulsoft.Base.StiLicense.key = keyStimulsoft;
                var report = new Stimulsoft.Report.StiReport();
                report.loadFile(parameterReport.pathreport);

                var jsonData = {
                    'data': datareport,
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
                        var binary = '';
                        for (var i = 0; i < buffer.length; i++) {
                            binary += String.fromCharCode(buffer[i]);
                        }
                        var base64String = btoa(binary);

                        if (vm.validatedsavereportdonor === 1) {
                            if (type === 1) {
                                var a = document.getElementById("previreportdonor");
                            } else {
                                var a = document.getElementById("previreportdonor2");
                            }
                            a.type = 'application/pdf';
                            a.src = 'data:application/pdf;base64,' + base64String;
                            a.height = '100%';
                            $scope.$apply(function () {
                                vm.loadingdata = false;
                            });
                        }
                        if (vm.validatedsavereportdonor === 2) {
                            vm.saveReportdonor(base64String, type)
                        }
                    }, report, stream, settings);

                });
            }, 10);
        }
        vm.saveReportdonor = saveReportdonor;
        function saveReportdonor(base64, type) {
            var data = {
                "idReport": vm.idReportdonor,
                "identificationDonor": vm.dataorder[0].donor.patientId,
                "nameDonor": vm.dataorder[0].donor.name,
                "institution": vm.dataorder[0].institution.name,
                "deliverDate": new Date(moment(vm.donordeath.deliveryresults).format()).getTime(),
                "receptionDate": new Date(moment(vm.dataorder[0].dateentry).format()).getTime(),
                "generationDate": new Date(moment().format()).getTime(),
                "reportType": type === 1 ? 11 : 12,
                "file": base64,
                "extension": ".pdf",
                "approveruser": vm.donordeath.approver.selected.name,
                "analystuser": vm.analyst.name
            }
            vm.loadingdata = false;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.saveReport(auth.authToken, data).then(
                function (response) {
                    if (response.status === 200) {
                        vm.hidebutton = true;
                        if (type === 1) {
                            var a = document.getElementById("previreportdonor");
                        } else {
                            var a = document.getElementById("previreportdonor2");
                        }
                        a.type = 'application/pdf';
                        a.src = 'data:application/pdf;base64,' + response.data.file;
                        a.height = '100%';
                        logger.success($filter('translate')('0149'));
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.changuerequeridapprover = changuerequeridapprover;
        function changuerequeridapprover(report, type) {
            $scope.$apply(function () {
                vm.requeridapproverdonor = false;
                if (report === 3 && type === 2) {
                    vm.preliminarydonor(3, 2);
                } else {
                    vm.preliminarydonor(3);
                }
            });
        }
        //donante vivo
        vm.getdonorliving = getdonorliving;
        function getdonorliving() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Listgetdonorliving = [];
            return reportransDS.getdonordeath(auth.authToken, 1).then(
                function (data) {
                    if (data.status === 200) {
                        data.data.forEach(function (value) {
                            value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName;
                        });
                        vm.Listgetdonorliving = data.data;
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.init = init;
        function init() {
            vm.loadingdata = true;
            vm.participants = {
                dateinit: new Date(),
                dateend: new Date()
            }
            vm.minDateinit = new Date(2000, 0, 1);
            vm.typeparticipants1 = true;
            vm.typeparticipants2 = true;
            vm.viewpreliminar = false;
            vm.loadingdata = true;
            vm.maxDate = new Date();
            vm.formatDate = localStorageService.get('FormatoFecha');
            vm.generateReport = false;
            vm.getInstitution();
            vm.listReportDonor = [{
                'id': 1,
                'name': $filter('translate')('3616')
            },
            {
                'id': 2,
                'name': $filter('translate')('3617')
            }]
            vm.requeridanalystparticipants = false;
            vm.requeridapproverparticipants = false;
            vm.organ = [
                {
                    id: 1,
                    name: $filter('translate')('2091')
                }, //Corazón
                {
                    id: 2,
                    name: $filter('translate')('2092')
                }, //Riñón
                {
                    id: 3,
                    name: $filter('translate')('2093')
                },//Hígado
                {
                    id: 4,
                    name: $filter('translate')('2094')
                },//Pulmón
                {
                    id: 5,
                    name: $filter('translate')('2095')
                },//Intestino
                {
                    id: 6,
                    name: $filter('translate')('2096')
                },//Páncreas
                {
                    id: 7,
                    name: $filter('translate')('2097')
                },//Vías aéreas
                {
                    id: 8,
                    name: $filter('translate')('2098')
                },//Células Lumbares
                {
                    id: 9,
                    name: $filter('translate')('2099')
                },//Multivisceral
                {
                    id: 10,
                    name: $filter('translate')('3308')
                },//islotes pancreáticos
                {
                    id: 11,
                    name: $filter('translate')('3327')
                },//células hematopoyéticas
                {
                    id: 12,
                    name: $filter('translate')('3333')
                },//Asociación con enfermedad
                {
                    id: 13,
                    name: 'PRA'
                }//PRA
            ];
            vm.listSearchorgan = _.clone(vm.organ);
            var organ = {
                id: 0,
                name: $filter('translate')('3334')
            }
            vm.listSearchorgan.push(organ);
            vm.report = [
                {
                    id: 1,
                    name: $filter('translate')('3616')
                },
                {
                    id: 2,
                    name: $filter('translate')('3617')
                },
                {
                    id: 3,
                    name: $filter('translate')('3618')
                },
                {
                    id: 4,
                    name: $filter('translate')('3619')
                },
                {
                    id: 5,
                    name: $filter('translate')('3620')
                },
                {
                    id: 6,
                    name: $filter('translate')('3621')
                },
                {
                    id: 7,
                    name: $filter('translate')('3622')
                },
                {
                    id: 10,
                    name: $filter('translate')('3625')
                }
            ]
            vm.selectReport = {
                id: 1,
                name: $filter('translate')('3616')
            }
            vm.organsearchname = {
                id: 0,
                name: $filter('translate')('3334')
            }
            vm.getseach();
            setTimeout(function () {
                document.getElementById('searchgrille').focus();
            }, 400);
        }
        vm.modalError = modalError;
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        vm.isAuthenticate = isAuthenticate;
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            } else {
                vm.init();
            }
        }
        vm.isAuthenticate();
    }

})();
/* jshint ignore:end */
