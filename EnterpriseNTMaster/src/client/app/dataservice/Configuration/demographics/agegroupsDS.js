(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('agegroupsDS', agegroupsDS);

  agegroupsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function agegroupsDS($http, $q, exception, logger, settings) {
    var service = {
      getagegroups: getagegroups,
      getagegroupsId: getagegroupsId,
      getagegroupsActive: getagegroupsActive,
      updateagegroups: updateagegroups,
      insertagegroups: insertagegroups
    };

    return service;

    function getagegroups(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/agegroups'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

   

    function getagegroupsId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl   + '/agegroups/filter/id/' +id
      });
      
      return promise.success(function (response, status) {
        return response;
      });
    }

     function getagegroupsActive(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/populationgroups/filter/state/true'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

    function updateagegroups(token,agegroups) {

      var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/agegroups',
              data: agegroups
          });
      
      return promise.success(function (response, status) {
        return response;
      });
    }

    function insertagegroups(token,agegroups) {

      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/agegroups',
              data: agegroups
          });
      
      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
