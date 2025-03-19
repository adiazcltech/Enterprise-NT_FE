/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.reportvisor')
        .controller('reportvisorController', reportvisorController);
    reportvisorController.$inject = ['localStorageService', 'logger', '$state', 'moment', '$rootScope', 'reportransDS', '$filter'];
    function reportvisorController(localStorageService, logger, $state, moment, $rootScope, reportransDS, $filter) {
        var vm = this;
        vm.title = 'reportvisor';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.NamePage = $filter('translate')('3323');
        vm.selected = -1;
        $rootScope.pageview = 3;
        vm.getseach = getseach;
        function getseach() {
            vm.loadingdata = true;
            vm.Listreport = [];
            vm.selected = -1;
            vm.viewpreliminar = false;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return reportransDS
                .getListReport(auth.authToken, vm.selectReport.id)
                .then(
                    function (data) {
                        if (data.data.length !== 0) {
                            data.data.forEach(function (value) {
                                value.Datedeliver = moment(value.deliverDate).format(vm.formatDate.toUpperCase());
                                value.Dategeneration = moment(value.generationDate).format(vm.formatDate.toUpperCase());
                                value.Datereception = moment(value.receptionDate).format(vm.formatDate.toUpperCase());
                            });
                            vm.Listreport = data.data;
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
        vm.eventEdit = eventEdit;
        function eventEdit(report) {
            vm.selected = report.idReport;
            if (vm.selectReport.id !== 9) {
                vm.viewpreliminar = true;
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return reportransDS
                .getbase64(auth.authToken, report)
                .then(
                    function (data) {
                        if (vm.selectReport.id === 9) {
                            var binaryString = window.atob(data.data.file);
                            var len = binaryString.length;
                            var bytes = new Uint8Array(len);
                            for (var i = 0; i < len; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }
                            var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                            // Crea un enlace de descarga
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = 'archivo.xlsx';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } else {
                            var a = document.getElementById("previreport");
                            a.type = 'application/pdf';
                            a.src = 'data:application/pdf;base64,' + data.data.file;
                            a.height = '100%';
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                        vm.loadingdata = false;
                    }
                );
        }
        vm.eventUndo = eventUndo;
        function eventUndo() {
            vm.viewpreliminar = false;
        }
        vm.init = init;
        function init() {
            vm.viewpreliminar = false;
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
                    id: 8,
                    name: $filter('translate')('3623')
                },
                {
                    id: 9,
                    name: $filter('translate')('3624')
                },
                {
                    id: 10,
                    name: $filter('translate')('3625')
                },
                {
                    id: 11,
                    name: $filter('translate')('3626')
                },
                {
                    id: 12,
                    name: $filter('translate')('3638')
                }

            ]
            vm.formatDate = localStorageService.get('FormatoFecha');
            setTimeout(function () {
                document.getElementById('searchgrille').focus();
            }, 400);
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
        vm.modalError = modalError;
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */
