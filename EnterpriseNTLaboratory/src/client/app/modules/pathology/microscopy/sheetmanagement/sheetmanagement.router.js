(function() {
    'use strict';

    angular
        .module('app.sheetmanagement')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'sheetmanagement',
            config: {
                url: '/sheetmanagement',
                templateUrl: 'app/modules/pathology/microscopy/sheetmanagement/sheetmanagement.html',
                controller: 'sheetmanagementController',
                controllerAs: 'vm',
                authorize: false,
                title: 'sheetmanagement',
                idpage: 410
            }
        }];
    }
})();