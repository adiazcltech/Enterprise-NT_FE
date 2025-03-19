(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('requirementDS', requirementDS);

  requirementDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function requirementDS($http, $q, exception, logger, settings) {
    var service = {
      getRequirement: getRequirement,
      getRequirementId: getRequirementId,
      getRequirementActive: getRequirementActive,
      NewRequirement: NewRequirement,
      updateRequirement: updateRequirement
    };

    return service;

    function getRequirement(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/requirements'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getRequirementId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/requirements/filter/id/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getRequirementActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/requirements/filter/state/true'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea un requerimento*/
    function NewRequirement(token,Requirement) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/requirements',
              data: Requirement
         });
         return promise.success(function (response, status) {
           return response;
         });
   }

   function updateRequirement(token,Requirement) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/requirements',
              data: Requirement
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
