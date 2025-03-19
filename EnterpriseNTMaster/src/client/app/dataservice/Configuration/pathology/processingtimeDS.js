(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('processingtimeDS', processingtimeDS);

  processingtimeDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function processingtimeDS($http, settings) {
      var service = {
          getProcessingTime: getProcessingTime,
          getProcessingTimeById: getProcessingTimeById,
          updateProcessingTime: updateProcessingTime,
          insertProcessingTime: insertProcessingTime
      };

      return service;

      function getProcessingTime(token) {
        var promise = $http({
            method: 'GET',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/processingtime'
        });

        return promise.success(function(response, status) {
            return response;
        });
      }

      function getProcessingTimeById(token, id) {
        var promise = $http({
            method: 'GET',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/processingtime/filter/id/' + id
        });

        return promise.success(function(response, status) {
            return response;
        });
      }

      function insertProcessingTime(token, processingTime) {
        var promise = $http({
            method: 'POST',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/processingtime',
            data: processingTime
        });

        return promise.success(function(response, status) {
            return response;
        });
      }

      function updateProcessingTime(token, processingTime) {
        var promise = $http({
            method: 'PUT',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/processingtime',
            data: processingTime
        });

        return promise.success(function(response, status) {
            return response;
        });
      }
  }
})();
