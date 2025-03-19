(function () {
  'use strict';

  angular
    .module('app.testlab')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'test',
        config: {
          url: '/testlab',
          templateUrl: 'app/modules/configuration/test/test/testlab.html',
          controller: 'TestController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Test',
          idpage: 66
        }
      }
    ];
  }
})();
