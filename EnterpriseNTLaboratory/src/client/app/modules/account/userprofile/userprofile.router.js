(function () {
  'use strict';

  angular
    .module('app.userprofile')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'userprofile',
      config: {
        url: '/userprofile',
        templateUrl: 'app/modules/account/userprofile/userprofile.html',
        controller: 'userprofileController',
        controllerAs: 'vm',
        authorize: true,
        title: 'userprofile',
        idpage: 210
      }
    }];
  }
})();
