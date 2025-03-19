(function() {
  'use strict';

  angular
    .module('app.controldeliveryreports')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'controldeliveryreports',
        config: {
          url: '/controldeliveryreports',
          templateUrl: 'app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html',
          controller: 'ControldeliveryreportsController',
          controllerAs: 'vm',
          authorize: false,
          title: 'ControlDeliveryreports',
          idpage: 230
        }
      }
    ];
  }
})();
