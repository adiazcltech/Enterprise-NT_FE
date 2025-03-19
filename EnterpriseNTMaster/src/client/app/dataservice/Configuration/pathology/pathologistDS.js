(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('pathologistDS', pathologistDS);

  pathologistDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function pathologistDS($http, settings) {
      var service = {
          getPathologist: getPathologist,
          getPathologistById: getPathologistById,
          insertOrgans: insertOrgans,
      };

      return service;

      function getPathologist(token) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/pathologist'
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function getPathologistById(token, id) {
        var promise = $http({
            method: 'GET',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/pathologist/filter/id/' + id
        });

        return promise.success(function(response, status) {
            return response;
        });
      }

      function insertOrgans(token, pathologist) {
        var promise = $http({
            method: 'POST',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/pathologist',
            data: pathologist
        });
        return promise.success(function(response, status) {
            return response;
        });
      }
  }
})();
