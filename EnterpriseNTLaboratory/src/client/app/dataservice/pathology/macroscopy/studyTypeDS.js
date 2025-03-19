(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('studyTypeDS', studyTypeDS);
  studyTypeDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function studyTypeDS($http, $q, exception, logger, settings) {
      var service = {
          getByStatus: getByStatus,
      };
      return service;
      //** Obtiene los casetes activos*/
      function getByStatus(token) {
          return $http({
                  hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/pathology/studytype/filter/state/1'
              })
              .then(success);

          function success(response) {
              return response;
          }
      }
  }
})();
