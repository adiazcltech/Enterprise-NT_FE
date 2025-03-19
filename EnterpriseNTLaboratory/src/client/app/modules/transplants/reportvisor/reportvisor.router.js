(function () {
  'use strict';

  angular
    .module('app.reportvisor')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'reportvisor',
        config: {
          url: '/reportvisor',
          templateUrl: 'app/modules/transplants/reportvisor/reportvisor.html',
          controller: 'reportvisorController',
          controllerAs: 'vm',
          authorize: false,
          title: 'reportvisor',
          idpage: 607
        }
      }
    ];
  }
})();


