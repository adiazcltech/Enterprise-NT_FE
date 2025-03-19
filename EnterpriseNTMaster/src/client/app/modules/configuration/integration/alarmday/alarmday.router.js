(function() {
  'use strict';

  angular
    .module('app.alarmday')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'alarmday',
        config: {
          url: '/alarmday',
          templateUrl: 'app/modules/configuration/integration/alarmday/alarmday.html',
          controller: 'AlarmdayController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Alarmday',
          idpage: 19
        }
      }
    ];
  }
})();
