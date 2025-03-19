(function() {
  'use strict';

  angular
    .module('app.barcodeedit')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'barcodeedit',
        config: {
          url: '/barcodeedit',
          templateUrl: 'app/modules/tools/barcodeedit/barcodeedit.html',
          controller: 'barcodeeditController',
          controllerAs: 'vm',
          authorize: false,
          title: 'barcodeedit',
          idpage: 248
        }
      }
    ];
  }
})();
