(function() {
  'use strict';

  angular
    .module('app.printorder')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'printorder',
        config: {
          url: '/printorder',
          templateUrl: 'app/modules/configuration/test/printorder/printorder.html',
          controller: 'PrintOrderController',
          controllerAs: 'vm',
          authorize: false,
          title: 'PrintOrder', 
          idpage: 63
        }
      }
    ];
  }
})();
