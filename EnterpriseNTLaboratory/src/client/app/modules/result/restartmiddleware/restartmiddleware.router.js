(function () {
  'use strict';

  angular
    .module('app.restartmiddleware')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'restartmiddleware',
        config: {
          url: '/restartmiddleware',
          templateUrl: 'app/modules/result/restartmiddleware/restartmiddleware.html',
          controller: 'restartmiddlewareController',
          controllerAs: 'vm',
          authorize: false,
          title: 'restartmiddleware',
          idpage: 225
        }
      }
    ];
  }
})();
