(function() {
  'use strict';

  angular
    .module('app.centralsystem')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'centralsystem',
        config: {
          url: '/centralsystem',
          templateUrl: 'app/modules/configuration/integration/centralsystem/centralsystem.html',
          controller: 'CentralSystemController',
          controllerAs: 'vm',
          authorize: false,
          title: 'CentralSystem',
          idpage: 31
        }
      }
    ];
  }
})();
