
/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.historyreassignment')
        .controller('historyreassignmentController', historyreassignmentController);


    historyreassignmentController.$inject = ['patientDS', 'orderDS', 'localStorageService', 'logger',
        '$filter', '$state', 'moment', '$rootScope','common'];

    function historyreassignmentController(patientDS, orderDS, localStorageService,
        logger, $filter, $state, moment, $rootScope,common) {

        var vm = this;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.title = 'HistoryAssignment';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0044');
        $rootScope.helpReference = '01. LaboratoryOrders/historyreassignment.htm';
        vm.getListYear = getListYear;
        vm.keyselect = keyselect;
        vm.keyselectpatientid = keyselectpatientid;
        vm.save = save;
        vm.formatDate = localStorageService.get('FormatoFecha');
        vm.dateseach = moment().format();
        vm.max = moment().format();
        vm.selected = -1;
        vm.listYear = [];
        vm.digitsorder = localStorageService.get('DigitosOrden');
        vm.digitsyear = 4;
        $rootScope.pageview = 3;
        vm.codeorder = '';
        vm.order = '0'
        vm.patientiddirective = -1;
        vm.listtest = [];
        vm.modalError = modalError;
        vm.getDocumentTypes = getDocumentTypes;
        vm.manageweight = localStorageService.get('ManejoPeso') === 'True';
        vm.managesize = localStorageService.get('ManejoTalla') === 'True';
        vm.managerace = localStorageService.get('ManejoRaza') === 'True';
        vm.integrationMINSA = localStorageService.get('IntegracionTribunal') === 'True';
        vm.managedocumenttype = localStorageService.get('ManejoTipoDocumento').toLowerCase() === 'true';
        vm.managehistoryauto = localStorageService.get('HistoriaAutomatica').toLowerCase() === 'true';
        vm.verifyPatient = verifyPatient;
        vm.errorValidOrVerify = errorValidOrVerify;
        vm.disableSave = false;
        vm.RegExp = false;

        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }



        if (vm.digitsyear === 4) {
            vm.digitsdelete = 0;
        }
        if (vm.digitsyear === 3) {
            vm.digitsdelete = 1;
        }
        if (vm.digitsyear === 2) {
            vm.digitsdelete = 2;
        }
        if (vm.digitsyear === 1) {
            vm.digitsdelete = 3;
        }


        function getListYear() {
            vm.listYear = common.getListYear();
            vm.listYear.id = moment().year();
        }

        function keyselect($event) {
            var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
            vm.logorder = 2;
            vm.dataPatient = [];
            if (vm.order.length > 6 && $event === undefined) { return; }
            if (keyCode === 13) {
                if (vm.codeorder !== '') {
                    vm.variable = [];

                    vm.amountdigits = parseInt(vm.digitsorder);
                    vm.amountdigitswrite = 4 + vm.amountdigits;
                    vm.monthJanuary = moment().format('MM');
                    vm.monthPresent = vm.codeorder.substring(0, 2);

                    if (vm.codeorder.length > vm.amountdigitswrite) {
                        vm.cant = vm.codeorder.length - vm.amountdigitswrite;
                        vm.codeorder = vm.codeorder.substring(vm.cant, vm.codeorder.length);
                    }

                    if (vm.codeorder.length === vm.amountdigitswrite) {
                        vm.codeorder = (vm.codeorder).substring(vm.digitsdelete);
                    }
                    else {
                        if (vm.codeorder.length === vm.amountdigitswrite - 1 || vm.codeorder.length === vm.amountdigitswrite - 3) {
                            vm.codeorder = (0 + vm.codeorder).substring(vm.digitsdelete);
                        }

                        if (vm.codeorder.length === vm.amountdigitswrite - 2) {
                            vm.codeorder = (moment().format('MM') + vm.codeorder).substring(vm.digitsdelete);
                        }

                        vm.ConsecutiveOrder = vm.codeorder;
                        var repeticiones = parseInt(vm.digitsorder) - vm.ConsecutiveOrder.length;
                        var ceros = '';
                        for (var i = 0; i < repeticiones; i++) {
                            ceros = ceros + 0;
                        }
                        vm.ConsecutiveOrder = ceros + vm.ConsecutiveOrder;

                        if (repeticiones >= 0) {
                            vm.codeorder = moment().format('MMDD') + vm.ConsecutiveOrder;
                        }
                    }

                    vm.order = vm.listYear.id + vm.codeorder;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    orderDS.getOrder(auth.authToken, vm.order).then(function (data) {
                        if (data.status === 200) {
                            vm.logorder = 0;
                            if (vm.patientiddirective !== -1) { vm.verifyPatient(vm.patientiddirective); }
                        }
                        else {
                            vm.logorder = 1;
                        }
                    }, function (error) {
                        if (error.data === null) {
                            vm.modalError(error);
                        }
                    });

                }
                else {
                    vm.order = '0';
                }
            }
            else {
                var expreg = new RegExp('^\\d?\\d*$');
                if (!expreg.test(vm.codeorder + String.fromCharCode(keyCode))) {
                    //detener toda accion en la caja de texto
                    $event.preventDefault();
                }
            }
        }

        function keyselectpatientid($event) {
            vm.RegExp = false;
            vm.errorExp = false;
            var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
            if (vm.patientid !== '' && vm.patientid !== null && vm.patientid !== undefined) {
                vm.logopatient = 2;
                vm.patientiddirective = -1;
                if (keyCode === 13) {
                    if (vm.patientid !== '') {
                        var numDoc = vm.patientid;
                       /*  if (vm.integrationMINSA) {
                            var expreg = new RegExp(
                                /^(PE|E|N|[23456789](?:AV|PI)?|1[0123]?(?:AV|PI)?)-(\d{1,4})-(\d{1,6})$/i
                            );
                            if (expreg.test(numDoc)) {
                                vm.RegExp = true;
                            } else {
                                vm.RegExp = false;
                                vm.errorExp = true;
                            }
                        } else {
                            vm.RegExp = true;
                        } */
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        if (vm.managedocumenttype) {
                            /* if (vm.RegExp) { */
                                patientDS.getPatientIdDocumentType(auth.authToken, numDoc, vm.patientDocToSearch).then(function (data) {
                                    if (data.status === 200) {
                                        vm.patientiddirective = data.data.id;
                                        vm.logopatient = 0;
                                        vm.verifyPatient(vm.patientiddirective);
                                    } else {
                                        vm.logopatient = 1;
                                        vm.patientiddirective = -1;
                                    }
                                }, function (error) {
                                    if (error.data === null) {
                                        vm.modalError(error);
                                    }
                                });
                           /* } */ 
                        } else {
                            /* if (vm.RegExp) { */
                                patientDS.getPatientIdDocumentType(auth.authToken, numDoc, 1).then(function (data) {
                                    if (data.status === 200) {
                                        vm.patientiddirective = data.data.id;
                                        vm.logopatient = 0;
                                        vm.verifyPatient(vm.patientiddirective);
                                    } else {
                                        vm.logopatient = 1;
                                        vm.patientiddirective = -1;
                                    }
                                }, function (error) {
                                    if (error.data === null) {
                                        vm.modalError(error);
                                    }
                                    vm.messageOrder = $filter('translate')('1454');
                                    UIkit.modal('#orderinvalid').show();
                                });
                            /* } */
                        }

                    }
                }
                else {
                    if (!vm.integrationMINSA) {
                        var expreg = new RegExp('^\\d?\\d*$');
                        if (!expreg.test(vm.codeorder + String.fromCharCode(keyCode))) {
                            //detener toda accion en la caja de texto
                            $event.preventDefault();
                        }
                    }
                }
            }
        }

        function getDocumentTypes() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.patientDocToSearch = vm.managedocumenttype ? '0' : '-1';
            vm.patientid = '';
            if (!vm.managedocumenttype) return;
            orderDS.getDocumentTypes(auth.authToken).then(
                function (response) {
                    if (response.status === 200) {
                        var documentTypes = response.data;
                        documentTypes = documentTypes.sort(function (a, b) {
                            if (a.id > b.id) {
                                return 1;
                            } else if (a.id < b.id) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });
                        vm.documentTypes = documentTypes;
                        vm.patientDocToSearch = '0';
                    }
                }, function (error) {
                    console.error(error);
                });
        }
        function save() {
            //Token de autenticación
            vm.loading=true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var datapatient = {
                'orderNumber': vm.order,
                'patient': {
                    'id': vm.patientiddirective
                }
            }
            patientDS.changePatientOrder(auth.authToken, datapatient).then(
                function (response) {
                    vm.loading=false;
                    vm.patientiddirective = -1;
                    vm.patientid='';
                    vm.codeorder='';
                    vm.order = '0'
                    logger.success($filter('translate')('0149'));
                },
                function (error) {
                    vm.loading=false;
                    vm.errorValidOrVerify(error);
                });

        }

        function errorValidOrVerify(error) {
            vm.listtest = [];
            var errortype = true;
            if (error.data !== null) {
                if (error.data.code === 2) {
                    error.data.errorFields.forEach(function (value) {
                        var item = value.split('|');
                        errortype = item[0] === '3' && item[1] === 'test';
                        if (item[0] === '3' && item[1] === 'test') {
                            var test = {
                                'code': item[3],
                                'name': item[4],
                                'reason': item[5] === '2' ? $filter('translate')('0674') : $filter('translate')('0675')
                            }
                            vm.listtest.push(test);
                        }
                    });
                    vm.widthGrid = vm.listtest.length > 1 ? 'width: 100%' : 'width: 215%';
                    if (errortype) {
                        UIkit.modal('#testinvalid').show();
                    } else {
                        var disyunt = $filter('translate')('0000') === 'esCo' ? ' ó ' : ' or ';
                        vm.messageOrder = $filter('translate')('0244') + disyunt +
                            $filter('translate')('0676').replace('@@@@', vm.order).replace('¡', '');

                        UIkit.modal('#orderinvalid').show();
                    }
                } else {
                    vm.modalError(error);
                }
            } else {
                vm.modalError(error);
            }
        }

        function verifyPatient(id) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var datapatient = {
                'orderNumber': vm.order,
                'patient': {
                    'id': id
                }
            }
            patientDS.verifyPatientOrder(auth.authToken, datapatient).then(function (response) {
                vm.disableSave = false;
            }, function (error) {
                vm.disableSave = true;
                vm.errorValidOrVerify(error);
            });
        }

        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.init();
            }
        }

        function init() {
            vm.getListYear();
            vm.getDocumentTypes();

        }

        vm.isAuthenticate();

    }

})();
/* jshint ignore:end */