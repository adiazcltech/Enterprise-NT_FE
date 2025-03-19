(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('caseteDS', caseteDS);

  caseteDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function caseteDS($http, settings) {
      var service = {
          getCasetes: getCasetes,
          getCaseteById: getCaseteById,
          updateCasete: updateCasete,
          insertCasete: insertCasete
      };

      return service;

      function getCasetes(token) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/casete'
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function getCaseteById(token, id) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/casete/filter/id/' + id
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function insertCasete(token, casete) {

          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/casete',
              data: casete
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function updateCasete(token, casete) {

          var promise = $http({
              method: 'PUT',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/casete',
              data: casete
          });

          return promise.success(function(response, status) {
              return response;
          });
      }
  }
})();
