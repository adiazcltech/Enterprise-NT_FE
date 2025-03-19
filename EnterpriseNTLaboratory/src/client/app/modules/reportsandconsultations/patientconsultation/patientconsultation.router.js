(function() {
  'use strict';

  angular
    .module('app.patientconsultation')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'patientconsultation',
        config: {
          url: '/patientconsultation',
          templateUrl: 'app/modules/reportsandconsultations/patientconsultation/patientconsultation.html',
          controller: 'patientconsultationController',
          controllerAs: 'vm',
          authorize: false,
          title: 'patientconsultation',
          idpage: 232
        }
      }
    ];
  }
})();
