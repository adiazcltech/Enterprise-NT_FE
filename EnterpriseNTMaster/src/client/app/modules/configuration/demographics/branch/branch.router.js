(function() {
  'use strict';

  angular
    .module('app.branch')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'branch',
        config: {
          url: '/branch',
          templateUrl: 'app/modules/configuration/demographics/branch/branch.html',
          controller: 'branchController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Branch',
          idpage: 99
        }
      }
    ];
  }
})();
