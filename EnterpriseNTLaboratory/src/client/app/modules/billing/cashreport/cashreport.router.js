(function() {
  'use strict';

  angular
    .module('app.cashreport')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'cashreport',
        config: {
          url: '/cashreport',
          templateUrl: 'app/modules/billing/cashreport/cashreport.html',
          controller: 'cashreportController',
          controllerAs: 'vm',
          authorize: false,
          title: 'cashreport',
          idpage: 504
        }
      }
    ];
  }
})();
