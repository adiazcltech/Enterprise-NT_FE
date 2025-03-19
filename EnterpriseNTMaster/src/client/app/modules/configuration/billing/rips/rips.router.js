(function () {
    'use strict';

    angular
      .module('app.rips')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'rips',
              config: {
                  url: '/rips',
                  templateUrl: 'app/modules/configuration/billing/rips/rips.html',
                  controller: 'ripsController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'rips',
                  idpage: 150
              }
          }
        ];
    }
})();
