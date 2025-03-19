(function () {
  'use strict';

  angular
    .module('app.historyreassignment')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'historyreassignment',
        config: {
          url: '/historyreassignment',
          templateUrl: 'app/modules/patientmanagement/historyreassignment/historyreassignment.html',
          controller: 'historyreassignmentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'HistoryReassignment',
          idpage: 218
        }
      }
    ];
  }
})();
