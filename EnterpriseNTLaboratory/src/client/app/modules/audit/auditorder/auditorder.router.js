(function() {
  'use strict';

  angular
    .module('app.auditorder')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'auditorder',
        config: {
          url: '/auditorder',
          templateUrl: 'app/modules/audit/auditorder/auditorder.html',
          controller: 'auditorderController',
          controllerAs: 'vm',
          authorize: false,
          title: 'auditorder',
          idpage: 233
        }
      }
    ];
  }
})();
