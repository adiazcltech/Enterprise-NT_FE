(function () {
    'use strict';
    angular
      .module('app.edi')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'edi',
              config: {
                  url: '/edi',
                  templateUrl: 'app/modules/configuration/billing/edi/edi.html',
                  controller: 'EdiController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Edi',
                  idpage: 17
              }
          }
        ];
    }
})();
