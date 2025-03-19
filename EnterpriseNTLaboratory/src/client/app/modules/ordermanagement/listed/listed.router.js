(function () {
  'use strict';

  angular
    .module('app.listed')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'listed',
        config: {
          url: '/listed',
          templateUrl: 'app/modules/ordermanagement/listed/listed.html',
          controller: 'ListedController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Listed',
          idpage: 212
        }
      }
    ];
  }
})();
