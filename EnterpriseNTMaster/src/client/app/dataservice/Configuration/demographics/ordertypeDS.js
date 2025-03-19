(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('ordertypeDS', ordertypeDS);

  ordertypeDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function ordertypeDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update,
      getlistOrderType:getlistOrderType
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de tipo de orden*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/ordertypes'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de  tipo de orden*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/ordertypes/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea tipos de orden*/
     function New(token,ordertype) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/ordertypes',
               data: ordertype
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza tipos de orden*/
    function update(token,ordertype) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/ordertypes',
               data: ordertype
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 

    function getlistOrderType(token) {
      var promise = $http({
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/ordertypes/filter/state/true'
          });

      return promise.success(function (response, status) {
        return response;
      });
    }
   

  }
})();


 