(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('chartpathologyDS', chartpathologyDS);
  chartpathologyDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function chartpathologyDS($http, $q, exception, logger, settings) {
      var service = {
          getTissueProcess: getTissueProcess,
          getInclusionCenter: getInclusionCenter
      };
      return service;
      //** Obtiene las graficas para el procesador de tejidos*/
      function getTissueProcess(token) {
          return $http({
                  hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/pathology/chart/tissueprocessor'
              })
              .then(success);

          function success(response) {
              return response;
          }
      }

      //** Obtiene las graficas para la central de inclusion*/
      function getInclusionCenter(token) {
        return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/pathology/chart/inclusioncenter'
            })
            .then(success);

        function success(response) {
            return response;
        }
      }
  }
})();
