(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('centralsystemDS', centralsystemDS);

  centralsystemDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function centralsystemDS($http, $q, exception, logger, settings) {
    var service = {
      getCentralSystem: getCentralSystem,
      getCentralSystemId: getCentralSystemId,
      getCentralSystemActive: getCentralSystemActive,
      newCentralSystem: newCentralSystem,
      updateCentralSystem: updateCentralSystem
    };

    return service;

    function getCentralSystem(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/centralsystems'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    function getCentralSystemId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/centralsystems/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getCentralSystemActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/centralsystems/filter/state/true'
      });
      return promise.success(function (response, status) {
        return response;
      });    
    }

    //** Método que crea un cliente*/
    function newCentralSystem(token,CentralSystem) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/centralsystems',
              data: CentralSystem
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function updateCentralSystem(token,CentralSystem) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/centralsystems',
              data: CentralSystem
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
