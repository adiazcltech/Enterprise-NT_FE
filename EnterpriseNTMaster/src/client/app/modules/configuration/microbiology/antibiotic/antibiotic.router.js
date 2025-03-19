(function () {
    'use strict';
    angular
      .module('app.antibiotic')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'antibiotic',
              config: {
                  url: '/antibiotic',
                  templateUrl: 'app/modules/configuration/microbiology/antibiotic/antibiotic.html',
                  controller: 'AntibioticController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Antibiotic',
                  idpage: 48
              }
          }
        ];
    }
})();
