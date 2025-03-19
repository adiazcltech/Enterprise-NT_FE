(function() {
  'use strict';

  angular
      .module('app.protocol')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'protocol',
          config: {
              url: '/protocol',
              templateUrl: 'app/modules/configuration/pathology/protocol/protocol.html',
              controller: 'protocolController',
              controllerAs: 'vm',
              authorize: false,
              title: 'protocol',
              idpage: 130
          }
      }];
  }
})();
