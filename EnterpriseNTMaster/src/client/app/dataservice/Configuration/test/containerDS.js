(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('containerDS', containerDS);

  containerDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function containerDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New: New,
      updatepriority:updatepriority,
      update: update,
      getState: getState,

    };

    return service;
    //** Método que consulta el Servicio y trae una lista de recipientes*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/containers'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos del recipiente*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/containers/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea recipiente*/
     function New(token,container) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/containers',
               data: container
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea recipiente*/
     function updatepriority(token,container) {
         var promise = $http({
               method: 'PATCH',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/containers/priority',
               data: container
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza recipiente*/
    function update(token,container) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/containers',
               data: container
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 

    //** Método que consulta el servicio por estado y trae los datos de los recipientes*/
    function getState(token,state) {
    var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/containers/filter/state/'+ state
              
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
 
  }
})();


 