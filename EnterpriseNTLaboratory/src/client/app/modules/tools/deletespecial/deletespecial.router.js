(function () {
  'use strict';

  angular
    .module('app.deletespecial')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'deletespecial',
        config: {
          url: '/deletespecial',
          templateUrl: 'app/modules/tools/deletespecial/deletespecial.html',
          controller: 'DeletespecialController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Deletespecial',
          idpage: 246
        }
      }
    ];
  }
})();
