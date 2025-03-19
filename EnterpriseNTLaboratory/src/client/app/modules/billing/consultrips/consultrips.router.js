(function () {
  'use strict';

  angular
    .module('app.consultrips')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) { 
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'consultrips',
        config: {
          url: '/consultrips',
          templateUrl: 'app/modules/billing/consultrips/consultrips.html',
          controller: 'consultripsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'consultrips',
          idpage: 506
        }
      }
    ];
  }
})();
