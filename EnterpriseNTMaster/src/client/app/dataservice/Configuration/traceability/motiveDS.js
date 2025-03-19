(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('motiveDS', motiveDS);

  motiveDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function motiveDS($http, $q, exception, logger, settings) {
    var service = {
      get: get,
      getstate: getstate,
      getId: getId,
      New: New,
      update: update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de motivos *// 
    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/motives'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    function getstate(token) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/motives/filter/state/true'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que consulta el servicio por id y trae los datos de motivos*/
    function getId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/motives/' + id

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que crea motivo*/
    function New(token, motive) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/motives',
        data: motive
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que Actualiza motivo*/
    function update(token, motive) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/motives',
        data: motive
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();


