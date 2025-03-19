(function() {
  'use strict';

  angular
      .module('app.core')
      .factory('macroscopytemplateDS', macroscopytemplateDS);

  macroscopytemplateDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function macroscopytemplateDS($http, settings) {
      var service = {
          getFieldsBySpecimen: getFieldsBySpecimen,
          insertFields: insertFields
      };

      return service;

      function getFieldsBySpecimen(token, specimen) {
        var promise = $http({
            method: 'GET',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/template/fields/' + specimen
        });
        return promise.success(function(response, status) {
            return response;
        });
      }

      function insertFields(token, template) {
        var promise = $http({
            method: 'POST',
            headers: {
                'Authorization': token
            },
            url: settings.serviceUrl + '/pathology/template',
            data: template
        });
        return promise.success(function(response, status) {
            return response;
        });
      }
  }
})();
