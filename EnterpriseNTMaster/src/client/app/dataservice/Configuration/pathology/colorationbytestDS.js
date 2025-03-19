(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('colorationbytestDS', colorationbytestDS);

  colorationbytestDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function colorationbytestDS($http, settings) {
      var service = {
          getColorations: getColorations,
          insertColorations: insertColorations
      };

      return service;

      function getColorations(token, id) {
          var promise = $http({
              method: 'GET',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/colorationbytest/coloration/' + id
          });

          return promise.success(function(response, status) {
              return response;
          });

      }

      function insertColorations(token, json) {

          var promise = $http({
              method: 'POST',
              headers: {
                  'Authorization': token
              },
              url: settings.serviceUrl + '/pathology/colorationbytest',
              data: json
          });

          return promise.success(function(response, status) {
              return response;
          });
      }
  }
})();
