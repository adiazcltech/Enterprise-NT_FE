(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('groupsDS', groupsDS);

  groupsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function groupsDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update,
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de grupos*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/groups'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de grupos*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/groups/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });
    }   
  
    //** Método que crea grupos*/
     function New(token,groups) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/groups',
               data: groups
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
    //** Método que Actualiza grupos*/
    function update(token,groups) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/groups',
               data: groups
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
  }
})();


 