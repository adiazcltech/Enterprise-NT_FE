(function() {
  'use strict';

  angular
    .module('app.queries')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'queries',
        config: {
          url: '/queries',
          templateUrl: 'app/modules/reportsandconsultations/queries/queries.html',
          controller: 'QueriesController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Queries',
          idpage: 231
        }
      }
    ];
  }
})();
