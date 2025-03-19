(function () {
  'use strict';

  angular
    .module('app.selection')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'selection',
        config: {
          url: '/selection',
          templateUrl: 'app/modules/transplants/selection/selection.html',
          controller: 'selectionController',
          controllerAs: 'vm',
          authorize: false,
          title: 'selection',
          idpage: 608
        }
      }
    ];
  }
})();


