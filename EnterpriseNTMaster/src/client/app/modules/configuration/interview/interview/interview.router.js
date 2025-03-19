(function () {
    'use strict';

    angular
      .module('app.interview')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'interview',
              config: {
                  url: '/interview',
                  templateUrl: 'app/modules/configuration/interview/interview/interview.html',
                  controller: 'InterviewController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'Interview',
                  idpage: 90
              }
          }
        ];
    }
})();
