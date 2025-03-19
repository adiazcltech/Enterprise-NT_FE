(function() {
  'use strict';

  angular
    .module('app.auditmaster')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'auditmaster',
        config: {
          url: '/auditmaster',
          templateUrl: 'app/modules/audit/auditmaster/auditmaster.html',
          controller: 'auditmasterController',
          controllerAs: 'vm',
          authorize: false,
          title: 'auditmaster',
          idpage: 234
        }
      }
    ];
  }
})();
