(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('literalresultDS', literalresultDS);

  literalresultDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function literalresultDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getLiteralResultActive: getLiteralResultActive,
      getId: getId,
      New:New,
      update:update,
      getIdTest:getIdTest,
      updateTest:updateTest
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de resultado literales*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/literalresults'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de la resultado literales*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/literalresults/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
     //** Método Obtiene lista resultado literals por examen*/
    function getIdTest(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/literalresults/filter/test/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
      //** Actualiza/Crea asignacion resultados literales a examenes/
    function updateTest(token,literalresult) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/literalresults/assign/test',
               data: literalresult
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
    //** Método que crea resultados literales*/
     function New(token,literalresult) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/literalresults',
               data: literalresult
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza resultado literales*/
    function update(token,literalresult) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/literalresults',
               data: literalresult
          });
          return promise.success(function (response, status) {
            return response;
          });

    }

    function getLiteralResultActive(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/literalresults/filter/state/true'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    } 
   

  }
})();


 