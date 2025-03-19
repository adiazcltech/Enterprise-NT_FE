(function() {
  'use strict';

  angular
    .module('app.standarization')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'standarization',
        config: {
          url: '/standarization',
          templateUrl: 'app/modules/configuration/integration/standarization/standarization.html',
          controller: 'StandarizationController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Standarization',
          idpage: 28
        }
      }
    ];
  }
})();
