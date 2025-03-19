(function () {
    'use strict';

    angular
      .module('app.holidays')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'holidays',
              config: {
                  url: '/holidays',
                  templateUrl: 'app/modules/configuration/configuration/holidays/holidays.html',
                  controller: 'holidaysController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'holidays',
                  idpage: 105
              }
          }
        ];
    }
})();
