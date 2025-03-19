/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.restartmiddleware')
        .controller('restartmiddlewareController', restartmiddlewareController);
    restartmiddlewareController.$inject = ['localStorageService', 'middlewareDS',
        '$filter', '$state', '$rootScope'];
    function restartmiddlewareController(localStorageService, middlewareDS,
        $filter, $state, $rootScope) {

        var vm = this;
        vm.title = 'restartmiddleware';
        $rootScope.menu = true;
        $rootScope.NamePage = 'Reenvio al middleware';
        $rootScope.helpReference = '03.Result/restartmiddleware.htm';
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.modalError = modalError;
        vm.getLaboratory = getLaboratory;
        vm.filterRange = '1';
        vm.typereport = '1';
        vm.rangeInit = '';
        vm.rangeEnd = '';
        vm.loading = true;
        vm.save = save;
        $rootScope.pageview = 3;
        // Función para sacar la vantana del modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        // Función para traer una lista de sedes
        function getLaboratory() {
            vm.data = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return middlewareDS.getlistprocessing(auth.authToken).then(function (data) {
                vm.loading = false;
                if (data.status === 200) {
                    vm.data = data.data;
                }
            },
                function (error) {
                    vm.modalError(error);
                });
        }
        function save() {
            vm.loading = true;
            vm.quantity = 0;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (vm.filterRange === '0') {
                var data = {
                    'filterId': vm.filterRange,
                    'firstDate': vm.rangeInit,
                    'lastDate': vm.rangeEnd,
                    'laboratorys': $filter('filter')(vm.data, { selected: true })
                };
            } else {
                var data = {
                    'filterId': vm.filterRange,
                    'firstOrder': vm.rangeInit,
                    'lastOrder': vm.rangeEnd,
                    'laboratorys': $filter('filter')(vm.data, { selected: true })
                };
            }

            return middlewareDS.middlewareresend(auth.authToken, data).then(function (data) {
                vm.loading = false;
                if (data.status === 200) {
                    vm.quantity = data.data;
                    UIkit.modal('#modalinformative').show();
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
            vm.getLaboratory();
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */