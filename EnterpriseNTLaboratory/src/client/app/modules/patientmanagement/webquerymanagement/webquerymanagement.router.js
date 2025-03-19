(function () {
  'use strict';

  angular
    .module('app.webquerymanagement')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'webquerymanagement',
        config: {
          url: '/webquerymanagement',
          templateUrl: 'app/modules/patientmanagement/webquerymanagement/webquerymanagement.html',
          controller: 'WebquerymanagementController',
          controllerAs: 'vm',
          authorize: false,
          title: 'webquerymanagement',
          idpage: 252
        }
      }
    ];
  }
})();



