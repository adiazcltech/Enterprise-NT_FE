(function() {
  'use strict';

  angular
    .module('app.excludetestsbydemographics')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'excludetestsbydemographics',
        config: {
          url: '/excludetestsbydemographics',
          templateUrl: 'app/modules/configuration/test/excludetestsbydemographics/excludetestsbydemographics.html',
          controller: 'excludetestsbydemographicsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'excludetestsbydemographics',
          idpage: 82
        }
      }
    ];
  }
})();
