(function () {
    'use strict';

    angular
      .module('app.hematologicalcounter')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'hematologicalcounter',
              config: {
                  url: '/hematologicalcounter',
                  templateUrl: 'app/modules/configuration/test/hematologicalcounter/hematologicalcounter.html',
                  controller: 'hematologicalcounterController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'hematologicalcounter',
                  idpage: 80
              }
          }
        ];
    }
})();
