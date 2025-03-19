(function() {
  'use strict';

  angular
      .module('app.processingtime')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
        state: 'processingtime',
        config: {
            url: '/processingtime',
            templateUrl: 'app/modules/configuration/pathology/processingtime/processingtime.html',
            controller: 'processingtimeController',
            controllerAs: 'vm',
            authorize: false,
            title: 'processingtime',
            idpage: 135
        }
    }];
  }
})();
