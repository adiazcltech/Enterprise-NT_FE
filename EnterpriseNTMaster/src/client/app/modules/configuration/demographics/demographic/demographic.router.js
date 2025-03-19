(function () {
  'use strict';

  angular
    .module('app.demographic')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'demographic',
        config: {
          url: '/demographic',
          templateUrl: 'app/modules/configuration/demographics/demographic/demographic.html',
          controller: 'DemographicsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Demographics',
          idpage: 95
        }
      }
    ];
  }
})();
