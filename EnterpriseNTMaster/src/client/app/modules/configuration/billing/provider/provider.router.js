(function () {
    'use strict';
    angular
      .module('app.provider')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'provider',
              config: {
                  url: '/provider',
                  templateUrl: 'app/modules/configuration/billing/provider/provider.html',
                  controller: 'ProviderController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Provider',
                  idpage: 24
              }
          }
        ];
    }
})();
