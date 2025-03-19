(function () {
  'use strict';

  angular
    .module('app.demographicwebconsultation')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'demographicwebconsultation',
        config: {
          url: '/demographicwebconsultation',
          templateUrl: 'app/modules/configuration/integration/demographicwebconsultation/demographicwebconsultation.html',
          controller: 'DemographicwebconsultationController',
          controllerAs: 'vm',
          authorize: false,
          title: 'demographicwebconsultation',
          idpage: 110
        }
      }
    ];
  }
})();
