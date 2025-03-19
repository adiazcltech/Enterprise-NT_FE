(function () {
    'use strict';
    angular
      .module('app.anatomicalsite')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'anatomicalsite',
              config: {
                  url: '/anatomicalsite',
                  templateUrl: 'app/modules/configuration/microbiology/anatomicalsite/anatomicalsite.html',
                  controller: 'AnatomicalsiteController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Anatomicalsite',
                  idpage: 44
              }
          }
        ];
    }
})();
