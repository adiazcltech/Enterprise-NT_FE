(function () {
  'use strict';

  angular
    .module('app.medicalappointment')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'medicalappointment',
        config: {
          url: '/medicalappointment',
          templateUrl: 'app/modules/ordermanagement/medicalappointment/medicalappointment.html',
          controller: 'medicalappointmentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'MedicalAppointment',
          idpage: 306
        }
      }
    ];
  }
})();
