(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('sampleDS', sampleDS);

  sampleDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function sampleDS($http, settings) {
    var service = {
      get: get,
      getId: getId,
      getSampleActive: getSampleActive,
      New: New,
      update: update,
      getSampleMicrobiology: getSampleMicrobiology
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de muestras*//
    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/samples'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que consulta el servicio por id y trae los datos de la muestra*/
    function getId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/samples/filter/id/' + id

      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método que consulta el servicio por estado y trae los datos de las muestras activas*/
    function getSampleActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/samples/filter/state/true'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método que consulta el servicio por estado y trae los datos de las muestras activas*/
    function getSampleMicrobiology(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/samples/samplemicrobiology'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    //** Método que crea muestra*/
    function New(token, container) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/samples',
        data: container
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que Actualiza muestra*/
    function update(token, container) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/samples',
        data: container
      });
      return promise.success(function (response, status) {
        return response;
      });

    }



  }
})();
