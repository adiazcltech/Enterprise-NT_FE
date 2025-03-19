(function() {
    'use strict';

    angular
        .module('app.insurance')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'insurance',
            config: {
                url: '/insurance',
                templateUrl: 'app/modules/configuration/transplants/insurance/insurance.html',
                controller: 'InsuranceController',
                controllerAs: 'vm',
                authorize: false,
                title: 'insurance',
                idpage: 161
            }
        }];
    }
})();


