(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('specialtyDS', specialtyDS);

  specialtyDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function specialtyDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update,
      Liststate:Liststate
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de especialidades*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/specialists'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de la especialidad*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/specialists/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea especialidad*/
     function New(token,specialty) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/specialists',
               data: specialty
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza una especialidad*/
    function update(token,specialty) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/specialists',
               data: specialty
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 

     //** Método que Obtiene lista especialidades por el estado*/
    function Liststate(token,state) {
        var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/specialists/filter/state/'+ state
              
          });
          return promise.success(function (response, status) {
            return response;
          });
    } 
   

  }
})();


 