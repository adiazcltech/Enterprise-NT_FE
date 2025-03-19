(function() {
  'use strict';

  angular
    .module('app.termsandConditions')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'termsandConditions',
        config: {
          url: '/termsandConditions',
          templateUrl: 'app/modules/configuration/termsandConditions/termsandConditions.html',
          controller: 'termsandConditionsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'TermsandConditions',
          idpage: 4
        }
      }
    ];
  }
})();
