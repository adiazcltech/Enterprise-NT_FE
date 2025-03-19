(function() {
  'use strict';

  angular
      .module('app.event')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'event',
          config: {
              url: '/event',
              templateUrl: 'app/modules/configuration/pathology/event/event.html',
              controller: 'eventController',
              controllerAs: 'vm',
              authorize: false,
              title: 'event',
              idpage: 132
          }
      }];
  }
})();
