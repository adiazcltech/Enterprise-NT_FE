(function () {
    'use strict';

    angular
      .module('app.middleware')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'middleware',
              config: {
                  url: '/middleware',
                  templateUrl: 'app/modules/configuration/integration/middleware/middleware.html',
                  controller: 'MiddlewareController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Middleware',
                  idpage: 32
              }
          }
        ];
    }
})();
