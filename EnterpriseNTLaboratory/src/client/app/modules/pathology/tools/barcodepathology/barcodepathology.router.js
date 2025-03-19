(function() {
  'use strict';

  angular
      .module('app.barcodepathology')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'barcodepathology',
          config: {
              url: '/barcodepathology',
              templateUrl: 'app/modules/pathology/tools/barcodepathology/barcodepathology.html',
              controller: 'barcodepathologyController',
              controllerAs: 'vm',
              authorize: false,
              title: 'barcodepathology',
              idpage: 470
          }
      }];
  }
})();
