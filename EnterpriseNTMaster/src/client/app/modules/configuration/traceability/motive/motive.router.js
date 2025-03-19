(function () {
    'use strict';

    angular
      .module('app.motive')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'motive',
              config: {
                  url: '/motive',
                  templateUrl: 'app/modules/configuration/traceability/motive/motive.html',
                  controller: 'MotiveController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Motive',
                  idpage: 52
              }
          }
        ];
    }
})();