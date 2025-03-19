(function () {
    'use strict';

    angular
      .module('app.processfortest')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'processfortest',
              config: {
                  url: '/processfortest',
                  templateUrl: 'app/modules/configuration/microbiology/processfortest/processfortest.html',
                  controller: 'ProcessfortestController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Processfortest',
                  idpage: 40
              }
          }
        ];
    }
})();
