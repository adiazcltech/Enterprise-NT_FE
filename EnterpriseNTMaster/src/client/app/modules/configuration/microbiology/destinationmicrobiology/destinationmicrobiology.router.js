(function () {
    'use strict';

    angular
      .module('app.destinationmicrobiology')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'destinationmicrobiology',
              config: {
                  url: '/destinationmicrobiology',
                  templateUrl: 'app/modules/configuration/microbiology/destinationmicrobiology/destinationmicrobiology.html',
                  controller: 'destinationmicrobiologyController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'destinationmicrobiology',
                  idpage: 45
              }
          }
        ];
    }
})();