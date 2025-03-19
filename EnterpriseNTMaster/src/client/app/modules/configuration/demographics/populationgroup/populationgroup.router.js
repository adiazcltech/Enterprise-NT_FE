(function() {
  'use strict';

  angular
    .module('app.populationgroup')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'populationgroup',
        config: {
          url: '/populationgroup',
          templateUrl: 'app/modules/configuration/demographics/populationgroup/populationgroup.html',
          controller: 'PopulationGroupsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'PopulationGroups',
          idpage: 70
        }
      }
    ];
  }
})();
