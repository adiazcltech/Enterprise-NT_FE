(function () {
  'use strict';

  var core = angular.module('app.core');

  core.config(configure);

  core.run(loadAuthData);

  function configure($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
  }

  loadAuthData.$inject = ['authService'];
  
  function loadAuthData(authService) {
    authService.loadAuthData();
  }

})();
