(function() {
  'use strict';

  angular
      .module('app.description')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'description',
      config: {
        url: '/description',
        templateUrl: 'app/modules/pathology/macroscopy/description/description.html',
        controller: 'descriptionController',
        controllerAs: 'vm',
        authorize: false,
        title: 'description',
        idpage: 420
      }
    }];
  }
})();
