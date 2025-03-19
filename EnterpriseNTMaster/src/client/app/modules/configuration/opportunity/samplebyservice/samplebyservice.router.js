(function() {
  'use strict';

  angular
    .module('app.samplebyservice')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'samplebyservice',
        config: {
          url: '/samplebyservice',
          templateUrl: 'app/modules/configuration/opportunity/samplebyservice/samplebyservice.html',
          controller: 'SampleByServiceController',
          controllerAs: 'vm',
          authorize: false,
          title: 'SampleByService',
          idpage: 35
        }
      }
    ];
  }
})();
