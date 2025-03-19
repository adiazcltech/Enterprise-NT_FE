(function () {
  'use strict';

  angular
    .module('app.growtmicrobiology')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'growtmicrobiology',
        config: {
          url: '/growtmicrobiology',
          templateUrl: 'app/modules/microbiology/growtmicrobiology/growtmicrobiology.html',
          controller: 'growtmicrobiologyController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Growtmicrobiology',
          idpage: 304
        }
      }
    ];
  }
})();
