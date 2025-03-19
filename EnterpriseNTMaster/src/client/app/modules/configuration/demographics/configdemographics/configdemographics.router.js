(function () {
    'use strict';

    angular
      .module('app.configdemographics')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'configdemographics',
              config: {
                  url: '/configdemographics',
                  templateUrl: 'app/modules/configuration/demographics/configdemographics/configdemographics.html',
                  controller: 'configdemographicsController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'configdemographics',
                  idpage: 93
              }
          }
        ];
    }
})();
