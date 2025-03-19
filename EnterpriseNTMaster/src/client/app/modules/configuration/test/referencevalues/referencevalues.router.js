(function () {
    'use strict';

    angular
      .module('app.referencevalues')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'referencevalues',
              config: {
                  url: '/referencevalues',
                  templateUrl: 'app/modules/configuration/test/referencevalues/referencevalues.html',
                  controller: 'ReferencevaluesController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'referencevalues',
                  idpage: 54
              }
          }
        ];
    }
})();
