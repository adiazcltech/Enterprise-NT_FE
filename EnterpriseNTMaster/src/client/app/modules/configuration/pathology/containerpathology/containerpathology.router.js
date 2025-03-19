(function() {
    'use strict';

    angular
        .module('app.containerpathology')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'containerpathology',
            config: {
                url: '/containerpathology',
                templateUrl: 'app/modules/configuration/pathology/containerpathology/containerpathology.html',
                controller: 'ContainerPathologyController',
                controllerAs: 'vm',
                authorize: false,
                title: 'ContainerPathology',
                idpage: 122
            }
        }];
    }
})();