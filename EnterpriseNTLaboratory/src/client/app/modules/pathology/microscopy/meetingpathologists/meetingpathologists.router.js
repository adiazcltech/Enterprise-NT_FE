(function() {
    'use strict';

    angular
        .module('app.meetingpathologists')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'meetingpathologists',
            config: {
                url: '/meetingpathologists',
                templateUrl: 'app/modules/pathology/microscopy/meetingpathologists/meetingpathologists.html',
                controller: 'meetingpathologistsController',
                controllerAs: 'vm',
                authorize: false,
                title: 'meetingpathologists',
                idpage: 411
            }
        }];
    }
})();