(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('raceDS', raceDS);

  raceDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function raceDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getRaceActive: getRaceActive,
      getId: getId,
      New:New,
      update:update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de razas*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/races'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }

    function getRaceActive(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/races/filter/state/true'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }
    //** Método que consulta el servicio por id y trae los datos de la raza*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/races/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }

    //** Método que crea raza*/
     function New(token,races) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/races',
               data: races
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza raza*/
    function update(token,races) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/races',
               data: races
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 