(function () {
    'use strict';
    angular
        .module('app.reciver')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'reciver',
                config: {
                    url: '/reciver',
                    templateUrl: 'app/modules/configuration/billing/reciver/reciver.html',
                    controller: 'ReciverController',
                    controllerAs: 'vm',
                    authorize: false,
                    title: 'Reciver',
                    idpage: 18
                }
            }
        ];
    }
})();
