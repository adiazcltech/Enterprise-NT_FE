(function () {
  'use strict';
  angular
    .module('app.shifts')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [
        {
            state: 'shifts',
            config: {
                url: '/shifts',
                templateUrl: 'app/modules/configuration/appointment/shifts/shifts.html',
                controller: 'shiftsController',
                controllerAs: 'vm',
                authorize: false,
                title: 'shifts',
                idpage: 191
            }
        }
      ];
  }
})();
