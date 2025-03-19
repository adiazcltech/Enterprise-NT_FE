(function() {
  'use strict';

  angular
    .module('app.typeuser')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'typeuser',
        config: {
          url: '/typeuser',
          templateUrl: 'app/modules/configuration/typeuser/typeuser.html',
          controller: 'typeuserController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Typeuser',
          idpage: 3
        }
      }
    ];
  }
})();
