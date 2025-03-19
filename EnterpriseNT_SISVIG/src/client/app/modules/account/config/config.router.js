(function () {
  'use strict';

  angular
    .module('app.config')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'config',
      config: {
        url: '/config',
        templateUrl: 'app/modules/account/config/config.html',
        controller: 'configController',
        controllerAs: 'vm',
        authorize: true,
        title: 'config',
        idpage: 210
      }
    }];
  }
})();
