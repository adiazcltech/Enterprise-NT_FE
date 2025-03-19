(function() {
  'use strict';

  angular
    .module('app.print')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'print',
        config: {
          url: '/:orqrm',
          templateUrl: 'app/modules/configuration/print/print.html',
          controller: 'PrintController',
          controllerAs: 'vm',
          title: 'print',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> Dashboard'
          }
        }
      }
    ];
  }
})();
