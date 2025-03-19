(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('protocolDS', protocolDS);

  protocolDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function protocolDS($http, settings) {
      var service = {
          getProtocol: getProtocol,
          getProtocolById: getProtocolById,
          updateProtocol: updateProtocol,
          insertProtocol: insertProtocol
      };

      return service;

      function getProtocol(token) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/protocol'
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function getProtocolById(token, id) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/protocol/filter/id/' + id
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function insertProtocol(token, protocol) {

          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/protocol',
              data: protocol
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function updateProtocol(token, protocol) {

          var promise = $http({
              method: 'PUT',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/protocol',
              data: protocol
          });

          return promise.success(function(response, status) {
              return response;
          });
      }
  }
})();
