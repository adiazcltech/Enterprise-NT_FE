(function () {
    'use strict';

    angular
      .module('app.generalconfig')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'generalconfig',
              config: {
                  url: '/generalconfig',
                  templateUrl: 'app/modules/configuration/configuration/generalconfig/generalconfig.html',
                  controller: 'generalconfigController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'generalconfig',
                  idpage: 106
              }
          }
        ];
    }
})();
