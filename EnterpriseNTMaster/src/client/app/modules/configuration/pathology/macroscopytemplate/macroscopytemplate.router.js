(function() {
  'use strict';

  angular
      .module('app.macroscopytemplate')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'macroscopytemplate',
          config: {
              url: '/macroscopytemplate',
              templateUrl: 'app/modules/configuration/pathology/macroscopytemplate/macroscopytemplate.html',
              controller: 'macroscopytemplateController',
              controllerAs: 'vm',
              authorize: false,
              title: 'macroscopytemplate',
              idpage: 134
          }
      }];
  }
})();
