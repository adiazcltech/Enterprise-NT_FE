(function () {
  'use strict';

  angular
    .module('app.histogram')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'histogram',
        config: {
          url: '/histogram',
          templateUrl: 'app/modules/indicators/histogram/histogram.html',
          controller: 'histogramController',
          controllerAs: 'vm',
          authorize: false,
          title: 'histogram',
          idpage: 242
        }
      }
    ];
  }
})();
