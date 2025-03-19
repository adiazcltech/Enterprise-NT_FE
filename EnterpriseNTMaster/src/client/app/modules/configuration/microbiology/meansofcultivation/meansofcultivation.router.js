(function () {
    'use strict';

    angular
      .module('app.meansofcultivation')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'meansofcultivation',
              config: {
                  url: '/meansofcultivation',
                  templateUrl: 'app/modules/configuration/microbiology/meansofcultivation/meansofcultivation.html',
                  controller: 'MeansofcultivationController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Meansofcultivation',
                  idpage: 39
              }
          }
        ];
    }
})();
