(function() {
  'use strict';

  angular
      .module('app.schedule')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'schedule',
          config: {
              url: '/schedule',
              templateUrl: 'app/modules/configuration/pathology/schedule/schedule.html',
              controller: 'scheduleController',
              controllerAs: 'vm',
              authorize: false,
              title: 'schedule',
              idpage: 131
          }
      }];
  }
})();
