(function() {
  'use strict';

  angular
    .module('app.reportedit')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'reportedit',
        config: {
          url: '/reportedit',
          templateUrl: 'app/modules/tools/reportedit/reportedit.html',
          controller: 'ReportEditController',
          controllerAs: 'vm',
          authorize: false,
          title: 'ReportEdit',
          idpage: 247
        }
      }
    ];
  }
})();
