(function () {
    'use strict';

    angular
      .module('app.literalresult')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'literalresult',
              config: {
                  url: '/literalresult',
                  templateUrl: 'app/modules/configuration/test/literalresult/literalresult.html',
                  controller: 'LiteralResultController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'LiteralResult',
                  idpage: 76
              }
          }
        ];
    }
})();
