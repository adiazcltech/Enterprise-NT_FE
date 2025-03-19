(function() {
  'use strict';

  angular
    .module('app.specialstadistics')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'specialstadistics',
        config: {
          url: '/specialstadistics',
          templateUrl: 'app/modules/stadistics/specialstadistics/specialstadistics.html',
          controller: 'specialstadisticsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'specialstadistics',
          idpage: 237
        }
      }
    ];
  }
})();
