(function() {
  'use strict';

  angular
    .module('app.destinationsample')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'destinationsample',
        config: {
          url: '/destinationsample',
          templateUrl: 'app/modules/stadistics/destinationsample/destinationsample.html',
          controller: 'destinationsampleController',
          controllerAs: 'vm',
          authorize: false,
          title: 'destinationsample',
          idpage: 239
        }
      }
    ];
  }
})();
