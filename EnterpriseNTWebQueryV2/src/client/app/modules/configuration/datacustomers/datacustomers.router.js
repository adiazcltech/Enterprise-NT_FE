(function() {
  'use strict';

  angular
    .module('app.datacustomers')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'datacustomers',
        config: {
          url: '/datacustomers',
          templateUrl: 'app/modules/configuration/datacustomers/datacustomers.html',
          controller: 'datacustomersController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Datacustomers',
          idpage: 1
        }
      }
    ];
  }
})();
