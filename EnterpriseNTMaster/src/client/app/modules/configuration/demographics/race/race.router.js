(function () {
    'use strict';

    angular
      .module('app.race')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'race',
              config: {
                  url: '/race',
                  templateUrl: 'app/modules/configuration/demographics/race/race.html',
                  controller: 'RaceController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Race',
                  idpage: 101
              }
          }
        ];
    }
})();
