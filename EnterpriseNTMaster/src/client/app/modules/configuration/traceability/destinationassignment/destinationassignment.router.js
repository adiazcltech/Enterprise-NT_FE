(function () {
    'use strict';

    angular
      .module('app.destinationassignment')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'destinationassignment',
              config: {
                  url: '/destinationassignment',
                  templateUrl: 'app/modules/configuration/traceability/destinationassignment/destinationassignment.html',
                  controller: 'destinationassignmentController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'destinationassignment',
                  idpage: 50
              }
          }
        ];
    }
})();