/* jshint ignore:start */
(function () {
    'use strict';
    angular
        .module('app.exception')
        .controller('ExceptionController', ExceptionController);
    ExceptionController.$inject = ['localStorageService', 'exceptionDS', 'LZString', '$translate',
        '$filter', '$state', 'moment', '$rootScope', 'reportadicional'];

    function ExceptionController(localStorageService, exceptionDS, LZString, $translate,
        $filter, $state, moment, $rootScope, reportadicional) {

        var vm = this;
        vm.title = 'Exception';
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0047');
        $rootScope.helpReference = '06.Tools/exception.htm';
        vm.modalError = modalError;
        vm.formatDate = localStorageService.get('FormatoFecha');
        vm.max = moment().format();
        vm.maxend = moment().format();
        vm.min = moment().format();
        vm.startDate = moment().format();
        vm.endDate = moment().format();
        vm.tomorrow = new Date();
        vm.tomorrow.setDate(vm.tomorrow.getDate() - 30);
        vm.loading = false;
        vm.seach = seach;
        vm.open = open;
        vm.data = [];
        vm.closemodal = closemodal;
        vm.print = print;
        vm.windowOpenReport = windowOpenReport;
        vm.email = email;
        vm.startChange = startChange;
        vm.endChange = endChange;
        $rootScope.pageview = 3;
        vm.loadingdata = false;
        vm.controle = $filter('translate')('0741');
        vm.BD = $filter('translate')('0742');
        vm.aplicate = $filter('translate')('0743');

        if ($filter('translate')('0000') === 'esCo') {
            kendo.culture('es-ES');
        } else {
            kendo.culture('en-US');
        }
        vm.Detail = {
            'email': '',
            'subject': '',
            'description': ''
        };
        //** Método que obtiene una lista de errores**//
        function seach() {
            vm.loadingdata = true;
            vm.data = [];
            var initialdate = moment(vm.startDate).format('YYYYMMDD');
            var finaldate = moment(vm.endDate).format('YYYYMMDD');
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return exceptionDS.getexception(auth.authToken, initialdate, finaldate).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.data = data.data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        function startChange() {
            if (vm.startDate) {
                vm.startDate = new Date(vm.startDate);
                vm.startDate.setDate(vm.startDate.getDate());
                vm.min = vm.startDate;
            } else if (vm.endDate) {
                vm.max = new Date(vm.endDate);
                vm.startDate = new Date(vm.endDate);
            } else {
                vm.endDate = new Date();
                vm.startDate = new Date();
                vm.max = vm.endDate;
                vm.min = vm.endDate;
            }
            vm.seach();
        }
        function endChange() {
            if (vm.endDate) {
                vm.endDate = new Date(vm.endDate);
                vm.endDate.setDate(vm.endDate.getDate());
                vm.max = vm.endDate;
            } else if (vm.startDate) {
                vm.min = new Date(vm.startDate);
                vm.endDate = new Date(vm.startDate);

            } else {
                vm.endDate = new Date();
                vm.startDate = new Date();
                vm.max = vm.endDate;
                vm.min = vm.endDate;
            }
            vm.seach();
        }
        // Función para asignar el valor de columna a una variable
        function open(exception) {
            vm.Detailexception = exception;
        }
        // función para cerrar la ventana 
        function closemodal() {
            UIkit.modal('#viewerror').hide();
        }
        // función para  armar el reporte detallado del error 
        function print() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.variables = {
                'username': auth.userName,
                'date': moment().format(vm.formatDate)
            };
            vm.datareport = vm.Detailexception;
            vm.pathreport = '/Report/tools/exception/exception.mrt';
            vm.openreport = false;
            vm.report = false;
            vm.windowOpenReport();
        }
        // función para enviar por email el reporte detallado del error 
        function email(Form) {
            Form.$setUntouched();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.variables = {
                'username': auth.userName,
                'date': moment().format(vm.formatDate)
            };
            var parameterReport = {};
            parameterReport.variables = vm.variables;
            parameterReport.pathreport = '/Report/tools/exception/exception.mrt';
            parameterReport.datareport = vm.Detailexception;
            var parameterEmail = {};
            parameterEmail.nameAttachment = 'Exception.pdf';
            parameterEmail.subject = vm.Detail.subject;
            parameterEmail.body = vm.Detail.description;
            parameterEmail.emailDestination = vm.Detail.email;
            return reportadicional.sendEmailexception(parameterReport, parameterEmail).then(function () {
                vm.loading = false;
                UIkit.modal('#modalsendemail').hide();
                vm.Detail = [];
                UIkit.modal('#modalmessajesend', { modal: false }).show() 

            },
                function (error) {
                    console.log(error);
                });
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
        // Función para sacar la vantana del modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }

        function isAuthenticate() {
            //var auth = null
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.init();
            }
        }
        // Función para inicializar la pagina
        function init() {
            vm.seach();
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */