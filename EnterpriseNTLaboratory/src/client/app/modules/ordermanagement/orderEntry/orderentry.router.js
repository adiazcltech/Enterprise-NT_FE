(function () {
  'use strict';

  angular
    .module('app.orderentry')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'orderentry',
        config: {
          url: '/orderentry',
          templateUrl: 'app/modules/ordermanagement/orderEntry/orderentry.html',
          controller: 'orderentryController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Orderentry',
          idpage: 210
        }
      }
    ];
  }
})();
