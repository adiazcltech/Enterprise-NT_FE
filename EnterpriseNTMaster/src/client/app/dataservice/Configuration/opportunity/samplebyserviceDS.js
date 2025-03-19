(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('samplebyserviceDS', samplebyserviceDS);

  samplebyserviceDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function samplebyserviceDS($http, $q, exception, logger,settings) {
    var service = {
      getSampleService: getSampleService,
      updateExpectedTime : updateExpectedTime
    };

    return service;

 

    //** Método que consulta el servicio por id y trae los datos de la muestra*/
    function getSampleService(token,idService) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl + '/samples/services/'+ idService
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }

    //** Método que Actualiza muestra*/
    function updateExpectedTime(token, json, idService) {
        var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/samples/services',
               data: json
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 