(function () {
    'use strict';

    angular
      .module('app.automatictest')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'automatictest',
              config: {
                  url: '/automatictest',
                  templateUrl: 'app/modules/configuration/test/automatictest/automatictest.html',
                  controller: 'AutomaticTestController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'AutomaticTest',
                  idpage: 77
              }
          }
        ];
    }
})();
