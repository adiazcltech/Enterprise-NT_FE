(function () {
  'use strict';

  angular
    .module('app.restartcounter')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'restartcounter',
        config: {
          url: '/restartcounter',
          templateUrl: 'app/modules/ordermanagement/restartcounter/restartcounter.html',
          controller: 'restartcounterController',
          controllerAs: 'vm',
          authorize: false,
          title: 'restartcounter',
          idpage: 215
        }
      }
    ];
  }
})();
