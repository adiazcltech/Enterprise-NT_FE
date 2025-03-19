(function () {
  'use strict';

  angular
    .module('app.indicator')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'indicators',
        config: {
          url: '/indicators',
          templateUrl: 'app/modules/indicators/indicators/indicators.html',
          controller: 'IndicatorsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Indicators',
          idpage: 241
        }
      }
    ];
  }
})();
