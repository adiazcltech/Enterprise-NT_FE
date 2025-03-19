(function () {

  'use strict';

  angular
    .module('app.samplingSites')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */

  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'samplingSites',
        config: {
          url: '/samplingSites',
          templateUrl: 'app/modules/configuration/traceability/samplingSites/samplingSites.html',
          controller: 'samplingSitesController',
          controllerAs: 'vm',
          authorize: false,
          title: 'samplingSites',
          idpage: 53
        }
      }
    ];
  }

})();
