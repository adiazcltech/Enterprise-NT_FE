(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('sensitivitieDS', sensitivitieDS);
    sensitivitieDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function sensitivitieDS($http, $q, exception, logger, settings) {
        var service = {
            get: get,
            getId: getId,
            New: New,
            update: update,
            getState : getState,
            generalSensitivity: generalSensitivity
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de Antibiogramas*//
        function get(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/sensitivities'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de Antibiograma*/
        function getId(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/sensitivities/filter/id/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que consulta el servicio por estado y trae los datos de Antibiograma*/
        function getState(token, state) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/sensitivities/filter/state/'+ state
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que crea el Antibiograma*/
        function New(token, sensitivitie) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/sensitivities',
                data: sensitivitie
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que Actualiza el Antibiograma*/
        function update(token, sensitivitie) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/sensitivities',
                data: sensitivitie
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que asigna el antibiograma a los microorganismos*/
        function generalSensitivity(token, sensitivitie) {
          var promise = $http({
              method: 'PUT',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/sensitivities/general',
              data: sensitivitie
          });
          return promise.success(function (response, status) {
              return response;
          });
      }
    }
})();
