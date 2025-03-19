(function() {
    'use strict';

    angular
        .module('app.specimen')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'specimen',
            config: {
                url: '/specimen',
                templateUrl: 'app/modules/configuration/pathology/specimen/specimen.html',
                controller: 'specimenController',
                controllerAs: 'vm',
                authorize: false,
                title: 'Specimen',
                idpage: 123
            }
        }];
    }
})();
