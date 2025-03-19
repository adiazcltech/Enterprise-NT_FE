(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('testserviceDS', testserviceDS);

  testserviceDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function testserviceDS($http, $q, exception, logger,settings) {
    var service = {
      getTestService: getTestService,
      updateExpectedTime : updateExpectedTime
    };

    return service;


    //** Método que consulta el servicio por id y trae los datos de la muestra*/
    function getTestService(token,idService) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl + '/tests/services/'+ idService
              
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
               url: settings.serviceUrl  +'/tests/services' ,
               data: json
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 