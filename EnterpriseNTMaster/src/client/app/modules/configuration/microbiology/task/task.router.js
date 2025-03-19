(function() {
  'use strict';

  angular
    .module('app.task')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'task',
        config: {
          url: '/task',
          templateUrl: 'app/modules/configuration/microbiology/task/task.html',
          controller: 'TaskController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Task',
          idpage: 43
        }
      }
    ];
  }
})();
