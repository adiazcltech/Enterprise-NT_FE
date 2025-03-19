(function () {
    'use strict';

    angular
        .module('app.branchforlaboratory')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'branchforlaboratory',
                config: {
                    url: '/branchforlaboratory',
                    templateUrl: 'app/modules/configuration/test/branchforlaboratory/branchforlaboratory.html',
                    controller: 'branchforlaboratoryController',
                    controllerAs: 'vm',
                    authorize: false,
                    title: 'branchforlaboratory',
                    idpage: 111
                }
            }
        ];
    }
})();
