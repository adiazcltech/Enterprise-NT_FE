(function() {
  'use strict';

  angular
      .module('app.activationsamples')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'activationsamples',
          config: {
              url: '/activationsamples',
              templateUrl: 'app/modules/pathology/samplereception/activationsamples/activationsamples.html',
              controller: 'activationsamplesController',
              controllerAs: 'vm',
              authorize: false,
              title: 'activationsamples',
              idpage: 411
          }
      }];
  }
})();
