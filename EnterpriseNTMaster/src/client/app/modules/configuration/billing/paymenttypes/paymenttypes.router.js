(function () {
    'use strict';
    angular
      .module('app.paymenttypes')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'paymenttypes',
              config: {
                  url: '/paymenttypes',
                  templateUrl: 'app/modules/configuration/billing/paymenttypes/paymenttypes.html',
                  controller: 'paymenttypesController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'paymenttypes',
                  idpage: 27
              }
          }
        ];
    }
})();
