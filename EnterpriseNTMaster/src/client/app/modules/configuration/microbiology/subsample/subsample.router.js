(function() {
  'use strict';

  angular
    .module('app.subsample')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'subsample',
        config: {
          url: '/subsample',
          templateUrl: 'app/modules/configuration/microbiology/subsample/subsample.html',
          controller: 'SubSampleController',
          controllerAs: 'vm',
          authorize: false,
          title: 'SubSample',
          idpage: 37
        }
      }
    ];
  }
})();
