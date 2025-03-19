(function () {
  'use strict';

  angular
    .module('app.service')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'service',
        config: {
          url: '/service',
          templateUrl: 'app/modules/configuration/demographics/service/service.html',
          controller: 'serviceController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Service',
          idpage: 107
        }
      }
    ];
  }
})();
