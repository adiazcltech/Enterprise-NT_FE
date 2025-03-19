(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('pathologistDS', pathologistDS);
  pathologistDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function pathologistDS($http, $q, exception, logger, settings) {
      var service = {
        getPathologistsAll: getPathologistsAll,
      };
      return service;
      //** Obtiene la lista de patologos*/
      function getPathologistsAll(token) {
        return $http({
          method: 'GET',
          headers: { 'Authorization': token },
          url: settings.serviceUrl + '/pathology/pathologist/all',
          hideOverlay: true
        })
        .then(function (response) {
          return response;
        });
      }
  }
})();
