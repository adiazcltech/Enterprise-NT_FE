(function () {
    'use strict';

    angular
      .module('app.diagnosticsfortest')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'diagnosticsfortest',
              config: {
                  url: '/diagnosticsfortest',
                  templateUrl: 'app/modules/configuration/demographics/diagnosticsfortest/diagnosticsfortest.html',
                  controller: 'DiagnosticsfortestController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Diagnosticsfortest',
                  idpage: 86
              }
          }
        ];
    }
})();
