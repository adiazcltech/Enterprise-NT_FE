(function() {
  'use strict';

  angular
    .module('app.statisticswithprices')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'statisticswithprices',
        config: {
          url: '/statisticswithprices',
          templateUrl: 'app/modules/stadistics/statisticswithprices/statisticswithprices.html',
          controller: 'statisticswithpricesController',
          controllerAs: 'vm',
          authorize: false,
          title: 'statistics with prices',
          idpage: 238
        }
      }
    ];
  }
})();
