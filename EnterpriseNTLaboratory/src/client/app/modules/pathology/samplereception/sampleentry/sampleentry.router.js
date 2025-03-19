(function() {
    'use strict';

    angular
        .module('app.sampleentry')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'sampleentry',
            config: {
                url: '/sampleentry',
                templateUrl: 'app/modules/pathology/samplereception/sampleentry/sampleentry.html',
                controller: 'sampleentryController',
                controllerAs: 'vm',
                authorize: false,
                title: 'sampleentry',
                idpage: 410
            }
        }];
    }
})();