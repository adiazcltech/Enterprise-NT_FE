
/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.auditinvoice')
        .controller('auditinvoiceController', auditinvoiceController);


    auditinvoiceController.$inject = ['LZString', '$translate', 'localStorageService',
        '$filter', '$state', 'moment', '$rootScope', 'auditsorderDS'];

    function auditinvoiceController(LZString, $translate, localStorageService,
        $filter, $state, moment, $rootScope, auditsorderDS) {

        var vm = this;
        vm.title = 'auditinvoice';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('1735');
        $rootScope.helpReference = '07.Audit/auditinvoice.htm';
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.modalError = modalError;
        vm.data = [];
        vm.windowOpenReport = windowOpenReport;
        vm.generateFileorder = generateFileorder;
        vm.search = search;
        vm.datachangeaudit = datachangeaudit;
        $rootScope.pageview = 3;
        vm.formatDateHours = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';


        function search() {
            vm.loadingdata = true;
            vm.data = [];
            var data = {
                "initDate": moment(vm.rangeInit).format('YYYYMMDD'),
                "endDate": moment(vm.rangeEnd).format('YYYYMMDD')
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return auditsorderDS.getTraceabilityOfInvoices(auth.authToken, data).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.data = data.data;
                } else {
                    UIkit.modal('#nofoundfilter').show();
                }
            },
                function (error) {
                    vm.modalError(error);
                });
        }

        function datachangeaudit(invoice) {
            vm.auditinvoice = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.loadingdata = true;
            return auditsorderDS.getInvoiceTraceability(auth.authToken, invoice).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.auditinvoice = data.data;
                    if (data.data.invoiceAudits.length !== 0) {
                        var auditinvoice = []
                        data.data.invoice.dateOfInvoice = moment(data.data.invoice.dateOfInvoice).format(vm.formatDateHours);
                        data.data.invoiceAudits.forEach(function (value) {
                            if (value.action === "I" && value.executionType === "INV") {
                                var addaoudit = {
                                    "name": $filter('translate')('0207'),
                                    "date": moment(value.date).format(vm.formatDateHours),
                                    "user": value.username,
                                    "comment": ""
                                }
                                auditinvoice.push(addaoudit)
                            } else if (value.action === "I" && value.executionType === "CN") {
                                var addaoudit = {
                                    "name": $filter('translate')('1576'),
                                    "date": moment(value.date).format(vm.formatDateHours),
                                    "user": value.username,
                                    "comment": ""
                                }
                                auditinvoice.push(addaoudit)
                            }
                            else if (value.action === "R") {
                                var addaoudit = {
                                    "name": $filter('translate')('0375'),
                                    "date": moment(value.date).format(vm.formatDateHours),
                                    "user": value.username,
                                    "comment": ""
                                }
                                auditinvoice.push(addaoudit)
                            }
                        });
                        vm.auditinvoice.auditinvoice = auditinvoice;
                    }
                    vm.datareport = vm.auditinvoice;
                    vm.generateFileorder();
                }
            }, function (error) {
                vm.loadingdata = false;
                vm.modalError(error);
            });
        }

        function generateFileorder() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.variables = {
                'abbreviation': 'CLT',
                'date': moment().format('DD/MM/YYYY, HH:mm:ss'),
                'username': auth.userName
            };
            vm.pathreport = '/Report/audit/auditinvoice/auditinvoice.mrt';
            vm.openreport = false;
            vm.report = false;
            vm.windowOpenReport();
        }
        function windowOpenReport() {
            if (vm.datareport.invoiceAudits.length > 0) {
                var parameterReport = {};
                parameterReport.variables = vm.variables;
                parameterReport.pathreport = vm.pathreport;
                parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
                var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
                localStorageService.set('parameterReport', parameterReport);
                localStorageService.set('dataReport', datareport);
                window.open('/viewreport/viewreport.html');
            } else {
                UIkit.modal('#modalReportError').show();
            }
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
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
            vm.loadingdata = false;
        }
        function init() {
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */
