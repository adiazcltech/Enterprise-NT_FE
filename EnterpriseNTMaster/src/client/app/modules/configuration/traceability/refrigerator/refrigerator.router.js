(function () {
    'use strict';
    angular
      .module('app.refrigerator')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'refrigerator',
              config: {
                  url: '/refrigerator',
                  templateUrl: 'app/modules/configuration/traceability/refrigerator/refrigerator.html',
                  controller: 'RefrigeratorController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Refrigerator',
                  idpage: 53
              }
          }
        ];
    }
})();
