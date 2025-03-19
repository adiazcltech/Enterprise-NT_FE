(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('diagnosticDS', diagnosticDS);
    diagnosticDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function diagnosticDS($http, $q, exception, logger, settings) {
        var service = {
            getstateactive:getstateactive,
            getIdtest: getIdtest,
            getTestDiagnostics: getTestDiagnostics
        };
        return service;
       
        //** Método que consulta los diagnosticos activos*/
        function getstateactive(token) {
              return $http({
                  method: 'GET',
                  headers: {'Authorization': token},
                  url: settings.serviceUrl  + '/diagnostics/filter/state/true',
                  hideOverlay: true
              })   
              .then(success);

              function success(response) {
                return response;
              }
        }

        //** Método que consulta los diagnosticos por prueba*/
        function getIdtest(token, id) {
            return $http({
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl + '/diagnostics/filter/test/' + id,
                hideOverlay: true  
            })   
            .then(success);

            function success(response) {
                return response;
            }
        }

        //** Agrupa diagnostico por pruebas*/
        function getTestDiagnostics(token, list) {
            return $http({
                method: 'POST',
                headers: {'Authorization': token},
                url: settings.serviceUrl + '/diagnostics/groupbytest',
                data: list,
                hideOverlay: true
            })   
            .then(success);

            function success(response) {
                return response;
            }
        }
      
      
    }
})();
 