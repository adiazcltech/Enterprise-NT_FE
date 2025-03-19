(function () {
  'use strict';

  angular
    .module('app.donor')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'donor',
        config: {
          url: '/donor',
          templateUrl: 'app/modules/transplants/donor/donor.html',
          controller: 'donorsamplesController',
          controllerAs: 'vm',
          authorize: false,
          title: 'donor',
          idpage: 603
        }
      }
    ];
  }
})();


