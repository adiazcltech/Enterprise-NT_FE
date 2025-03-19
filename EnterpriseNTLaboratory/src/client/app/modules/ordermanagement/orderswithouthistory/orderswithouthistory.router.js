(function () {
  'use strict';

  angular
    .module('app.orderswithouthistory')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'orderswithouthistory',
        config: {
          url: '/orderswithouthistory',
          templateUrl: 'app/modules/ordermanagement/orderswithouthistory/orderswithouthistory.html',
          controller: 'OrdersWithoutHistoryController',
          controllerAs: 'vm',
          authorize: false,
          title: 'OrdersWithoutHistory',
          idpage: 213
        }
      }
    ];
  }
})();



