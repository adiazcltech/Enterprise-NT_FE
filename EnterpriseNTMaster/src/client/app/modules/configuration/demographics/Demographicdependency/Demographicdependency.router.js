(function () {
  'use strict';

  angular
    .module('app.Demographicdependency')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'Demographicdependency',
      config: {
        url: '/Demographicdependency',
        templateUrl: 'app/modules/configuration/demographics/Demographicdependency/Demographicdependency.html',
        controller: 'DemographicdependencyController',
        controllerAs: 'vm',
        authorize: false,
        title: 'Demographicdependency',
        idpage: 116
      }
    }];
  }
})();
