(function () {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate',
      'ngSanitize',
      'blocks.exception',
      'blocks.logger',
      'blocks.router',
      'blocks.settings',
      'ui.router',
      'ngplus',
      'pascalprecht.translate',
      'LocalStorageModule',
      'ngCookies',
      'rzTable',
      'ngMaterial',
      'ngMessages',
    ]);
})();
