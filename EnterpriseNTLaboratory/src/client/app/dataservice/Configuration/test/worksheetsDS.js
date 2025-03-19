(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('worksheetsDS', worksheetsDS);

  worksheetsDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function worksheetsDS($http, $q, exception, logger, settings) {
    var service = {
      getWorkSheet: getWorkSheet,
      getIdWorkSheet: getIdWorkSheet
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de unidades*//
    function getWorkSheet(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/worksheets'
      }).then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }

    }
    //** Método que consulta el servicio por id y trae los datos de la unidad*/
    function getIdWorkSheet(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/worksheets/' + id
      }).then(success)
        .catch(fail);

      function success(response) {
        return response;
      }
      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }

    }

  }
})();
