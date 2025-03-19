(function() {
  'use strict';

  angular
    .module('app.mailconfigurate')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'mailconfigurate',
        config: {
          url: '/mailconfigurate',
          templateUrl: 'app/modules/configuration/mailconfigurate/mailconfigurate.html',
          controller: 'mailconfigurateController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Mailconfigurate',
          idpage: 5
        }
      }
    ];
  }
})();
