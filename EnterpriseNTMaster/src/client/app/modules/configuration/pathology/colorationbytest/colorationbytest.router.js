(function() {
  'use strict';

  angular
      .module('app.colorationbytest')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'colorationbytest',
          config: {
              url: '/colorationbytest',
              templateUrl: 'app/modules/configuration/pathology/colorationbytest/colorationbytest.html',
              controller: 'colorationbytestController',
              controllerAs: 'vm',
              authorize: false,
              title: 'colorationbytest',
              idpage: 136
          }
      }];
  }
})();
