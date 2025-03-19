(function() {
  'use strict';

  angular
    .module('app.menuMaster')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'menuMaster',
        config: {
          url: '/menuMaster',
          templateUrl: 'app/modules/menuMaster/menuMaster.html',
          controller: 'menuMasterController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Menu Master',
          idpage: 1
        }
      }
    ];
  }
})();
