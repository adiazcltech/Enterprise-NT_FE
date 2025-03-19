(function() {
    'use strict';

    angular
        .module('app.tissueprocessor')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
      return [{
        state: 'tissueprocessor',
        config: {
          url: '/tissueprocessor',
          templateUrl: 'app/modules/pathology/histotechnology/tissueprocessor/tissueprocessor.html',
          controller: 'tissueprocessorController',
          controllerAs: 'vm',
          authorize: false,
          title: 'tissueprocessor',
          idpage: 430
        }
      }];
    }
  })();
