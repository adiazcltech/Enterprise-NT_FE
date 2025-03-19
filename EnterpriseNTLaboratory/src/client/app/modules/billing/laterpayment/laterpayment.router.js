(function() {
  'use strict';

  angular
    .module('app.laterpayment')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'laterpayment',
        config: {
          url: '/laterpayment',
          templateUrl: 'app/modules/billing/laterpayment/laterpayment.html',
          controller: 'laterpaymentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'laterpayment',
          idpage: 231
        }
      }
    ];
  }
})();
