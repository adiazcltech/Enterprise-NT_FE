(function () {
    'use strict';

    angular
      .module('app.ordertype')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'ordertype',
              config: {
                  url: '/ordertype',
                  templateUrl: 'app/modules/configuration/demographics/ordertype/ordertype.html',
                  controller: 'OrdertypeController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Ordertype',
                  idpage: 98
              }
          }
        ];
    }
})();

