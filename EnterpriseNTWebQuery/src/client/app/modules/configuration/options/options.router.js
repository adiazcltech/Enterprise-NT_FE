(function() {
  'use strict';

  angular
    .module('app.options')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'options',
        config: {
          url: '/options',
          templateUrl: 'app/modules/configuration/options/options.html',
          controller: 'optionsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Options',
          idpage: 2
        }
      }
    ];
  }
})();
