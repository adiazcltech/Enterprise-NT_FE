(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('fixativeDS', fixativeDS);

  fixativeDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function fixativeDS($http, settings) {
      var service = {
          getFixatives: getFixatives,
          getFixativeById: getFixativeById,
          updateFixative: updateFixative,
          insertFixative: insertFixative
      };

      return service;

      function getFixatives(token) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/fixative'
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function getFixativeById(token, id) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/fixative/filter/id/' + id
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function insertFixative(token, fixative) {

          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/fixative',
              data: fixative
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function updateFixative(token, fixative) {

          var promise = $http({
              method: 'PUT',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/fixative',
              data: fixative
          });

          return promise.success(function(response, status) {
              return response;
          });
      }
  }
})();
