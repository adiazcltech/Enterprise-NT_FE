(function() {
  'use strict';

  angular
    .module('app.testedition')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'testedition',
        config: {
          url: '/testedition',
          templateUrl: 'app/modules/configuration/test/testedition/testedition.html',
          controller: 'TestEditionController',
          controllerAs: 'vm',
          authorize: false,
          title: 'TestEdition',
          idpage: 61
        }
      }
    ];
  }
})();
