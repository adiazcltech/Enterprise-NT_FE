(function () {
  'use strict';

  angular
    .module('app.user')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'user',
        config: {
          url: '/user',
          templateUrl: 'app/modules/configuration/user/user/user.html',
          controller: 'UsersController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Users',
          idpage: 13
        }
      }
    ];
  }
})();
