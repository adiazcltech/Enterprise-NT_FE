(function() {
  'use strict';

  angular
    .module('app.demographicsItem')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'demographicsItem',
        config: {
          url: '/demographicsItem',
          templateUrl: 'app/modules/configuration/demographics/demographicsItem/demographicsItem.html',
          controller: 'DemographicsItemsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'DemographicsItems',
          idpage: 94
        }
      }
    ];
  }
})();
