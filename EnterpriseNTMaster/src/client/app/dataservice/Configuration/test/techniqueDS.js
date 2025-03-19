(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('techniqueDS', techniqueDS);

  techniqueDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function techniqueDS($http, $q, exception, logger, settings) {
    var service = {
      getTechnique: getTechnique,
      getTechniqueId: getTechniqueId,
      getTechniqueActive: getTechniqueActive,
      NewTechnique: NewTechnique,
      updateTechnique: updateTechnique
    };

    return service;

    function getTechnique(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/techniques'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    function getTechniqueId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/techniques/filter/id/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }


    function getTechniqueActive(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/techniques/filter/state/true'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea una tércnica*/
    function NewTechnique(token,Technique) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/techniques',
              data: Technique
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function updateTechnique(token,Technique) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/techniques',
              data: Technique
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
