(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('anatomicalsiteDS', anatomicalsiteDS);

  anatomicalsiteDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function anatomicalsiteDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de sitios anatomicos*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/anatomicalsites'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de sitios anátomicos*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/anatomicalsites/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea sitios anátomicos*/
     function New(token,anatomicalsite) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/anatomicalsites',
               data: anatomicalsite
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza sitios anátomicos*/
    function update(token,anatomicalsite) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/anatomicalsites',
               data: anatomicalsite
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 