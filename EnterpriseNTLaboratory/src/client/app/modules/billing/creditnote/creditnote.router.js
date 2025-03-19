(function() {
  'use strict';

  angular
    .module('app.creditnote')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'creditnote',
        config: {
          url: '/creditnote',
          templateUrl: 'app/modules/billing/creditnote/creditnote.html',
          controller: 'creditnoteController',
          controllerAs: 'vm',
          authorize: false,
          title: 'creditnote',
          idpage: 502
        }
      }
    ];
  }
})();
