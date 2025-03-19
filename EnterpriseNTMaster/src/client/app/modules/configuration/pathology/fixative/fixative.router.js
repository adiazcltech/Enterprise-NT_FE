(function() {
  'use strict';

  angular
      .module('app.fixative')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'fixative',
          config: {
              url: '/fixative',
              templateUrl: 'app/modules/configuration/pathology/fixative/fixative.html',
              controller: 'fixativeController',
              controllerAs: 'vm',
              authorize: false,
              title: 'Fixative',
              idpage: 127
          }
      }];
  }
})();
