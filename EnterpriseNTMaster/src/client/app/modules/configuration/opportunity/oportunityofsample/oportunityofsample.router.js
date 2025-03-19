(function () {
    'use strict';

    angular
      .module('app.oportunityofsample')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'oportunityofsample',
              config: {
                  url: '/oportunityofsample',
                  templateUrl: 'app/modules/configuration/opportunity/oportunityofsample/oportunityofsample.html',
                  controller: 'OportunityofsampleController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'OportunityofSample',
                  idpage: 34
              }
          }
        ];
    }
})();
