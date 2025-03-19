(function() {
    'use strict';

    angular
        .module('app.institution')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'institution',
            config: {
                url: '/institution',
                templateUrl: 'app/modules/configuration/transplants/institution/institution.html',
                controller: 'InstitutionController',
                controllerAs: 'vm',
                authorize: false,
                title: 'institution',
                idpage: 162
            }
        }];
    }
})();


