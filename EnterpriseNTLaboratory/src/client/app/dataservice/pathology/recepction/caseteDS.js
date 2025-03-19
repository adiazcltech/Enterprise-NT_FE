(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('caseteDS', caseteDS);
  caseteDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function caseteDS($http, $q, exception, logger, settings) {
      var service = {
        getByStatus: getByStatus,
        getByFilterCases: getByFilterCases,
        saveTissueProcessor: saveTissueProcessor,
        changeStatus: changeStatus,
        getColorationByStatus: getColorationByStatus
      };
      return service;
      //** Obtiene los casetes activos*/
      function getByStatus(token) {
        return $http({
          hideOverlay: true,
          method: 'GET',
          headers: { 'Authorization': token },
          url: settings.serviceUrl + '/pathology/casete/filter/state/1'
        })
        .then(success);

        function success(response) {
          return response;
        }
      }

      /*Obtiene las casetes por casos filtrados*/
      function getByFilterCases(token, filter) {
        return $http({
            hideOverlay: true,
            method: 'PATCH',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/samples/casetes/filter/cases',
            data: filter
        })
        .then(success);

        function success(response) {
            return response;
        }
      }

      /*Guarda la informacion del procesador de tejidos de los casetes*/
      function saveTissueProcessor(token, list) {
        return $http({
            hideOverlay: true,
            method: 'POST',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/tissueprocessor',
            data: list
        })
        .then(success);

        function success(response) {
            return response;
        }
      }

      /*Cambia de estado los casetes*/
      function changeStatus(token, list) {
        return $http({
            hideOverlay: true,
            method: 'PATCH',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/samples/casetes/status',
            data: list
        })
        .then(success);

        function success(response) {
            return response;
        }
      }

      //** Obtiene las coloraciones activas*/
      function getColorationByStatus(token) {
        return $http({
          hideOverlay: true,
          method: 'GET',
          headers: { 'Authorization': token },
          url: settings.serviceUrl + '/pathology/coloration/filter/state/1'
        })
        .then(success);

        function success(response) {
          return response;
        }
      }
  }
})();
