(function() {
  'use strict';

  angular
    .module('app.collectionmethod')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'collectionmethod',
        config: {
          url: '/collectionmethod',
          templateUrl: 'app/modules/configuration/microbiology/collectionmethod/collectionmethod.html',
          controller: 'CollectionmethodController',
          controllerAs: 'vm',
          authorize: false,
          title: 'collectionmethod',
          idpage: 42
        }
      }
    ];
  }
})();
