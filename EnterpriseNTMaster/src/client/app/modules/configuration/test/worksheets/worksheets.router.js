(function () {
    'use strict';

    angular
      .module('app.worksheets')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'worksheets',
              config: {
                  url: '/worksheets',
                  templateUrl: 'app/modules/configuration/test/worksheets/worksheets.html',
                  controller: 'worksheetsController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'worksheets',
                  idpage: 81
              }
          }
        ];
    }
})();
