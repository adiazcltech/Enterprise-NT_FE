(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('scheduleDS', scheduleDS);

  scheduleDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function scheduleDS($http, settings) {
      var service = {
          getScheduleByPathologist: getScheduleByPathologist,
          insertSchedule: insertSchedule,
          updateSchedule: updateSchedule,
          deleteSchedule: deleteSchedule,
      };

      return service;

      function getScheduleByPathologist(token, json) {
        var promise = $http({
            method: 'PATCH',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/schedule/filter',
            data: json
        });

        return promise.success(function(response, status) {
            return response;
        });
      }

      function insertSchedule(token, schedule) {
          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/schedule',
              data: schedule
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function updateSchedule(token, schedule) {
        var promise = $http({
            method: 'PUT',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/schedule',
            data: schedule
        });
        return promise.success(function(response, status) {
            return response;
        });
      }

      function deleteSchedule(token, schedule) {
        var promise = $http({
            method: 'DELETE',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/schedule/' + schedule
        });
        return promise.success(function(response, status) {
            // return response;
        });
      }
  }
})();
