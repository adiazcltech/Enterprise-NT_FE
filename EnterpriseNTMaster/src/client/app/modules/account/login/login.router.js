(function() {
  'use strict';

  angular
    .module('app.login')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'login',
        config: {
          url: '/',
          templateUrl: 'app/modules/account/login/login.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          authorize: true,
          title: 'Login'
        }
      }
    ];
  }
})();
