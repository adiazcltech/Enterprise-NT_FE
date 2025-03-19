(function () {
  'use strict';

  angular
    .module('app.historyassignment')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'historyassignment',
        config: {
          url: '/historyassignment',
          templateUrl: 'app/modules/patientmanagement/historyassignment/historyassignment.html',
          controller: 'historyassignmentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'HistoryAssignment',
          idpage: 217
        }
      }
    ];
  }
})();
