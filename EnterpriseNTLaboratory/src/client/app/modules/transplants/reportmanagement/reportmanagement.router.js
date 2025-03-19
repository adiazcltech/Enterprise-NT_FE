(function () {
  'use strict';

  angular
    .module('app.reportmanagement')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'reportmanagement',
        config: {
          url: '/reportmanagement',
          templateUrl: 'app/modules/transplants/reportmanagement/reportmanagement.html',
          controller: 'reportmanagementController',
          controllerAs: 'vm',
          authorize: false,
          title: 'reportmanagement',
          idpage: 606
        }
      }
    ];
  }
})();


