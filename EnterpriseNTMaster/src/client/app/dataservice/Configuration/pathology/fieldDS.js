(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('fieldDS', fieldDS);

  fieldDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function fieldDS($http, settings) {
      var service = {
          getFields: getFields,
          getFieldById: getFieldById,
          updateField: updateField,
          insertField: insertField
      };

      return service;

      function getFields(token) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/field'
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function getFieldById(token, id) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/field/filter/id/' + id
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function insertField(token, field) {

          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/field',
              data: field
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function updateField(token, field) {

          var promise = $http({
              method: 'PUT',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/field',
              data: field
          });

          return promise.success(function(response, status) {
              return response;
          });
      }
  }
})();
