(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('mediaCulturesDS', mediaCulturesDS);

  mediaCulturesDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function mediaCulturesDS($http, $q, exception, logger, settings) {
    var service = {
      get: get,
      getId: getId,
      New: New,
      update: update,
      getmediaCulturesActive:getmediaCulturesActive,
      getmediaculturestestId:getmediaculturestestId,
      updatetestofmediacultures:updatetestofmediacultures
    };

    return service;
     //** Método que  consulta las listas de medios de cultivo*/
    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/mediacultures'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
      //** Método que  consulta las lista de medios de cultivo que estan activas*/
     function getmediaCulturesActive(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/mediacultures/filter/state/true'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

      //** Método que  consulta un  medio de cultivo por id*/
    function getId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/mediacultures/filter/id/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea un medio de cultivo*/
    function New(token,mediaCultures) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/mediacultures',
              data: mediaCultures
         });
         return promise.success(function (response, status) {
           return response;
         });

   }
    //** Método que actualiza un medios de cultivo*/
   function update(token,mediaCultures) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/mediacultures',
              data: mediaCultures
         });
         return promise.success(function (response, status) {
           return response;
         });

   }
    //** Método Obtiene los medios de cultivo de una prueba*/
    function getmediaculturestestId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/mediacultures/filter/test/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
      //** asocia las  medios de cultivo a las pruebas*/
    function updatetestofmediacultures(token,mediaCultures) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/mediacultures/testofmediacultures',
              data: mediaCultures
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
 
})();



 