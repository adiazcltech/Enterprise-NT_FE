(function() {
  'use strict';

  angular
    .module('app.processingday')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'processingday',
        config: {
          url: '/processingday',
          templateUrl: 'app/modules/configuration/test/processingday/processingday.html',
          controller: 'ProcessingDayController',
          controllerAs: 'vm',
          authorize: false,
          title: 'ProcessingDay',
          idpage: 64
        }
      }
    ];
  }
})();
