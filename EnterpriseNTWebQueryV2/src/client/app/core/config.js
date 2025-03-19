(function() {
  'use strict';

  var core = angular.module('app.core');

  core.config(toastrConfig);

  toastrConfig.$inject = ['toastr'];
  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
  }

  var config = {
    appErrorPrefix: '[Consulta web Error] ',
    appTitle: 'Consulta web',
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider','$translateProvider'];
  /* @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider,$translateProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });

    $translateProvider.useStaticFilesLoader({
      prefix: 'languages/locale-',
      suffix: '.json'
    });
    

    $translateProvider.preferredLanguage('es');
    /* $translateProvider.useLocalStorage(); */
  /*   $translateProvider.useSanitizeValueStrategy('escape');  */
  }

})();
