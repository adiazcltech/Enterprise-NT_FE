(function () {
    'use strict';

    angular
      .module('app.resultemplate')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'resultemplate',
              config: {
                  url: '/resultemplate',
                  templateUrl: 'app/modules/configuration/test/resultemplate/resultemplate.html',
                  controller: 'ResultTemplateController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'ResultTemplate',
                  idpage: 79
              }
          }
        ];
    }
})();
