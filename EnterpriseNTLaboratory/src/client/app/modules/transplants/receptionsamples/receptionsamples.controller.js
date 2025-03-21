/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.receptionsamples')
        .controller('receptionsamplesController', receptionsamplesController);
    receptionsamplesController.$inject = ['LZString', 'localStorageService', 'logger', 'patientDS',
        '$filter', '$state', 'moment', '$rootScope', 'common', '$translate', 'documenttypesDS', 'recepctionDS', 'orderentryDS', '$scope', 'reportsDS'];
    function receptionsamplesController(LZString, localStorageService, logger, patientDS,
        $filter, $state, moment, $rootScope, common, $translate, documenttypesDS, recepctionDS, orderentryDS, $scope, reportsDS) {
        var vm = this;
        vm.title = 'receptionsamples';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.NamePage = $filter('translate')('3316');
        vm.selected = -1;
        vm.generateFile = generateFile;
        vm.isOpenReport = true;
        vm.button = false;
        vm.windowOpenReport = windowOpenReport;
        $rootScope.pageview = 3;
        vm.init = init;
        vm.viewadjunto = false;
        vm.staticDemoIds = {
            'patientDB': -99,
            'patientComment': -997,
            'documentType': -10,
            'patientId': -100,
            'lastName': -101,
            'surName': -102,
            'name1': -103,
            'name2': -109,
            'sex': -104,
            'birthday': -105,
            'age': -110,
            'email': -106,
            'weight': -8,
            'size': -9,
            'race': -7, //demografico
            'orderDB': -998,
            'orderComment': -996,
            'order': -107,
            'orderDate': -108,
            'orderType': -4, //demografico
            'rate': -3, //demografico
            'branch': -5, //demografico
            'service': -6, //demografico
            'account': -1, //demografico
            'physician': -2, //demografico
            'phone': -111,
            'address': -112,
            'createUser': -113
        };


        vm.exts = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
        vm.extsToPrint = vm.exts.toString().replace(new RegExp('\\.', 'g'), ' -');

        $scope.$watch('vm.selectedIndex', function (newIndex) {
            if (newIndex === 0) {
                setTimeout(function () {
                    document.getElementById('bloodgroup').focus();
                }, 100);
            }
            if (newIndex === 5) {
                setTimeout(function () {
                    document.getElementById('mtNegativeAlloreactionIgG').focus();
                }, 100);
            }
        });
        $scope.$watch('vm.attachmentsHLAInput', function () {
            if (vm.attachmentsHLAInput !== undefined) {
                vm.loading = true;
                if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(vm.attachmentsHLAInput[0].filename)) {
                    vm.validFile = false;
                    logger.warning($filter('translate')('0587') + ' ' + $filter('translate')('3378') + vm.extsToPrint);
                    vm.loading = false;
                } else {
                    var elemento = document.getElementById("attachmentsHLA");
                    elemento.type = '';
                    elemento.src = '';
                    vm.saveattachmentsHLAInput = vm.attachmentsHLAInput[0];
                    var filename = vm.saveattachmentsHLAInput.filename;
                    vm.saveattachmentsHLAInput.file = vm.attachmentsHLAInput[0].base64;
                    vm.saveattachmentsHLAInput.name = filename;
                    vm.saveattachmentsHLAInput.extension = vm.attachmentsHLAInput[0].filename.split(".")[1];
                    vm.saveattachmentsHLAInput.replace = false;
                    vm.saveattachmentsHLAInput.delete = false;
                    if (filename.indexOf(".docx") === -1 && filename.indexOf(".doc") === -1) {
                        vm.viewattachmentsHLAInput = false;
                        vm.viewattachmentsHLAInput = true;
                        var elemento = document.getElementById("attachmentsHLA");
                        elemento.src = 'data:' + vm.saveattachmentsHLAInput.filetype + ';base64,' + vm.saveattachmentsHLAInput.base64;
                        elemento.type = vm.saveattachmentsHLAInput.filetype;
                        vm.loading = false;
                    } else {
                        var elemento = document.getElementById("attachmentsHLA");
                        elemento.type = 'application/pdf';
                        elemento.src = '';
                        vm.viewattachmentsHLAInput = false;
                        vm.viewattachmentsHLAInput = true;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var data = {
                            "file": vm.attachmentsHLAInput[0].base64
                        }
                        return recepctionDS.convertdocumentspdf(auth.authToken, data).then(
                            function (data) {
                                vm.loading = false;
                                if (data.status === 200) {
                                    vm.saveattachmentsHLAInput.file = data.data.file;
                                    vm.saveattachmentsHLAInput.fileType = 'application/pdf';
                                    vm.saveattachmentsHLAInput.name = vm.attachmentsHLAInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsHLAInput.filename = vm.attachmentsHLAInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsHLAInput.extension = 'pdf';
                                    vm.saveattachmentsHLAInput.base64 = data.data.file;
                                    var elemento = document.getElementById("attachmentsHLA");
                                    elemento.src = 'data:' + vm.saveattachmentsHLAInput.fileType + ';base64,' + vm.saveattachmentsHLAInput.base64;
                                    elemento.type = vm.saveattachmentsHLAInput.fileType
                                }
                            },
                            function (error) {
                                vm.loading = false;
                                vm.modalError(error);
                            }
                        );
                    }
                }
            }
        });
        $scope.$watch('vm.attachmentsPRAInput', function () {
            if (vm.attachmentsPRAInput !== undefined) {
                vm.loading = true;
                if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(vm.attachmentsPRAInput[0].filename)) {
                    vm.validFile = false;
                    vm.loading = false;
                    logger.warning($filter('translate')('0587') + ' ' + $filter('translate')('3378') + vm.extsToPrint);
                } else {
                    vm.saveattachmentsPRAInput = vm.attachmentsPRAInput[0];
                    vm.saveattachmentsPRAInput.file = vm.attachmentsPRAInput[0].base64;
                    var filename = vm.saveattachmentsPRAInput.filename;
                    vm.saveattachmentsPRAInput.name = filename;
                    vm.saveattachmentsPRAInput.extension = vm.attachmentsPRAInput[0].filename.split(".")[1];
                    vm.saveattachmentsPRAInput.replace = false;
                    vm.saveattachmentsPRAInput.delete = false;
                    if (filename.indexOf(".docx") === -1 && filename.indexOf(".doc") === -1) {
                        vm.viewattachmentsPRAInput = false;
                        vm.viewattachmentsPRAInput = true;
                        vm.loading = false;
                        var elemento = document.getElementById("attachmentsPRA");
                        elemento.src = 'data:' + vm.saveattachmentsPRAInput.filetype + ';base64,' + vm.saveattachmentsPRAInput.base64;
                        elemento.type = vm.saveattachmentsPRAInput.filetype;
                    } else {
                        var elemento = document.getElementById("attachmentsPRA");
                        elemento.type = 'application/pdf';
                        elemento.src = '';
                        vm.viewattachmentsPRAInput = false;
                        vm.viewattachmentsPRAInput = true;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var data = {
                            "file": vm.attachmentsPRAInput[0].base64
                        }
                        return recepctionDS.convertdocumentspdf(auth.authToken, data).then(
                            function (data) {
                                vm.loading = false;
                                if (data.status === 200) {
                                    vm.saveattachmentsPRAInput.fileType = 'application/pdf';
                                    vm.saveattachmentsPRAInput.extension = 'pdf';
                                    vm.saveattachmentsPRAInput.name = vm.attachmentsPRAInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsPRAInput.filename = vm.attachmentsPRAInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsPRAInput.file = data.data.file;
                                    vm.saveattachmentsPRAInput.base64 = data.data.file;
                                    var elemento = document.getElementById("attachmentsPRA");
                                    elemento.src = 'data:' + vm.saveattachmentsPRAInput.fileType + ';base64,' + vm.saveattachmentsPRAInput.base64;
                                    elemento.type = vm.saveattachmentsPRAInput.fileType;
                                }
                            },
                            function (error) {
                                vm.loading = false;
                                vm.modalError(error);
                            }
                        );
                    }
                }
            }
        });
        $scope.$watch('vm.attachmentsCUANInput', function () {
            if (vm.attachmentsCUANInput !== undefined) {
                vm.loading = true;
                if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(vm.attachmentsCUANInput[0].filename)) {
                    vm.validFile = false;
                    logger.warning($filter('translate')('0587') + ' ' + $filter('translate')('3378') + vm.extsToPrint);
                    vm.loading = false;
                } else {
                    vm.saveattachmentsCUANInput = vm.attachmentsCUANInput[0];
                    var filename = vm.saveattachmentsCUANInput.filename;
                    vm.saveattachmentsCUANInput.name = filename;
                    vm.saveattachmentsCUANInput.file = vm.attachmentsCUANInput[0].base64;
                    vm.saveattachmentsCUANInput.extension = vm.attachmentsCUANInput[0].filename.split(".")[1];
                    vm.saveattachmentsCUANInput.replace = false;
                    vm.saveattachmentsCUANInput.delete = false;
                    if (filename.indexOf(".docx") === -1 && filename.indexOf(".doc") === -1) {
                        vm.loading = false;
                        vm.viewattachmentsCUANInput = false;
                        vm.viewattachmentsCUANInput = true;
                        var elemento = document.getElementById("attachmentsCUAN");
                        elemento.src = 'data:' + vm.saveattachmentsCUANInput.filetype + ';base64,' + vm.saveattachmentsCUANInput.base64;
                        elemento.type = vm.saveattachmentsCUANInput.filetype;
                    } else {
                        var elemento = document.getElementById("attachmentsCUAN");
                        elemento.type = 'application/pdf';
                        elemento.src = '';
                        vm.viewattachmentsCUANInput = false;
                        vm.viewattachmentsCUANInput = true;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var data = {
                            "file": vm.attachmentsCUANInput[0].base64
                        }
                        return recepctionDS.convertdocumentspdf(auth.authToken, data).then(
                            function (data) {
                                vm.loading = false;
                                if (data.status === 200) {
                                    vm.saveattachmentsCUANInput.file = data.data.file;
                                    vm.saveattachmentsCUANInput.fileType = 'application/pdf';
                                    vm.saveattachmentsCUANInput.extension = 'pdf';
                                    vm.saveattachmentsCUANInput.name = vm.attachmentsCUANInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsCUANInput.filename = vm.attachmentsCUANInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsCUANInput.base64 = data.data.file;
                                    var elemento = document.getElementById("attachmentsCUAN");
                                    elemento.src = 'data:' + vm.saveattachmentsCUANInput.fileType + ';base64,' + vm.saveattachmentsCUANInput.base64;
                                    elemento.type = vm.saveattachmentsCUANInput.fileType;
                                }
                            },
                            function (error) {
                                vm.loading = false;
                                vm.modalError(error);
                            }
                        );
                    }
                }
            }
        });
        $scope.$watch('vm.attachmentsANInput', function () {
            if (vm.attachmentsANInput !== undefined) {
                vm.loading = true;
                if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(vm.attachmentsANInput[0].filename)) {
                    vm.validFile = false;
                    logger.warning($filter('translate')('0587') + ' ' + $filter('translate')('3378') + vm.extsToPrint);
                    vm.loading = false;
                } else {
                    vm.saveattachmentsANInput = vm.attachmentsANInput[0];
                    var filename = vm.saveattachmentsANInput.filename;
                    vm.saveattachmentsANInput.file = vm.attachmentsANInput[0].base64;
                    vm.saveattachmentsANInput.name = filename;
                    vm.saveattachmentsANInput.extension = vm.attachmentsANInput[0].filename.split(".")[1];
                    vm.saveattachmentsANInput.replace = false;
                    vm.saveattachmentsANInput.delete = false;
                    if (filename.indexOf(".docx") === -1 && filename.indexOf(".doc") === -1) {
                        vm.viewattachmentsANInput = false;
                        vm.viewattachmentsANInput = true;
                        var elemento = document.getElementById("attachmentsAN");
                        elemento.src = 'data:' + vm.saveattachmentsANInput.filetype + ';base64,' + vm.saveattachmentsANInput.base64;
                        elemento.type = vm.saveattachmentsANInput.filetype;
                        vm.loading = false;
                    } else {
                        var elemento = document.getElementById("attachmentsAN");
                        elemento.type = 'application/pdf';
                        elemento.src = '';
                        vm.viewattachmentsANInput = false;
                        vm.viewattachmentsANInput = true;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var data = {
                            "file": vm.attachmentsANInput[0].base64
                        }
                        return recepctionDS.convertdocumentspdf(auth.authToken, data).then(
                            function (data) {
                                vm.loading = false;
                                if (data.status === 200) {
                                    vm.saveattachmentsANInput.file = data.data.file;
                                    vm.saveattachmentsANInput.fileType = 'application/pdf';
                                    vm.saveattachmentsANInput.extension = 'pdf';
                                    vm.saveattachmentsANInput.name = vm.attachmentsANInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsANInput.filename = vm.attachmentsANInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsANInput.base64 = data.data.file;
                                    var elemento = document.getElementById("attachmentsAN");
                                    elemento.src = 'data:' + vm.saveattachmentsANInput.fileType + ';base64,' + vm.saveattachmentsANInput.base64;
                                    elemento.type = vm.saveattachmentsANInput.fileType;
                                }
                            },
                            function (error) {
                                vm.loading = false;
                                vm.modalError(error);
                            }
                        );
                    }
                }
            }
        });
        $scope.$watch('vm.attachmentsCIMEInput', function () {
            if (vm.attachmentsCIMEInput !== undefined) {
                vm.loading = true;
                if (!(new RegExp('(' + vm.exts.join('|').replace(/\./g, '\\.') + ')$')).test(vm.attachmentsCIMEInput[0].filename)) {
                    vm.validFile = false;
                    logger.warning($filter('translate')('0587') + ' ' + $filter('translate')('3378') + vm.extsToPrint);
                    vm.loading = false;
                } else {
                    vm.saveattachmentsCIMEInput = vm.attachmentsCIMEInput[0];
                    var filename = vm.saveattachmentsCIMEInput.filename;
                    vm.saveattachmentsCIMEInput.name = filename;
                    vm.saveattachmentsCIMEInput.file = vm.attachmentsCIMEInput[0].base64;
                    vm.saveattachmentsCIMEInput.extension = vm.attachmentsCIMEInput[0].filename.split(".")[1];
                    vm.saveattachmentsCIMEInput.replace = false;
                    vm.saveattachmentsCIMEInput.delete = false;
                    if (filename.indexOf(".docx") === -1 && filename.indexOf(".doc") === -1) {
                        vm.viewattachmentsCIMEInput = false;
                        vm.viewattachmentsCIMEInput = true;
                        var elemento = document.getElementById("attachmentsCIME");
                        elemento.src = 'data:' + vm.saveattachmentsCIMEInput.filetype + ';base64,' + vm.saveattachmentsCIMEInput.base64;
                        elemento.type = vm.saveattachmentsCIMEInput.filetype;
                        vm.loading = false;
                    } else {
                        var elemento = document.getElementById("attachmentsCIME");
                        elemento.type = 'application/pdf';
                        elemento.src = '';
                        vm.viewattachmentsCIMEInput = false;
                        vm.viewattachmentsCIMEInput = true;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        var data = {
                            "file": vm.attachmentsCIMEInput[0].base64
                        }
                        return recepctionDS.convertdocumentspdf(auth.authToken, data).then(
                            function (data) {
                                vm.loading = false;
                                if (data.status === 200) {
                                    vm.saveattachmentsCIMEInput.file = data.data.file;
                                    vm.saveattachmentsCIMEInput.fileType = 'application/pdf';
                                    vm.saveattachmentsCIMEInput.extension = 'pdf';
                                    vm.saveattachmentsCIMEInput.name = vm.attachmentsCIMEInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsCIMEInput.filename = vm.attachmentsCIMEInput[0].filename.split(".")[0] + '.pdf';
                                    vm.saveattachmentsCIMEInput.base64 = data.data.file;
                                    var elemento = document.getElementById("attachmentsCIME");
                                    elemento.src = 'data:' + vm.saveattachmentsCIMEInput.fileType + ';base64,' + vm.saveattachmentsCIMEInput.base64;
                                    elemento.type = vm.saveattachmentsCIMEInput.fileType;
                                }
                            },
                            function (error) {
                                vm.loading = false;
                                vm.modalError(error);
                            }
                        );
                    }
                }
            }
        });

        vm.initzip = initzip;
        function initzip() {
            UIkit.modal('#modalprogressprint', { bgclose: false, escclose: false, modal: false }).show();
            vm.indexorgan = 0;
            vm.listreport = [];
            vm.zip = new JSZip();
            vm.exportdatareception();
        }
        vm.exportdatareception = exportdatareception;
        function exportdatareception() {
            vm.porcent = Math.round((vm.indexorgan * 100) / vm.organ.length);
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.getparticipantAll(auth.authToken, vm.organ[vm.indexorgan].id).then(
                function (data) {
                    if (data.status === 200) {
                        if (data.data.length > 0) {
                            data.data.forEach(function (item) {
                                if (item.donorReceiverBasic.gender === 7) {
                                    item.donorReceiverBasic.genderName = $filter('translate')('0363');
                                }
                                else if (item.donorReceiverBasic.gender === 8) {
                                    item.donorReceiverBasic.genderName = $filter('translate')('0362');
                                }
                                else if (item.donorReceiverBasic.gender === 9) {
                                    item.donorReceiverBasic.genderName = $filter('translate')('0401');
                                }
                                else if (item.donorReceiverBasic.gender === 42) {
                                    item.donorReceiverBasic.genderName = $filter('translate')('0402');
                                }

                                item.donorReceiverBasic.age = common.getAgeAsString(moment(item.donorReceiverBasic.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                                item.donorReceiverBasic.birthday = item.donorReceiverBasic.birthday === undefined ? null : moment(item.donorReceiverBasic.birthday).format();

                                item.receiverTransplant.dateTransplant = item.receiverTransplant.dateTransplant === undefined ? null : moment(item.receiverTransplant.dateTransplant).format();
                                
                                item.receiverTestEntry.dialysisstartdate = item.receiverTestEntry.dialysisstartdate === undefined ? null : moment(item.receiverTestEntry.dialysisstartdate).format();
                                item.receiverTestEntry.transfusiondate = item.receiverTestEntry.transfusiondate === undefined ? null : moment(item.receiverTestEntry.transfusiondate).format();
                                item.receiverTestEntry.previoustransplantdate = item.receiverTestEntry.previoustransplantdate === undefined ? null : moment(item.receiverTestEntry.previoustransplantdate).format();
                                item.receiverTestEntry.dateinclusionwaitinglist = item.receiverTestEntry.dateinclusionwaitinglist === undefined ? null : moment(item.receiverTestEntry.dateinclusionwaitinglist).format();
                                item.receiverHLAMolecular.datesamplecollection = item.receiverHLAMolecular.datesamplecollection === undefined ? null : moment(item.receiverHLAMolecular.datesamplecollection).format();
                                item.receiverHLAMolecular.trialdate = item.receiverHLAMolecular.trialdate === undefined ? null : moment(item.receiverHLAMolecular.trialdate).format();
                                item.receiverPRALuminexCualitativo.datesamplecollection = item.receiverPRALuminexCualitativo.datesamplecollection === undefined ? null : moment(item.receiverPRALuminexCualitativo.datesamplecollection).format();
                                item.receiverPRALuminexCualitativo.trialdate = item.receiverPRALuminexCualitativo.trialdate === undefined ? null : moment(item.receiverPRALuminexCualitativo.trialdate).format();
                                item.receiverPRALuminexCuantitativo.datesamplecollection = item.receiverPRALuminexCuantitativo.datesamplecollection === undefined ? null : moment(item.receiverPRALuminexCuantitativo.datesamplecollection).format();
                                item.receiverPRALuminexCuantitativo.trialdate = item.receiverPRALuminexCuantitativo.trialdate === undefined ? null : moment(item.receiverPRALuminexCuantitativo.trialdate).format();
                                if (item.receiverPRALuminexAntigeno != undefined) {
                                    item.receiverPRALuminexAntigeno.datesamplecollection = item.receiverPRALuminexAntigeno.datesamplecollection === undefined ? null : moment(item.receiverPRALuminexAntigeno.datesamplecollection).format();
                                    item.receiverPRALuminexAntigeno.trialdate = item.receiverPRALuminexAntigeno.trialdate === undefined ? null : moment(item.receiverPRALuminexAntigeno.trialdate).format();
                                    item.receiverPRALuminexAntigeno.classIObservation = item.receiverPRALuminexAntigeno.classIObservation.replace(/\n/g, " ");
                                    item.receiverPRALuminexAntigeno.classIIObservation = item.receiverPRALuminexAntigeno.classIObservation.replace(/\n/g, " ");
                                }
                                item.receiverFlowCytometry.datesamplecollection = item.receiverFlowCytometry.datesamplecollection === undefined ? null : moment(item.receiverFlowCytometry.datesamplecollection).format();
                                item.receiverFlowCytometry.trialdate = item.receiverFlowCytometry.trialdate === undefined ? null : moment(item.receiverFlowCytometry.trialdate).format();

                                item.receiverHLAMolecular.observation = item.receiverHLAMolecular.observation.replace(/\n/g, " ");
                                item.receiverPRALuminexCualitativo.classIObservation = item.receiverPRALuminexCualitativo.classIObservation.replace(/\n/g, " ");

                                item.receiverPRALuminexCuantitativo.classIObservation = item.receiverPRALuminexCuantitativo.classIObservation.replace(/\n/g, " ");
                                item.receiverPRALuminexCuantitativo.classIIObservation = item.receiverPRALuminexCuantitativo.classIIObservation.replace(/\n/g, " ");
                            });
                            generalexcel(data.data)
                        }
                        else {

                            if (vm.indexorgan < vm.organ.length - 1) {
                                vm.indexorgan = vm.indexorgan + 1;
                                vm.exportdatareception();
                            }
                            else {
                                UIkit.modal('#modalprogressprint', { bgclose: false, keyboard: false }).hide();
                                var blob = vm.zip.generate({ type: "blob" });
                                var nameZip = 'Receptores_' + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY') + '.zip';
                                saveAs(blob, nameZip);

                            }
                        }


                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        function generalexcel(data) {
            var report = {
                "type": "csv",
                "data": data,
                "template": "transplant/receiver"
            }

            reportsDS.generarpdf(report).then(function (response) {
                if (response.status === 200) {

                    var buffer = _base64ToArrayBuffer(response.data);
                    var byteArray = new Uint8Array(buffer);
                    // Decodificar los bytes en una cadena UTF-8
                    var decoder = new TextDecoder('utf-8');
                    var utf8String = decoder.decode(byteArray);

                    // Volver a codificar la cadena en UTF-8
                    var encoder = new TextEncoder();
                    var utf8Bytes = encoder.encode(utf8String);


                    var byteString = '';
                    for (var i = 0; i < utf8Bytes.byteLength; i++) {
                        byteString += String.fromCharCode(utf8Bytes[i]);
                    }

                    vm.zip.file(vm.organ[vm.indexorgan].name + ".csv", byteString, { binary: true });


                    if (vm.indexorgan < vm.organ.length - 1) {
                        vm.indexorgan = vm.indexorgan + 1;
                        vm.exportdatareception();
                    }
                    else {
                        UIkit.modal('#modalprogressprint', { bgclose: false, keyboard: false }).hide();
                        var blob = vm.zip.generate({ type: "blob" });
                        var nameZip = 'Receptores_' + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY') + '.zip';
                        saveAs(blob, nameZip);

                    }

                }
            })

        }
        function _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(JSON.parse(base64));
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
        vm.modalError = modalError;
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        vm.closeddetailexam = closeddetailexam;
        function closeddetailexam() {
            if (vm.tabActive == 4) {
                vm.tabActive = 3;
            } else if (vm.tabActive == 3) {
                vm.tabActive = 2;
            } else {
                UIkit.modal('#modal_editdemo').hide();
            }
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
        vm.gettypedocument = gettypedocument;
        function gettypedocument() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return documenttypesDS.getstatetrue(auth.authToken).then(
                function (data) {
                    if (data.status === 200) {
                        vm.documentTypelist = data.data;
                        vm.documentTypelist.push({
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        });
                        vm.documentTypepatient = {
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        };
                    } else {
                        vm.documentTypelist.push({
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        });
                        vm.documentTypepatient = {
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        };
                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        vm.getInsurance = getInsurance;
        function getInsurance() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Listinsurance = [];
            return recepctionDS.getinsurance(auth.authToken).then(
                function (data) {
                    if (data.status === 200) {
                        vm.Listinsurance = data.data;
                    }
                },
                function (error) {
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
                    if (data.status === 200) {
                        vm.ListInstitution = data.data;
                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );
        }
        vm.changefilter = changefilter;
        function changefilter() {
            vm.searchreception = '';
            if (vm.typedocument) {
                vm.documentTypepatient = {
                    'id': 0,
                    'abbr': 'NI',
                    'name': $filter('translate')('0919')
                };
            }
            vm.organsearch = {
                id: 0,
                name: $filter('translate')('3334')
            }

            vm.organsearchname = {
                id: 0,
                name: $filter('translate')('3334')
            }
            if (vm.typeresport.id === 0) {
                setTimeout(function () {
                    document.getElementById('searchgrille').focus();
                }, 400);
            }
            if (vm.typeresport.id === 1) {
                setTimeout(function () {
                    document.getElementById('txt_patientid').focus();
                }, 400);
            }
            if (vm.typeresport.id === 2) {
                setTimeout(function () {
                    document.getElementById('txt_lastname').focus();
                }, 400);
            }
            vm.ListOrder = [];
            vm.record = '';
            vm.lastname = '';
            vm.surname = '';
            vm.name1 = '';
            vm.name2 = '';
            if (vm.typeresport.id === 0) {
                vm.getseach();
            }
        }
        vm.getseach = getseach;
        function getseach() {
            if (vm.typeresport.id === 0) {
                var data = {
                    "typeFilter": 0
                }
            }
            if (vm.typeresport.id === 1) {
                var data = {
                    "typeFilter": 1,
                    "patientId": vm.record
                }
                if (vm.documentTypepatient.id !== 0) {
                    data.documentType = { "id": vm.documentTypepatient.id }
                }
                if (vm.organsearch.id !== 0) {
                    data.idOrgan = vm.organsearch.id
                }
            }
            if (vm.typeresport.id === 2) {
                if (vm.name1.trim() === '' && vm.name2.trim() === '' && vm.lastname.trim() === '' && vm.surname.trim() === '') {
                    vm.loadingdata = false;
                    return false;
                }
                var data = {
                    "typeFilter": 2
                }
                if (vm.name1.trim() !== '') {
                    data.name1 = vm.name1;
                }
                if (vm.name2.trim() !== '') {
                    data.name2 = vm.name2;
                }
                if (vm.lastname.trim() !== '') {
                    data.lastName = vm.lastname;
                }

                if (vm.surname.trim() !== '') {
                    data.surName = vm.surname;
                }
                if (vm.organsearchname.id !== 0) {
                    data.idOrgan = vm.organsearchname.id
                }

            }
            vm.loadingdata = true;
            vm.ListOrder = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS
                .getreceiverpatient(auth.authToken, data)
                .then(
                    function (data) {
                        if (data.data.length !== 0) {
                            data.data.forEach(function (data) {
                                data.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                                if (data.listTransplant.length !== 0) {
                                    data.listTransplant.forEach(function (dataOrgan) {
                                        dataOrgan.nameorgan = vm.changuenameOrgan(dataOrgan.organ);
                                        dataOrgan.listOrgan = {
                                            'id': dataOrgan.organ,
                                            'name': dataOrgan.nameorgan
                                        }
                                    });
                                }
                            });
                            vm.ListOrder = data.data;
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
        vm.searchtype = searchtype;
        function searchtype() {
            if (vm.typeresport.id === 1) {
                setTimeout(function () {
                    document.getElementById('txt_patientid').focus();
                }, 400);
                if (vm.record === '') {
                    return true;
                } else {
                    vm.getseach();
                }
            }
        }
        vm.keyselectpatientid = keyselectpatientid;
        function keyselectpatientid($event) {
            var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
            if (keyCode === 13) {
                vm.getseach();
            }
        }
        vm.eventUndo = eventUndo;
        function eventUndo() {
            vm.documentType = {
                'id': 0
            };
            vm.patientId = '';
            vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
            vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, !vm.managehistoryauto);
            vm.patientDemosDisabled[-100] = vm.managehistoryauto;
            vm.patientDemos.forEach(function (demo, index) {
                if (demo.encoded && demo.viewdefault) {
                    vm.patientDemosValues[demo.id] = demo.itemsdefault;
                }
            });
            if (vm.typedocument) {
                vm.patientDemosDisabled[-10] = false;
                setTimeout(function () {
                    document.getElementById('demo_' + vm.staticDemoIds['documentType'] + '_value').focus();
                }, 100);
            } else {
                if (!vm.historyautomatic) {
                    setTimeout(function () {
                        document.getElementById('demo_' + vm.staticDemoIds['patientId']).focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
                    }, 100);
                }

            }

            //Limpia el formulario de los indicadores de obligatorios
            vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
            });
        }
        vm.eventEdit = eventEdit;
        function eventEdit() {
            //Habilita los datos del paciente
            var patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, false);
            vm.patientDemosDisabled = patientDemosDisabled;
            vm.patientDemosDisabled[-100] = vm.historyautomatic;
            var findpropertydemografic = _.filter(vm.patientDemos, function (e) {
                return e.modify === false
            });
            if (findpropertydemografic.length > 0) {
                findpropertydemografic.forEach(function (e) {
                    disabledDemo(vm.patientDemosDisabled, e.id, true);
                })
            }
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['lastName'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['surName'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['name1'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['name2'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['sex'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['birthday'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['age'], true);
        }
        function init() {
            vm.loadingdata = true;
            vm.labelhytorico = $filter('translate')('0400');
            vm.newreceptor = $filter('translate')('3325');

            vm.labelcorregido = 'cPRA global';
            vm.labelcalculado = $filter('translate')('3358');

            vm.maxDate = new Date();
            vm.formatDate = localStorageService.get('FormatoFecha');
            vm.typedocument = localStorageService.get('ManejoTipoDocumento');
            vm.typedocument = vm.typedocument === 'True' || vm.typedocument === true ? true : false;
            vm.historyautomatic = localStorageService.get('HistoriaAutomatica');
            vm.historyautomatic = vm.historyautomatic === 'True' || vm.historyautomatic === true ? true : false;
            vm.history = undefined;
            vm.patientPhoto = 'images/user.png';
            // lista de grupo sanguineo
            vm.ListBloodtype = [
                {
                    id: $filter('translate')('0162'),
                    name: $filter('translate')('0162')
                },
                {
                    id: 'A',
                    name: 'A'
                },
                {
                    id: 'B',
                    name: 'B'
                },
                {
                    id: 'AB',
                    name: 'AB'
                },
                {
                    id: 'O',
                    name: 'O'
                }
            ]
            // lista de RH
            vm.ListRH = [
                {
                    id: $filter('translate')('0162'),
                    name: $filter('translate')('0162')
                }, {
                    id: $filter('translate')('3328'),
                    name: $filter('translate')('3328')
                },
                {
                    id: $filter('translate')('3329'),
                    name: $filter('translate')('3329')
                }
            ]
            //Lista de  Hepatitis B N/S
            vm.ListHepatitisB = _.clone(vm.ListRH);
            //Lista de Anticuerpos N/S
            vm.ListAutoantibodies = _.clone(vm.ListRH);
            //Lista de clase
            vm.ListClase = _.clone(vm.ListRH);
            var ListClase = {
                id: $filter('translate')('3330'),
                name: $filter('translate')('3330')
            }
            vm.ListClase.push(ListClase);
            //Lista de clase 2
            vm.ListClaseI = _.clone(vm.ListRH);

            //Lista de tipo de donante 
            vm.ListtypeDonor = [{
                id: $filter('translate')('3331'),
                name: $filter('translate')('3331')
            },
            {
                id: $filter('translate')('3332'),
                name: $filter('translate')('3332')
            }
            ] 
            //Lista de Eritropoyetina
            vm.Listeritropoyetina = [{
                id: $filter('translate')('0219'),
                name: $filter('translate')('0219')
            },
            {
                id: $filter('translate')('0220'),
                name: $filter('translate')('0220')
            }
            ] 

            vm.typeresport = [
                {
                    id: 0,
                    name: $filter('translate')('0353')
                }, //historia
                {
                    id: 1,
                    name: $filter('translate')('0117')
                }, //historia
                {
                    id: 2,
                    name: $filter('translate')('0133') + "/" + $filter('translate')('0134')
                } //Apellido
            ];

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

            vm.organsearch = {
                id: 0,
                name: $filter('translate')('3334')
            }

            vm.organsearchname = {
                id: 0,
                name: $filter('translate')('3334')
            }

            vm.typeresport.id = 0;
            if (vm.typedocument) {
                vm.gettypedocument();
            }
            else {
                vm.documentTypelist = [];
                vm.documentTypelist.push({
                    'id': 0,
                    'abbr': 'NI',
                    'name': $filter('translate')('0919')
                });
                vm.documentTypepatient = vm.documentTypelist[0];
            }

            vm.labelPor_incompatibilidad = $filter('translate')('3351');
            vm.labelPor_reaccion = $filter('translate')('3352');
            vm.labelAceptable = $filter('translate')('3353');
            vm.labelNegativa = $filter('translate')('3354');
            vm.labelInaceptable = $filter('translate')('3355');
            vm.labelPositiva = $filter('translate')('3356');


            vm.loadDemographicControls();
            vm.getseach();
            vm.getInsurance();
            vm.getInstitution();
            setTimeout(function () {
                document.getElementById('searchgrille').focus();
            }, 400);
        }
        vm.eventNew = eventNew;
        function eventNew() {
            vm.newreceptor = $filter('translate')('3325');
            vm.tabActive = 1;
            vm.documentType = {
                'id': 0
            };
            vm.patientId = '';
            vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
            vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, !vm.historyautomatic);
            vm.patientDemosDisabled[-100] = vm.historyautomatic;
            vm.patientDemos.forEach(function (demo, index) {
                if (demo.encoded && demo.viewdefault) {
                    vm.patientDemosValues[demo.id] = demo.itemsdefault;
                }
            });
            if (vm.typedocument) {
                vm.patientDemosDisabled[-10] = false;
                setTimeout(function () {
                    document.getElementById('demo_' + vm.staticDemoIds['documentType'] + '_value').focus();
                }, 100);
            } else {
                if (!vm.historyautomatic) {
                    setTimeout(function () {
                        document.getElementById('demo_' + vm.staticDemoIds['patientId']).focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
                    }, 100);
                }
            }
            //Limpia el formulario de los indicadores de obligatorios
            vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
            });
            UIkit.modal('#modal_editdemo').show();
        }
        /**
        * Remisiones
        */
        vm.EditRemission = EditRemission;
        function EditRemission() {
            vm.btneditremission = true;
            vm.btnsaveremission = false;
        }
        vm.saveRemission = saveRemission;
        function saveRemission() {
            vm.loading = true;
            vm.requeridphysyian = false;
            if (vm.listremision.institution.selected === undefined) {
                vm.listremision.institution.requerid = true;
            }
            if (vm.listremision.insurance.selected === undefined) {
                vm.listremision.insurance.requerid = true;
            }
            if (vm.listremision.physician !== undefined) {
                vm.requeridphysyian = vm.listremision.physician === '' || vm.listremision.physician.trim() === '' ? true : false;
            } else {
                vm.requeridphysyian = false;
            }

            if (vm.listremision.institution.selected !== undefined && vm.listremision.insurance.selected !== undefined && !vm.requeridphysyian) {
                vm.listremision.institution.id = vm.listremision.institution.selected.id;
                vm.listremision.institution.code = vm.listremision.institution.selected.code;
                vm.listremision.institution.name = vm.listremision.institution.selected.name;

                vm.listremision.insurance.id = vm.listremision.insurance.selected.id;
                vm.listremision.insurance.code = vm.listremision.insurance.selected.code;
                vm.listremision.insurance.name = vm.listremision.insurance.selected.name;


                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                var receiverpatient = {
                    "idRemmision": vm.listremision.idRemmision,
                    "patientId": vm.patientDemosValues[vm.staticDemoIds['patientDB']],
                    "institution": {
                        "id": vm.listremision.institution.id
                    },
                    "insurance": {
                        "id": vm.listremision.insurance.id
                    },
                    "physician": vm.listremision.physician,
                    "idUserRemission": vm.patientDemosValues[vm.staticDemoIds['patientDB']]
                }
                return recepctionDS.updatereceiverpatient(auth.authToken, receiverpatient).then(
                    function (data) {
                        vm.loading = false;
                        if (data.status === 200) {
                            vm.btneditremission = false;
                            vm.btnsaveremission = true;
                            vm.listremision.idRemmision = data.data.idRemmision;
                        }
                    },
                    function (error) {
                        vm.loading = false;
                        vm.modalError(error);
                    }
                );
            } else {
                vm.loading = false;
            }
        }
        /**
       * Transplant
       */
        vm.eventNewTransplant = eventNewTransplant;
        function eventNewTransplant() {
            if (vm.listTransplant.length !== 0) {
                vm.listTransplant.forEach(function (dataOrgan) {
                    dataOrgan.DisabledEditremision = true;
                    dataOrgan.DisabledCancelremision = true;
                    vm.listorganTransplant = _.filter(vm.listorganTransplant, function (o) { return o.id !== dataOrgan.listOrgan.id });

                });
            }
            var listTransplant = {
                "idTransplant": -1,
                "listOrgan": { id: 0 },
                "dateTransplant": new Date(),
                "edit": true
            }
            vm.listTransplant.push(listTransplant);
            setTimeout(function () {
                document.getElementById('listremision_-1').focus();
            }, 200);
        }

        vm.chanclaseIantigeno = chanclaseIantigeno;
        function chanclaseIantigeno() {
            if (vm.Test.receiverPRALuminexAntigeno.classI === 'Negativo') {
                vm.Test.receiverPRALuminexAntigeno.classIUnacceptableA = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIAcceptableA = $filter('translate')('3381');

                vm.Test.receiverPRALuminexAntigeno.classIUnacceptableB = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIAcceptableB = $filter('translate')('3381');

                vm.Test.receiverPRALuminexAntigeno.classIUnacceptableC = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIAcceptableC = $filter('translate')('3381');
            } else {
                vm.Test.receiverPRALuminexAntigeno.classIUnacceptableA = '';
                vm.Test.receiverPRALuminexAntigeno.classIAcceptableA = '';

                vm.Test.receiverPRALuminexAntigeno.classIUnacceptableB = '';
                vm.Test.receiverPRALuminexAntigeno.classIAcceptableB = '';

                vm.Test.receiverPRALuminexAntigeno.classIUnacceptableC = '';
                vm.Test.receiverPRALuminexAntigeno.classIAcceptableC = '';
            }
        }

        vm.chanclaseIantigeno2 = chanclaseIantigeno2;
        function chanclaseIantigeno2() {
            if (vm.Test.receiverPRALuminexAntigeno.classII === 'Negativo') {
                vm.Test.receiverPRALuminexAntigeno.classIIDRB11 = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIIDRB12 = $filter('translate')('3381');

                vm.Test.receiverPRALuminexAntigeno.classIIDQA1 = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIIDQA2 = $filter('translate')('3381');

                vm.Test.receiverPRALuminexAntigeno.classIIDQB1 = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIIDQB2 = $filter('translate')('3381');

                vm.Test.receiverPRALuminexAntigeno.classIIDPA1 = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIIDPA2 = $filter('translate')('3381');

                vm.Test.receiverPRALuminexAntigeno.classIIDPB1 = $filter('translate')('3380');
                vm.Test.receiverPRALuminexAntigeno.classIIDPB2 = $filter('translate')('3381');

            } else {
                vm.Test.receiverPRALuminexAntigeno.classIIDRB11 = '';
                vm.Test.receiverPRALuminexAntigeno.classIIDRB12 = '';

                vm.Test.receiverPRALuminexAntigeno.classIIDQA1 = '';
                vm.Test.receiverPRALuminexAntigeno.classIIDQA2 = '';

                vm.Test.receiverPRALuminexAntigeno.classIIDQB1 = '';
                vm.Test.receiverPRALuminexAntigeno.classIIDQB2 = '';

                vm.Test.receiverPRALuminexAntigeno.classIIDPA1 = '';
                vm.Test.receiverPRALuminexAntigeno.classIIDPA2 = '';

                vm.Test.receiverPRALuminexAntigeno.classIIDPB1 = '';
                vm.Test.receiverPRALuminexAntigeno.classIIDPB2 = '';
            }
        }

        vm.chanclaseIcuanti = chanclaseIcuanti;
        function chanclaseIcuanti() {
            if (vm.Test.receiverPRALuminexCuantitativo.classI === 'Negativo') {
                vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableA = $filter('translate')('3380');
                vm.Test.receiverPRALuminexCuantitativo.classIAcceptableA = $filter('translate')('3381');

                vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableB = $filter('translate')('3380');
                vm.Test.receiverPRALuminexCuantitativo.classIAcceptableB = $filter('translate')('3381');

                vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableC = $filter('translate')('3380');
                vm.Test.receiverPRALuminexCuantitativo.classIAcceptableC = $filter('translate')('3381');
            } else {
                vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableA = '';
                vm.Test.receiverPRALuminexCuantitativo.classIAcceptableA = '';

                vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableB = '';
                vm.Test.receiverPRALuminexCuantitativo.classIAcceptableB = '';

                vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableC = '';
                vm.Test.receiverPRALuminexCuantitativo.classIAcceptableC = '';
            }
        }

        vm.newtest = newtest;
        function newtest(idTransplant) {
            vm.selectedIndex = 0;
            vm.new = true;
            vm.edit = false;
            vm.tabActive = 3;
            vm.saveattachmentsHLAInput = {};
            vm.saveattachmentsPRAInput = {};
            vm.saveattachmentsCUANInput = {};
            vm.saveattachmentsANInput = {};
            vm.saveattachmentsCIMEInput = {};
            vm.viewattachmentsANInput = false;
            vm.viewattachmentsCIMEInput = false;
            vm.viewattachmentsHLAInput = false;
            vm.viewattachmentsPRAInput = false;
            vm.viewattachmentsCUANInput = false;
            vm.disabledcontrol = false;
            vm.disabledcontrolHLA = false;
            vm.disabledcontrolPRA = false;
            vm.disabledcontrolCUAN = false;
            vm.disabledcontrolAN = false;
            vm.disabledcontrolCIME = false;
            vm.Test = newJsontest(idTransplant);
            setTimeout(function () {
                document.getElementById('bloodgroup').focus();
            }, 100);
        }

        vm.newJsontest = newJsontest;
        function newJsontest(idTransplant) {
            var jsonTest = {
                "receiverTestEntry": {
                    "idTransplant": idTransplant, //id del transplante
                    "bloodgroup": $filter('translate')('0162'), //Grupo sanguineo
                    "rh": $filter('translate')('0162'), //RH
                    "numbertransfusions": 0, //Numero de tranfusiones             
                    "transfusiondate": null, //Fecha de transfusion
                    "numberprevioustransplants": 0, //Numero tranplantes anteriores
                    "previoustransplantdate": null, //Fecha de tranplante anterior
                    "donortype": '',//Tipo donante
                    "originaldisease": '', //Enfermedad Original
                    "dialysisstartdate": null,//Fecha de inicio dialisis
                    "dialysistype": '', //Tipo dialisis
                    "Eritoproyetina": '',//Eritoproyetina
                    "hepatitisb": $filter('translate')('0162'),// Hepatitis B
                    "numberpregnancies": 0, //Numero de embarazos
                    "autoantibodies": $filter('translate')('0162'), //Autoanticuerpos
                    "observation": '',
                    "dateinclusionwaitinglist": null, //fecha de lista de espera
                },
                "receiverHLAMolecular": {
                    "idTransplant": idTransplant,
                    "a": '',
                    "drb1": '',
                    "dpa": '',
                    "b": '',
                    "dqa": '',
                    "dpb": '',
                    "c": '',
                    "dqb": '',
                    "datesamplecollection": null,// fecha de toma de la muestra
                    "trialdate": null,// fecha de ensayo
                    "observations": ''
                },
                "receiverPRALuminexCualitativo": {
                    "idTransplant": idTransplant,
                    "classI": $filter('translate')('0162'),
                    "classII": $filter('translate')('0162'),
                    "classIIObservation": "",
                    "classIObservation": "",
                    "datesamplecollection": null,
                    "trialdate": null
                },
                "receiverPRALuminexCuantitativo": {
                    "idTransplant": idTransplant,
                    "classIType": '1', //
                    "classI": $filter('translate')('0162'), // clase1
                    "classIPercentage": 0, //Porcentaje
                    "classICorrected": 0, // Corregido
                    "classIObservation": "",//Observaciones
                    "classIUnacceptableA": "",//A*
                    "classIUnacceptableB": "",//b*
                    "classIUnacceptableC": "",//c*
                    "classIAcceptableA": "",//A1
                    "classIAcceptableB": "",//B2
                    "classIAcceptableC": "",//C2
                    "classIAleloHLAA1": "",//h ALELO HLA-A1
                    "classIAleloHLAA2": "",
                    "classIEpletasHLAAImmunizer1": "", //
                    "classIEpletasHLAAImmunizer2": "",
                    "classIAleloHLAB1": "", //
                    "classIAleloHLAB2": "",
                    "classIEpletasHLABImmunizer1": "",//
                    "classIEpletasHLABImmunizer2": "",
                    "classIAleloHLAC1": "", //
                    "classIAleloHLAC2": "",
                    "classIEpletasHLACImmunizer1": "",
                    "classIEpletasHLACImmunizer2": "",//
                    "classII": $filter('translate')('0162'),
                    "classIIPercentage": 0,
                    "classIICorrected": 0,
                    "classIIObservation": "",
                    "classIIDRB11": "",
                    "classIIDRB12": "",
                    "classIIDQA1": "",
                    "classIIDQA2": "",
                    "classIIDQB1": "",
                    "classIIDQB2": "",
                    "classIIDPA1": "",
                    "classIIDPA2": "",
                    "classIIDPB1": "",
                    "classIIDPB2": "",
                    "classIIAleloHLADRB11": "",
                    "classIIAleloHLADRB12": "",
                    "classIIEpletasHLADRB1Immunizer1": "",
                    "classIIEpletasHLADRB1Immunizer2": "",
                    "classIIAleloHLADQA1": "",
                    "classIIAleloHLADQA2": "",
                    "classIIEpletasHLADQAImmunizer1": "",
                    "classIIEpletasHLADQAImmunizer2": "",
                    "classIIAleloHLADQB1": "",//
                    "classIIAleloHLADQB2": "",
                    "classIIEpletasHLADQBImmunizer1": "",//
                    "classIIEpletasHLADQBImmunizer2": "",
                    "classIIAleloHLADPA1": "",//
                    "classIIAleloHLADPA2": "",
                    "classIIEpletasHLADPAImmunizer1": "",//
                    "classIIEpletasHLADPAImmunizer2": "",
                    "classIIAleloHLADPB1": "", //
                    "classIIAleloHLADPB2": "",
                    "classIIEpletasHLADPBImmunizer1": "",
                    "classIIEpletasHLADPBImmunizer2": "",
                    "datesamplecollection": null,
                    "trialdate": null
                },
                "receiverPRALuminexAntigeno": {
                    "idTransplant": idTransplant,
                    "classIType": '1', //
                    "classI": $filter('translate')('0162'),
                    "classIPercentage": 0,
                    "classICorrected": 0,
                    "classIObservation": "",
                    "classIUnacceptableA": "",
                    "classIUnacceptableB": "",
                    "classIUnacceptableC": "",
                    "classIAcceptableA": "",
                    "classIAcceptableB": "",
                    "classIAcceptableC": "",
                    "classIAleloHLAA1": "",
                    "classIAleloHLAA2": "",
                    "classIEpletasHLAAImmunizer1": "",
                    "classIEpletasHLAAImmunizer2": "",
                    "classIAleloHLAB1": "",
                    "classIAleloHLAB2": "",
                    "classIEpletasHLABImmunizer1": "",
                    "classIEpletasHLABImmunizer2": "",
                    "classIAleloHLAC1": "",
                    "classIAleloHLAC2": "",
                    "classIEpletasHLACImmunizer1": "",
                    "classIEpletasHLACImmunizer2": "",
                    "classII": $filter('translate')('0162'),
                    "classIIPercentage": 0,
                    "classIICorrected": 0,
                    "classIIObservation": "",
                    "classIIDRB11": "",
                    "classIIDRB12": "",
                    "classIIDQA1": "",
                    "classIIDQA2": "",
                    "classIIDQB1": "",
                    "classIIDQB2": "",
                    "classIIDPA1": "",
                    "classIIDPA2": "",
                    "classIIDPB1": "",
                    "classIIDPB2": "",
                    "classIIAleloHLADRB11": "",
                    "classIIAleloHLADRB12": "",
                    "classIIEpletasHLADRB1Immunizer1": "",
                    "classIIEpletasHLADRB1Immunizer2": "",
                    "classIIAleloHLADQA1": "",
                    "classIIAleloHLADQA2": "",
                    "classIIEpletasHLADQAImmunizer1": "",
                    "classIIEpletasHLADQAImmunizer2": "",
                    "classIIAleloHLADQB1": "",
                    "classIIAleloHLADQB2": "",
                    "classIIEpletasHLADQBImmunizer1": "",
                    "classIIEpletasHLADQBImmunizer2": "",
                    "classIIAleloHLADPA1": "",
                    "classIIAleloHLADPA2": "",
                    "classIIEpletasHLADPAImmunizer1": "",
                    "classIIEpletasHLADPAImmunizer2": "",
                    "classIIAleloHLADPB1": "",
                    "classIIAleloHLADPB2": "",
                    "classIIEpletasHLADPBImmunizer1": "",
                    "classIIEpletasHLADPBImmunizer2": "",
                    "datesamplecollection": null,
                    "trialdate": null
                },
                "receiverFlowCytometry": {
                    "idTransplant": idTransplant,
                    "lbAlloreactionIgG": "",
                    "lbAlloreactionIgM": "",
                    "lbInterpretationAlloreactionIgG": "",
                    "lbInterpretationAlloreactionIgM": "",
                    "lbInterpretationSelfreactionIgG": "",
                    "lbInterpretationSelfreactionIgM": "",
                    "lbNegativeControlAlloreactionIgG": "",
                    "lbNegativeControlAlloreactionIgM": "",
                    "lbNegativeControlSelfreactionIgG": "",
                    "lbNegativeControlSelfreactionIgM": "",
                    "lbPositiveControlAlloreactionIgG": "",
                    "lbPositiveControlAlloreactionIgM": "",
                    "lbSelfreactionIgG": "",
                    "lbSelfreactionIgM": "",
                    "ltAlloreactionIgG": "",
                    "ltAlloreactionIgM": "",
                    "ltInterpretationAlloreactionIgG": "",
                    "ltInterpretationAlloreactionIgM": "",
                    "ltInterpretationSelfreactionIgG": "",
                    "ltInterpretationSelfreactionIgM": "",
                    "ltNegativeControlAlloreactionIgG": "",
                    "ltNegativeControlAlloreactionIgM": "",
                    "ltNegativeControlSelfreactionIgG": "",
                    "ltNegativeControlSelfreactionIgM": "",
                    "ltPositiveControlAlloreactionIgG": "",
                    "ltPositiveControlAlloreactionIgM": "",
                    "ltSelfreactionIgG": "",
                    "ltSelfreactionIgM": "",
                    "mtAlloreactionIgG": "",
                    "mtAlloreactionIgM": "",
                    "mtInterpretationAlloreactionIgG": "",
                    "mtInterpretationAlloreactionIgM": "",
                    "mtInterpretationSelfreactionIgG": "",
                    "mtInterpretationSelfreactionIgM": "",
                    "mtNegativeControlAlloreactionIgG": "",
                    "mtNegativeControlAlloreactionIgM": "",
                    "mtNegativeControlSelfreactionIgG": "",
                    "mtNegativeControlSelfreactionIgM": "",
                    "mtPositiveControlAlloreactionIgG": "",
                    "mtPositiveControlAlloreactionIgM": "",
                    "mtSelfreactionIgG": "",
                    "mtSelfreactionIgM": "",
                    "datesamplecollection": null,
                    "observation": "",
                    "trialdate": null
                }
            }
            return jsonTest;
        }
        vm.saveTes = saveTes;
        function saveTes() {
            vm.loading = true;
            if (vm.saveattachmentsHLAInput.filename !== undefined) {
                vm.Test.receiverHLAMolecular.attachment = vm.saveattachmentsHLAInput;
            }
            if (vm.saveattachmentsPRAInput.filename !== undefined) {
                vm.Test.receiverPRALuminexCualitativo.attachment = vm.saveattachmentsPRAInput;
            }
            if (vm.saveattachmentsCUANInput.filename !== undefined) {
                vm.Test.receiverPRALuminexCuantitativo.attachment = vm.saveattachmentsCUANInput;
            }
            if (vm.saveattachmentsANInput.filename !== undefined) {
                vm.Test.receiverPRALuminexAntigeno.attachment = vm.saveattachmentsANInput;
            }
            if (vm.saveattachmentsCIMEInput.filename !== undefined) {
                vm.Test.receiverFlowCytometry.attachment = vm.saveattachmentsCIMEInput;
            }
            vm.Test.receiverTestEntry.dialysisstartdate = vm.Test.receiverTestEntry.dialysisstartdate == null ? null : new Date(moment(vm.Test.receiverTestEntry.dialysisstartdate).format()).getTime();
            vm.Test.receiverTestEntry.transfusiondate = vm.Test.receiverTestEntry.transfusiondate == null ? null : new Date(moment(vm.Test.receiverTestEntry.transfusiondate).format()).getTime();
            vm.Test.receiverTestEntry.previoustransplantdate = vm.Test.receiverTestEntry.previoustransplantdate === null ? null : new Date(moment(vm.Test.receiverTestEntry.previoustransplantdate).format()).getTime();
            vm.Test.receiverTestEntry.dateinclusionwaitinglist = vm.Test.receiverTestEntry.dateinclusionwaitinglist === null ? null : new Date(moment(vm.Test.receiverTestEntry.dateinclusionwaitinglist).format()).getTime();
            vm.Test.receiverHLAMolecular.datesamplecollection = vm.Test.receiverHLAMolecular.datesamplecollection === null ? null : new Date(moment(vm.Test.receiverHLAMolecular.datesamplecollection).format()).getTime();
            vm.Test.receiverHLAMolecular.trialdate = vm.Test.receiverHLAMolecular.trialdate === null ? null : new Date(moment(vm.Test.receiverHLAMolecular.trialdate).format()).getTime();
            vm.Test.receiverPRALuminexCualitativo.datesamplecollection = vm.Test.receiverPRALuminexCualitativo.datesamplecollection === null ? null : new Date(moment(vm.Test.receiverPRALuminexCualitativo.datesamplecollection).format()).getTime();
            vm.Test.receiverPRALuminexCualitativo.trialdate = vm.Test.receiverPRALuminexCualitativo.trialdate === null ? null : new Date(moment(vm.Test.receiverPRALuminexCualitativo.trialdate).format()).getTime();
            vm.Test.receiverPRALuminexCuantitativo.datesamplecollection = vm.Test.receiverPRALuminexCuantitativo.datesamplecollection === null ? null : new Date(moment(vm.Test.receiverPRALuminexCuantitativo.datesamplecollection).format()).getTime();
            vm.Test.receiverPRALuminexCuantitativo.trialdate = vm.Test.receiverPRALuminexCuantitativo.trialdate === null ? null : new Date(moment(vm.Test.receiverPRALuminexCuantitativo.trialdate).format()).getTime();
            vm.Test.receiverPRALuminexAntigeno.datesamplecollection = vm.Test.receiverPRALuminexAntigeno.datesamplecollection === null ? null : new Date(moment(vm.Test.receiverPRALuminexAntigeno.datesamplecollection).format()).getTime();
            vm.Test.receiverPRALuminexAntigeno.trialdate = vm.Test.receiverPRALuminexAntigeno.trialdate === null ? null : new Date(moment(vm.Test.receiverPRALuminexAntigeno.trialdate).format()).getTime();
            vm.Test.receiverFlowCytometry.datesamplecollection = vm.Test.receiverFlowCytometry.datesamplecollection === null ? null : new Date(moment(vm.Test.receiverFlowCytometry.datesamplecollection).format()).getTime();
            vm.Test.receiverFlowCytometry.trialdate = vm.Test.receiverFlowCytometry.trialdate === null ? null : new Date(moment(vm.Test.receiverFlowCytometry.trialdate).format()).getTime();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (vm.new) {
                return recepctionDS.newResultText(auth.authToken, vm.Test).then(
                    function (data) {
                        if (data.status === 200) {
                            vm.loading = false;
                            vm.tabActive = 2;
                        }
                    },
                    function (error) {
                        vm.loading = false;
                        vm.modalError(error);
                    }
                );
            }

            if (vm.edit) {
                return recepctionDS.EditResultText(auth.authToken, vm.Test).then(
                    function (data) {
                        if (data.status === 200) {
                            vm.loading = false;
                            vm.tabActive = 2;
                        }
                    },
                    function (error) {
                        vm.loading = false;
                        vm.modalError(error);
                    }
                );
            }
        }

        vm.cancelRemission = cancelRemission;
        function cancelRemission() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Listinsurance = [];
            vm.loading = true;
            return recepctionDS.deletedtransplant(auth.authToken, vm.deleted.idTransplant).then(
                function (data) {
                    vm.loading = false;
                    if (data.status === 200) {
                        vm.listTransplant = _.filter(vm.listTransplant, function (o) { return o.idTransplant !== vm.deleted.idTransplant; });
                        vm.getseach();                       
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }

        /**
       *  HlA MOLECULAR
       */
        vm.historicalHLA = historicalHLA;
        function historicalHLA() {
            vm.loading = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.LististoricalPRA = [];
            vm.LististoricalHLA = [];
            vm.LististoricalCIME = [];
            vm.LististoricalCUAN = [];
            vm.LististoricalAN = [];
            vm.nameTest = 'HLA MOLECULAR';
            return recepctionDS.gethistoricalHLA(auth.authToken, vm.idTransplant).then(
                function (data) {
                    if (data.status === 200) {
                        if (data.data.length === 0) {
                            logger.info('No hay datos historicos');
                            vm.loading = false;
                        } else {
                            vm.tabActive = 4;
                            var listhytoric = data.data;
                            listhytoric.forEach(function (data) {
                                if (data.attachment !== undefined) {
                                    data.attachment.fileType = validatetype(data.attachment.extension);
                                    data.attachment.base64 = 'data:' + data.attachment.fileType + ';base64,' + data.attachment.file
                                } else {
                                    data.attachment = [];
                                }
                            });
                            vm.LististoricalHLA = listhytoric;
                            setTimeout(function () {
                                vm.LististoricalHLA.forEach(function (data) {
                                    if (data.attachment.length !== 0) {
                                        var elemento = document.getElementById(data.id);
                                        elemento.src = data.attachment.base64;
                                    }
                                });
                                vm.loading = false;
                            }, 100);
                        }
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        function validatetype(type) {
            if (type === 'jpg' || type === 'jpeg' || type === 'png') {
                return 'image/' + type
            }
            if (type === 'pdf') {
                return 'application/' + type
            }
        }
        vm.newHLA = newHLA;
        function newHLA() {
            vm.disablednewHLA = true;
            vm.disabledcontrolHLA = false;
            vm.receiverHLAMolecularcomparated = _.clone(vm.Test.receiverHLAMolecular);
            vm.Test.receiverHLAMolecular.a = '';
            vm.Test.receiverHLAMolecular.drb1 = '';
            vm.Test.receiverHLAMolecular.dpa = '';
            vm.Test.receiverHLAMolecular.b = '';
            vm.Test.receiverHLAMolecular.dqa = '';
            vm.Test.receiverHLAMolecular.dpb = '';
            vm.Test.receiverHLAMolecular.c = '';
            vm.Test.receiverHLAMolecular.dqb = '';
            vm.Test.receiverHLAMolecular.observation = '';
            vm.Test.receiverHLAMolecular.attachment = undefined;
            vm.Test.receiverHLAMolecular.datesamplecollection = null;
            vm.Test.receiverHLAMolecular.trialdate = null;
            vm.Test.receiverHLAMolecular.historical = 1;
            vm.viewattachmentsHLAInput = false;
            vm.saveattachmentsHLAInput = {};
            setTimeout(function () {
                document.getElementById('HLAMoleculara').focus();
            }, 100);
        }
        vm.eventUndoHLA = eventUndoHLA;
        function eventUndoHLA() {
            vm.viewattachmentsHLAInput = false;
            vm.disablednewHLA = false;
            vm.disabledcontrolHLA = true;
            vm.Test.receiverHLAMolecular = vm.receiverHLAMolecularcomparated;
            vm.Test.receiverHLAMolecular.historical = 0;
            if (vm.Test.receiverHLAMolecular.attachment !== undefined) {
                vm.attachmentsHLAInput = [{
                    'filetype': vm.Test.receiverHLAMolecular.attachment.fileType,
                    'filename': vm.Test.receiverHLAMolecular.attachment.name,
                    'base64': vm.Test.receiverHLAMolecular.attachment.file
                }];
            }
        }
        vm.closedadjutedHLA = closedadjutedHLA;
        function closedadjutedHLA() {
            vm.viewattachmentsHLAInput = false;
            vm.saveattachmentsHLAInput = {};
        }

        /**
      *  PRA LUMINEX CUALITATIVO
      */

        vm.historicalPRA = historicalPRA;
        function historicalPRA() {
            vm.loading = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.LististoricalPRA = [];
            vm.LististoricalHLA = [];
            vm.LististoricalCIME = [];
            vm.LististoricalCUAN = [];
            vm.LististoricalAN = [];
            vm.nameTest = 'PRA LUMINEX - CUALITATIVO';
            return recepctionDS.gethistoricalPRA(auth.authToken, vm.idTransplant).then(
                function (data) {
                    if (data.status === 200) {
                        if (data.data.length === 0) {
                            logger.info($filter('translate')('3382'));
                            vm.loading = false;
                        } else {
                            vm.tabActive = 4;
                            var listhytoric = data.data;
                            listhytoric.forEach(function (data) {
                                if (data.attachment !== undefined) {
                                    data.attachment.fileType = validatetype(data.attachment.extension);
                                    data.attachment.base64 = 'data:' + data.attachment.fileType + ';base64,' + data.attachment.file
                                } else {
                                    data.attachment = [];
                                }
                            });
                            vm.LististoricalPRA = listhytoric;
                            setTimeout(function () {
                                vm.LististoricalPRA.forEach(function (data) {
                                    if (data.attachment.length !== 0) {
                                        var elemento = document.getElementById(data.id);
                                        elemento.src = data.attachment.base64;
                                    }
                                });
                                vm.loading = false;
                            }, 100);
                        }
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.newPRA = newPRA;
        function newPRA() {
            vm.disablednewPRA = true;
            vm.disabledcontrolPRA = false;
            vm.receiverPRAMolecularcomparated = _.clone(vm.Test.receiverPRALuminexCualitativo);
            vm.Test.receiverPRALuminexCualitativo.classI = $filter('translate')('0162');
            vm.Test.receiverPRALuminexCualitativo.classII = $filter('translate')('0162');
            vm.Test.receiverPRALuminexCualitativo.attachment = undefined;
            vm.Test.receiverPRALuminexCualitativo.classIObservation = '';
            vm.Test.receiverPRALuminexCualitativo.datesamplecollection = null;
            vm.Test.receiverPRALuminexCualitativo.trialdate = null;
            vm.Test.receiverPRALuminexCualitativo.historical = 1;
            vm.viewattachmentsPRAInput = false;
            vm.saveattachmentsPRAInput = {};
            setTimeout(function () {
                document.getElementById('PRALuminexCualitativo').focus();
            }, 100);
        }
        vm.eventUndoPRA = eventUndoPRA;
        function eventUndoPRA() {
            vm.viewattachmentsPRAInput = false;
            vm.disablednewPRA = false;
            vm.disabledcontrolPRA = true;
            vm.Test.receiverPRALuminexCualitativo = vm.receiverPRAMolecularcomparated;
            vm.Test.receiverPRALuminexCualitativo.historical = 0;
            if (vm.Test.receiverPRALuminexCualitativo.attachment !== undefined) {
                vm.attachmentsPRAInput = [{
                    'filetype': vm.Test.receiverPRALuminexCualitativo.attachment.fileType,
                    'filename': vm.Test.receiverPRALuminexCualitativo.attachment.name,
                    'base64': vm.Test.receiverPRALuminexCualitativo.attachment.file
                }];
            }
        }
        vm.closedadjutedPRA = closedadjutedPRA;
        function closedadjutedPRA() {
            vm.viewattachmentsPRAInput = false;
            vm.saveattachmentsPRAInput = {};
        }

        /**
     *  CIMETRIA DE FLUJO
     */

        vm.historicalCIME = historicalCIME;
        function historicalCIME() {
            vm.loading = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.LististoricalPRA = [];
            vm.LististoricalHLA = [];
            vm.LististoricalCIME = [];
            vm.LististoricalCUAN = [];
            vm.LististoricalAN = [];
            vm.nameTest = 'CITOMETRÍA DE FLUJO';
            return recepctionDS.gethistoricalCIEN(auth.authToken, vm.idTransplant).then(
                function (data) {
                    if (data.status === 200) {
                        if (data.data.length === 0) {
                            logger.info($filter('translate')('3382'));
                            vm.loading = false;
                        } else {
                            vm.tabActive = 4;
                            var listhytoric = data.data;
                            listhytoric.forEach(function (data) {
                                if (data.attachment !== undefined) {
                                    data.attachment.fileType = validatetype(data.attachment.extension);
                                    data.attachment.base64 = 'data:' + data.attachment.fileType + ';base64,' + data.attachment.file
                                } else {
                                    data.attachment = [];
                                }
                            });
                            vm.LististoricalCIME = listhytoric;
                            setTimeout(function () {
                                vm.LististoricalCIME.forEach(function (data) {
                                    if (data.attachment.length !== 0) {
                                        var elemento = document.getElementById(data.id);
                                        elemento.src = data.attachment.base64;
                                    }
                                });
                                vm.loading = false;
                            }, 100);
                        }
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.newCIME = newCIME;
        function newCIME() {
            vm.disablednewCIME = true;
            vm.disabledcontrolCIME = false;
            vm.receiverCIMEMolecularcomparated = _.clone(vm.Test.receiverFlowCytometry);
            vm.Test.receiverFlowCytometry.lbAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.lbAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.lbInterpretationAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.lbInterpretationAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.lbInterpretationSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.lbInterpretationSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.lbNegativeControlAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.lbNegativeControlAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.lbNegativeControlSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.lbNegativeControlSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.lbPositiveControlAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.lbPositiveControlAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.lbSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.lbSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.ltAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.ltAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.ltInterpretationAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.ltInterpretationAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.ltInterpretationSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.ltInterpretationSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.ltNegativeControlAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.ltNegativeControlAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.ltNegativeControlSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.ltNegativeControlSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.ltPositiveControlAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.ltPositiveControlAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.ltSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.ltSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.mtAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.mtAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.mtInterpretationAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.mtInterpretationAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.mtInterpretationSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.mtInterpretationSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.mtNegativeControlAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.mtNegativeControlAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.mtNegativeControlSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.mtNegativeControlSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.mtPositiveControlAlloreactionIgG = "";
            vm.Test.receiverFlowCytometry.mtPositiveControlAlloreactionIgM = "";
            vm.Test.receiverFlowCytometry.mtSelfreactionIgG = "";
            vm.Test.receiverFlowCytometry.mtSelfreactionIgM = "";
            vm.Test.receiverFlowCytometry.datesamplecollection = null;
            vm.Test.receiverFlowCytometry.trialdate = null;
            vm.Test.receiverFlowCytometry.attachment = undefined;
            vm.Test.receiverFlowCytometry.observation = '';
            vm.Test.receiverFlowCytometry.historical = 1;
            vm.viewattachmentsCIMEInput = false;
            vm.saveattachmentsCIMEInput = {};
            setTimeout(function () {
                document.getElementById('mtNegativeAlloreactionIgG').focus();
            }, 100);
        }
        vm.eventUndoCIME = eventUndoCIME;
        function eventUndoCIME() {
            vm.viewattachmentsCIMEInput = false;
            vm.disablednewCIME = false;
            vm.disabledcontrolCIME = true;
            vm.Test.receiverFlowCytometry = vm.receiverCIMEMolecularcomparated;
            vm.Test.receiverFlowCytometry.historical = 0;
            if (vm.Test.receiverFlowCytometry.attachment !== undefined) {
                vm.attachmentsCIMEInput = [{
                    'filetype': vm.Test.receiverFlowCytometry.attachment.fileType,
                    'filename': vm.Test.receiverFlowCytometry.attachment.name,
                    'base64': vm.Test.receiverFlowCytometry.attachment.file
                }];
            }
        }

        vm.closedadjutedCIME = closedadjutedCIME;
        function closedadjutedCIME() {
            vm.viewattachmentsCIMEInput = false;
            vm.saveattachmentsCIMEInput = {};
        }

        /**
         * PRA LUMINEX-CUANTITATIVO*  
         */

        vm.closedadjutedCUAN = closedadjutedCUAN;
        function closedadjutedCUAN() {
            vm.viewattachmentsCUANInput = false;
            vm.saveattachmentsCUANInput = {};
        }

        vm.historicalCUAN = historicalCUAN;
        function historicalCUAN() {
            vm.loading = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.LististoricalPRA = [];
            vm.LististoricalHLA = [];
            vm.LististoricalCIME = [];
            vm.LististoricalCUAN = [];
            vm.LististoricalAN = [];
            vm.nameTest = 'PRA LUMINEX - CUANTITATIVO';
            return recepctionDS.gethistoricalCUAN(auth.authToken, vm.idTransplant).then(
                function (data) {
                    if (data.status === 200) {
                        if (data.data.length === 0) {
                            logger.info($filter('translate')('3382'));
                            vm.loading = false;
                        } else {
                            vm.tabActive = 4;
                            vm.validatehistoricalAN = 2;
                            var listhytoric = data.data;
                            listhytoric.forEach(function (data) {
                                if (data.attachment !== undefined) {
                                    data.attachment.fileType = validatetype(data.attachment.extension);
                                    data.attachment.base64 = 'data:' + data.attachment.fileType + ';base64,' + data.attachment.file
                                } else {
                                    data.attachment = [];
                                }
                            });
                            vm.LististoricalCUAN = listhytoric;
                            setTimeout(function () {
                                vm.LististoricalCUAN.forEach(function (data) {
                                    if (data.attachment.length !== 0) {
                                        var elemento = document.getElementById(data.id);
                                        elemento.src = data.attachment.base64;
                                    }
                                });
                                vm.loading = false;
                            }, 100);
                        }
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.newCUAN = newCUAN;
        function newCUAN() {
            vm.disablednewCUAN = true;
            vm.disabledcontrolCUAN = false;
            vm.receiverCUANMolecularcomparated = _.clone(vm.Test.receiverPRALuminexCuantitativo);
            vm.Test.receiverPRALuminexCuantitativo.classIType = '1'; //
            vm.Test.receiverPRALuminexCuantitativo.classI = $filter('translate')('0162'); // clase1
            vm.Test.receiverPRALuminexCuantitativo.classIPercentage = 0; //Porcentaje
            vm.Test.receiverPRALuminexCuantitativo.classICorrected = 0; // Corregido
            vm.Test.receiverPRALuminexCuantitativo.classIObservation = "";//Observaciones
            vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableA = "";//A*
            vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableB = "";//b*
            vm.Test.receiverPRALuminexCuantitativo.classIUnacceptableC = "";//c*
            vm.Test.receiverPRALuminexCuantitativo.classIAcceptableA = "";//A1
            vm.Test.receiverPRALuminexCuantitativo.classIAcceptableB = "";//B2
            vm.Test.receiverPRALuminexCuantitativo.classIAcceptableC = "";//C2
            vm.Test.receiverPRALuminexCuantitativo.classIAleloHLAA1 = "";//h ALELO HLA-A1
            vm.Test.receiverPRALuminexCuantitativo.classIAleloHLAA2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIEpletasHLAAImmunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIEpletasHLAAImmunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIAleloHLAB1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIAleloHLAB2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIEpletasHLABImmunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIEpletasHLABImmunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIAleloHLAC1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIAleloHLAC2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIEpletasHLACImmunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIEpletasHLACImmunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classII = $filter('translate')('0162');
            vm.Test.receiverPRALuminexCuantitativo.classIIPercentage = 0;
            vm.Test.receiverPRALuminexCuantitativo.classIICorrected = 0;
            vm.Test.receiverPRALuminexCuantitativo.classIIObservation = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDRB11 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDRB12 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDQA1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDQA2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDQB1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDQB2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDPA1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDPA2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDPB1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIDPB2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADRB11 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADRB12 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADRB1Immunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADRB1Immunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADQA1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADQA2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADQAImmunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADQAImmunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADQB1 = "";//
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADQB2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADQBImmunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADQBImmunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADPA1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADPA2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADPAImmunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADPAImmunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADPB1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIAleloHLADPB2 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADPBImmunizer1 = "";
            vm.Test.receiverPRALuminexCuantitativo.classIIEpletasHLADPBImmunizer2 = "";
            vm.Test.receiverPRALuminexCuantitativo.datesamplecollection = null;
            vm.Test.receiverPRALuminexCuantitativo.trialdate = null;
            vm.Test.receiverPRALuminexCuantitativo.attachment = undefined;
            vm.Test.receiverPRALuminexCuantitativo.historical = 1;
            vm.viewattachmentsCUANInput = false;
            vm.saveattachmentsCUANInput = {};
            setTimeout(function () {
                document.getElementById('classIPRA').focus();
            }, 100);
        }
        vm.eventUndoCUAN = eventUndoCUAN;
        function eventUndoCUAN() {
            vm.viewattachmentsCUANInput = false;
            vm.disablednewCUAN = false;
            vm.disabledcontrolCUAN = true;
            vm.Test.receiverPRALuminexCuantitativo = vm.receiverCUANMolecularcomparated;
            vm.Test.receiverPRALuminexCuantitativo.historical = 0;
            if (vm.Test.receiverPRALuminexCuantitativo.attachment !== undefined) {
                vm.attachmentsCUANInput = [{
                    'filetype': vm.Test.receiverPRALuminexCuantitativo.attachment.fileType,
                    'filename': vm.Test.receiverPRALuminexCuantitativo.attachment.name,
                    'base64': vm.Test.receiverPRALuminexCuantitativo.attachment.file
                }];
            }
        }
        /**
          *  
           PRA LUMINEX-ANTIGENO
          */
        vm.closedadjutedAN = closedadjutedAN;
        function closedadjutedAN() {
            vm.viewattachmentsANInput = false;
            vm.saveattachmentsANInput = {};
        }
        vm.historicalAN = historicalAN;
        function historicalAN() {
            vm.loading = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.LististoricalPRA = [];
            vm.LististoricalHLA = [];
            vm.LististoricalCIME = [];
            vm.LististoricalCUAN = [];
            vm.LististoricalAN = [];
            vm.nameTest = 'PRA LUMINEX - ANTIGENO';
            return recepctionDS.gethistoricalAN(auth.authToken, vm.idTransplant).then(
                function (data) {
                    if (data.status === 200) {
                        if (data.data.length === 0) {
                            logger.info($filter('translate')('3382'));
                            vm.loading = false;
                        } else {
                            vm.tabActive = 4;
                            vm.validatehistoricalAN = 1;
                            var listhytoric = data.data;
                            listhytoric.forEach(function (data) {
                                if (data.attachment !== undefined) {
                                    data.attachment.fileType = validatetype(data.attachment.extension);
                                    data.attachment.base64 = 'data:' + data.attachment.fileType + ';base64,' + data.attachment.file
                                } else {
                                    data.attachment = [];
                                }
                            });
                            vm.LististoricalAN = listhytoric;
                            setTimeout(function () {
                                vm.LististoricalAN.forEach(function (data) {
                                    if (data.attachment.length !== 0) {
                                        var elemento = document.getElementById(data.id);
                                        elemento.src = data.attachment.base64;
                                    }
                                });
                                vm.loading = false;
                            }, 100);
                        }
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.newAN = newAN;
        function newAN() {
            vm.disablednewAN = true;
            vm.disabledcontrolAN = false;
            vm.receiverANcomparated = _.clone(vm.Test.receiverPRALuminexAntigeno);
            vm.Test.receiverPRALuminexAntigeno.classIType = '1'; //
            vm.Test.receiverPRALuminexAntigeno.classI = $filter('translate')('0162'); // clase1
            vm.Test.receiverPRALuminexAntigeno.classIPercentage = 0; //Porcentaje
            vm.Test.receiverPRALuminexAntigeno.classICorrected = 0; // Corregido
            vm.Test.receiverPRALuminexAntigeno.classIObservation = "";//Observaciones
            vm.Test.receiverPRALuminexAntigeno.classIUnacceptableA = "";//A*
            vm.Test.receiverPRALuminexAntigeno.classIUnacceptableB = "";//b*
            vm.Test.receiverPRALuminexAntigeno.classIUnacceptableC = "";//c*
            vm.Test.receiverPRALuminexAntigeno.classIAcceptableA = "";//A1
            vm.Test.receiverPRALuminexAntigeno.classIAcceptableB = "";//B2
            vm.Test.receiverPRALuminexAntigeno.classIAcceptableC = "";//C2
            vm.Test.receiverPRALuminexAntigeno.classIAleloHLAA1 = "";//h ALELO HLA-A1
            vm.Test.receiverPRALuminexAntigeno.classIAleloHLAA2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIEpletasHLAAImmunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIEpletasHLAAImmunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIAleloHLAB1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIAleloHLAB2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIEpletasHLABImmunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIEpletasHLABImmunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIAleloHLAC1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIAleloHLAC2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIEpletasHLACImmunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIEpletasHLACImmunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.classII = $filter('translate')('0162');
            vm.Test.receiverPRALuminexAntigeno.classIIPercentage = 0;
            vm.Test.receiverPRALuminexAntigeno.classIICorrected = 0;
            vm.Test.receiverPRALuminexAntigeno.classIIObservation = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDRB11 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDRB12 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDQA1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDQA2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDQB1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDQB2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDPA1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDPA2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDPB1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIDPB2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADRB11 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADRB12 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADRB1Immunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADRB1Immunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADQA1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADQA2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADQAImmunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADQAImmunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADQB1 = "";//
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADQB2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADQBImmunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADQBImmunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADPA1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADPA2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADPAImmunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADPAImmunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADPB1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIAleloHLADPB2 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADPBImmunizer1 = "";
            vm.Test.receiverPRALuminexAntigeno.classIIEpletasHLADPBImmunizer2 = "";
            vm.Test.receiverPRALuminexAntigeno.datesamplecollection = null;
            vm.Test.receiverPRALuminexAntigeno.trialdate = null;
            vm.Test.receiverPRALuminexAntigeno.attachment = undefined;
            vm.Test.receiverPRALuminexAntigeno.historical = 1;
            vm.viewattachmentsANInput = false;
            vm.saveattachmentsANInput = {};
            setTimeout(function () {
                document.getElementById('classIAN').focus();
            }, 100);
        }
        vm.eventUndoAN = eventUndoAN;
        function eventUndoAN() {
            vm.viewattachmentsANInput = false;
            vm.disablednewAN = false;
            vm.disabledcontrolAN = true;
            vm.Test.receiverPRALuminexAntigeno = vm.receiverANcomparated;
            vm.Test.receiverPRALuminexAntigeno.historical = 0;
            if (vm.Test.receiverPRALuminexAntigeno.attachment !== undefined) {
                vm.attachmentsANInput = [{
                    'filetype': vm.Test.receiverPRALuminexAntigeno.attachment.fileType,
                    'filename': vm.Test.receiverPRALuminexAntigeno.attachment.name,
                    'base64': vm.Test.receiverPRALuminexAntigeno.attachment.file
                }];
            }
        }

        /**
  * Transplant
  */
        vm.EditTransplant = EditTransplant;
        function EditTransplant(transplant) {
            vm.loading = true;
            vm.Test = {};
            vm.new = false;
            vm.edit = true;
            vm.idTransplant = transplant.idTransplant;
            vm.transplantRemision = vm.listremision.institution.name;
            vm.transplantOrgan = transplant.listOrgan.name;
            vm.saveattachmentsHLAInput = {};
            vm.saveattachmentsPRAInput = {};
            vm.saveattachmentsCUANInput = {};
            vm.saveattachmentsANInput = {};
            vm.saveattachmentsCIMEInput = {};
            vm.viewattachmentsHLAInput = false;
            vm.viewattachmentsPRAInput = false;
            vm.viewattachmentsCUANInput = false;
            vm.viewattachmentsCIMEInput = false;
            vm.viewattachmentsANInput = false;
            vm.selectedIndex = 0;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.getTesttransplant(auth.authToken, vm.idTransplant).then(
                function (data) {
                    vm.tabActive = 3;
                    if (data.status === 200) {
                        vm.loading = false;
                        vm.disabledcontrol = true;
                        vm.disablednewHLA = false;
                        vm.disabledcontrolHLA = true;
                        vm.disablednewPRA = false;
                        vm.disabledcontrolPRA = true;
                        vm.disablednewCIME = false;
                        vm.disabledcontrolCIME = true;
                        vm.disablednewCUAN = false;
                        vm.disabledcontrolCUAN = true;
                        vm.disablednewAN = false;
                        vm.disabledcontrolAN = true;
                        vm.Test = data.data;
                        if (vm.Test.receiverHLAMolecular.attachment !== undefined) {
                            vm.Test.receiverHLAMolecular.attachment.fileType = validatetype(vm.Test.receiverHLAMolecular.attachment.extension);
                            vm.saveattachmentsHLAInput = vm.Test.receiverHLAMolecular.attachment;
                            vm.viewattachmentsHLAInput = true;
                            var attachmentsHLA = document.getElementById("attachmentsHLA");
                            attachmentsHLA.src = 'data:' + vm.Test.receiverHLAMolecular.attachment.fileType + ';base64,' + vm.Test.receiverHLAMolecular.attachment.file;
                            attachmentsHLA.type = vm.Test.receiverHLAMolecular.attachment.fileType;
                        }
                        if (vm.Test.receiverPRALuminexCualitativo.attachment !== undefined) {
                            vm.Test.receiverPRALuminexCualitativo.attachment.fileType = validatetype(vm.Test.receiverPRALuminexCualitativo.attachment.extension);
                            vm.saveattachmentsPRAInput = vm.Test.receiverPRALuminexCualitativo.attachment;
                            vm.viewattachmentsPRAInput = true;
                            var attachmentsPRA = document.getElementById("attachmentsPRA");
                            attachmentsPRA.src = 'data:' + vm.Test.receiverPRALuminexCualitativo.attachment.fileType + ';base64,' + vm.Test.receiverPRALuminexCualitativo.attachment.file;
                            attachmentsPRA.type = vm.Test.receiverPRALuminexCualitativo.attachment.fileType;
                        }

                        if (vm.Test.receiverPRALuminexCuantitativo.attachment !== undefined) {
                            vm.Test.receiverPRALuminexCuantitativo.attachment.fileType = validatetype(vm.Test.receiverPRALuminexCuantitativo.attachment.extension);
                            vm.saveattachmentsCUANInput = vm.Test.receiverPRALuminexCuantitativo.attachment;
                            vm.viewattachmentsCUANInput = true;
                            var attachmentsCUAN = document.getElementById("attachmentsCUAN");
                            attachmentsCUAN.src = 'data:' + vm.Test.receiverPRALuminexCuantitativo.attachment.fileType + ';base64,' + vm.Test.receiverPRALuminexCuantitativo.attachment.file;
                            attachmentsCUAN.type = vm.Test.receiverPRALuminexCuantitativo.attachment.fileType;
                        }

                        if (vm.Test.receiverFlowCytometry.attachment !== undefined) {
                            vm.Test.receiverFlowCytometry.attachment.fileType = validatetype(vm.Test.receiverFlowCytometry.attachment.extension);
                            vm.saveattachmentsCIMEInput = vm.Test.receiverFlowCytometry.attachment;
                            vm.viewattachmentsCIMEInput = true;
                            var attachmentsCIME = document.getElementById("attachmentsCIME");
                            attachmentsCIME.src = 'data:' + vm.Test.receiverFlowCytometry.attachment.fileType + ';base64,' + vm.Test.receiverFlowCytometry.attachment.file;
                            attachmentsCIME.type = vm.Test.receiverFlowCytometry.attachment.fileType;
                        }

                        if (vm.Test.receiverPRALuminexAntigeno.attachment !== undefined) {
                            vm.Test.receiverPRALuminexAntigeno.attachment.fileType = validatetype(vm.Test.receiverPRALuminexAntigeno.attachment.extension);
                            vm.saveattachmentsANInput = vm.Test.receiverPRALuminexAntigeno.attachment;
                            vm.viewattachmentsANInput = true;
                            var attachmentsAN = document.getElementById("attachmentsAN");
                            attachmentsAN.src = 'data:' + vm.Test.receiverPRALuminexAntigeno.attachment.fileType + ';base64,' + vm.Test.receiverPRALuminexAntigeno.attachment.file;
                            attachmentsAN.type = vm.Test.receiverPRALuminexAntigeno.attachment.fileType;
                        }
                        
                        vm.Test.receiverTestEntry.dialysisstartdate = vm.Test.receiverTestEntry.dialysisstartdate === undefined ? null : moment(vm.Test.receiverTestEntry.dialysisstartdate).format();
                        vm.Test.receiverTestEntry.transfusiondate = vm.Test.receiverTestEntry.transfusiondate === undefined ? null : moment(vm.Test.receiverTestEntry.transfusiondate).format();
                        vm.Test.receiverTestEntry.previoustransplantdate = vm.Test.receiverTestEntry.previoustransplantdate === undefined ? null : moment(vm.Test.receiverTestEntry.previoustransplantdate).format();
                        vm.Test.receiverTestEntry.dateinclusionwaitinglist = vm.Test.receiverTestEntry.dateinclusionwaitinglist === undefined ? null : moment(vm.Test.receiverTestEntry.dateinclusionwaitinglist).format();
                        vm.Test.receiverHLAMolecular.datesamplecollection = vm.Test.receiverHLAMolecular.datesamplecollection === undefined ? null : moment(vm.Test.receiverHLAMolecular.datesamplecollection).format();
                        vm.Test.receiverHLAMolecular.trialdate = vm.Test.receiverHLAMolecular.trialdate === undefined ? null : moment(vm.Test.receiverHLAMolecular.trialdate).format();
                        vm.Test.receiverPRALuminexCualitativo.datesamplecollection = vm.Test.receiverPRALuminexCualitativo.datesamplecollection === undefined ? null : moment(vm.Test.receiverPRALuminexCualitativo.datesamplecollection).format();
                        vm.Test.receiverPRALuminexCualitativo.trialdate = vm.Test.receiverPRALuminexCualitativo.trialdate === undefined ? null : moment(vm.Test.receiverPRALuminexCualitativo.trialdate).format();
                        vm.Test.receiverPRALuminexCuantitativo.datesamplecollection = vm.Test.receiverPRALuminexCuantitativo.datesamplecollection === undefined ? null : moment(vm.Test.receiverPRALuminexCuantitativo.datesamplecollection).format();
                        vm.Test.receiverPRALuminexCuantitativo.trialdate = vm.Test.receiverPRALuminexCuantitativo.trialdate === undefined ? null : moment(vm.Test.receiverPRALuminexCuantitativo.trialdate).format();
                        vm.Test.receiverPRALuminexAntigeno.datesamplecollection = vm.Test.receiverPRALuminexAntigeno.datesamplecollection === undefined ? null : moment(vm.Test.receiverPRALuminexAntigeno.datesamplecollection).format();
                        vm.Test.receiverPRALuminexAntigeno.trialdate = vm.Test.receiverPRALuminexAntigeno.trialdate === undefined ? null : moment(vm.Test.receiverPRALuminexAntigeno.trialdate).format();
                        vm.Test.receiverFlowCytometry.datesamplecollection = vm.Test.receiverFlowCytometry.datesamplecollection === undefined ? null : moment(vm.Test.receiverFlowCytometry.datesamplecollection).format();
                        vm.Test.receiverFlowCytometry.trialdate = vm.Test.receiverFlowCytometry.trialdate === undefined ? null : moment(vm.Test.receiverFlowCytometry.trialdate).format();
                        setTimeout(function () {
                            document.getElementById('bloodgroup').focus();
                        }, 100);

                    } else if (data.status === 204) {
                        vm.loading = false;
                        vm.newtest(vm.idTransplant);
                        setTimeout(function () {
                            document.getElementById('bloodgroup').focus();
                        }, 100);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        function generateFile(transplant) {
            vm.loading = true;
            vm.idTransplant = transplant.idTransplant;
            vm.Test = {};
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS.getTesttransplant(auth.authToken, vm.idTransplant).then(
                function (data) {
                    if (data.status === 200) {
                        vm.Test = data.data;
                        vm.Test.listremision = vm.listremision;
                        vm.Test.listremision.dateRemission = moment(vm.Test.listremision.dateRemission).format(vm.formatDate.toUpperCase());
                        vm.Test.transplant = transplant;
                        for (var propiedad in vm.patientDemosValues) {
                            if (vm.patientDemosValues.hasOwnProperty(propiedad)) {
                                if (vm.patientDemosValues[propiedad].id === undefined) {
                                    if (vm.patientDemosValues[propiedad] === '') {
                                        vm.Test["demo_" + propiedad + "_valuename"] = '';
                                        vm.Test["demo_" + propiedad + "_valuecode"] = '';
                                    } else {
                                        if (propiedad === "-105") {
                                            vm.Test["demo_age_valuename"] = common.getAgeAsString(moment(vm.patientDemosValues[-105]).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase())
                                        }
                                        vm.Test["demo_" + propiedad + "_valuename"] = vm.patientDemosValues[propiedad];
                                        vm.Test["demo_" + propiedad + "_valuecode"] = '';
                                    }
                                } else if (vm.patientDemosValues[propiedad].id === 0) {
                                    vm.Test["demo_" + propiedad + "_valuename"] = '';
                                    vm.Test["demo_" + propiedad + "_valuecode"] = '';
                                } else {
                                    vm.Test["demo_" + propiedad + "_valuename"] = vm.patientDemosValues[propiedad].name;
                                    vm.Test["demo_" + propiedad + "_valuecode"] = vm.patientDemosValues[propiedad].code;
                                }
                            }
                        }

                        if (vm.Test.receiverHLAMolecular.attachment !== undefined) {
                            vm.Test.receiverHLAMolecular.attachment.fileType = validatetype(vm.Test.receiverHLAMolecular.attachment.extension);
                            vm.Test.receiverHLAMolecular.attachment.src = 'data:' + vm.Test.receiverHLAMolecular.attachment.fileType + ';base64,' + vm.Test.receiverHLAMolecular.attachment.file;
                            vm.Test.receiverHLAMolecular.attachment.type = vm.Test.receiverHLAMolecular.attachment.fileType;
                        } else {
                            vm.Test.receiverHLAMolecular.attachment = { 'src': '' };
                        }
                        if (vm.Test.receiverPRALuminexCualitativo.attachment !== undefined) {
                            vm.Test.receiverPRALuminexCualitativo.attachment.fileType = validatetype(vm.Test.receiverPRALuminexCualitativo.attachment.extension);
                            vm.Test.receiverPRALuminexCualitativo.attachment.src = 'data:' + vm.Test.receiverPRALuminexCualitativo.attachment.fileType + ';base64,' + vm.Test.receiverPRALuminexCualitativo.attachment.file;
                            vm.Test.receiverPRALuminexCualitativo.attachment.type = vm.Test.receiverPRALuminexCualitativo.attachment.fileType;
                        } else {
                            vm.Test.receiverPRALuminexCualitativo.attachment = { 'src': '' }
                        }

                        if (vm.Test.receiverPRALuminexCuantitativo.attachment !== undefined) {
                            vm.Test.receiverPRALuminexCuantitativo.attachment.fileType = validatetype(vm.Test.receiverPRALuminexCuantitativo.attachment.extension);
                            vm.Test.receiverPRALuminexCuantitativo.attachment.src = 'data:' + vm.Test.receiverPRALuminexCuantitativo.attachment.fileType + ';base64,' + vm.Test.receiverPRALuminexCuantitativo.attachment.file;
                            vm.Test.receiverPRALuminexCuantitativo.attachment.type = vm.Test.receiverPRALuminexCuantitativo.attachment.fileType;
                        }
                        else {
                            vm.Test.receiverPRALuminexCuantitativo.attachment = { 'src': '' }
                        }

                        if (vm.Test.receiverFlowCytometry.attachment !== undefined) {
                            vm.Test.receiverFlowCytometry.attachment.fileType = validatetype(vm.Test.receiverFlowCytometry.attachment.extension);
                            vm.Test.receiverFlowCytometry.attachment.src = 'data:' + vm.Test.receiverFlowCytometry.attachment.fileType + ';base64,' + vm.Test.receiverFlowCytometry.attachment.file;
                            vm.Test.receiverFlowCytometry.attachment.type = vm.Test.receiverFlowCytometry.attachment.fileType;
                        }
                        else {
                            vm.Test.receiverFlowCytometry.attachment = { 'src': '' }
                        }

                        if (vm.Test.receiverPRALuminexAntigeno.attachment !== undefined) {
                            vm.Test.receiverPRALuminexAntigeno.attachment.fileType = validatetype(vm.Test.receiverPRALuminexAntigeno.attachment.extension);
                            vm.Test.receiverPRALuminexAntigeno.attachment.src = 'data:' + vm.Test.receiverPRALuminexAntigeno.attachment.fileType + ';base64,' + vm.Test.receiverPRALuminexAntigeno.attachment.file;
                            vm.Test.receiverPRALuminexAntigeno.attachment.type = vm.Test.receiverPRALuminexAntigeno.attachment.fileType;
                        }
                        else {
                            vm.Test.receiverPRALuminexAntigeno.attachment = { 'src': '' }
                        }

                        vm.Test.receiverTestEntry.dialysisstartdate = vm.Test.receiverTestEntry.dialysisstartdate === undefined ? null : moment(vm.Test.receiverTestEntry.dialysisstartdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverTestEntry.transfusiondate = vm.Test.receiverTestEntry.transfusiondate === undefined ? null : moment(vm.Test.receiverTestEntry.transfusiondate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverTestEntry.previoustransplantdate = vm.Test.receiverTestEntry.previoustransplantdate === undefined ? null : moment(vm.Test.receiverTestEntry.previoustransplantdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverTestEntry.dateinclusionwaitinglist = vm.Test.receiverTestEntry.dateinclusionwaitinglist === undefined ? null : moment(vm.Test.receiverTestEntry.dateinclusionwaitinglist).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverHLAMolecular.datesamplecollection = vm.Test.receiverHLAMolecular.datesamplecollection === undefined ? null : moment(vm.Test.receiverHLAMolecular.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverHLAMolecular.trialdate = vm.Test.receiverHLAMolecular.trialdate === undefined ? null : moment(vm.Test.receiverHLAMolecular.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCualitativo.datesamplecollection = vm.Test.receiverPRALuminexCualitativo.datesamplecollection === undefined ? null : moment(vm.Test.receiverPRALuminexCualitativo.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCualitativo.trialdate = vm.Test.receiverPRALuminexCualitativo.trialdate === undefined ? null : moment(vm.Test.receiverPRALuminexCualitativo.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCuantitativo.datesamplecollection = vm.Test.receiverPRALuminexCuantitativo.datesamplecollection === undefined ? null : moment(vm.Test.receiverPRALuminexCuantitativo.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexCuantitativo.trialdate = vm.Test.receiverPRALuminexCuantitativo.trialdate === undefined ? null : moment(vm.Test.receiverPRALuminexCuantitativo.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexAntigeno.datesamplecollection = vm.Test.receiverPRALuminexAntigeno.datesamplecollection === undefined ? null : moment(vm.Test.receiverPRALuminexAntigeno.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverPRALuminexAntigeno.trialdate = vm.Test.receiverPRALuminexAntigeno.trialdate === undefined ? null : moment(vm.Test.receiverPRALuminexAntigeno.trialdate).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverFlowCytometry.datesamplecollection = vm.Test.receiverFlowCytometry.datesamplecollection === undefined ? null : moment(vm.Test.receiverFlowCytometry.datesamplecollection).format(vm.formatDate.toUpperCase());
                        vm.Test.receiverFlowCytometry.trialdate = vm.Test.receiverFlowCytometry.trialdate === undefined ? null : moment(vm.Test.receiverFlowCytometry.trialdate).format(vm.formatDate.toUpperCase());
                        vm.print([vm.Test]);
                    } else if (data.status === 204) {
                        vm.Test = newJsontest(idTransplant);
                        vm.Test.listremision = vm.listremision;
                        vm.Test.transplant = transplant;
                        for (var propiedad in vm.patientDemosValues) {
                            if (vm.patientDemosValues.hasOwnProperty(propiedad)) {
                                if (vm.patientDemosValues[propiedad].id === undefined) {
                                    if (vm.patientDemosValues[propiedad] === '') {
                                        vm.Test["demo_" + propiedad + "_valuename"] = '';
                                        vm.Test["demo_" + propiedad + "_valuecode"] = '';
                                    } else {
                                        if (propiedad === '-105') {
                                            vm.Test["demo_age_valuename"] = common.getAgeAsString(moment(vm.patientDemosValues[-105]).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase())
                                        }
                                        vm.Test["demo_" + propiedad + "_valuename"] = vm.patientDemosValues[propiedad];
                                        vm.Test["demo_" + propiedad + "_valuecode"] = '';
                                    }
                                } else if (vm.patientDemosValues[propiedad].id === 0) {
                                    vm.Test["demo_" + propiedad + "_valuename"] = '';
                                    vm.Test["demo_" + propiedad + "_valuecode"] = '';
                                } else {
                                    vm.Test["demo_" + propiedad + "_valuename"] = vm.patientDemosValues[propiedad].name;
                                    vm.Test["demo_" + propiedad + "_valuecode"] = vm.patientDemosValues[propiedad].code;
                                }
                            }
                        }
                        vm.print([vm.Test]);
                    }
                },
                function (error) {
                    vm.loading = false;
                    vm.modalError(error);
                }
            );
        }
        vm.print = print;
        //** Método  para imprimir el reporte**//
        function print(Test) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.variables = {
                'date': moment().format(vm.formatDate.toUpperCase() + ' HH:mm:ss'),
                'abbreviation': localStorageService.get("Abreviatura"),
                'entity': localStorageService.get("Entidad"),
                'username': auth.userName
            }
            vm.datareport = Test;
            vm.pathreport = '/Reportransplants/receivers/transplants/transplants.mrt';
            vm.openreport = false;
            vm.report = false;
            vm.loading = false;
            vm.windowOpenReport();
        }
        // función para ver pdf el reporte detallado del error
        function windowOpenReport() {
            var parameterReport = {};
            parameterReport.variables = vm.variables;
            parameterReport.pathreport = vm.pathreport;
            parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
            var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
            localStorageService.set('parameterReport', parameterReport);
            localStorageService.set('dataReport', datareport);
            window.open('/viewreport/viewreport.html');
        }
        vm.eventUndoTest = eventUndoTest;
        function eventUndoTest() {
            vm.tabActive = 2;
        }
        vm.eventUndoTransplant = eventUndoTransplant;
        function eventUndoTransplant(transplant) {
            if (transplant.idTransplant === -1) {
                vm.listTransplant = _.filter(_.clone(vm.listTransplant), function (o) { return -1 !== o.idTransplant; })
            }
            if (vm.listTransplant.length !== 0) {
                vm.listTransplant.forEach(function (dataOrgan) {
                    dataOrgan.DisabledEditremision = false;
                    dataOrgan.DisabledCancelremision = false;
                });
            }
        }
        vm.saveTransplant = saveTransplant;
        function saveTransplant(transplant) {
            vm.loading = true;
            transplant.requeridorgan = false;
            if (transplant.listOrgan.id === 0) {
                transplant.requeridorgan = true;
                vm.loading = false;
            }
            if (!transplant.requeridorgan) {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                var receiverpatient = {
                    "idRemission": vm.listremision.idRemmision,
                    "organ": transplant.listOrgan.id
                }
                transplant.edit = false;
                if (vm.listTransplant.length !== 0) {
                    vm.listTransplant.forEach(function (dataOrgan) {
                        dataOrgan.DisabledEditremision = false;
                        dataOrgan.DisabledCancelremision = false;
                    });
                }
                return recepctionDS.newtranplantpatient(auth.authToken, receiverpatient).then(
                    function (data) {
                        vm.loading = false;
                        if (data.status === 200) {
                            transplant.idTransplant = data.data.idTransplant;
                            vm.transplantRemision = vm.listremision.institution.name
                            vm.transplantOrgan = transplant.listOrgan.name;
                            vm.newtest(data.data.idTransplant);
                            var listchangue = _.filter(vm.ListOrder, function (o) { return o.id === parseInt(vm.patientDemosValues[vm.staticDemoIds['patientDB']]) });
                            var insertdata = {
                                detailRemission: {
                                    institution: { name: vm.listremision.institution.name }
                                },
                                organ: transplant.listOrgan.id,
                                nameorgan: transplant.listOrgan.name,
                            }
                            listchangue[0].listTransplant.add(insertdata);
                        }
                    },
                    function (error) {
                        vm.loading = false;
                        vm.modalError(error);
                    }
                );
            }
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
        /**
        * Obtiene los datos del formulario asociados al paciente
        */
        function getPatientData() {
            var patient = {};
            var patientDemographics = [];
            vm.patientDemos.forEach(function (demo, index) {
                if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
                    if (demo.encoded) {
                        if (demo.id === vm.staticDemoIds['documentType']) {
                            patient.documentType = {
                                'id': vm.patientDemosValues[demo.id].id
                            };
                        } else if (demo.id === vm.staticDemoIds['sex']) {
                            patient.sex = {
                                'id': vm.patientDemosValues[demo.id].id
                            };
                        } else if (demo.id === vm.staticDemoIds['race']) {
                            if (typeof vm.patientDemosValues[demo.id] === 'object' && vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                                patient.race = {
                                    'id': vm.patientDemosValues[demo.id].id
                                };
                            } else {
                                patient.race = null;
                            }
                        } else {
                            if (typeof vm.patientDemosValues[demo.id] === 'object' && vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                                patientDemographics.push({
                                    'idDemographic': demo.id,
                                    'encoded': true,
                                    'notCodifiedValue': '',
                                    'codifiedId': vm.patientDemosValues[demo.id].id
                                });
                            }
                        }
                    } else {
                        if (demo.id !== vm.staticDemoIds['age']) {
                            if (demo.id === vm.staticDemoIds['patientDB']) {
                                patient.id = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['patientId']) {
                                patient.patientId = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['lastName']) {
                                patient.lastName = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['surName']) {
                                patient.surName = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null);
                            } else if (demo.id === vm.staticDemoIds['name1']) {
                                patient.name1 = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['name2']) {
                                patient.name2 = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null);
                            } else if (demo.id === vm.staticDemoIds['birthday']) {
                                var birthday = moment(vm.patientDemosValues[demo.id], vm.formatDate.toUpperCase()).valueOf();
                                if (isNaN(birthday)) {
                                    var datebirthday = moment(vm.patientDemosValues[demo.id]).format(vm.formatDate.toUpperCase());
                                    var birthday = moment(datebirthday, vm.formatDate.toUpperCase()).valueOf()
                                }
                                patient.birthday = birthday;
                            } else if (demo.id === vm.staticDemoIds['email']) {
                                patient.email = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['weight']) {
                                patient.weight = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['size']) {
                                patient.size = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['phone']) {
                                patient.phone = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['address']) {
                                patient.address = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else {
                                if (demo.date === true) {
                                    if (vm.patientDemosValues[demo.id] !== '') {
                                        var format = demo.format === '' ? vm.formatDate.toUpperCase() : demo.format.toUpperCase();
                                        vm.patientDemosValues[demo.id] = moment(vm.patientDemosValues[demo.id]).format(format);
                                    }
                                }
                                if (vm.patientDemosValues[demo.id] !== undefined && vm.patientDemosValues[demo.id] !== '' && vm.patientDemosValues[demo.id] !== null) {
                                    patientDemographics.push({
                                        'idDemographic': demo.id,
                                        'encoded': false,
                                        'notCodifiedValue': vm.patientDemosValues[demo.id],
                                        'codifiedId': ''
                                    });
                                } else {
                                    if (demo.id === vm.staticDemoIds['surName']) {
                                        patient.surName = '';
                                    } else if (demo.id === vm.staticDemoIds['name1']) {
                                        patient.name1 = '';
                                    } else if (demo.id === vm.staticDemoIds['email']) {
                                        patient.email = '';
                                    } else {
                                        patientDemographics.push({
                                            'idDemographic': demo.id,
                                            'encoded': false,
                                            'notCodifiedValue': '',
                                            'codifiedId': ''
                                        });
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (demo.id === -997) {
                        patient.diagnostic = (vm.patientDemosValues[demo.id] !== undefined && vm.patientDemosValues[demo.id] !== '' ? vm.patientDemosValues[demo.id] : []);
                    } else if (demo.id === vm.staticDemoIds['surName']) {
                        patient.surName = '';
                    } else if (demo.id === vm.staticDemoIds['name1']) {
                        patient.name1 = '';
                    } else if (demo.id === vm.staticDemoIds['email']) {
                        patient.email = '';
                    } else if (demo.id === vm.staticDemoIds['phone']) {
                        patient.phone = '';
                    } else if (demo.id === vm.staticDemoIds['address']) {
                        patient.address = '';
                    } else if (demo.id > 0) {
                        patientDemographics.push({
                            'idDemographic': demo.id,
                            'encoded': demo.encoded,
                            'notCodifiedValue': '',
                            'codifiedId': ''
                        });
                    }
                }
            });
            if (patient.documentType === undefined) {
                patient.documentType = {
                    'id': 1
                };
            }
            patient.demographics = patientDemographics;
            return patient;
        }
        vm.eventSave = eventSave;
        function eventSave(edit) {
            vm.loading = true;
            vm.editPatient = edit;
            if (validateForm()) {
                //Se obtiene la informacion del paciente
                var patient = getPatientData();
                if (vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== null && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== undefined && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== '') {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Invoca el servicio que actualiza el paciente                    
                    patient.id = vm.patientDemosValues[vm.staticDemoIds['patientDB']];
                    patientDS.updatePatient(auth.authToken, patient).then(function (data) {
                        if (data.status === 200) {
                            logger.success($filter('translate')('0671'));
                            vm.savephotopatient(vm.patientDemosValues[vm.staticDemoIds['patientDB']]);
                            afterSavePatient(data.data);
                        } else {
                            vm.loading = false;
                            logger.warning($filter('translate')('0673'));
                        }
                    }, function (error) {
                        if (error.data !== null) {
                            vm.loading = false;
                            if (error.data.code === 2) {
                                error.data.errorFields.forEach(function (value) {
                                    var item = value.split('|');
                                    if (item[0] === '0' && item[1] === 'Patient exists') {
                                        logger.warning($filter('translate')('0672'));
                                        //vm.cleanform = 1;
                                        vm.statepatient = 5;
                                    }
                                });
                            }
                        } else {
                            vm.loading = false;
                            vm.modalError(error);
                        }
                    });
                } else {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Invoca el servicio que crea el paciente
                    patientDS.insertPatient(auth.authToken, patient).then(function (data) {
                        if (data.status === 200) {
                            logger.success($filter('translate')('0670'));
                            vm.savephotopatient(data.data.id);
                            afterSavePatient(data.data);
                        }
                    }, function (error) {
                        if (error.data !== null) {
                            vm.loading = false;
                            if (error.data.code === 2) {
                                error.data.errorFields.forEach(function (value) {
                                    var item = value.split('|');
                                    if (item[0] === '0' && item[1] === 'Patient already exists') {
                                        logger.warning('El paciente ya existe!');
                                        //vm.cleanform = 1;
                                        vm.statepatient = 5;
                                    }
                                });
                            }
                        } else {
                            vm.loading = false;
                            vm.modalError(error);
                        }
                    });
                }

            } else {
                vm.loading = false;
                logger.warning($filter('translate')('0663'));
            }
        }
        /**
     * Se ejecuta despues de guardada o modificada la orden
     * @param {*} response Objeto de respuesta enviado desde el servidor
     */
        function afterSavePatient(response) {
            vm.dataresponsePatient = response;
            vm.patientDemosDisabled = disabledAllDemo(vm.patientDemosDisabled, true);
            if (vm.editPatient === 1) {
                vm.patientDemosValues[vm.staticDemoIds['patientDB']] = vm.dataresponsePatient.id;
                if (vm.historyautomatic) {
                    vm.patientDemosValues[vm.staticDemoIds['patientId']] = vm.dataresponsePatient.id;
                }
                vm.patientDemosValues[-99] = vm.dataresponsePatient.id;
                if (vm.listremision.idRemmision === -1) {
                    vm.focusinstitution = true;
                }
                vm.loading = false;
            } else {
                var newreceiver = {
                    "id": response.id
                };
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                recepctionDS.newreceiverpatient(auth.authToken, newreceiver).then(
                    function (data) {
                        var patientadd = {
                            "id": vm.dataresponsePatient.id,
                            "patientId": vm.patientDemosValues[-100],
                            "name1": vm.patientDemosValues[-103],
                            "name2": vm.patientDemosValues[-109],
                            "lastName": vm.patientDemosValues[-101],
                            "surName": vm.patientDemosValues[-102],
                            "birthday": vm.dataresponsePatient.birthday,
                            "documentType": vm.patientDemosValues[-10],
                            "listTransplant": [],
                            "age": common.getAgeAsString(moment(vm.dataresponsePatient.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase())
                        }
                        patientadd.documentType.abbr = patientadd.documentType.code;
                        vm.ListOrder.push(patientadd);
                        if (data.status === 200) {
                            vm.tabActive = 2;
                            vm.patientDemosValues[vm.staticDemoIds['patientDB']] = vm.dataresponsePatient.id;
                            if (vm.historyautomatic) {
                                vm.patientDemosValues[vm.staticDemoIds['patientId']] = vm.dataresponsePatient.id;
                            }
                            //Deshabilita los controles de ingreso de datos
                            vm.patientDemosValues[-99] = vm.dataresponsePatient.id;
                            vm.editDisabled = false;
                            vm.saveDisabled = true;
                            setTimeout(function () {
                                vm.focusinstitution = true;
                            }, 200);
                            vm.loading = false;
                        }
                    }, function (error) {
                        vm.modalError(error);
                        vm.loading = false;
                    });
            }
        }
        vm.savephotopatient = savephotopatient;
        function savephotopatient(id) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');

            var datapatient = {
                'id': id,
                'photoInBase64': vm.patientPhoto
            };
            patientDS.insertphotopatient(auth.authToken, datapatient).then(
                function (response) { });
        }

        /**
    * Valida que el ingreso esta correcto para guardar la orden
    */
        function validateForm() {
            var fieldsComplete = true;
            vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
                if (demo.obligatory === 1) {
                    if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
                        if (demo.encoded) {
                            if (typeof vm.patientDemosValues[demo.id] !== 'object') {
                                demo.showRequired = true;
                                fieldsComplete = false;
                            } else {
                                if (!vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                                    demo.showRequired = true;
                                    fieldsComplete = false;
                                } else if (vm.patientDemosValues[demo.id].id === undefined) {
                                    demo.showRequired = true;
                                    fieldsComplete = false;
                                }
                            }
                        } else {
                            if (demo.date === true && vm.patientDemosValues[demo.id] !== null && demo.date === true && vm.patientDemosValues[demo.id] !== '') {

                            } else if (demo.date === true && vm.patientDemosValues[demo.id] === null || demo.date === true && vm.patientDemosValues[demo.id] === '' || demo.date === true && vm.patientDemosValues[demo.id] === 'Invalid date') {
                                demo.showRequired = true;
                                fieldsComplete = false;
                            } else if (vm.patientDemosValues[demo.id] === undefined || vm.patientDemosValues[demo.id].trim() === '') {
                                demo.showRequired = true;
                                fieldsComplete = false;
                            }
                        }
                    } else if (demo.id === -111 && vm.maskphone !== '' && vm.patientDemosValues[demo.id] !== undefined) {
                        if (vm.patientDemosValues[demo.id].length < vm.maskphone.length) {
                            demo.showInvalidmask = true;
                        } else {
                            demo.showInvalidmask = false;
                        }
                    }
                }
            });
            return fieldsComplete;
        }

        vm.selectedPatientId = selectedPatientId;
        function selectedPatientId() {
            vm.loading = true;
            var searchById_DB = vm.historyautomatic ? 'patientDB' : 'patientId';
            vm.patientId = vm.patientDemosValues[vm.staticDemoIds[searchById_DB]];
            if (vm.patientId.toString().trim() !== '') {
                vm.documentType = vm.patientDemosValues[vm.staticDemoIds['documentType']];
                var idDocumentType = 0;

                var patientDemosValues = {};
                if (!vm.historyautomatic) {

                    if (vm.typedocument === true) {
                        idDocumentType = vm.documentType.id;
                    } else {
                        idDocumentType = 1
                    }
                }
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                patientDS.getPatientbyIddocument(auth.authToken, vm.patientId, idDocumentType).then(function (response) {
                    vm.viewphoto = true;
                    vm.patientDemosDisabled.photo = true;
                    vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, response.data.length > 0);
                    vm.editDisabled = response.data.length === 0;
                    vm.newsaveDisabled = false;
                    vm.neweventUndoDisabled = false;
                    if (response.data.length > 0) {
                        vm.listpatientid = response.data;
                        var datareception = {
                            "typeFilter": 1,
                            "patientId": vm.patientId
                        }
                        if (vm.documentType !== '') {
                            datareception.documentType = { "id": vm.documentType.id }
                        }
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        return recepctionDS
                            .getreceiverpatient(auth.authToken, datareception)
                            .then(
                                function (data) {
                                    vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
                                    vm.listpatientid.forEach(function (demographic, index) {
                                        if (demographic.encoded) {
                                            patientDemosValues[demographic.idDemographic] = {
                                                'id': demographic.codifiedId,
                                                'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                                                'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                                                'showValue': demographic.value !== undefined ? demographic.value : ''
                                            };
                                        } else {
                                            patientDemosValues[demographic.idDemographic] = demographic.value;
                                            if (demographic.idDemographic == vm.staticDemoIds['birthday']) {
                                                //Si el demografico es la fecha de nacimiento calcula la edad
                                                patientDemosValues[vm.staticDemoIds['age']] = common.getAge(demographic.value, vm.formatDate.toUpperCase());
                                            }
                                        }
                                    });
                                    vm.patientDemosValues = patientDemosValues;
                                    vm.patientDemosDisabled.photo = true;
                                    if (data.data.length !== 0) {
                                        if (data.data[0].listTransplant.length !== 0) {
                                            data.data[0].listTransplant.forEach(function (dataOrgan) {
                                                dataOrgan.remision = {
                                                    id: dataOrgan.idRemission,
                                                    code: dataOrgan.detailRemission.institution.code,
                                                    name: dataOrgan.detailRemission.institution.name,
                                                }
                                                if (dataOrgan.organ === 1) {
                                                    dataOrgan.nameorgan = vm.organ[0].name;
                                                } else if (dataOrgan.organ === 2) {
                                                    dataOrgan.nameorgan = vm.organ[1].name;
                                                } else if (dataOrgan.organ === 3) {
                                                    dataOrgan.nameorgan = vm.organ[2].name;
                                                } else if (dataOrgan.organ === 4) {
                                                    dataOrgan.nameorgan = vm.organ[3].name;
                                                } else if (dataOrgan.organ === 5) {
                                                    dataOrgan.nameorgan = vm.organ[4].name;
                                                } else if (dataOrgan.organ === 6) {
                                                    dataOrgan.nameorgan = vm.organ[5].name;
                                                } else if (dataOrgan.organ === 7) {
                                                    dataOrgan.nameorgan = vm.organ[6].name;
                                                } else if (dataOrgan.organ === 8) {
                                                    dataOrgan.nameorgan = vm.organ[7].name;
                                                } else if (dataOrgan.organ === 9) {
                                                    dataOrgan.nameorgan = vm.organ[8].name;
                                                } else if (dataOrgan.organ === 10) {
                                                    dataOrgan.nameorgan = vm.organ[9].name;
                                                } else if (dataOrgan.organ === 11) {
                                                    dataOrgan.nameorgan = vm.organ[10].name;
                                                } else if (dataOrgan.organ === 12) {
                                                    dataOrgan.nameorgan = vm.organ[11].name;
                                                } else if (dataOrgan.organ === 13) {
                                                    dataOrgan.nameorgan = vm.organ[12].name;
                                                }
                                                dataOrgan.listOrgan = {
                                                    'id': dataOrgan.organ,
                                                    'name': dataOrgan.nameorgan
                                                }
                                            });
                                        } else {
                                            vm.focusinstitution = true;
                                        }
                                        vm.listTransplant = data.data[0].listTransplant;
                                        vm.listorganTransplant = _.clone(vm.organ);
                                        //validar para poner las remisiones y trasplante
                                        vm.tabActive = 2;
                                        vm.saveDisabled = true;
                                        vm.editDisabled = false;
                                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                        vm.listremision = {
                                            "idRemmision": -1,
                                            "institution": {
                                                "id": 0,
                                                "requerid": false
                                            },
                                            "physician": '',
                                            "insurance": {
                                                "id": 0,
                                                "requerid": false
                                            },
                                            "dateRemission": new Date(),
                                            "edit": true
                                        };
                                        vm.requeridphysyian
                                        vm.btneditremission = true;
                                        vm.btnsaveremission = false;
                                        return recepctionDS.getinsuranceidremission(auth.authToken, vm.patientDemosValues[vm.staticDemoIds['patientDB']]).then(
                                            function (response) {
                                                vm.loading = false;
                                                if (response.status === 200) {
                                                    var institution = {
                                                        id: response.data[0].institution.id,
                                                        code: response.data[0].institution.code,
                                                        name: response.data[0].institution.name,
                                                        requerid: false,
                                                    }
                                                    response.data[0].institution = {
                                                        id: response.data[0].institution.id,
                                                        code: response.data[0].institution.code,
                                                        name: response.data[0].institution.name,
                                                        requerid: false,
                                                        selected: institution
                                                    }
                                                    var insurance = {
                                                        id: response.data[0].insurance.id,
                                                        code: response.data[0].insurance.code,
                                                        name: response.data[0].insurance.name,
                                                    }
                                                    response.data[0].insurance = {
                                                        id: response.data[0].insurance.id,
                                                        code: response.data[0].insurance.code,
                                                        name: response.data[0].insurance.name,
                                                        requerid: false,
                                                        selected: insurance
                                                    }
                                                    vm.requeridphysyian = false;
                                                    vm.listremision = response.data[0];
                                                    vm.btneditremission = false;
                                                    vm.btnsaveremission = true;
                                                }
                                            },
                                            function (error) {
                                                vm.loading = false;
                                                vm.modalError(error);
                                            }
                                        );
                                    } else {
                                        vm.requeridphysyian = false
                                        vm.patientDemosDisabled.photo = true;
                                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
                                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
                                        setTimeout(function () {
                                            document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
                                        }, 100);
                                        vm.listorganTransplant = _.clone(vm.organ);
                                        vm.listTransplant = [];
                                        vm.listremision = {
                                            "idRemmision": -1,
                                            "institution": {
                                                "id": 0,
                                                "requerid": false
                                            },
                                            "physician": '',
                                            "insurance": {
                                                "id": 0,
                                                "requerid": false
                                            },
                                            "dateRemission": new Date(),
                                            "edit": true
                                        };
                                        vm.btneditremission = true;
                                        vm.btnsaveremission = false;
                                        vm.focusinstitution = true;
                                        vm.loading = false;
                                    }
                                },
                                function (error) {
                                    vm.modalError(error);
                                    vm.loadingdata = false;
                                }
                            );

                    } else {
                        vm.cleanAllDemos();
                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
                        setTimeout(function () {
                            document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
                        }, 100);
                        vm.listorganTransplant = _.clone(vm.organ);
                        vm.listTransplant = [];
                        vm.listremision = {
                            "idRemmision": -1,
                            "institution": {
                                "id": 0,
                                "requerid": false
                            },
                            "physician": '',
                            "insurance": {
                                "id": 0,
                                "requerid": false
                            },
                            "dateRemission": new Date(),
                            "edit": true
                        };
                        vm.requeridphysyian = false;
                        vm.btneditremission = true;
                        vm.btnsaveremission = false;
                        vm.loading = false;
                    }

                }, function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
            }

        }

        vm.editrecepcion = editrecepcion;
        function editrecepcion(recepcion) {
            vm.newreceptor = 'Editar receptor';
            vm.loadingdata = true;
            vm.patientId = vm.historyautomatic ? recepcion.id : recepcion.patientId;
            if (vm.patientId.toString().trim() !== '') {
                vm.documentType = recepcion.documentType;
                var idDocumentType = 0;
                var patientDemosValues = {};
                if (!vm.historyautomatic) {
                    if (vm.typedocument === true) {
                        idDocumentType = vm.documentType.id;
                    } else {
                        idDocumentType = 1
                    }
                }
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                patientDS.getPatientbyIddocument(auth.authToken, vm.patientId, idDocumentType).then(function (response) {
                    vm.viewphoto = true;
                    vm.patientDemosDisabled.photo = true;
                    vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, response.data.length > 0);
                    vm.editDisabled = response.data.length === 0;
                    vm.newsaveDisabled = false;
                    vm.neweventUndoDisabled = false;
                    if (response.data.length > 0) {
                        vm.listpatientid = response.data;
                        var datareception = {
                            "typeFilter": 1,
                            "patientId": vm.patientId
                        }
                        if (vm.documentType !== '') {
                            datareception.documentType = { "id": vm.documentType.id }
                        }
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        return recepctionDS
                            .getreceiverpatient(auth.authToken, datareception)
                            .then(
                                function (data) {
                                    vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
                                    vm.listpatientid.forEach(function (demographic, index) {
                                        if (demographic.encoded) {
                                            patientDemosValues[demographic.idDemographic] = {
                                                'id': demographic.codifiedId,
                                                'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                                                'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                                                'showValue': demographic.value !== undefined ? demographic.value : ''
                                            };
                                        } else {
                                            patientDemosValues[demographic.idDemographic] = demographic.value;
                                            if (demographic.idDemographic == vm.staticDemoIds['birthday']) {
                                                //Si el demografico es la fecha de nacimiento calcula la edad
                                                patientDemosValues[vm.staticDemoIds['age']] = common.getAge(demographic.value, vm.formatDate.toUpperCase());
                                            }
                                        }
                                    });
                                    vm.patientDemosValues = patientDemosValues;
                                    vm.patientDemosDisabled.photo = true;
                                    if (data.data.length !== 0) {
                                        if (data.data[0].listTransplant.length !== 0) {
                                            data.data[0].listTransplant.forEach(function (dataOrgan) {
                                                dataOrgan.remision = {
                                                    id: dataOrgan.idRemission,
                                                    code: dataOrgan.detailRemission.institution.code,
                                                    name: dataOrgan.detailRemission.institution.name,
                                                }
                                                if (dataOrgan.organ === 1) {
                                                    dataOrgan.nameorgan = vm.organ[0].name;
                                                } else if (dataOrgan.organ === 2) {
                                                    dataOrgan.nameorgan = vm.organ[1].name;
                                                } else if (dataOrgan.organ === 3) {
                                                    dataOrgan.nameorgan = vm.organ[2].name;
                                                } else if (dataOrgan.organ === 4) {
                                                    dataOrgan.nameorgan = vm.organ[3].name;
                                                } else if (dataOrgan.organ === 5) {
                                                    dataOrgan.nameorgan = vm.organ[4].name;
                                                } else if (dataOrgan.organ === 6) {
                                                    dataOrgan.nameorgan = vm.organ[5].name;
                                                } else if (dataOrgan.organ === 7) {
                                                    dataOrgan.nameorgan = vm.organ[6].name;
                                                } else if (dataOrgan.organ === 8) {
                                                    dataOrgan.nameorgan = vm.organ[7].name;
                                                } else if (dataOrgan.organ === 9) {
                                                    dataOrgan.nameorgan = vm.organ[8].name;
                                                } else if (dataOrgan.organ === 10) {
                                                    dataOrgan.nameorgan = vm.organ[9].name;
                                                } else if (dataOrgan.organ === 11) {
                                                    dataOrgan.nameorgan = vm.organ[10].name;
                                                } else if (dataOrgan.organ === 12) {
                                                    dataOrgan.nameorgan = vm.organ[11].name;
                                                } else if (dataOrgan.organ === 13) {
                                                    dataOrgan.nameorgan = vm.organ[12].name;
                                                }
                                                dataOrgan.listOrgan = {
                                                    'id': dataOrgan.organ,
                                                    'name': dataOrgan.nameorgan
                                                }
                                            });
                                        }
                                        vm.listTransplant = data.data[0].listTransplant;
                                        vm.listorganTransplant = _.clone(vm.organ);
                                        //validar para poner las remisiones y trasplante
                                        vm.tabActive = 2;
                                        vm.saveDisabled = true;
                                        vm.editDisabled = false;
                                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                                        vm.listremision = {
                                            "idRemmision": -1,
                                            "institution": {
                                                "id": 0,
                                                requerid: false,
                                            },
                                            "physician": '',
                                            "insurance": {
                                                "id": 0,
                                                requerid: false,
                                            },
                                            "dateRemission": new Date(),
                                            "edit": true
                                        };
                                        vm.requeridphysyian = false;
                                        vm.btneditremission = true;
                                        vm.btnsaveremission = false;
                                        return recepctionDS.getinsuranceidremission(auth.authToken, recepcion.id).then(
                                            function (response) {
                                                vm.loading = false;
                                                if (response.status === 200) {
                                                    vm.requeridphysyian = false;
                                                    var institution = {
                                                        id: response.data[0].institution.id,
                                                        code: response.data[0].institution.code,
                                                        name: response.data[0].institution.name,
                                                    }
                                                    response.data[0].institution = {
                                                        id: response.data[0].institution.id,
                                                        code: response.data[0].institution.code,
                                                        name: response.data[0].institution.name,
                                                        requerid: false,
                                                        selected: institution
                                                    }
                                                    var insurance = {
                                                        id: response.data[0].insurance.id,
                                                        code: response.data[0].insurance.code,
                                                        name: response.data[0].insurance.name,
                                                    }
                                                    response.data[0].insurance = {
                                                        id: response.data[0].insurance.id,
                                                        code: response.data[0].insurance.code,
                                                        name: response.data[0].insurance.name,
                                                        requerid: false,
                                                        selected: insurance
                                                    }
                                                    vm.listremision = response.data[0];
                                                    vm.btneditremission = false;
                                                    vm.btnsaveremission = true;
                                                    vm.loadingdata = false;
                                                    UIkit.modal('#modal_editdemo').show();
                                                } else {
                                                    vm.requeridphysyian = false;
                                                    vm.listorganTransplant = _.clone(vm.organ);
                                                    vm.listTransplant = [];
                                                    vm.listremision = {
                                                        "idRemmision": -1,
                                                        "institution": {
                                                            "id": 0,
                                                            "requerid": false
                                                        },
                                                        "physician": '',
                                                        "insurance": {
                                                            "id": 0,
                                                            "requerid": false
                                                        },
                                                        "dateRemission": new Date(),
                                                        "edit": true
                                                    };
                                                    vm.btneditremission = true;
                                                    vm.btnsaveremission = false;
                                                    vm.loadingdata = false;
                                                    UIkit.modal('#modal_editdemo').show();
                                                    setTimeout(function () {
                                                        vm.focusinstitution = true;
                                                    }, 200);
                                                }
                                            },
                                            function (error) {
                                                vm.loadingdata = false;
                                                vm.modalError(error);
                                            }
                                        );
                                    }
                                },
                                function (error) {
                                    vm.modalError(error);
                                    vm.loadingdata = false;
                                }
                            );

                    }

                }, function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
            }

        }


        vm.changueremision = changueremision;
        function changueremision(type) {
            $scope.$apply(function () {
                if (type === 1) {
                    vm.listremision.institution.requerid = false;
                } else {
                    vm.listremision.insurance.requerid = false;
                }
            });
        }

        function disabledDemo(demos, id, disabled) {
            for (var property in demos) {
                if (property == id) {
                    if (demos.hasOwnProperty(property)) {
                        demos[property] = disabled;
                    }
                }
            }
            return demos;
        }

        vm.cleanAllDemos = cleanAllDemos;
        function cleanAllDemos(demos) {
            var cleanDemos = {};
            for (var property in demos) {
                if (demos.hasOwnProperty(property)) {
                    cleanDemos[property] = '';
                }
            }
            return cleanDemos;
        }

        vm.disabledAllDemo = disabledAllDemo;
        function disabledAllDemo(demos, disabled) {
            var disabledDemos = {};
            for (var property in demos) {
                if (demos.hasOwnProperty(property)) {
                    disabledDemos[property] = disabled;
                }
            }
            return disabledDemos;
        }
        vm.loadDemographicControls = loadDemographicControls;
        function loadDemographicControls() {
            //Carga la historia
            var patientDemosValues = {};
            var patientDemosDisabled = {};
            var index = 1;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            orderentryDS.getDemographics(auth.authToken, 'H').then(function (response) {
                response.data.forEach(function (value, key) {
                    value.tabIndex = index;
                    value.name = ($filter('translate')(value.name)).toLowerCase();
                    value.format = value.format === undefined || value.format === '' ? '' : value.format;
                    if (value.id === -8 || value.id === -9) {
                        value.placeholder = '';
                        value.format = '';
                    }
                    if (value.id === -105) {
                        value.date = true;
                        value.format = value.placeholder;
                    } else if (value.format !== undefined && value.format !== '') {
                        if (value.format.search("DATE") === -1) {
                            value.date = false;
                        } else {
                            value.date = true;
                            value.format = value.format.slice(5);
                        }
                    }
                    value.showRequired = false;
                    value.idOrigin = '|' + value.id + 'H';
                    patientDemosValues[value.id] = '';
                    patientDemosDisabled[value.id] = true;
                    if (value.encoded) {
                        var itemsdefault = '';
                        var viewdefault = false;
                        value.items.forEach(function (item, indexItem) {
                            item.idDemo = value.id;
                            item.showValue = (item.code + '. ' + item.name).toUpperCase();
                            if (item.defaultItem) {
                                itemsdefault = item;
                                viewdefault = true;
                            }
                        });
                        value.itemsdefault = itemsdefault;
                        value.viewdefault = viewdefault;
                    }
                    index++;
                });

                //Actualiza la vista
                vm.patientDemos = response.data;
                vm.patientDemosValues = patientDemosValues;
                vm.patientDemosDisabled = patientDemosDisabled;
                vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
            },
                function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */
