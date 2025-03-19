(function() {
  'use strict';

  angular
    .module('app.audituser')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'audituser',
        config: {
          url: '/audituser',
          templateUrl: 'app/modules/audit/audituser/audituser.html',
          controller: 'AudituserController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Audituser',
          idpage: 235
        }
      }
    ];
  }
})();
