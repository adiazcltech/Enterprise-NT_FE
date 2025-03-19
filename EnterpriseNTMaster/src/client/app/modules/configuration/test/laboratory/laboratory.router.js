(function () {
    'use strict';

    angular
      .module('app.laboratory')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'laboratory',
              config: {
                  url: '/laboratory',
                  templateUrl: 'app/modules/configuration/test/laboratory/laboratory.html',
                  controller: 'LaboratoryController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Laboratory',
                  idpage: 85
              }
          }
        ];
    }
})();
