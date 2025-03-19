(function () {
  'use strict';

  angular
    .module('app.role')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'role',
        config: {
          url: '/role',
          templateUrl: 'app/modules/configuration/user/role/role.html',
          controller: 'RoleController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Role',
          idpage: 12

        }
      }
    ];
  }
})();
