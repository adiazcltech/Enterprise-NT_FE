(function () {
  'use strict';

  angular
    .module('app.informedconsent')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [{
      state: 'informedconsent',
      config: {
        url: '/informedconsent',
        templateUrl: 'app/modules/reportsandconsultations/informedconsent/informedconsent.html',
        controller: 'informedconsentController',
        controllerAs: 'vm',
        authorize: false,
        title: 'Informedconsent',
        idpage: 249
      }
    }];
  }
})();
