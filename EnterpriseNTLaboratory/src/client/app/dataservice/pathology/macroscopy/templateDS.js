(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('templateDS', templateDS);
  templateDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function templateDS($http, $q, exception, logger, settings) {
    var service = {
        getByCase: getByCase,
    };
    return service;

    /* Obtiene las plantillas de los especimenes de un caso */
    function getByCase(token, idCase) {
      return $http({
              hideOverlay: true,
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/pathology/template/filter/case/' + idCase
          })
          .then(success);

      function success(response) {
          return response;
      }
    }
  }
})();
