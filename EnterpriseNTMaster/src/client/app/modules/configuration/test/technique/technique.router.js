(function() {
  'use strict';

  angular
    .module('app.technique')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'technique',
        config: {
          url: '/technique',
          templateUrl: 'app/modules/configuration/test/technique/technique.html',
          controller: 'TechniqueController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Technique',
          idpage: 72
        }
      }
    ];
  }
})();
