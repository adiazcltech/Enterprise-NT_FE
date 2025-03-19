(function () {
    'use strict';

    angular
      .module('app.laboratorytest')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'laboratorytest',
              config: {
                  url: '/laboratorytest',
                  templateUrl: 'app/modules/configuration/test/laboratorytest/laboratorytest.html',
                  controller: 'LaboratorytestController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Laboratorytest',
                  idpage: 84
              }
          }
        ];
    }
})();
