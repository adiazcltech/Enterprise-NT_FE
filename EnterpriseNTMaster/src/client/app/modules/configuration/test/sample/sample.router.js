(function () {
    'use strict';

    angular
      .module('app.sample')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'sample',
              config: {
                  url: '/sample',
                  templateUrl: 'app/modules/configuration/test/sample/sample.html',
                  controller: 'SampleController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Sample',
                  idpage: 88

              }
          }
        ];
    }
})();
