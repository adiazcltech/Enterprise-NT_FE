(function () {
  'use strict';

  angular
    .module('app.sendEmailAutomaticResult')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'sendEmailAutomaticResult',
        config: {
          url: '/sendEmailAutomaticResult',
          templateUrl: 'app/modules/result/sendEmailAutomaticResult/sendEmailAutomaticResult.html',
          controller: 'SendEmailAutomaticResultController',
          controllerAs: 'vm',
          authorize: false,
          title: 'sendEmailAutomaticResult',
          idpage: 224
        }
      }
    ];
  }
})();
