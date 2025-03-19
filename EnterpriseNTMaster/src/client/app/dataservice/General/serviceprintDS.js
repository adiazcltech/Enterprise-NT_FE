(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('serviceprintDS', serviceprintDS);

  serviceprintDS.$inject = ['$http','settings'];
  /* @ngInject */

  function serviceprintDS($http,settings) {
    var service = {
      getserviceprint: getserviceprint,
      getserial: getserial,
      updateserviceprint: updateserviceprint,
      deleteprint: deleteprint
    };

    return service;

    function getserviceprint(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/serviceprint'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    function getserial(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/reports/serials'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    function updateserviceprint(token, json) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/serviceprint',
        data: json
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    function deleteprint(token, json) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/serviceprint/deletebyservice',
        data: json
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
  }
})();
