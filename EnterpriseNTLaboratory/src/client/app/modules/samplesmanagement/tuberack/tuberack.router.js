(function () {
  'use strict';

  angular
    .module('app.tuberack')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'tuberack',
        config: {
          url: '/tuberack',
          templateUrl: 'app/modules/samplesmanagement/tuberack/tuberack.html',
          controller: 'tuberackController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Tuberack',
          idpage: 243
        }
      }
    ];
  }
})();
