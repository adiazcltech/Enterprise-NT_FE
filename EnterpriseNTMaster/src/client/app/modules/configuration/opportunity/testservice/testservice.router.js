(function() {
  'use strict';

  angular
    .module('app.testservice')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'testservice',
        config: {
          url: '/testservice',
          templateUrl: 'app/modules/configuration/opportunity/testservice/testservice.html',
          controller: 'TestServiceController',
          controllerAs: 'vm',
          authorize: false,
          title: 'TestService',
          idpage: 33
        }
      }
    ];
  }
})();
