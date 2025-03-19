(function () {
    'use strict';

    angular
      .module('app.serviceprinting')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'serviceprinting',
              config: {
                  url: '/serviceprinting',
                  templateUrl: 'app/modules/configuration/configuration/serviceprinting/serviceprinting.html',
                  controller: 'serviceprintingController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'ServicePrinting',
                  idpage: 103
              }
          }
        ];
    }
})();
