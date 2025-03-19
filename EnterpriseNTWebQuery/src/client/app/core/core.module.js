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
      'ngplus',
      'pascalprecht.translate',
      'ngIdle',
      'oc.lazyLoad',
      'ngResource',      
      'minicolors',
      'vcRecaptcha',
      'vs-repeat',
      'lz-string',
      'ngMaterial',
      'ngMessages',
      'angular.filter'
    ]);
})();
