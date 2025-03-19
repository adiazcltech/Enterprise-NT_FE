(function () {
  'use strict';

  angular
    .module('app.demographicbranch')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'demographicbranch',
      config: {
        url: '/demographicbranch',
        templateUrl: 'app/modules/configuration/demographics/demographicbranch/demographicbranch.html',
        controller: 'demographicbranchController',
        controllerAs: 'vm',
        authorize: false,
        title: 'demographicbranch',
        idpage: 113
      }
    }];
  }
})();
