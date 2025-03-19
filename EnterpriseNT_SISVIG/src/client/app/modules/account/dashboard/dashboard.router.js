(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'dashboard',
        config: {
          url: '/dashboard',
          templateUrl: 'app/modules/account/dashboard/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Dashboard',
          idpage: 200
        }
      }
    ];
  }
})();
