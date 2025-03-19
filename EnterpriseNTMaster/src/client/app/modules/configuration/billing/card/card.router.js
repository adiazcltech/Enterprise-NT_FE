(function() {
  'use strict';

  angular
    .module('app.card')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'card',
        config: {
          url: '/card',
          templateUrl: 'app/modules/configuration/billing/card/card.html',
          controller: 'CardController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Card',
          idpage: 25
        }
      }
    ];
  }
})();
