(function () {
    'use strict';

    angular
      .module('app.groups')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'groups',
              config: {
                  url: '/groups',
                  templateUrl: 'app/modules/configuration/test/groups/groups.html',
                  controller: 'GroupsController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Groups',
                  idpage: 62
              }
          }
        ];
    }
})();
