(function () {
  'use strict';

  angular
    .module('app.activationorder')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'activationorder',
        config: {
          url: '/activationorder',
          templateUrl: 'app/modules/ordermanagement/activationorder/activationorder.html',
          controller: 'activationorderController',
          controllerAs: 'vm',
          authorize: false,
          title: 'activationorder',
          idpage: 214
        }
      }
    ];
  }
})();
