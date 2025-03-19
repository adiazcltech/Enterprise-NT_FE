(function () {
    'use strict';

    angular
      .module('app.specialty')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'specialty',
              config: {
                  url: '/specialty',
                  templateUrl: 'app/modules/configuration/demographics/specialty/specialty.html',
                  controller: 'SpecialtyController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Specialty',
                  idpage: 97
              }
          }
        ];
    }
})();
