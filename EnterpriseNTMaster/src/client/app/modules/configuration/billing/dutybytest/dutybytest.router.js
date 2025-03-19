(function() {
  'use strict';

  angular
    .module('app.dutybytest')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'dutybytest',
        config: {
          url: '/dutybytest',
          templateUrl: 'app/modules/configuration/billing/dutybytest/dutybytest.html',
          controller: 'dutybytestController',
          controllerAs: 'vm',
          authorize: false,
          title: 'dutybytest',
          idpage: 16
        }
      }
    ];
  }
})();
