(function () {
    'use strict';

    angular
      .module('app.literalresultfortest')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'literalresultfortest',
              config: {
                  url: '/literalresultfortest',
                  templateUrl: 'app/modules/configuration/test/literalresultfortest/literalresultfortest.html',
                  controller: 'literalResultbyTestController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'LiteralResultbyTest',
                  idpage: 75
              }
          }
        ];
    }
})();
