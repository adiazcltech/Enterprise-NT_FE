(function() {
  'use strict';

  angular
    .module('app.sectionviewer')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'sectionviewer',
        config: {
          url: '/sectionviewer',
          templateUrl: 'app/modules/tools/sectionviewer/sectionviewer.html',
          controller: 'SectionviewerController',
          controllerAs: 'vm',
          authorize: false,
          title: 'sectionviewer',
          idpage: 245
        }
      }
    ];
  }
})();
