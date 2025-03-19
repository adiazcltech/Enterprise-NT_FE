(function() {
  'use strict';

  angular
    .module('app.contract')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'contract',
        config: {
          url: '/contract',
          templateUrl: 'app/modules/configuration/billing/contract/contract.html',
          controller: 'contractController',
          controllerAs: 'vm',
          authorize: false,
          title: 'contract',
          idpage: 153
        }
      }
    ];
  }
})();
