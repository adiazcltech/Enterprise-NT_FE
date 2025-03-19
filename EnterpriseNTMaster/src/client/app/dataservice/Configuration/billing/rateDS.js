(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('rateDS', rateDS);

  rateDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function rateDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      getstate:getstate,
      New:New,
      update:update,
      getpayers:getpayers
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de tarifas*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/rates'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el Servicio y trae una lista de tarifas*// 
    function getpayers(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/rates/payers'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de tarifas*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/rates/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
     //** Método que consulta el servicio por estado y trae los datos de tarifas*/
    function getstate(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/rates/filter/state/true'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea una tarifa*/
     function New(token,rate) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/rates',
               data: rate
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza una tarifa*/
    function update(token,rate) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/rates',
               data: rate
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
  }
})();


 