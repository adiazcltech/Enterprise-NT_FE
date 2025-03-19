(function() {
    'use strict';

    angular
        .module('app.organ')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'organ',
            config: {
                url: '/organ',
                templateUrl: 'app/modules/configuration/pathology/organ/organ.html',
                controller: 'OrganController',
                controllerAs: 'vm',
                authorize: false,
                title: 'Organ',
                idpage: 124
            }
        }];
    }
})();