(function () {
    'use strict';

    angular
      .module('app.alarm')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'alarm',
              config: {
                  url: '/alarm',
                  templateUrl: 'app/modules/configuration/test/alarm/alarm.html',
                  controller: 'AlarmController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Alarm',
                  idpage: 69
              }
          }
        ];
    }
})();
