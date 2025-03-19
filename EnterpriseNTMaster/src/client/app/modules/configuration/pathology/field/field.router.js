(function() {
  'use strict';

  angular
      .module('app.field')
      .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
  }

  function getStates() {
      return [{
          state: 'field',
          config: {
              url: '/field',
              templateUrl: 'app/modules/configuration/pathology/field/field.html',
              controller: 'fieldController',
              controllerAs: 'vm',
              authorize: false,
              title: 'field',
              idpage: 133
          }
      }];
  }
})();
