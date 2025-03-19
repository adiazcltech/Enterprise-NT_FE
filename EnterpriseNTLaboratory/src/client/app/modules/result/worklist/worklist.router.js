(function () {
  'use strict';

  angular
    .module('app.worklist')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'worklist',
        config: {
          url: '/worklist',
          templateUrl: 'app/modules/result/worklist/worklist.html',
          controller: 'WorkListController',
          controllerAs: 'vm',
          authorize: false,
          title: 'WorkList',
          idpage: 224
        }
      }
    ];
  }
})();
