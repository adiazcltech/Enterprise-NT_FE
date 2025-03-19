(function() {
  'use strict';

  angular
    .module('app.container')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'container',
        config: {
          url: '/container',
          templateUrl: 'app/modules/configuration/test/container/container.html',
          controller: 'ContainerController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Container',
          idpage:89
        }
      }
    ];
  }
})();
