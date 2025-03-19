(function () {
    'use strict';

    angular
      .module('app.diagnostic')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'diagnostic',
              config: {
                  url: '/diagnostic',
                  templateUrl: 'app/modules/configuration/test/diagnostic/diagnostic.html',
                  controller: 'DiagnosticController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'diagnostic',
                  idpage: 87
              }
          }
        ];
    }
})();
