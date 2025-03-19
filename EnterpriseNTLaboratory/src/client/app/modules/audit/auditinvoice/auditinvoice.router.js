(function() {
  'use strict';

  angular
    .module('app.auditinvoice')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'auditinvoice',
        config: {
          url: '/auditinvoice',
          templateUrl: 'app/modules/audit/auditinvoice/auditinvoice.html',
          controller: 'auditinvoiceController',
          controllerAs: 'vm',
          authorize: false,
          title: 'auditinvoice',
          idpage: 507
        }
      }
    ];
  }
})();
