(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('etiologicalagentDS', etiologicalagentDS);
  etiologicalagentDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */
  //** Método que define los metodos a usar*/
  function etiologicalagentDS($http, $q, exception, logger, settings) {
      var service = {
          get: get,
          getId: getId,
          New: New,
          update: update
      };
      return service;

      //** Método que consulta el Servicio y trae una lista de agentes etiologicos*//
      function get(token) {
          var promise = $http({
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/etiologicalagent'
          });
          return promise.success(function (response, status) {
              return response;
          });
      }

      //** Método que consulta el servicio por id y trae los datos de un agente etiologico*/
      function getId(token, id) {
          var promise = $http({
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/etiologicalagent/filter/id/' + id
          });
          return promise.success(function (response, status) {
              return response;
          });
      }

      //** Método que crea un agente etiologico*/
      function New(token, antibiotic) {
          var promise = $http({
              method: 'POST',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/etiologicalagent',
              data: antibiotic
          });
          return promise.success(function (response, status) {
              return response;
          });
      }
      //** Método que Actualiza un agente etiologico*/
      function update(token, antibiotic) {
          var promise = $http({
              method: 'PUT',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/etiologicalagent',
              data: antibiotic
          });
          return promise.success(function (response, status) {
              return response;
          });
      }
  }
})();
