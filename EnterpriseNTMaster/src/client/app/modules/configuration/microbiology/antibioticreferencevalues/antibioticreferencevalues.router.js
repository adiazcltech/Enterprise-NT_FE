(function () {
    'use strict';
    angular
      .module('app.antibioticreferencevalues')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'antibioticreferencevalues',
              config: {
                  url: '/antibioticreferencevalues',
                  templateUrl: 'app/modules/configuration/microbiology/antibioticreferencevalues/antibioticreferencevalues.html',
                  controller: 'AntibioticreferencevaluesController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Antibioticreferencevalues',
                  idpage: 46
              }
          }
        ];
    }
})();
