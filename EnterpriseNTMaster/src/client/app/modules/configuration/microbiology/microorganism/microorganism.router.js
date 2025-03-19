(function () {
    'use strict';
    angular
      .module('app.microorganism')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'microorganism',
              config: {
                  url: '/microorganism',
                  templateUrl: 'app/modules/configuration/microbiology/microorganism/microorganism.html',
                  controller: 'microorganismController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Microorganism',
                  idpage: 49
              }
          }
        ];
    }
})();
