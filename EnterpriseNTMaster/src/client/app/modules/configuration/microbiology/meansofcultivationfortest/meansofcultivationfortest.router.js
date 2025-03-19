(function () {
    'use strict';

    angular
      .module('app.meansofcultivationfortest')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'meansofcultivationfortest',
              config: {
                  url: '/meansofcultivationfortest',
                  templateUrl: 'app/modules/configuration/microbiology/meansofcultivationfortest/meansofcultivationfortest.html',
                  controller: 'MeansfortestController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Meansofcultivationfortest',
                  idpage: 38
              }
          }
        ];
    }
})();
