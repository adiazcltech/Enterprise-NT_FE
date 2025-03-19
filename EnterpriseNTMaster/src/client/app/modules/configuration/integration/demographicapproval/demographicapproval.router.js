(function() {
  'use strict';

  angular
    .module('app.demographicapproval')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'demographicapproval',
        config: {
          url: '/demographicapproval',
          templateUrl: 'app/modules/configuration/integration/demographicapproval/demographicapproval.html',
          controller: 'demographicapprovalController',
          controllerAs: 'vm',
          authorize: false,
          title: 'demographicapproval',
          idpage: 29
        }
      }
    ];
  }
})();
