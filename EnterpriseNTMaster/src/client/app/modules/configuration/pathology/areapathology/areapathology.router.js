(function() {
    'use strict';

    angular
        .module('app.areapathology')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'areapathology',
            config: {
                url: '/areapathology',
                templateUrl: 'app/modules/configuration/pathology/areapathology/areapathology.html',
                controller: 'AreaPathologyController',
                controllerAs: 'vm',
                authorize: false,
                title: 'Area',
                idpage: 121
            }
        }];
    }
})();