(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicTestDS', demographicTestDS);

  demographicTestDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function demographicTestDS($http, settings) {
    var service = {
      save: save,
      get: get,
      getById: getById,
      update: update,
    };

    return service;

    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographictest'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getById(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographictest/filter/id/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function update(token, demographics) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographictest',
        data: demographics
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function save(token, demographics) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographictest',
        data: demographics
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
