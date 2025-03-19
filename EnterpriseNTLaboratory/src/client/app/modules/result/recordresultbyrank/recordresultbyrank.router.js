(function () {
  'use strict';

  angular
    .module('app.recordresultbyrank')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'recordresultbyrank',
        config: {
          url: '/recordresultbyrank',
          templateUrl: 'app/modules/result/recordresultbyrank/recordresultbyrank.html',
          controller: 'recordresultbyrankController',
          controllerAs: 'vm',
          authorize: false,
          title: 'recordresultbyrank',
          idpage: 222
        }
      }
    ];
  }
})();
