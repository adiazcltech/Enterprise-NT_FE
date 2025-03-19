(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('histogramDS', histogramDS);

  histogramDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function histogramDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      insert:insert,
      update:update
    };

    return service;
    //** Método que consulta y trae una lista de histogramas *// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/binds'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/binds/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea*/
     function insert(token,data) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/binds',
               data: data
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza*/
    function update(token,data) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/binds',
               data: data
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
  }
})();


 