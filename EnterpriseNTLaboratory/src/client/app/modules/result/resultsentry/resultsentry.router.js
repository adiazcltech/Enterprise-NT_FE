(function () {
  'use strict';

  angular
    .module('app.resultsentry')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'resultsentry',
        config: {
          url: '/resultsentry',
          templateUrl: 'app/modules/result/resultsentry/resultsentry.html',
          controller: 'resultsentryController',
          controllerAs: 'vm',
          authorize: false,
          title: 'ResultsEntry',
          idpage: 221
        }
      }
    ];
  }
})();
