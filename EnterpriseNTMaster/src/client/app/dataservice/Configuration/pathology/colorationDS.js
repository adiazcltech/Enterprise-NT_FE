(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('colorationDS', colorationDS);

  colorationDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function colorationDS($http, settings) {
      var service = {
          getColorations: getColorations,
          getColorationById: getColorationById,
          updateColoration: updateColoration,
          insertColoration: insertColoration
      };

      return service;

      function getColorations(token) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/coloration'
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function getColorationById(token, id) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/coloration/filter/id/' + id
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function insertColoration(token, coloration) {

          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/coloration',
              data: coloration
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function updateColoration(token, coloration) {

          var promise = $http({
              method: 'PUT',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/coloration',
              data: coloration
          });

          return promise.success(function(response, status) {
              return response;
          });
      }
  }
})();
