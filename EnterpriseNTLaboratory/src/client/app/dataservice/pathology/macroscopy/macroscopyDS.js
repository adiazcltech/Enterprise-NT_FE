(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('macroscopyDS', macroscopyDS);
  macroscopyDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function macroscopyDS($http, $q, exception, logger, settings) {
    var service = {
        getByCase: getByCase,
        post: post,
        put: put,
        getTranscription: getTranscription,
        transcription: transcription,
        getAuthorizations: getAuthorizations,
        authorization: authorization
    };
    return service;

    /* Obtiene la descripcion macroscopica de un caso */
    function getByCase(token, idCase) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/macroscopy/filter/case/' + idCase
      })
      .then(success);
      function success(response) {
          return response;
      }
    }

    //**Guarda la descripcion macroscopica de un caso*/
    function post(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/macroscopy',
        data: json
      })
      .then(success);
      function success(response) {
          return response;
      }
    }

    //**Modifica una descripcion macroscopica de un caso*/
    function put(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/macroscopy',
        data: json
      })
      .then(success);
      function success(response) {
          return response;
      }
    }

    /* Obtiene los casos pendientes de transcripción macroscopica */
    function getTranscription(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/macroscopy/filter/transcription'
      })
      .then(success);

      function success(response) {
          return response;
      }
    }

    //**Guarda la transcripcion de una descripcion macroscopica de un caso*/
    function transcription(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/macroscopy/transcription',
        data: json
      })
      .then(success);
      function success(response) {
          return response;
      }
    }

    /* Obtiene los casos pendientes de autorizacion */
    function getAuthorizations(token, idUser) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/macroscopy/filter/authorization/' + idUser
      })
      .then(success);

      function success(response) {
          return response;
      }
    }

    //**Guarda la autorizacion de una transcripcion de una descripcion macroscopica de un caso*/
    function authorization(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/macroscopy/authorization',
        data: json
      })
      .then(success);
      function success(response) {
          return response;
      }
    }
  }
})();
