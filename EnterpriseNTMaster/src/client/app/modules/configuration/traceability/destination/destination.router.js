(function () {
    'use strict';

    angular
      .module('app.destination')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'destination',
              config: {
                  url: '/destination',
                  templateUrl: 'app/modules/configuration/traceability/destination/destination.html',
                  controller: 'DestinationController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Destination',
                  idpage: 51
              }
          }
        ];
    }
})();