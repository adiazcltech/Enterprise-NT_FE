(function() {
  'use strict';

  angular
      .module('app.coloration')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'coloration',
          config: {
              url: '/coloration',
              templateUrl: 'app/modules/configuration/pathology/coloration/coloration.html',
              controller: 'colorationController',
              controllerAs: 'vm',
              authorize: false,
              title: 'coloration',
              idpage: 128
          }
      }];
  }
})();
