(function () {
  'use strict';

  angular
    .module('app.cubicleassignment')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'cubicleassignment',
        config: {
          url: '/cubicleassignment',
          templateUrl: 'app/modules/tools/cubicleassignment/cubicleassignment.html',
          controller: 'cubicleassignmentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'cubicleassignment',
          idpage: 250
        }
      }
    ];
  }
})();
