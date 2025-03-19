(function () {
    'use strict';

    angular
      .module('app.unit')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'unit',
              config: {
                  url: '/unit',
                  templateUrl: 'app/modules/configuration/test/unit/unit.html',
                  controller: 'UnitController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Unit',
                  idpage: 73
              }
          }
        ];
    }
})();
