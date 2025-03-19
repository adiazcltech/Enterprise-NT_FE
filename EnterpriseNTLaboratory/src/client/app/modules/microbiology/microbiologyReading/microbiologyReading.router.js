(function () {
  'use strict';

  angular
    .module('app.microbiologyReading')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'microbiologyReading',
        config: {
          url: '/microbiologyReading',
          templateUrl: 'app/modules/microbiology/microbiologyReading/microbiologyReading.html',
          controller: 'microbiologyReadingController',
          controllerAs: 'vm',
          authorize: false,
          title: 'microbiologyReading',
          idpage: 302
        }
      }
    ];
  }
})();
