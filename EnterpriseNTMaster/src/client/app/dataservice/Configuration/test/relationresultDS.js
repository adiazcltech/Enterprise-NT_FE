(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('relationresultDS', relationresultDS);

  relationresultDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function relationresultDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de unidades*//
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/resultrelationships'
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de la unidad*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/resultrelationships/'+ id
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
        
    //** Método que crea unidad*/
     function New(token,Unit) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/resultrelationships',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza unidad*/
    function update(token,Unit) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/resultrelationships',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
  }
})();
