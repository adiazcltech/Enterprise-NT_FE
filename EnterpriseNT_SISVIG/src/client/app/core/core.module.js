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
      'LocalStorageModule',
      'ngCookies',
      'ui.router',
      'pascalprecht.translate',
      'ngIdle',
      'ngResource',
      'ngWebSocket',
      'ngMaterial',
      'angular-velocity',
      'ui.select',
      'ngMessages'
    ]);
})();
