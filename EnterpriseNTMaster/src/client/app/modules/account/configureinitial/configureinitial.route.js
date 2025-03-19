(function() {
  'use strict';

  angular
    .module('app.configureinitial')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'configureinitial',
        config: {
          url: '/account/configureinitial',
          templateUrl: 'app/modules/account/configureinitial/configureinitial.html',
          controller: 'configureinitialController',
          controllerAs: 'vm',
          authorize: false,
          title: 'configureinitial'
        }
      }
    ];
  }
})();


