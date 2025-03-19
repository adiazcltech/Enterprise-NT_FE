(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('serviceDS', serviceDS);

  serviceDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function serviceDS($http, settings) {
    var service = {
      getService: getService,
      getServiceActive: getServiceActive,
      getById: getById,
      update: update,
      insert: insert
    };

    return service;

    function getService(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/services'
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
        url: settings.serviceUrl + '/services/filter/id/' + id
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getServiceActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/services/filter/state/true'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function update(token, service) {

      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/services',
        data: service
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function insert(token, service) {

      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/services',
        data: service
      });

      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
