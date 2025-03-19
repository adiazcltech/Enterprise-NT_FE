/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.activationorder')
        .controller('activationorderController', activationorderController);
    activationorderController.$inject = ['orderDS', 'LZString', 'localStorageService', 'logger',
        '$filter', '$state', 'moment', '$rootScope', '$translate'];
    function activationorderController(orderDS, LZString, localStorageService, logger,
        $filter, $state, moment, $rootScope, $translate) {
        var vm = this;
        vm.title = 'ActivationOrder';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.helpReference = '01. LaboratoryOrders/activationorder.htm';
        $rootScope.NamePage = $filter('translate')('0045');
        vm.save = save;
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
        vm.format = localStorageService.get('FormatoFecha').toUpperCase();
        vm.dateseach = moment().format();
        vm.max = moment().format();
        vm.selected = -1;
        vm.listYear = [];
        vm.search = search;
        vm.changecheck = changecheck;
        vm.generateFile = generateFile;
        vm.isOpenReport = true;
        vm.button = false;
        vm.selectallcheck = selectallcheck;
        vm.ListOrder = [];
        vm.modalError = modalError;
        vm.filterRange = '0';
        vm.rangeInit = '';
        vm.rangeEnd = '';
        $rootScope.pageview = 3;
        vm.windowOpenReport = windowOpenReport;
        vm.cleanlist = cleanlist;
        vm.isAuthenticate = isAuthenticate;
        //Limpia la lista cuando cambia de número de orden a fecha de la muestra
        function cleanlist() {
            vm.ListOrder = [];
        }
        // Modal de errores
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // Cambia el valor de los ckecks
        function selectallcheck() {
            if (vm.ListOrder.length > 0) {
                vm.ListOrder.forEach(function (value, key) {
                    vm.ListOrder[key].check = vm.Allcheck;

                });
            }
        }
        // Funcion que busca las ordenes que cumpklan con el filtro
        function search() {
            var consult = {
                "rangeType": vm.filterRange === '0' ? '3' : vm.filterRange,
                "init": vm.rangeInit,
                "end": vm.rangeEnd,
                "basic": true

            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.loadingdata = true;
            return orderDS.getfilterOrderdeleted(auth.authToken, consult).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.ListOrder = data.data.length === 0 ? data.data : removeData(data);
                    vm.isOpenReport = false;
                } else {
                    vm.isOpenReport = true;
                    vm.ListOrder = [];
                    logger.success($filter('translate')('0684'));
                }
            },
                function (error) {
                    if (error.data === null) {
                        vm.modalError(error);
                    }
                });
        }
        //** Metodo que elimina los elementos sobrantes en la grilla**//
        function removeData(data) {
            data.data.forEach(function (value, key) {
                data.data[key].orderNumber = value.order.orderNumber;
                data.data[key].patientId = value.order.patient.patientId;
                var name2 = value.order.patient.name2 === undefined ? "" : value.order.patient.name2;
                data.data[key].name = value.order.patient.name1 + " " + name2;
                data.data[key].lastName = value.order.patient.lastName;
                data.data[key].username = value.last.user.name + ' ' + value.last.user.lastName;
                data.data[key].datedeleted = moment(value.last.date).format(vm.formatDate);
                data.data[key].reasondeleted = value.last.reason === null ? '' : value.last.reason.name;
            });
            return data.data;
        }
        //** Método  para imprimir el reporte**//
        function generateFile() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.variables = {
                'date': moment().format(vm.formatDate),
                'rangeInit': vm.filterRange.toString() === '1' ? $filter('translate')('0073') + ': ' + vm.rangeInit : $filter('translate')('0075') + ': ' + moment(vm.rangeInit).format(vm.format),
                'rangeEnd': vm.filterRange.toString() === '1' ? $filter('translate')('0074') + ': ' + vm.rangeEnd : $filter('translate')('0076') + ': ' + moment(vm.rangeEnd).format(vm.format),
                'total': vm.ListOrder.length
            }
            vm.datareport = vm.ListOrder;
            vm.pathreport = '/Report/pre-analitic/activateorder/activateorder.mrt';
            vm.openreport = false;
            vm.report = false;
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
        //Método para activar las ordenes seleccionadas
        function save() {
            vm.loadingdata = true;
            vm.Allcheck = false;
            vm.oderdelete = $filter('filter')(vm.ListOrder, { check: true });
            var laboratorio = [];
            vm.oderdelete.forEach(function (value, key) {
                laboratorio.push(value.order.orderNumber);
            });
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return orderDS.getactivateorders(auth.authToken, laboratorio).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.ListOrder = [];
                    logger.success($filter('translate')('0685'));
                }
                vm.search();
            },
                function (error) {
                    if (error.data === null) {
                        vm.modalError(error);
                    }
                });
        }
        //Método que muestra un popup para la confirmación de la activación
        function changecheck() {
            UIkit.modal("#confirmation").show();
        }
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */
