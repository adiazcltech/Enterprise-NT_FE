(function () {
  'use strict';

  angular
    .module('app.otherreports')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'otherreports',
        config: {
          url: '/otherreports',
          templateUrl: 'app/modules/indicators/otherreports/otherreports.html',
          controller: 'otherreportsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'otherreports',
          idpage: 305
        }
      }
    ];
  }
})();
