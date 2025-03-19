(function () {
    'use strict';

    angular
      .module('app.customerate')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'customerate',
              config: {
                  url: '/customerate',
                  templateUrl: 'app/modules/configuration/billing/customerate/customerate.html',
                  controller: 'CustomerateController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'CustomerRate',
                  idpage: 20
              }
          }
        ];
    }
})();
