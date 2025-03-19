(function () {
  'use strict';

  angular
    .module('app.testalarm')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'testalarm',
        config: {
          url: '/testalarm',
          templateUrl: 'app/modules/configuration/test/testalarm/testalarm.html',
          controller: 'TestAlarmController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Test Alarm',
          idpage: 154
        }
      }
    ];
  }
})();
