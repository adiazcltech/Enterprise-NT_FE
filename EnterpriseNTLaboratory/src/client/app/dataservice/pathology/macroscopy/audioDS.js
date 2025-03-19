(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('audioDS', audioDS);
  audioDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function audioDS($http, $q, exception, logger, settings) {
      var service = {
          post: post,
          uploadAudio: uploadAudio,
          put: put
      };
      return service;

      //**Guarda la información de un audio de patología*/
      function post(token, json) {
        return $http({
          hideOverlay: true,
          method: 'POST',
          headers: { 'Authorization': token },
          url: settings.serviceUrl + '/pathology/audio',
          data: json
        })
        .then(success);
        function success(response) {
            return response;
        }
      }

      //**Modifica la información de un audio de patología*/
      function put(token, json) {
        return $http({
          hideOverlay: true,
          method: 'PUT',
          headers: { 'Authorization': token },
          url: settings.serviceUrl + '/pathology/audio',
          data: json
        })
        .then(success);
        function success(response) {
            return response;
        }
      }

      function uploadAudio(parameters) {
          return $http.post('/api/uploadAudio', parameters)
              .then(success);
          function success(response) {
              return response;
          }
      }
  }
})();
