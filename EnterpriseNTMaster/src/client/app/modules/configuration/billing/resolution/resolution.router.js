(function () {
    'use strict';
    angular
      .module('app.resolution')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'resolution',
              config: {
                  url: '/resolution',
                  templateUrl: 'app/modules/configuration/billing/resolution/resolution.html',
                  controller: 'ResolutionController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Resolution',
                  idpage: 21
              }
          }
        ];
    }
})();
