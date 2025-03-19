(function () {
    'use strict';

    angular
      .module('app.answer')
      .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
          {
              state: 'answer',
              config: {
                  url: '/answer',
                  templateUrl: 'app/modules/configuration/interview/answer/answer.html',
                  controller: 'answerController',
                  controllerAs: 'vm',
                  authorize: false,
                  title: 'answer',
                  idpage: 92
              }
          }
        ];
    }
})();
