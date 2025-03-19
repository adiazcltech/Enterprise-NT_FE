(function() {
  'use strict';

  angular
    .module('app.printinvoice')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'printinvoice',
        config: {
          url: '/printinvoice',
          templateUrl: 'app/modules/billing/printinvoice/printinvoice.html',
          controller: 'printinvoiceController',
          controllerAs: 'vm',
          authorize: false,
          title: 'printinvoice',
          idpage: 505
        }
      }
    ];
  }
})();
