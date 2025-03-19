(function () {
  'use strict';

  angular
    .module('app.integrationanalyzer')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'integrationanalyzer',
        config: {
          url: '/integrationanalyzer',
          templateUrl: 'app/modules/configuration/user/integrationanalyzer/integrationanalyzer.html',
          controller: 'UserintegrationanalyzerController',
          controllerAs: 'vm',
          authorize: false,
          title: 'integrationanalyzer',
          idpage: 108
        }
      }
    ];
  }
})();
