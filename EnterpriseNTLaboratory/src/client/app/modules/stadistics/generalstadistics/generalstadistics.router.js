(function() {
  'use strict';

  angular
    .module('app.generalstadistics')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'generalstadistics',
        config: {
          url: '/generalstadistics',
          templateUrl: 'app/modules/stadistics/generalstadistics/generalstadistics.html',
          controller: 'generalstadisticsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Stadistics',
          idpage: 236
        }
      }
    ];
  }
})();
