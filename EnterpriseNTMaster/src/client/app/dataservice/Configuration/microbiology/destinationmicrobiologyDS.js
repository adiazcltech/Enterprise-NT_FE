(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('destinationmicrobiologyDS', destinationmicrobiologyDS);

  destinationmicrobiologyDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function destinationmicrobiologyDS($http, $q, exception, logger, settings) {
    var service = {
      get: get,
      getuseranalizer: getuseranalizer,
      getId: getId,
      New: New,
      update: update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de destinos *//
    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/microbiologydestinations'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function getuseranalizer(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/users/getUsersAnalyzers'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que consulta el servicio por id y trae los datos de destinos*/
    function getId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/microbiologydestinations/' + id

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que crea destino*/
    function New(token, destination) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/microbiologydestinations',
        data: destination
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que Actualiza destino*/
    function update(token, destination) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/microbiologydestinations',
        data: destination
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
