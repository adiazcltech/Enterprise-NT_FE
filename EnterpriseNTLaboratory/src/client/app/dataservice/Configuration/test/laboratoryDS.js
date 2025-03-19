(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('laboratoryDS', laboratoryDS);
    laboratoryDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function laboratoryDS($http, $q, exception, logger, settings) {
        var service = {
            getLaboratory: getLaboratory,
            getId: getId,
            getLaboratoryActive: getLaboratoryActive
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de laboratorios*// 
        function getLaboratory(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/laboratories'

            }).then(function(response) {
        return response;
      });
       
    }   
          //** Método que consulta el servicio por estado y trae los datos de las laboratorios activas*/
        function getLaboratoryActive(token) {
             return $http({
              hideOverlay: true,
                  method: 'GET',
                  headers: {'Authorization': token},
                  url: settings.serviceUrl  +'/laboratories/filter/state/true'
                  
              }).then(function(response) {
        return response;
      });
       
    }   
        //** Método que consulta el servicio por id y trae los datos del laboratorios*/
        function getId(token, id) {
            return $http({
              hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/laboratories/filter/id/' + id

            }).then(function(response) {
        return response;
      });
       
    }   




    }
})();

 