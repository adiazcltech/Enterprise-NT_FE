(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('providerDS', providerDS);

  providerDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function providerDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update,
      getstate:getstate
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de EMISOR*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/providers'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
      //** Método que consulta el Servicio y trae una lista de EMISOR*// 
    function getstate(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/providers/filter/state/true'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos del EMISOR*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/providers/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea EMISOR*/
     function New(token,providers) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/providers',
               data: providers
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza EMISOR*/
    function update(token,providers) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/providers',
               data: providers
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 