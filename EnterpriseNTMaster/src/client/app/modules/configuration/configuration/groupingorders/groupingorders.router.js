(function () {
    'use strict';

    angular
      .module('app.groupingorders')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'groupingorders',
              config: {
                  url: '/groupingorders',
                  templateUrl: 'app/modules/configuration/configuration/groupingorders/groupingorders.html',
                  controller: 'groupingordersController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'groupingorders',
                  idpage: 104
              }
          }
        ];
    }
})();