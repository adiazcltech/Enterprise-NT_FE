(function() {
  'use strict';

  angular
      .module('app.transcription')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'transcription',
      config: {
        url: '/transcription',
        templateUrl: 'app/modules/pathology/macroscopy/transcription/transcription.html',
        controller: 'transcriptionController',
        controllerAs: 'vm',
        authorize: false,
        title: 'transcription',
        idpage: 421
      }
    }];
  }
})();
