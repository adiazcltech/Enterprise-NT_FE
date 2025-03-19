(function () {
    'use strict';

    angular
      .module('app.process')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'process',
              config: {
                  url: '/process',
                  templateUrl: 'app/modules/configuration/microbiology/process/process.html',
                  controller: 'ProcessController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Process',
                  idpage: 41
              }
          }
        ];
    }
})();
