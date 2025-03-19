(function () {
  'use strict';

  angular
    .module('app.cytotoxicantibodies')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'cytotoxicantibodies',
        config: {
          url: '/cytotoxicantibodies',
          templateUrl: 'app/modules/transplants/cytotoxicantibodies/cytotoxicantibodies.html',
          controller: 'cytotoxicantibodiesController',
          controllerAs: 'vm',
          authorize: false,
          title: 'cytotoxicantibodies',
          idpage: 604
        }
      }
    ];
  }
})();


