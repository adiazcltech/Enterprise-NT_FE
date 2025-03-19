(function () {
    'use strict';

    angular
      .module('app.userstandardization')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'userstandardization',
              config: {
                  url: '/userstandardization',
                  templateUrl: 'app/modules/configuration/integration/userstandardization/userstandardization.html',
                  controller: 'UserstandardizationController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Userstandardization',
                  idpage: 30
              }
          }
        ];
    }
})();
