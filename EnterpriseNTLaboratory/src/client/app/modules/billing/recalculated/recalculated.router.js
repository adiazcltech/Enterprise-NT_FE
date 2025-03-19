(function() {
  'use strict';

  angular
    .module('app.recalculated')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'recalculated',
        config: {
          url: '/recalculated',
          templateUrl: 'app/modules/billing/recalculated/recalculated.html',
          controller: 'recalculatedController',
          controllerAs: 'vm',
          authorize: false,
          title: 'recalculated',
          idpage: 508
        }
      }
    ];
  }
})();
