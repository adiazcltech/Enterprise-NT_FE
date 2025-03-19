(function() {
  'use strict';

  angular
    .module('app.traceability')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'traceability',
        config: {
          url: '/traceability',
          templateUrl: 'app/modules/audit/traceability/traceability.html',
          controller: 'traceabilityController',
          controllerAs: 'vm',
          authorize: false,
          title: 'traceability',
          idpage: 251
        }
      }
    ];
  }
})();
