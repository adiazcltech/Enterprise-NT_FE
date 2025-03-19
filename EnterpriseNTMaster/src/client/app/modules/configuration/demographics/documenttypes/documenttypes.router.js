(function () {
    'use strict';

    angular
      .module('app.documenttypes')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'documenttypes',
              config: {
                  url: '/documenttypes',
                  templateUrl: 'app/modules/configuration/demographics/documenttypes/documenttypes.html',
                  controller: 'documenttypesController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Document Types',
                  idpage: 100
              }
          }
        ];
    }
})();
