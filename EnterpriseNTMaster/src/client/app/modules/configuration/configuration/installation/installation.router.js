(function () {
    'use strict';

    angular
      .module('app.installation')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'installation',
              config: {
                  url: '/installation',
                  templateUrl: 'app/modules/configuration/configuration/installation/installation.html',
                  controller: 'InstallationController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Installation',
                  idpage: 102
              }
          }
        ];
    }
})();
