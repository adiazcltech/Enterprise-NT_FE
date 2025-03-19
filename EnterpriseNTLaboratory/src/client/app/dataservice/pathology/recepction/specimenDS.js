(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('specimenDS', specimenDS);
    specimenDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

    /* @ngInject */
    //** Método que define los metodos a usar*/
    function specimenDS($http, $q, exception, logger, settings) {
        var service = {
            getSubsamplesBySpecimen: getSubsamplesBySpecimen
        };
        return service;

        //** Obtiene la lista de submuestras de una muestra*/
        function getSubsamplesBySpecimen(token, sampleId) {
          return $http({
                  hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/pathology/specimen/subsamples/' + sampleId
              })
              .then(success);
          function success(response) {
              return response;
          }
        }
    }
})();
