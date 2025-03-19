(function () {
    'use strict';
    angular
      .module('app.antibiogram')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'antibiogram',
              config: {
                  url: '/antibiogram',
                  templateUrl: 'app/modules/configuration/microbiology/antibiogram/antibiogram.html',
                  controller: 'AntibiogramController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Antibiogram',
                  idpage: 47
              }
          }
        ];
    }
})();
