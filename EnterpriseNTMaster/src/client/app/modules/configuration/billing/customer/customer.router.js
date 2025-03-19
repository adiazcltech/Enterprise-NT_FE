(function() {
  'use strict';

  angular
    .module('app.customer')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'customer',
        config: {
          url: '/customer',
          templateUrl: 'app/modules/configuration/billing/customer/customer.html',
          controller: 'CustomerController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Customer',
          idpage: 23
        }
      }
    ];
  }
})();
