(function() {
  'use strict';

  angular
    .module('app.requirement')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'requirement',
        config: {
          url: '/requirement',
          templateUrl: 'app/modules/configuration/test/requirement/requirement.html',
          controller: 'RequirementController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Requirement',
          idpage: 71
        }
      }
    ];
  }
})();
