(function() {
  'use strict';

  angular
    .module('app.rate')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'rate',
        config: {
          url: '/rate',
          templateUrl: 'app/modules/configuration/billing/rate/rate.html',
          controller: 'RateController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Rate',
          idpage: 22
        }
      }
    ];
  }
})();
