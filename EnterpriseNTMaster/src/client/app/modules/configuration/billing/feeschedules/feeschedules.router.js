(function () {
    'use strict';

    angular
      .module('app.feeschedules')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'feeschedules',
              config: {
                  url: '/feeschedules',
                  templateUrl: 'app/modules/configuration/billing/feeschedules/feeschedules.html',
                  controller: 'feeschedulesController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'feeschedules',
                  idpage: 15
              }
          }
        ];
    }
})();
