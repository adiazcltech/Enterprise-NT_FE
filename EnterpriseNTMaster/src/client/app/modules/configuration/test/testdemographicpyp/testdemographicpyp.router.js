(function() {
  'use strict';

  angular
    .module('app.testdemographicpyp')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'testdemographicpyp',
        config: {
          url: '/testdemographicpyp',
          templateUrl: 'app/modules/configuration/test/testdemographicpyp/testdemographicpyp.html',
          controller: 'TestDemographicPyPController',
          controllerAs: 'vm',
          authorize: false,
          title: 'TestDemographicPyP',
          idpage: 58
        }
      }
    ];
  }
})();
