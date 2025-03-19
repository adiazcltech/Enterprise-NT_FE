(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('refrigeratorDS', refrigeratorDS);

  refrigeratorDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function refrigeratorDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de Neveras*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/refrigerators'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de nevera*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/refrigerators/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea una nevera*/
     function New(token,Refrigerator) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/refrigerators',
               data: Refrigerator
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza una nevera*/
    function update(token,Refrigerator) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/refrigerators',
               data: Refrigerator
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 