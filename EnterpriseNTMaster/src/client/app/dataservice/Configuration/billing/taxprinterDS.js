(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('taxprinterDS', taxprinterDS);

    taxprinterDS.$inject = ['$http','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function taxprinterDS($http,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de impresora fiscal*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/taxprinter'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos del impresora fiscal*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/taxprinter/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea impresora fiscal*/
     function New(token,bank) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/taxprinter',
               data: bank
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza impresora fiscal*/
    function update(token,bank) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/taxprinter',
               data: bank
          });
          return promise.success(function (response, status) {
            return response;
          });

    }    

  }
})();


 