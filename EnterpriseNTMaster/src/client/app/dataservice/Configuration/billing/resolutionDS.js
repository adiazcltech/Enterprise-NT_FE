(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('resolutionDS', resolutionDS);

  resolutionDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function resolutionDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update,
      getstate:getstate
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de receptor*//
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/resolutions'

          });
          return promise.success(function (response, status) {
            return response;
          });

    }
      //** Método que consulta el Servicio y trae una lista de receptor*//
    function getstate(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/resolutions/filter/state/true'

          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos del receptor*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/resolutions/'+ id

          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea receptor*/
     function New(token,receiver) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/resolutions',
               data: receiver
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza receptor*/
    function update(token,receiver) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/resolutions ',
               data: receiver
          });
          return promise.success(function (response, status) {
            return response;
          });

    }


  }
})();


