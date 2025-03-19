(function () {
  'use strict';

  angular
    .module('app.simpleverification')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'simpleverification',
        config: {
          url: '/simpleverification',
          templateUrl: 'app/modules/samplesmanagement/simpleverification/simpleverification.html',
          controller: 'SimpleverificationController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Simpleverification',
          idpage: 211
        }
      }
    ];
  }
})();
