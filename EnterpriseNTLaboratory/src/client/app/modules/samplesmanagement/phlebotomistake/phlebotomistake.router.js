(function() {
  'use strict';

  angular
    .module('app.phlebotomistake')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [ 
      {
        state: 'phlebotomistake',
        config: {
          url: '/phlebotomistake',
          templateUrl: 'app/modules/samplesmanagement/phlebotomistake/phlebotomistake.html',
          controller: 'phlebotomistakeController',
          controllerAs: 'vm',
          authorize: true,
          title: 'phlebotomistake',
          idpage: 307
        }
      }
    ];
  }
})();
