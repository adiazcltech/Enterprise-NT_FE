/* jshint ignore:start */
(function () {
  'use strict';

  var core = angular.module('app.core');

  core.config(toastrConfig);

  toastrConfig.$inject = ['toastr'];
  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 5000;
    toastr.options.positionClass = 'toast-bottom-right';
  }



  var config = {
    appErrorPrefix: '[enterpriseNt Error] ',
    appTitle: 'enterpriseNt',
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider',
    '$translateProvider', '$mdDateLocaleProvider', '$mdAriaProvider','localStorageServiceProvider'];
  /* @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider,
    $translateProvider, $mdDateLocaleProvider, $mdAriaProvider,localStorageServiceProvider) {
    localStorageServiceProvider.setStorageType('sessionStorage');
    $mdAriaProvider.disableWarnings();
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });


    $translateProvider.useStaticFilesLoader({
      prefix: 'languages/locale-',
      suffix: '.json'
    });

    var languaje;
    if (localStorage.getItem("NG_TRANSLATE_LANG_KEY") === 'es' ||
      localStorage.getItem("NG_TRANSLATE_LANG_KEY") === null) {
      languaje = 'es';
    } else {
      languaje = 'de';
    }
    moment.locale(languaje);
    var localeData = moment.localeData();
    $mdDateLocaleProvider.months = localeData._months;
    $mdDateLocaleProvider.shortMonths = moment.monthsShort();
    $mdDateLocaleProvider.days = localeData._weekdays;
    $mdDateLocaleProvider.shortDays = localeData._weekdaysMin;
    // Optionaly let the week start on the day as defined by moment's locale data
    $mdDateLocaleProvider.firstDayOfWeek = localeData._week.dow;


    $translateProvider.preferredLanguage('es');


    $translateProvider.useLocalStorage();
    $translateProvider.useSanitizeValueStrategy('escape');
  }
})();
/* jshint ignore:end */
