(function () {
  'use strict';

  angular
    .module('app.orderingdemographic')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'orderingdemographic',
        config: {
          url: '/orderingdemographic',
          templateUrl: 'app/modules/configuration/demographics/orderingdemographic/orderingdemographic.html',
          controller: 'OrderingdemographicController',
          controllerAs: 'vm',
          authorize: false,
          title: 'orderingdemographic',
          idpage: 156
        }
      }
    ];
  }
})();
