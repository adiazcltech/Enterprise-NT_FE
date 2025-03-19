(function () {
    'use strict';

    angular
      .module('app.excludetestbyuser')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'excludetestbyuser',
              config: {
                  url: '/excludetestbyuser',
                  templateUrl: 'app/modules/configuration/user/excludetestbyuser/excludetestbyuser.html',
                  controller: 'ExcludeTestbyUserController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'ExcludeTestbyUser',
                  idpage: 83
              }
          }
        ];
    }
})();
