(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('oportunityofsampleDS', oportunityofsampleDS);

  oportunityofsampleDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function oportunityofsampleDS($http, $q, exception, logger,settings) {
    var service = {
      getoportunityofsample: getoportunityofsample,
      updateoportunityofsample : updateoportunityofsample
    };

    return service;

 

    //** Método que consulta el servicio por id y trae los datos de la muestra*/
    function getoportunityofsample(token,branch,sample,typeorder) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl + '/destinations/oportunity/branch/'+ branch + '/sample/'+ sample + '/typeorder/'+ typeorder 
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }

    //** Método que Actualiza muestra*/
    function updateoportunityofsample(token, oportunity) {
        var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/destinations/oportunity',
               data: oportunity
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 