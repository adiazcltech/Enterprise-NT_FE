(function() {
  'use strict';

  angular
    .module('app.discounts')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'discounts',
        config: {
          url: '/discounts',
          templateUrl: 'app/modules/configuration/billing/discounts/discounts.html',
          controller: 'discountsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Discounts',
          idpage: 151
        }
      }
    ];
  }
})();
 