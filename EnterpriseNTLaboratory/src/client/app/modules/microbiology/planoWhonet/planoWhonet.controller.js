/* jshint ignore:start */
(function () {
    'use strict';
    angular
        .module('app.planoWhonet')
        .controller('PlanoWhonetController', PlanoWhonetController);


    PlanoWhonetController.$inject = ['localStorageService', 'branchDS', 'stadisticsDS',
        '$filter', '$state', 'moment', '$rootScope'];

    function PlanoWhonetController(localStorageService, branchDS, stadisticsDS,
        $filter, $state, moment, $rootScope) {

        var vm = this;
        vm.title = 'PlanoWhonet';
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.getbranch = getbranch;
        vm.get = get;
        $rootScope.menu = true;
        vm.branch = {};
        vm.c = '"';
        $rootScope.helpReference = '05.Stadistics/whonet.htm';
        $rootScope.NamePage = $filter('translate')('0039');
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase();
        vm.separator = localStorageService.get('SeparadorLista');
        vm.rangeInit = moment().format('YYYYMMDD');
        vm.rangeEnd = moment().format('YYYYMMDD');
        vm.saveTextAsFile = saveTextAsFile;
        $rootScope.pageview = 3;
        vm.header = '"PATIENT_ID"' + vm.separator + '"LAST_NAME"' + vm.separator + '"FIRST_NAME"' + vm.separator +
            '"SEX"' + vm.separator + '"DATE_BIRTH"' + vm.separator + '"AGE"' + vm.separator + '"DEPARTMENT"' +
            vm.separator + '"WARD_TYPE"' + vm.separator + '"SPEC_NUM"' + vm.separator + '"SPEC_DATE"' +
            vm.separator + '"SPEC_TYPE"' + vm.separator + '"ORGANISM"' + vm.separator + '"ABX"' +
            vm.separator + '"MIC"' + vm.separator + '"THM"' + vm.separator + '"EDTA"' + vm.separator + '"APB"\r\n';
        // Funcion que convierte el archivo en txt
        function saveTextAsFile(data, filename) {
            if (!data) {
                console.error('Console.save: No data');
                return;
            }
            if (!filename) filename = 'console.json';
            var blob = new Blob([data], { type: 'text/plain' }),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a')
            // FOR IE:

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else {
                var e = document.createEvent('MouseEvents'),
                    a = document.createElement('a');

                a.download = filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
                e.initEvent('click', true, false, window,
                    0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            }
        }
        // Función para sacar la vantana del modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // Función para traer una lista de sedes
        function getbranch() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return branchDS.getBranchstate(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.listbranch = data.data;
                }
            },
                function (error) {
                    vm.modalError(error);
                })
        }
        //Función consultar la data y arma los datos para imprimir txt
        function get() {
            var fileText = vm.header;
            var data = {
                'rangeType': 0,
                'init': vm.rangeInit,
                'end': vm.rangeEnd,
                'demographics': [{
                    'demographic': -5,
                    'demographicItems': [vm.branch.id],
                }],
            };

            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return stadisticsDS.getplanowhonet(auth.authToken, data).then(function (data) {
                if (data.status === 200) {
                    vm.data = data.data;
                    for (var i = 0; i < vm.data.length; i++) {
                        fileText = fileText + vm.c + vm.data[i].patientId + vm.c + vm.separator;
                        fileText = fileText + vm.c + vm.data[i].lastName + vm.c + vm.separator;
                        fileText = fileText + vm.c + vm.data[i].name1 + vm.c + vm.separator;
                        fileText = fileText + vm.c + vm.data[i].gender + vm.c + vm.separator;
                        fileText = fileText + vm.c + moment(vm.data[i].dob).format('DD/MM/YYYY') + vm.c + vm.separator;
                        if (vm.data[i].ageUnit === 1) {
                            var ageUnit = $filter('translate')('0476');
                        }
                        if (vm.data[i].ageUnit === 2) {
                            var ageUnit = $filter('translate')('0569');
                        }
                        if (vm.data[i].ageUnit === 3) {
                            var ageUnit = $filter('translate')('0103');
                        }
                        fileText = fileText + vm.c + vm.data[i].age + ' ' + ageUnit + vm.c + vm.separator;
                        fileText = fileText + vm.c + vm.data[i].department + vm.c + vm.separator;
                        fileText = fileText + vm.c + vm.data[i].wardType + vm.c + vm.separator;
                        fileText = fileText + vm.c + vm.data[i].specNum + vm.c + vm.separator;
                        fileText = fileText + vm.c + moment(vm.data[i].specDate).format('DD/MM/YYYY') + vm.c + vm.separator;
                        if (vm.data[i].specType === undefined) { fileText = fileText + vm.c + vm.c + vm.separator; } else { fileText = fileText + vm.c + vm.data[i].specType + vm.c + vm.separator; }
                        if (vm.data[i].organism === undefined) { fileText = fileText + vm.c + vm.c + vm.separator; } else { fileText = fileText + vm.c + vm.data[i].organism + vm.c + vm.separator; }
                        if (vm.data[i].abx === undefined) { fileText = fileText + vm.c + vm.c + vm.separator; } else { fileText = fileText + vm.c + vm.data[i].abx + vm.c + vm.separator; }
                        if (vm.data[i].mic === undefined) { fileText = fileText + vm.c + vm.c + vm.separator; } else { fileText = fileText + vm.c + vm.data[i].mic + vm.c + vm.separator; }
                        if (vm.data[i].thm === undefined) { fileText = fileText + vm.c + vm.c + vm.separator; } else { fileText = fileText + vm.c + vm.data[i].thm + vm.c + vm.separator; }
                        if (vm.data[i].edta === undefined) { fileText = fileText + vm.c + vm.c + vm.separator; } else { fileText = fileText + vm.c + vm.data[i].edta + vm.c + vm.separator; }
                        if (vm.data[i].apb === undefined) { fileText = fileText + vm.c + vm.c + vm.separator; } else { fileText = fileText + vm.c + vm.data[i].apb + vm.c + '\r\n'; }

                    }

                    var fileName = vm.branch.name + '.txt';
                    vm.saveTextAsFile(fileText, fileName);


                } else {
                    UIkit.modal('#modalReportError').show();
                }
            },
                function (error) {
                    vm.modalError(error);
                })
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
            vm.getbranch();
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */