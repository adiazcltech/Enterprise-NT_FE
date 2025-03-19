(function() {
  'use strict';

  angular
      .module('app.inclusioncenter')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'inclusioncenter',
      config: {
        url: '/inclusioncenter',
        templateUrl: 'app/modules/pathology/histotechnology/inclusioncenter/inclusioncenter.html',
        controller: 'inclusioncenterController',
        controllerAs: 'vm',
        authorize: false,
        title: 'inclusioncenter',
        idpage: 430
      }
    }];
  }
})();
