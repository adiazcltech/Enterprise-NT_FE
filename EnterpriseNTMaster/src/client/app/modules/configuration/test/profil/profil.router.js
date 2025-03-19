(function () {
    'use strict';

    angular
      .module('app.profil')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'profil',
              config: {
                  url: '/profil',
                  templateUrl: 'app/modules/configuration/test/profil/profil.html',
                  controller: 'ProfilController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Profil',
                  idpage: 65
              }
          }
        ];
    }
})();
