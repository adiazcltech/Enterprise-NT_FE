(function() {
  'use strict';

  angular
      .module('app.casete')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'casete',
          config: {
              url: '/casete',
              templateUrl: 'app/modules/configuration/pathology/casete/casete.html',
              controller: 'caseteController',
              controllerAs: 'vm',
              authorize: false,
              title: 'casete',
              idpage: 126
          }
      }];
  }
})();
