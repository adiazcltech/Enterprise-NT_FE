(function () {
  'use strict';
  angular
    .module('app.shiftsbybranch')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [
        {
            state: 'shiftsbybranch',
            config: {
                url: '/shiftsbybranch',
                templateUrl: 'app/modules/configuration/appointment/shiftsbybranch/shiftsbybranch.html',
                controller: 'shiftsbybranchController',
                controllerAs: 'vm',
                authorize: false,
                title: 'shiftsbybranch',
                idpage: 192
            }
        }
      ];
  }
})();
