/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.restartcounter')
        .controller('restartcounterController', restartcounterController);


    restartcounterController.$inject = ['localStorageService', 'configurationDS',
        'logger', '$filter', '$state', 'moment', '$rootScope'];

    function restartcounterController(localStorageService, configurationDS,
        logger, $filter, $state, moment, $rootScope) {

        var vm = this;
        vm.title = 'restartcounter';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0951');
        $rootScope.helpReference = '01. LaboratoryOrders/restartcounter.htm';
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.modalError = modalError;
        vm.getsave = getsave;
        vm.typereport = '1';
        vm.loading = false;
        vm.date = null;
        vm.restartsequencemanually = restartsequencemanually;
        vm.startChange = startChange;
        vm.get = get;
        $rootScope.pageview = 3;


        // Función para sacar la vantana del modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // Función que trae la lista de servicios
        function getsave() {
            if (vm.typereport === '1') {
                UIkit.modal('#confirmation').show();

            } else {
                if (vm.date !== null) {

                    if (moment(vm.date).format('HHmm') === 'Invalid date') {
                        var date = vm.date.replace(':', '');
                    }
                    else {
                        var date = moment(vm.date).format('HHmm');
                    }

                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return configurationDS.restartsequence(auth.authToken, date).then(function (data) {
                        if (data.status === 200) {
                            logger.success($filter('translate')('0948') + ' ' + moment(vm.date).format('HH:mm:ss') + ' ' + $filter('translate')('0949'));
                        }
                    },
                        function (error) {
                            vm.modalError(error);
                        });
                }
            }

        }
        function startChange() {
            if (!vm.date) {
                vm.date = null;
            }
        }
        function restartsequencemanually() {
            vm.loading = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.restartsequencemanually(auth.authToken).then(function (data) {
                vm.loading = false;
                if (data.status === 200) {
                    UIkit.modal('#advertencie').hide();
                    logger.success($filter('translate')('0950'));
                }
            },
                function (error) {
                    vm.modalError(error);
                });

        }
        function get() {
            vm.loading = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfigurationKey(auth.authToken, 'HorarioReinicioOrdenes').then(function (data) {
                vm.loading = false;

                if (data.status === 200) {
                    vm.typereport = data.data.value === null || data.data.value === '' ? '1' : '2';
                    var date = moment(data.data.value, 'HH:mm:ss');
                    vm.date = moment(date).format('HH:mm:ss');
                }
            },
                function (error) {
                    vm.modalError(error);
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
        // Función para inicializar la pagina
        function init() {
            vm.loading = true;
            vm.get();
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */