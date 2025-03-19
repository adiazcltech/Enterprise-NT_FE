(function () {
    'use strict';

    angular
        .module('app.role')
        .controller('menuMasterController', menuMasterController);

    menuMasterController.$inject = ['$http', 'localStorageService', 'logger',
        '$filter', '$state', '$rootScope'];

    function menuMasterController($http, localStorageService, logger,
        $filter, $state, $rootScope) {

        var vm = this;

        $rootScope.menu = true;

        vm.init = init;
        vm.isAuthenticate = isAuthenticate;
        vm.title = 'Menu Master';

        //** Metodo que valida la autenticación**//
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.init();
            }
        }
        //** Método que carga los metodos que inicializa la pagina*// 
        function init() {

        }

        vm.isAuthenticate();

    }
})();

