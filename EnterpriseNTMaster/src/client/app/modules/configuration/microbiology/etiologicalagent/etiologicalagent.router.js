(function() {
  'use strict';

  angular
    .module('app.etiologicalagent')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'etiologicalagent',
        config: {
          url: '/etiologicalagent',
          templateUrl: 'app/modules/configuration/microbiology/etiologicalagent/etiologicalagent.html',
          controller: 'etiologicalagentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'etiologicalagent',
          idpage: 117
        }
      }
    ];
  }
})();
