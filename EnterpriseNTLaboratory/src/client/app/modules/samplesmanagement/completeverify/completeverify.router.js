(function () {
  'use strict';

  angular
    .module('app.completeverify')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'completeverify',
        config: {
          url: '/completeverify',
          templateUrl: 'app/modules/samplesmanagement/completeverify/completeverify.html',
          controller: 'completeverifyController',
          controllerAs: 'vm',
          authorize: false,
          title: 'completeverify',
          idpage: 211
        }
      }
    ];
  }
})();
