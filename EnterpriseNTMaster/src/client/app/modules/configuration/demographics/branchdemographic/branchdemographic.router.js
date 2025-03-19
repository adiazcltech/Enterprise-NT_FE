(function () {
  'use strict';

  angular
    .module('app.branchdemographic')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'branchdemographic',
      config: {
        url: '/branchdemographic',
        templateUrl: 'app/modules/configuration/demographics/branchdemographic/branchdemographic.html',
        controller: 'branchdemographicController',
        controllerAs: 'vm',
        authorize: false,
        title: 'branchdemographic',
        idpage: 114
      }
    }];
  }
})();
