(function() {
  'use strict';

  angular
    .module('app.reports')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'reports',
        config: {
          url: '/reports',
          templateUrl: 'app/modules/reportsandconsultations/reports/reports.html',
          controller: 'ReportsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Reports',
          idpage: 229
        }
      }
    ];
  }
})();
 