(function () {
  'use strict';

  angular
    .module('app.checkmicrobiology')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'checkmicrobiology',
        config: {
          url: '/checkmicrobiology',
          templateUrl: 'app/modules/microbiology/checkmicrobiology/checkmicrobiology.html',
          controller: 'checkmicrobiologyController',
          controllerAs: 'vm',
          authorize: false,
          title: 'CheckMicrobiology',
          idpage: 301
        }
      }
    ];
  }
})();
