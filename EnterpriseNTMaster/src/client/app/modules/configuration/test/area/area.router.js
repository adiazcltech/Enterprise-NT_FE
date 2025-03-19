(function() {
  'use strict';

  angular
    .module('app.area')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'area',
        config: {
          url: '/area',
          templateUrl: 'app/modules/configuration/test/area/area.html',
          controller: 'AreaController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Area',
          idpage: 74
        }
      }
    ];
  }
})();
