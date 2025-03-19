(function () {
  'use strict';

  angular
    .module('app.reportencryption')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'reportencryption',
      config: {
        url: '/reportencryption',
        templateUrl: 'app/modules/configuration/demographics/reportencryption/reportencryption.html',
        controller: 'reportencryptionController',
        controllerAs: 'vm',
        authorize: false,
        title: 'Reportencryption',
        idpage: 112
      }
    }];
  }
})();
