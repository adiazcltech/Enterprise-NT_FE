(function() {
  'use strict';

  angular
      .module('app.cut')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'cut',
      config: {
        url: '/cut',
        templateUrl: 'app/modules/pathology/histotechnology/cut/cut.html',
        controller: 'cutController',
        controllerAs: 'vm',
        authorize: false,
        title: 'cut',
        idpage: 432
      }
    }];
  }
})();
