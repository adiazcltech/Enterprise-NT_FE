(function () {
    'use strict';

    angular
      .module('app.question')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'question',
              config: {
                  url: '/question',
                  templateUrl: 'app/modules/configuration/interview/question/question.html',
                  controller: 'questionController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'question',
                  idpage: 91
              }
          }
        ];
    }
})();
