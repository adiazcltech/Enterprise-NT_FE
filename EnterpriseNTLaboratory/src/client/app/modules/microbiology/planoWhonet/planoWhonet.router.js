(function () {
  'use strict';

  angular
    .module('app.planoWhonet')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'planoWhonet',
        config: {
          url: '/planoWhonet',
          templateUrl: 'app/modules/microbiology/planoWhonet/planoWhonet.html',
          controller: 'PlanoWhonetController',
          controllerAs: 'vm',
          authorize: false,
          title: 'PlanoWhonet',
          idpage: 303
        }
      }
    ];
  }
})();
