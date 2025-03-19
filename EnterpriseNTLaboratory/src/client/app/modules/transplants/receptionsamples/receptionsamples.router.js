(function () {
  'use strict';

  angular
    .module('app.receptionsamples')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'receptionsamples',
        config: {
          url: '/receptionsamples',
          templateUrl: 'app/modules/transplants/receptionsamples/receptionsamples.html',
          controller: 'receptionsamplesController',
          controllerAs: 'vm',
          authorize: false,
          title: 'receptionsamples',
          idpage: 601
        }
      }
    ];
  }
})();


