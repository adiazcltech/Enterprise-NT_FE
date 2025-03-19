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
      'ngIdle',
      'LocalStorageModule',
      'pascalprecht.translate',
      'color.picker',
      'toggle-switch',
      'ui.bootstrap',
      'vs-repeat',
      'lz-string',
      'naif.base64'
    ]);
})();