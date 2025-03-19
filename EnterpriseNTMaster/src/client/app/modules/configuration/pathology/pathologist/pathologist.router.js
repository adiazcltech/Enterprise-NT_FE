(function() {
  'use strict';

  angular
      .module('app.pathologist')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'pathologist',
          config: {
              url: '/pathologist',
              templateUrl: 'app/modules/configuration/pathology/pathologist/pathologist.html',
              controller: 'pathologistController',
              controllerAs: 'vm',
              authorize: false,
              title: 'pathologist',
              idpage: 129
          }
      }];
  }
})();
