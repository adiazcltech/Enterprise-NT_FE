(function () {
  'use strict';

  angular
    .module('app.participants')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'participants',
        config: {
          url: '/participants',
          templateUrl: 'app/modules/transplants/participants/participants.html',
          controller: 'participantsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'participants',
          idpage: 602
        }
      }
    ];
  }
})();


