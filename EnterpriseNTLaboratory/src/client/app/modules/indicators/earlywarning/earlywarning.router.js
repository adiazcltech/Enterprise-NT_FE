(function () {
  'use strict';

  angular
    .module('app.earlywarning')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'earlywarning',
        config: {
          url: '/earlywarning',
          templateUrl: 'app/modules/indicators/earlywarning/earlywarning.html',
          controller: 'EarlywarningController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Earlywarning',
          idpage: 240
        }
      }
    ];
  }
})();
