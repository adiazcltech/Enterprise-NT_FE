(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('holidaysDS', holidaysDS);

  holidaysDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function holidaysDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      New:New,
      update:update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de festivos*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/holidays'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de festivos*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/holidays/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que crea un dia festivo*/
     function New(token,holiday) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/holidays',
               data: holiday
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza un dia festivo*/
    function update(token,holiday) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/holidays',
               data: holiday
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
  }
})();


 