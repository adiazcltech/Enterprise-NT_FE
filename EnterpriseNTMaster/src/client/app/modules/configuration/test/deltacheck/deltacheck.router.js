(function () {
    'use strict';

    angular
      .module('app.deltacheck')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'deltacheck',
              config: {
                  url: '/deltacheck',
                  templateUrl: 'app/modules/configuration/test/deltacheck/deltacheck.html',
                  controller: 'DeltaCheckController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Deltacheck',
                  idpage: 55
              }
          }
        ];
    }
})();
