(function() {
  'use strict';

  angular
    .module('app.changeprices')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'changeprices',
        config: {
          url: '/changeprices',
          templateUrl: 'app/modules/billing/changeprices/changeprices.html',
          controller: 'changepricesController',
          controllerAs: 'vm',
          authorize: false,
          title: 'changeprices',
          idpage: 509
        }
      }
    ];
  }
})();
