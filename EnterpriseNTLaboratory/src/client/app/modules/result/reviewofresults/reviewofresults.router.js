(function () {
  'use strict';

  angular
    .module('app.reviewofresults')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'reviewofresults',
        config: {
          url: '/reviewofresults',
          templateUrl: 'app/modules/result/reviewofresults/reviewofresults.html',
          controller: 'reviewofresultsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'reviewofresults',
          idpage: 223
        }
      }
    ];
  }
})();
