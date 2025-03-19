(function() {
  'use strict';

  angular
    .module('app.priceassigment')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'priceassigment',
        config: {
          url: '/priceassigment',
          templateUrl: 'app/modules/configuration/billing/priceassigment/priceassigment.html',
          controller: 'PriceAssigmentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'PriceAssigment',
          idpage: 14
        }
      }
    ];
  }
})();
