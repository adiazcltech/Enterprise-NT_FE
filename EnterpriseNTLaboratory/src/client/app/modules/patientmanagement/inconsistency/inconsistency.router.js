(function () {
  'use strict';

  angular
    .module('app.inconsistency')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'inconsistency',
        config: {
          url: '/inconsistency',
          templateUrl: 'app/modules/patientmanagement/inconsistency/inconsistency.html',
          controller: 'InconsistencyController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Inconsistency',
          idpage: 219
        }
      }
    ];
  }
})();
