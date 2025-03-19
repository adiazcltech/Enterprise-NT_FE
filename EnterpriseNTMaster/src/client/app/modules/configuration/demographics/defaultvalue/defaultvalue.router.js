(function () {
  'use strict';

  angular
    .module('app.defaultvalue')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'defaultvalue',
      config: {
        url: '/defaultvalue',
        templateUrl: 'app/modules/configuration/demographics/defaultvalue/defaultvalue.html',
        controller: 'defaultvalueController',
        controllerAs: 'vm',
        authorize: false,
        title: 'defaultvalue',
        idpage: 115
      }
    }];
  }
})();
