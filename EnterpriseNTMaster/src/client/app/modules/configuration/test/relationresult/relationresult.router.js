(function () {
    'use strict';

    angular
      .module('app.relationresult')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'relationresult',
              config: {
                  url: '/relationresult',
                  templateUrl: 'app/modules/configuration/test/relationresult/relationresult.html',
                  controller: 'RelationresultController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Relationresult',
                  idpage: 78
              }
          }
        ];
    }
})();
