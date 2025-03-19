(function() {
  'use strict';

  angular
    .module('app.comment')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'comment',
        config: {
          url: '/comment',
          templateUrl: 'app/modules/configuration/test/comment/comment.html',
          controller: 'commentController',
          controllerAs: 'vm',
          authorize: false,
          title: 'Comentario',
          idpage:68
        }
      }
    ];
  }
})();
