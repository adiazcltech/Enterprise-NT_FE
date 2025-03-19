(function () {
  'use strict';

  angular
    .module('app.historypatient')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'historypatient',
        config: {
          url: '/historypatient',
          templateUrl: 'app/modules/patientmanagement/historypatient/historypatient.html',
          controller: 'HistoryPatientController',
          controllerAs: 'vm',
          authorize: false,
          title: 'HistoryPatient',
          idpage: 216
        }
      }
    ];
  }
})();
