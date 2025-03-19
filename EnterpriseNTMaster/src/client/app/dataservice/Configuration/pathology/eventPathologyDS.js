(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('eventPathologyDS', eventPathologyDS);

  eventPathologyDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function eventPathologyDS($http, settings) {
      var service = {
          getEvents: getEvents,
          getEventById: getEventById,
          updateEvent: updateEvent,
          insertEvent: insertEvent
      };

      return service;

      function getEvents(token) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/event'
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function getEventById(token, id) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/event/filter/id/' + id
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function insertEvent(token, event) {

          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/event',
              data: event
          });

          return promise.success(function(response, status) {
              return response;
          });
      }

      function updateEvent(token, event) {

          var promise = $http({
              method: 'PUT',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/event',
              data: event
          });

          return promise.success(function(response, status) {
              return response;
          });
      }
  }
})();
