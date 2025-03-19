(function() {
  'use strict';

  angular
    .module('app.physician')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'physician',
        config: {
          url: '/physician',
          templateUrl: 'app/modules/configuration/demographics/physician/physician.html',
          controller: 'PhysicianController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Physician',
          idpage: 96
        }
      }
    ];
  }
})();
