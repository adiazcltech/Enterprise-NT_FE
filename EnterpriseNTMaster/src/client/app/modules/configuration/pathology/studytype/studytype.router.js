(function() {
    'use strict';

    angular
        .module('app.studytype')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [{
            state: 'studytype',
            config: {
                url: '/studytype',
                templateUrl: 'app/modules/configuration/pathology/studytype/studytype.html',
                controller: 'StudyTypeController',
                controllerAs: 'vm',
                authorize: false,
                title: 'StudyType',
                idpage: 125
            }
        }];
    }
})();