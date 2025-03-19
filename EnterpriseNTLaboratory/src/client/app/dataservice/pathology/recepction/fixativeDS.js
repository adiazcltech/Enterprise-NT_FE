(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('fixativeDS', fixativeDS);
  fixativeDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function fixativeDS($http, $q, exception, logger, settings) {
      var service = {
          getByStatus: getByStatus,
      };
      return service;
      //** Obtiene los organos activos*/
      function getByStatus(token) {
          return $http({
                  hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/pathology/fixative/filter/state/1'
              })
              .then(success);

          function success(response) {
              return response;
          }
      }
  }
})();
