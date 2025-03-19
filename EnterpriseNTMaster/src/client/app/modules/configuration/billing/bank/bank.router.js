(function () {
    'use strict';
    angular
      .module('app.bank')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'bank',
              config: {
                  url: '/bank',
                  templateUrl: 'app/modules/configuration/billing/bank/bank.html',
                  controller: 'BankController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Bank',
                  idpage: 26
              }
          }
        ];
    }
})();
