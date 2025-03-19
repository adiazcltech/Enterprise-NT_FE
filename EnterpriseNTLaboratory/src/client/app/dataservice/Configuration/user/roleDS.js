(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('roleDS', roleDS);

  roleDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function roleDS($http, $q, exception, logger,settings) {
    var service = {
      getRole: getRole,
      getRoleId: getRoleId,
      getRoleActive: getRoleActive,
      NewRole:NewRole,
      updaterole:updaterole
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de roles*// 
    function getRole(token) {
      var promise = $http({
        hideOverlay: true,
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/roles'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos del rol*/
    function getRoleId(token,id) {
         var promise = $http({
          hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/roles/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio filtrando los roles activos*/
    function getRoleActive(token) {
         var promise = $http({
          hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/roles/filter/state/true'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea rol*/
     function NewRole(token,Role) {
         var promise = $http({
          hideOverlay: true,
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/roles',
               data: Role
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza rol*/
    function updaterole(token,Role) {
        var promise = $http({
          hideOverlay: true,
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/roles',
               data: Role
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 