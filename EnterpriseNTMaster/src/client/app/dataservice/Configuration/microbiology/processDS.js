(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('processDS', processDS);

  processDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function processDS($http, $q, exception, logger, settings) {
    var service = {
      get: get,
      getprocessActive: getprocessActive,
      getprocesstestid: getprocesstestid,
      getId: getId,
      New: New,
      update: update,
      updatetestofprocess: updatetestofprocess
    };

    return service;

    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/procedures'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function getprocessActive(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/procedures/filter/state/true'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

    function getId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/procedures/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getprocesstestid(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/procedures/testprocedure/filter/idtest/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }


    //** Método que crea un cliente*/
    function New(token,procedures) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/procedures',
              data: procedures
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function update(token,procedures) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/procedures',
              data: procedures
         });
         return promise.success(function (response, status) {
           return response;
         });

   }
    
      //** asocia las  medios de cultivo a las pruebas*/
    function updatetestofprocess(token,mediaCultures) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/procedures/testprocedure',
              data: mediaCultures
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();



 