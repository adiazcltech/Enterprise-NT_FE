(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('populationgroupDS', populationgroupDS);

  populationgroupDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function populationgroupDS($http, $q, exception, logger, settings) {
    var service = {
      getPopulationGroups: getPopulationGroups,
      getPopulationGroupsById: getPopulationGroupsById,
      getPopulationGroupsActive: getPopulationGroupsActive,
      updatePopulationGroups: updatePopulationGroups,
      insertPopulationGroups: insertPopulationGroups
    };

    return service;

    function getPopulationGroups(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/populationgroups'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

    function getPopulationGroupsActive(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/populationgroups/filter/state/true'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

    function getPopulationGroupsById(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl   + '/populationgroups/filter/id/' +id
      });
      
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updatePopulationGroups(token,populationgroups) {

      var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/populationgroups',
              data: populationgroups
          });
      
      return promise.success(function (response, status) {
        return response;
      });
    }

    function insertPopulationGroups(token,populationgroups) {

      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/populationgroups',
              data: populationgroups
          });
      
      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
