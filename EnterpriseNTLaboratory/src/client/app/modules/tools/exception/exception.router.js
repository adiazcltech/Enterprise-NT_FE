(function() {
  'use strict';

  angular
    .module('app.exception')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'exception',
        config: {
          url: '/exception',
          templateUrl: 'app/modules/tools/exception/exception.html',
          controller: 'ExceptionController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Exception',
          idpage: 244
        }
      }
    ];
  }
})();
