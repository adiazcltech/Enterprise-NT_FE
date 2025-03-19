(function () {
    'use strict';
    angular
      .module('app.taxprinter')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'taxprinter',
              config: {
                  url: '/taxprinter',
                  templateUrl: 'app/modules/configuration/billing/taxprinter/taxprinter.html',
                  controller: 'taxprinterController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'taxprinter',
                  idpage: 152
              }
          }
        ];
    }
})();
