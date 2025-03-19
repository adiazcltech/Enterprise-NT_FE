(function () {
  'use strict';

  angular
    .module('app.demographictest')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'demographictest',
        config: {
          url: '/demographictest',
          templateUrl: 'app/modules/configuration/demographics/demographictest/demographictest.html',
          controller: 'DemographicTestController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Demographic Test',
          idpage: 155
        }
      }
    ];
  }
})();
