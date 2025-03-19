(function () {
  'use strict';

  angular
    .module('app.unlockorderhistory')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'unlockorderhistory',
        config: {
          url: '/unlockorderhistory',
          templateUrl: 'app/modules/patientmanagement/unlockorderhistory/unlockorderhistory.html',
          controller: 'UnlockOrderHistoryController',
          controllerAs: 'vm',
          authorize: false,
          title: 'UnlockOrderHistory',
          idpage: 220
        }
      }
    ];
  }
})();



