/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.cytotoxicantibodies')
        .controller('cytotoxicantibodiesController', cytotoxicantibodiesController);
    cytotoxicantibodiesController.$inject = ['localStorageService', 'logger', 'keyStimulsoft', 'reportransDS',
        '$filter', '$state', 'moment', '$rootScope', '$translate', 'recepctionDS', 'cytotoxicantibodiesDS', 'userDS', 'common', '$scope'];
    function cytotoxicantibodiesController(localStorageService, logger, keyStimulsoft, reportransDS,
        $filter, $state, moment, $rootScope, $translate, recepctionDS, cytotoxicantibodiesDS, userDS, common, $scope) {
        var vm = this;
        vm.title = 'cytotoxicantibodies';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.NamePage = $filter('translate')('3319');
        vm.minDateinit = new Date(2000, 0, 1);
        vm.maxDate = new Date();
        vm.modalError = modalError;
        $rootScope.pageview = 3;
        vm.new = {};
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        vm.generateFileblock = generateFileblock;
        function generateFileblock() {
            vm.requeridapproverblock = false;
            vm.requeriddeliveryresultsblock = false;
            vm.datazip = _.filter(vm.listcytotoxicantibodies, function (o) { return o.select; });
            vm.dataprintblock = {
                approver: {},
                deliveryresults: new Date()
            }
            UIkit.modal('#modal_block_cytotoxicantibodies').show();
        }
        vm.preliminaryblock = preliminaryblock;
        function preliminaryblock(validate) {
            vm.validatedsavereport = validate;
            if (vm.dataprintblock.approver.selected === undefined || vm.dataprintblock.deliveryresults === null) {
                vm.requeridapproverblock = vm.dataprintblock.approver.selected === undefined ? true : false;
                vm.requeriddeliveryresultsblock = vm.dataprintblock.deliveryresults === null ? true : false;
            } else {
                vm.generateFile();
            }
        }
        vm.changuerequeridblock = changuerequeridblock;
        function changuerequeridblock() {
            $scope.$apply(function () {
                vm.requeridapproverblock = false;
            });
        }
        vm.generateFile = generateFile;
        function generateFile() {
            vm.count = 0;
            vm.totaldownload = 0;
            vm.porcentdownload = 0;
            UIkit.modal('#modalprogressprint', { modal: false, keyboard: false }).show();
            vm.total = vm.datazip.length - 1;
            if (vm.validatedsavereport === 1) {
                vm.dategeneratezip();
            } else {
                vm.printsave = [];
                vm.savepdfReportblock();
            }
        }
        vm.savepdfReportblock = savepdfReportblock;
        function savepdfReportblock() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return reportransDS.getsavetypereport(auth.authToken, 8).then(
                function (response) {
                    if (response.status === 200) {
                        vm.datazip[vm.count].idReport = response.data;
                        vm.dategeneratezip();
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.dategeneratezip = dategeneratezip;
        function dategeneratezip() {
            if (vm.datazip[vm.count].receiverPatient.gender === 7) {
                vm.datazip[vm.count].receiverPatient.genderName = $filter('translate')('0363');
            }

            if (vm.datazip[vm.count].receiverPatient.gender === 8) {
                vm.datazip[vm.count].receiverPatient.genderName = $filter('translate')('0362');
            }

            if (vm.datazip[vm.count].receiverPatient.gender === 9) {
                vm.datazip[vm.count].receiverPatient.genderName = $filter('translate')('0401');
            }

            if (vm.datazip[vm.count].receiverPatient.gender === 42) {
                vm.datazip[vm.count].receiverPatient.genderName = $filter('translate')('0402');
            }

            vm.datazip[vm.count].nameOrgan = vm.changuenameOrgan(parseInt(vm.datazip[vm.count].receiverPatient.organ));
            vm.datazip[vm.count].receiverPatient.birthday = moment(vm.datazip[vm.count].receiverPatient.birthday).format(vm.formatDate.toUpperCase());
            vm.datazip[vm.count].receiverPatient.age = common.getAgeAsString(vm.datazip[vm.count].receiverPatient.birthday, vm.formatDate.toUpperCase());
            vm.datazip[vm.count].datestudy = vm.datazip[vm.count].datestudy === undefined ? 'N/A' : moment(vm.datazip[vm.count].datestudy).format(vm.formatDate.toUpperCase());
            vm.datazip[vm.count].datesamplecollection = vm.datazip[vm.count].datesamplecollection === undefined ? 'N/A' : moment(vm.datazip[vm.count].datesamplecollection).format(vm.formatDate.toUpperCase());
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return cytotoxicantibodiesDS.detailcytotoxicantibodies(auth.authToken, vm.datazip[vm.count].idDonor, vm.datazip[vm.count].id).then(
                function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        vm.datazip[vm.count].aloT4 = data.data.aloT4;
                        vm.datazip[vm.count].aloB4 = data.data.aloB4;
                        vm.datazip[vm.count].aloT20 = data.data.aloT20;
                        vm.datazip[vm.count].aloB20 = data.data.aloB20;
                        vm.datazip[vm.count].aloT37 = data.data.aloT37;
                        vm.datazip[vm.count].aloB37 = data.data.aloB37;
                        vm.datazip[vm.count].aloDttT4 = data.data.aloDttT4;
                        vm.datazip[vm.count].aloDttB4 = data.data.aloDttB4;
                        vm.datazip[vm.count].aloDttT20 = data.data.aloDttT20;
                        vm.datazip[vm.count].aloDttB20 = data.data.aloDttB20;
                        vm.datazip[vm.count].aloDttT37 = data.data.aloDttT37;
                        vm.datazip[vm.count].aloDttB37 = data.data.aloDttB37;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        vm.datazip[vm.count].variables = {
                            'date': moment().format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
                            'dateEntryResult': moment(vm.dataprintblock.deliveryresults).format(vm.formatDate.toUpperCase()),
                            'abbreviation': localStorageService.get("Abreviatura"),
                            'entity': localStorageService.get("Entidad"),
                            'username': auth.userName,
                            'analyst': vm.analyst.name,
                            'labelAnalisty': vm.analyst.rolelabel,
                            'regiterAnalyst': vm.analyst.identification,
                            'numbeReport': vm.validatedsavereport === 1 ? 'Reporte preliminar' : vm.datazip[vm.count].idReport,
                            'analystsignature': 'data:image/jpeg;base64,' + vm.analyst.signature,
                            'approver': vm.dataprintblock.approver.selected.name,
                            'regiterApprover': vm.dataprintblock.approver.selected.identification,
                            'approversignature': 'data:image/jpeg;base64,' + vm.dataprintblock.approver.selected.signature
                        };
                        vm.datazip[vm.count].pathreport = '/Reportransplants/participants/cytotoxicantibodies/cytotoxicantibodies.mrt';
                        vm.datazip[vm.count].labelsreport = $translate.getTranslationTable();
                        vm.dataorder = [vm.datazip[vm.count]];
                        setTimeout(function () {
                            Stimulsoft.Base.StiLicense.key = keyStimulsoft;
                            var report = new Stimulsoft.Report.StiReport();
                            report.loadFile(vm.datazip[vm.count].pathreport);

                            var jsonData = {
                                'data': vm.dataorder,
                                'Labels': [vm.datazip[vm.count].labelsreport],
                                'variables': [vm.datazip[vm.count].variables]
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
                                    if (vm.validatedsavereport === 2) {
                                        var data = stream.toArray();
                                        var buffer = new Uint8Array(data);
                                        var binary = '';
                                        for (var i = 0; i < buffer.length; i++) {
                                            binary += String.fromCharCode(buffer[i]);
                                        }
                                        var base64String = btoa(binary);
                                        vm.datazip[vm.count].buffer = base64String;
                                    } else {
                                        var data = stream.toArray();
                                        var buffer = new Uint8Array(data);
                                        var byteArray = new Uint8Array(buffer);
                                        var byteString = '';
                                        for (var i = 0; i < byteArray.byteLength; i++) {
                                            byteString += String.fromCharCode(byteArray[i]);
                                        }
                                        vm.datazip[vm.count].buffer = byteString;
                                    }
                                    if (vm.total === vm.count) {
                                        if (vm.validatedsavereport === 2) {
                                            var data = {
                                                "idReport": vm.datazip[vm.count].idReport,
                                                "nameReceptor": vm.datazip[vm.count].receiverPatient.name1 + ' ' + vm.datazip[vm.count].receiverPatient.name2 + ' ' + vm.datazip[vm.count].receiverPatient.surName + ' ' + vm.datazip[vm.count].receiverPatient.lastName,
                                                "identificationReceptor": vm.datazip[vm.count].receiverPatient.patientId,
                                                "institution": vm.datazip[vm.count].institution.name,
                                                "deliverDate": new Date(moment(vm.datazip[vm.count].deliveryresults).format()).getTime(),
                                                "receptionDate": new Date(moment(vm.datazip[vm.count].datestudy).format()).getTime(),
                                                "generationDate": new Date(moment().format()).getTime(),
                                                "reportType": 8,
                                                "file": vm.datazip[vm.count].buffer,
                                                "extension": ".pdf",
                                                "approveruser": vm.dataprintblock.approver.selected.name,
                                                'labelAnalisty': vm.analyst.rolelabel,
                                                "analystuser": vm.analyst.name,
                                                "identificationDonor": vm.datazip[vm.count].donorPatient.patientId,
                                                "nameDonor": vm.datazip[vm.count].donorPatient.name1 + ' ' + vm.datazip[vm.count].donorPatient.name2 + ' ' + vm.datazip[vm.count].donorPatient.surName + ' ' + vm.datazip[vm.count].donorPatient.lastName,
                                            }
                                            var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                            return recepctionDS.saveReport(auth.authToken, data).then(
                                                function (response) {
                                                    if (response.status === 200) {
                                                        vm.totaldownload = vm.totaldownload + 1;
                                                        vm.porcentdownload = Math.round((vm.totaldownload * 100) / vm.datazip.length);
                                                        var bufferbase64 = _base64ToArrayBuffer(response.data.file);
                                                        var buffer = new Uint8Array(bufferbase64);
                                                        var byteArray = new Uint8Array(buffer);
                                                        var byteString = '';
                                                        for (var i = 0; i < byteArray.byteLength; i++) {
                                                            byteString += String.fromCharCode(byteArray[i]);
                                                        }
                                                        vm.datazip[vm.count].buffersave = byteString;
                                                        var namefiledonor = vm.datazip[vm.count].donorPatient.patientId.replace(/\s+/g, '') + '-' + vm.datazip[vm.count].donorPatient.name1.replace(/\s+/g, '') + vm.datazip[vm.count].donorPatient.name2.replace(/\s+/g, '') + vm.datazip[vm.count].donorPatient.surName.replace(/\s+/g, '') + vm.datazip[vm.count].donorPatient.lastName.replace(/\s+/g, '');
                                                        var namefilereciver = vm.datazip[vm.count].receiverPatient.patientId.replace(/\s+/g, '') + '-' + vm.datazip[vm.count].receiverPatient.name1.replace(/\s+/g, '') + vm.datazip[vm.count].receiverPatient.name2.replace(/\s+/g, '') + vm.datazip[vm.count].receiverPatient.surName.replace(/\s+/g, '') + vm.datazip[vm.count].receiverPatient.lastName.replace(/\s+/g, '');

                                                        var databases = {
                                                            "donorPatient": namefiledonor,
                                                            "receiverPatient": namefilereciver,
                                                            "buffersave": byteString
                                                        }
                                                        vm.printsave.push(databases);
                                                        UIkit.modal('#modalprogressprint', { bgclose: false, keyboard: false }).hide();
                                                        vm.printzipsave();
                                                    }
                                                },
                                                function (error) {
                                                    vm.loading = false;
                                                    vm.modalError(error);
                                                }
                                            );

                                        } else {
                                            vm.printzip();
                                        }
                                        UIkit.modal('#modalprogressprint', { bgclose: false, keyboard: false }).hide();
                                    } else {
                                        if (vm.validatedsavereport === 2) {
                                            var data = {
                                                "idReport": vm.datazip[vm.count].idReport,
                                                "nameReceptor": vm.datazip[vm.count].receiverPatient.name1 + ' ' + vm.datazip[vm.count].receiverPatient.name2 + ' ' + vm.datazip[vm.count].receiverPatient.surName + ' ' + vm.datazip[vm.count].receiverPatient.lastName,
                                                "identificationReceptor": vm.datazip[vm.count].receiverPatient.patientId,
                                                "institution": vm.datazip[vm.count].institution.name,
                                                "deliverDate": new Date(moment(vm.datazip[vm.count].deliveryresults).format()).getTime(),
                                                "receptionDate": new Date(moment(vm.datazip[vm.count].datestudy).format()).getTime(),
                                                "generationDate": new Date(moment().format()).getTime(),
                                                "reportType": 8,
                                                "file": vm.datazip[vm.count].buffer,
                                                "extension": ".pdf",
                                                "approveruser": vm.dataprintblock.approver.selected.name,
                                                "analystuser": vm.analyst.name,
                                                "identificationDonor": vm.datazip[vm.count].donorPatient.patientId,
                                                "nameDonor": vm.datazip[vm.count].donorPatient.name1 + ' ' + vm.datazip[vm.count].donorPatient.name2 + ' ' + vm.datazip[vm.count].donorPatient.surName + ' ' + vm.datazip[vm.count].donorPatient.lastName,
                                            }
                                            var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                            return recepctionDS.saveReport(auth.authToken, data).then(
                                                function (response) {
                                                    if (response.status === 200) {
                                                        vm.totaldownload = vm.totaldownload + 1;
                                                        vm.porcentdownload = Math.round((vm.totaldownload * 100) / vm.datazip.length);
                                                        var bufferbase64 = _base64ToArrayBuffer(response.data.file);
                                                        var buffer = new Uint8Array(bufferbase64);
                                                        var byteArray = new Uint8Array(buffer);
                                                        var byteString = '';
                                                        for (var i = 0; i < byteArray.byteLength; i++) {
                                                            byteString += String.fromCharCode(byteArray[i]);
                                                        }
                                                        vm.datazip[vm.count].buffersave = byteString;
                                                        var namefiledonor = vm.datazip[vm.count].donorPatient.patientId.replace(/\s+/g, '') + '-' + vm.datazip[vm.count].donorPatient.name1.replace(/\s+/g, '') + vm.datazip[vm.count].donorPatient.name2.replace(/\s+/g, '') + vm.datazip[vm.count].donorPatient.surName.replace(/\s+/g, '') + vm.datazip[vm.count].donorPatient.lastName.replace(/\s+/g, '');
                                                        var namefilereciver = vm.datazip[vm.count].receiverPatient.patientId.replace(/\s+/g, '') + '-' + vm.datazip[vm.count].receiverPatient.name1.replace(/\s+/g, '') + vm.datazip[vm.count].receiverPatient.name2.replace(/\s+/g, '') + vm.datazip[vm.count].receiverPatient.surName.replace(/\s+/g, '') + vm.datazip[vm.count].receiverPatient.lastName.replace(/\s+/g, '');
                                                        var databases = {
                                                            "donorPatient": namefiledonor,
                                                            "receiverPatient": namefilereciver,
                                                            "buffersave": byteString
                                                        }
                                                        vm.printsave.push(databases);
                                                        vm.count++;
                                                        vm.savepdfReportblock();
                                                    }
                                                },
                                                function (error) {
                                                    vm.loading = false;
                                                    vm.modalError(error);
                                                }
                                            );
                                        } else {
                                            vm.totaldownload = vm.totaldownload + 1;
                                            vm.porcentdownload = Math.round((vm.totaldownload * 100) / vm.datazip.length);
                                            vm.count++;
                                            vm.dategeneratezip();
                                        }
                                    }

                                }, report, stream, settings);

                            });
                        }, 10);

                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }

        function _base64ToArrayBuffer(base64) {
            var binaryString = window.atob(base64);
            var len = binaryString.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }
        vm.printzip = printzip;
        function printzip() {
            vm.getseach();
            var zip = new JSZip();
            vm.datazip.forEach(function (archivo) {
                var namefiledonor = archivo.donorPatient.patientId.replace(/\s+/g, '') + '-' + archivo.donorPatient.name1.replace(/\s+/g, '') + archivo.donorPatient.name2.replace(/\s+/g, '') + archivo.donorPatient.surName.replace(/\s+/g, '') + archivo.donorPatient.lastName.replace(/\s+/g, '');
                var namefilereciver = archivo.receiverPatient.patientId.replace(/\s+/g, '') + '-' + archivo.receiverPatient.name1.replace(/\s+/g, '') + archivo.receiverPatient.name2.replace(/\s+/g, '') + archivo.receiverPatient.surName.replace(/\s+/g, '') + archivo.receiverPatient.lastName.replace(/\s+/g, '')

                zip.file(namefiledonor + '_' + namefilereciver + ".pdf", archivo.buffer, { binary: true });
            });
            var blob = zip.generate({ type: "blob" });
            var nameZip = 'Anticuerpos_citotóxicos_' + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY') + '.zip';
            saveAs(blob, nameZip);
        }
        vm.printzipsave = printzipsave;
        function printzipsave() {
            vm.getseach();
            logger.success($filter('translate')('0149'));
            var zip = new JSZip();
            vm.printsave.forEach(function (archivo) {
                zip.file(archivo.donorPatient + '_' + archivo.receiverPatient + ".pdf", archivo.buffersave, { binary: true });
            });
            var blob = zip.generate({ type: "blob" });
            var nameZip = 'Anticuerpos_citotóxicos_' + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY') + '.zip';
            saveAs(blob, nameZip);
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
        vm.changeDatePicker = changeDatePicker;
        function changeDatePicker(obj) {
            if (obj === 1) {
                vm.dateI = false;
                if (moment(vm.bodiessearch.dateinit).format('YYYY-MM-DD') > moment(vm.bodiessearch.dateend).format('YYYY-MM-DD')) {
                    vm.bodiessearch.dateend = moment(vm.bodiessearch.dateinit).format();
                } else if (vm.bodiessearch.dateinit === undefined) {
                    vm.bodiessearch.dateinit = null;
                }
            } else {
                vm.dateF = false;
                if (moment(vm.bodiessearch.dateinit).format('YYYY-MM-DD') > moment(vm.bodiessearch.dateend).format('YYYY-MM-DD')) {
                    vm.bodiessearch.dateinit = moment(vm.bodiessearch.dateend).format();
                } else if (vm.bodiessearch.dateend === undefined) {
                    vm.bodiessearch.dateend = null;
                }
            }
            vm.getseach();
        }
        vm.focusdateend = focusdateend;
        function focusdateend() {
            if (vm.bodiessearch.dateend !== null) {
                vm.bodiessearch.dateend = new Date(vm.bodiessearch.dateend);
            } else {
                vm.bodiessearch.dateend = null;
            }
        }
        vm.changue = changue;
        function changue(requerid) {
            if (requerid === 1) {
                vm.requeriddonor = false
            }
            if (requerid === 2) {
                vm.requeridreceiver = false;
            }
            if (vm.new.receiver.selected !== undefined && vm.new.donor.selected !== undefined) {
                var antibodies = {
                    'idDonor': vm.new.donor.selected.id,
                    'id': vm.new.receiver.selected.id
                }
                vm.eventEdit(antibodies);
            }

        }
        vm.eventEdit = eventEdit;
        function eventEdit(antibodies) {
            vm.labelnew = "Editar anticuerpo citotóxico";
            vm.loadingdata = true;
            vm.newAntitoxico = false;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return cytotoxicantibodiesDS.detailcytotoxicantibodies(auth.authToken, antibodies.idDonor, antibodies.id).then(
                function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        vm.editdisabled = true;
                        vm.new = {};
                        data.data.datestudy = data.data.datestudy === undefined ? null : moment(data.data.datestudy).format();
                        data.data.datesamplecollection = data.data.datesamplecollection === undefined ? null : moment(data.data.datesamplecollection).format();
                        var institutionlist = _.filter(_.clone(vm.ListInstitution), function (o) { return o.id === data.data.institution.id; });
                        if (institutionlist.length !== 0) {
                            var institution = {
                                id: institutionlist[0].id,
                                code: institutionlist[0].code,
                                name: institutionlist[0].name,
                            }
                            data.data.institutions = {
                                id: institutionlist[0].id,
                                code: institutionlist[0].code,
                                name: institutionlist[0].name,
                                selected: institution
                            }
                            vm.editreceiver(data.data);
                        }
                    } else {
                        vm.newAntitoxico = true;
                        vm.editdisabled = true;
                        var institution = {
                            id: antibodies.institution.id,
                            code: antibodies.institution.code,
                            name: antibodies.institution.name,
                        }
                        var inData = {
                            'id': antibodies.id,
                            'idDonor': antibodies.idDonor,
                            'datestudy': moment().format(),
                            'institutions': {
                                id: antibodies.institution.id,
                                code: antibodies.institution.code,
                                name: antibodies.institution.name,
                                selected: institution
                            },
                            'datesamplecollection': null,
                            'aloT4': 1,
                            'aloB4': 1,
                            'aloT20': 1,
                            'aloB20': 1,
                            'aloT37': 1,
                            'aloB37': 1,
                            'aloDttT4': 1,
                            'aloDttB4': 1,
                            'aloDttT20': 1,
                            'aloDttB20': 1,
                            'aloDttT37': 1,
                            'aloDttB37': 1
                        }
                        vm.editreceiver(inData);
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
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
        vm.eventPrint = eventPrint;
        function eventPrint(antibodies) {
            vm.requeridanalyst = false;
            vm.requeridapprover = false;
            if (antibodies.datestudy === undefined) {
                logger.info($filter('translate')('3612'));
            } else {
                vm.generateReport = true;
                vm.viewpreliminar = false;
                if (antibodies.receiverPatient.gender === 7) {
                    antibodies.receiverPatient.genderName = $filter('translate')('0363');
                }

                if (antibodies.receiverPatient.gender === 8) {
                    antibodies.receiverPatient.genderName = $filter('translate')('0362');
                }

                if (antibodies.receiverPatient.gender === 9) {
                    antibodies.receiverPatient.genderName = $filter('translate')('0401');
                }

                if (antibodies.receiverPatient.gender === 42) {
                    antibodies.receiverPatient.genderName = $filter('translate')('0402');
                }
                antibodies.nameOrgan = vm.changuenameOrgan(parseInt(antibodies.receiverPatient.organ));
                antibodies.receiverPatient.birthday = moment(antibodies.receiverPatient.birthday).format(vm.formatDate.toUpperCase());
                antibodies.receiverPatient.age = common.getAgeAsString(antibodies.receiverPatient.birthday, vm.formatDate.toUpperCase());
                antibodies.datestudy = antibodies.datestudy === undefined ? 'N/A' : moment(antibodies.datestudy).format(vm.formatDate.toUpperCase());
                antibodies.datesamplecollection = antibodies.datesamplecollection === undefined ? 'N/A' : moment(antibodies.datesamplecollection).format(vm.formatDate.toUpperCase());
                vm.loadingdata = true;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                return cytotoxicantibodiesDS.detailcytotoxicantibodies(auth.authToken, antibodies.idDonor, antibodies.id).then(
                    function (data) {
                        vm.loadingdata = false;
                        if (data.status === 200) {
                            vm.dataprint = antibodies;
                            vm.dataprint.aloT4 = data.data.aloT4;
                            vm.dataprint.aloB4 = data.data.aloB4;
                            vm.dataprint.aloT20 = data.data.aloT20;
                            vm.dataprint.aloB20 = data.data.aloB20;
                            vm.dataprint.aloT37 = data.data.aloT37;
                            vm.dataprint.aloB37 = data.data.aloB37;
                            vm.dataprint.aloDttT4 = data.data.aloDttT4;
                            vm.dataprint.aloDttB4 = data.data.aloDttB4;
                            vm.dataprint.aloDttT20 = data.data.aloDttT20;
                            vm.dataprint.aloDttB20 = data.data.aloDttB20;
                            vm.dataprint.aloDttT37 = data.data.aloDttT37;
                            vm.dataprint.aloDttB37 = data.data.aloDttB37;
                            vm.dataprint.deliveryresults = new Date();
                            vm.dataprint.approver = {};
                            UIkit.modal('#modal_print_cytotoxicantibodies').show();
                        }
                    },
                    function (error) {
                        vm.loadingdata = false;
                        vm.modalError(error);
                    }
                );
            }
        }
        vm.changuerequerid = changuerequerid;
        function changuerequerid() {
            $scope.$apply(function () {
                vm.requeridapprover = false;
            });
        }
        vm.editreceiver = editreceiver;
        function editreceiver(receiverdata) {
            vm.Listreceiverpopup = [];
            if (receiverdata.institutions.selected.id !== undefined) {
                vm.loading = true
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                return cytotoxicantibodiesDS.getlistreceiverpatient(auth.authToken, receiverdata.institutions.selected.id).then(
                    function (data) {
                        vm.loading = false;
                        if (data.status === 200) {
                            data.data.forEach(function (value) {
                                value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName
                            });
                            vm.Listreceiverpopup = data.data;
                            var receiverlist = _.filter(_.clone(vm.Listreceiverpopup), function (o) { return o.id === receiverdata.id; });
                            if (receiverlist.length !== 0) {
                                var receiver = {
                                    id: receiverlist[0].id,
                                    patientId: receiverlist[0].patientId,
                                    name: receiverlist[0].name,
                                }
                                receiverdata.receiver = {
                                    id: receiverlist[0].id,
                                    patientId: receiverlist[0].patientId,
                                    name: receiverlist[0].name,
                                    selected: receiver
                                }
                            }

                            var donorlist = _.filter(_.clone(vm.ListDonor), function (o) { return o.idDonor === receiverdata.idDonor; });
                            if (donorlist.length !== 0) {
                                var donor = {
                                    id: receiverdata.idDonor,
                                    patientId: donorlist[0].patientId,
                                    name: donorlist[0].name,
                                }
                                receiverdata.donor = {
                                    id: receiverdata.idDonor,
                                    patientId: donorlist[0].patientId,
                                    name: donorlist[0].name,
                                    selected: donor
                                }
                            }
                            vm.new = receiverdata;
                            UIkit.modal('#modal_new_cytotoxicantibodies').show();
                        }
                    },
                    function (error) {
                        vm.loadingdata = false;
                        vm.modalError(error);
                    }
                );
            }
        }
        vm.savepdfReport = savepdfReport;
        function savepdfReport() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return reportransDS.getsavetypereport(auth.authToken, 8).then(
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
            vm.validatedsavereport = validate;
            if (vm.dataprint.approver.selected === undefined || vm.dataprint.deliveryresults === null) {
                vm.requeridapprover = vm.dataprint.approver.selected === undefined ? true : false;
                vm.requeriddeliveryresults = vm.dataprint.deliveryresults === null ? true : false;
            } else {
                vm.viewpreliminar = true;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                var parameterReport = {};
                parameterReport.variables = {
                    'date': moment().format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
                    'dateEntryResult': moment(vm.dataprint.deliveryresults).format(vm.formatDate.toUpperCase()),
                    'abbreviation': localStorageService.get("Abreviatura"),
                    'entity': localStorageService.get("Entidad"),
                    'username': auth.userName,
                    'analyst': vm.analyst.name,
                    'labelAnalisty': vm.analyst.rolelabel,
                    'regiterAnalyst': vm.analyst.identification,
                    'numbeReport': vm.validatedsavereport === 2 ? vm.idReport : 'Reporte preliminar',
                    'analystsignature': 'data:image/jpeg;base64,' + vm.analyst.signature,
                    'approver': vm.dataprint.approver.selected.name,
                    'regiterApprover': vm.dataprint.approver.selected.identification,
                    'approversignature': 'data:image/jpeg;base64,' + vm.dataprint.approver.selected.signature
                };

                parameterReport.pathreport = '/Reportransplants/participants/cytotoxicantibodies/cytotoxicantibodies.mrt';
                parameterReport.labelsreport = $translate.getTranslationTable();
                vm.dataorder = [vm.dataprint];
                vm.setReport(parameterReport, vm.dataorder);
            }
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
                    settings.ownerPassword = "tu_contraseña";
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
            var data = {
                "idReport": vm.idReport,
                "nameReceptor": vm.dataprint.receiverPatient.name1 + ' ' + vm.dataprint.receiverPatient.name2 + ' ' + vm.dataprint.receiverPatient.surName + ' ' + vm.dataprint.receiverPatient.lastName,
                "identificationReceptor": vm.dataprint.receiverPatient.patientId,
                "institution": vm.dataprint.institution.name,
                "deliverDate": new Date(moment(vm.dataprint.deliveryresults).format()).getTime(),
                "receptionDate": new Date(moment(vm.dataprint.datestudy).format()).getTime(),
                "generationDate": new Date(moment().format()).getTime(),
                "reportType": 8,
                "file": base64,
                "extension": ".pdf",
                "approveruser": vm.dataprint.approver.selected.name,
                "analystuser": vm.analyst.name,
                "identificationDonor": vm.dataprint.donorPatient.patientId,
                "nameDonor": vm.dataprint.donorPatient.name1 + ' ' + vm.dataprint.donorPatient.name2 + ' ' + vm.dataprint.donorPatient.surName + ' ' + vm.dataprint.donorPatient.lastName,
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
        vm.eventUndo = eventUndo;
        function eventUndo() {
            vm.viewpreliminar = false;
            vm.requeridanalyst = false;
            vm.requeridapprover = false;
            vm.requeriddeliveryresults = false;
        }
        vm.getseach = getseach;
        function getseach() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var bodiessearch = {
                'dateinit': moment(vm.bodiessearch.dateinit).format('YYYYMMDD'),
                'dateend': moment(vm.bodiessearch.dateend).format('YYYYMMDD'),
                'idDonor': vm.bodiessearch.donor === null ? null : vm.bodiessearch.donor.selected.id,
                'idReceiver': vm.bodiessearch.receiver === null ? null : vm.bodiessearch.receiver.selected.id
            }
            vm.listcytotoxicantibodies = [];
            return cytotoxicantibodiesDS
                .filtercytotoxicantibodies(auth.authToken, bodiessearch)
                .then(
                    function (data) {
                        vm.loadingdata = false;
                        if (data.data.length !== 0) {
                            vm.listcytotoxicantibodies = data.data;
                        } else {
                            logger.info($filter('translate')('3379'));
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                        vm.loadingdata = false;
                    }
                );
        }
        vm.init = init;
        function init() {
            vm.loadingdata = true;
            vm.labelnew = $filter('translate')('3507');
            vm.prepotition = $filter('translate')('0000') === 'esCo' ? 'de' : 'of';
            vm.bodiessearch = {
                'dateinit': new Date(),
                'dateend': new Date(),
                'donor': null,
                'receiver': null
            }
            vm.generateReport = false;
            vm.viewpreliminar = false;
            vm.formatDate = localStorageService.get('FormatoFecha');
            vm.score = [
                { id: 1, name: 1 },
                { id: 2, name: 2 },
                { id: 4, name: 4 },
                { id: 6, name: 6 },
                { id: 8, name: 8 },
            ]
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
            vm.Listreceiverpopup = [];
            vm.getListDonor();
            vm.getUser();
        }
        vm.getUser = getUser;
        function getUser() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListUser = [];
            return recepctionDS.getUserTransplant(auth.authToken).then(
                function (data) {
                    vm.getUseranalyst();
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
        vm.getListDonor = getListDonor;
        function getListDonor() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListDonor = [];
            return cytotoxicantibodiesDS.getlistDonor(auth.authToken).then(
                function (data) {
                    vm.getListDonorpopup();
                    if (data.status === 200) {
                        data.data.forEach(function (value, key) {
                            value.id = value.idDonor;
                            value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName
                        });
                        vm.ListDonor = data.data;
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.getListDonorpopup = getListDonorpopup;
        function getListDonorpopup() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListDonorPopup = [];
            return cytotoxicantibodiesDS.getlistDonor(auth.authToken).then(
                function (data) {
                    vm.getListreceiver();
                    if (data.status === 200) {
                        data.data.forEach(function (value, key) {
                            value.id = value.idDonor;
                            value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName
                        });
                        var Donorpopup = {
                            'id': null,
                            'patientId': $filter('translate')('0153'),
                            'name': $filter('translate')('3613')
                        }
                        data.data.push(Donorpopup);
                        vm.ListDonorPopup = data.data;
                        vm.bodiessearch.donor = {
                            'id': null,
                            'patientId': $filter('translate')('0153'),
                            'name': $filter('translate')('3613'),
                            'selected': {
                                'id': null,
                                'patientId': $filter('translate')('0153'),
                                'name': $filter('translate')('3613')
                            }
                        }
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.focusdateInit = focusdateInit;
        function focusdateInit() {
            if (vm.bodiessearch.dateinit !== null) {
                vm.bodiessearch.dateinit = new Date(vm.bodiessearch.dateinit);
            } else {
                vm.bodiessearch.dateinit = null;
            }
        }
        vm.getListreceiver = getListreceiver;
        function getListreceiver() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Listreceiver = [];
            return cytotoxicantibodiesDS.getlistreceiverpatient(auth.authToken, 0).then(
                function (data) {
                    vm.getInstitution();
                    if (data.status === 200) {
                        data.data.forEach(function (value, key) {
                            value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName
                        });
                        var Listreceiver = {
                            'id': null,
                            'patientId': $filter('translate')('0153'),
                            'name': $filter('translate')('3614')
                        }
                        data.data.push(Listreceiver);
                        vm.Listreceiver = data.data;
                        vm.bodiessearch.receiver = {
                            'id': null,
                            'patientId': $filter('translate')('0153'),
                            'name': $filter('translate')('3614'),
                            'selected': {
                                'id': null,
                                'patientId': $filter('translate')('0153'),
                                'name': $filter('translate')('3614')
                            }
                        }
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.getInstitution = getInstitution;
        function getInstitution() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListInstitution = [];
            return recepctionDS.getinstitution(auth.authToken).then(
                function (data) {
                    vm.getseach();
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
        vm.eventNew = eventNew;
        function eventNew() {
            vm.labelnew = $filter('translate')('3507');
            vm.Listreceiverpopup = [];
            vm.editdisabled = false;
            vm.new = {
                'datestudy': new Date(),
                'donor': {},
                'institutions': {},
                'receiver': {},
                'datesamplecollection': null,
                'aloT4': 1,
                'aloB4': 1,
                'aloT20': 1,
                'aloB20': 1,
                'aloT37': 1,
                'aloB37': 1,
                'aloDttT4': 1,
                'aloDttB4': 1,
                'aloDttT20': 1,
                'aloDttB20': 1,
                'aloDttT37': 1,
                'aloDttB37': 1
            }
            vm.requeriddonor = false;
            vm.requeridinstistution = false;
            vm.requeridreceiver = false;

            UIkit.modal('#modal_new_cytotoxicantibodies').show();
        }

        vm.newcitotoxican = newcitotoxican;
        function newcitotoxican() {
            vm.labelnew = $filter('translate')('3507');
            vm.Listreceiverpopup = [];
            vm.editdisabled = false;
            vm.new.datestudy = new Date();
            vm.new.institution = {};
            vm.new.institutions = {};
            vm.new.receiver = {};
            vm.new.receiverPatient = {};
            vm.new.datesamplecollection = null;
            vm.new.aloT4 = 1;
            vm.new.aloB4 = 1;
            vm.new.aloT20 = 1;
            vm.new.aloB20 = 1;
            vm.new.aloT37 = 1;
            vm.new.aloB37 = 1;
            vm.new.aloDttT4 = 1;
            vm.new.aloDttB4 = 1;
            vm.new.aloDttT20 = 1;
            vm.new.aloDttB20 = 1;
            vm.new.aloDttT37 = 1;
            vm.new.aloDttB37 = 1;        
        vm.requeriddonor = false;
        vm.requeridinstistution = false;
        vm.requeridreceiver = false;
    }

    vm.recepcionChange = recepcionChange;
    function recepcionChange() {
        vm.Listreceiverpopup = [];
        vm.requeridinstistution = false;
        vm.new.receiver = {};
        if (vm.new.institutions.selected.id !== undefined) {
            vm.loading = true
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return cytotoxicantibodiesDS.getlistreceiverpatient(auth.authToken, vm.new.institutions.selected.id).then(
                function (data) {
                    vm.loading = false;
                    if (data.status === 200) {
                        data.data.forEach(function (value) {
                            value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName
                        });
                        vm.Listreceiverpopup = data.data;
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
    }

    vm.savecytotoxicantibodies = savecytotoxicantibodies;
    function savecytotoxicantibodies() {
        if (vm.new.institutions.selected !== undefined && vm.new.receiver.selected !== undefined && vm.new.donor.selected !== undefined) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.new.idDonor = vm.new.donor.selected.id;
            vm.new.id = vm.new.receiver.selected.id;
            vm.new.institution = vm.new.institutions.selected;
            vm.new.datesamplecollection = vm.new.datesamplecollection === null ? null : new Date(moment(vm.new.datesamplecollection).format()).getTime();
            vm.new.datestudy = vm.new.datestudy === null ? null : new Date(moment(vm.new.datestudy).format()).getTime();
            if (vm.editdisabled && !vm.newAntitoxico) {
                return cytotoxicantibodiesDS.updatecytotoxicantibodies(auth.authToken, vm.new).then(
                    function (data) {
                        //   vm.getseach();
                        logger.success($filter('translate')('0149'));
                        //  UIkit.modal('#modal_new_cytotoxicantibodies').hide();
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
            } else {
                return cytotoxicantibodiesDS.newytotoxicantibodies(auth.authToken, vm.new).then(
                    function (data) {
                        // vm.getseach();
                        logger.success($filter('translate')('0149'));
                        //  UIkit.modal('#modal_new_cytotoxicantibodies').hide();
                    },
                    function (error) {
                        vm.modalError(error);
                    }
                );
            }
        } else {
            vm.requeriddonor = vm.new.donor.selected !== undefined ? false : true;
            vm.requeridinstistution = vm.new.institutions.selected !== undefined ? false : true;
            vm.requeridreceiver = vm.new.receiver.selected !== undefined ? false : true;
        }
    }
    vm.isAuthenticate();
}
}) ();
/* jshint ignore:end */
