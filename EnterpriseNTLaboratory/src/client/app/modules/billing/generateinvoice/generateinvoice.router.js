(function() {
  'use strict';

  angular
    .module('app.generateinvoice')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'generateinvoice',
        config: {
          url: '/generateinvoice',
          templateUrl: 'app/modules/billing/generateinvoice/generateinvoice.html',
          controller: 'generateinvoiceController',
          controllerAs: 'vm',
          authorize: false,
          title: 'generateinvoice',
          idpage: 501
        }
      }
    ];
  }
})();
