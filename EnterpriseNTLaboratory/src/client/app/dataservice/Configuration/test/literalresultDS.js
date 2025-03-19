(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('literalresultDS', literalresultDS);

  literalresultDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function literalresultDS($http, settings) {
    var service = {
      getIdTest: getIdTest,
      getliteralresults: getliteralresults
    };

    return service;


    //** Método Obtiene lista resultado literals por examen*/
    function getIdTest(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/literalresults/filter/test/' + id
      })
        .then(success);

      function success(response) {
        return response;
      }

    }
    //** Método Obtiene lista resultado literals por examen*/
    function getliteralresults(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/literalresults/filter/state/true'
      })
        .then(success);

      function success(response) {
        return response;
      }

    }
  }
})();


