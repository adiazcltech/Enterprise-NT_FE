(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authInterceptorService', authInterceptorService);

  authInterceptorService.$inject = ['$q', '$location', 'localStorageService',];

  function authInterceptorService($q, $location, localStorageService) {
    var service = {
      request: request,
      responseError: responseError
    };

    return service;

    function request(config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('careerscore.authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.authToken;
      }

      return config;
    }

    function responseError(rejection) {
      if (rejection.status === 401) {
        $location.path('/');
      }
      return $q.reject(rejection);
    }

  }
})();
