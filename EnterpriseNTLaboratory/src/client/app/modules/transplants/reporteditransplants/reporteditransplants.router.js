(function() {
  'use strict';

  angular
    .module('app.reporteditransplants')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'reporteditransplants',
        config: {
          url: '/reporteditransplants',
          templateUrl: 'app/modules/transplants/reporteditransplants/reporteditransplants.html',
          controller: 'ReportEdittransplantsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'reporteditransplants',
          idpage: 605
        }
      }
    ];
  }
})();
