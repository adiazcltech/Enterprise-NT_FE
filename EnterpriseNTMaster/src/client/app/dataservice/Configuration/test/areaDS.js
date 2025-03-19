(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('areaDS', areaDS);

  areaDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function areaDS($http, settings) {
    var service = {
      getAreas: getAreas,
      getAreaById: getAreaById,
      getAreasActive: getAreasActive,
      updateArea: updateArea,
      insertArea: insertArea
    };

    return service;

    function getAreas(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/areas'
      });

      return promise.success(function (response, status) {
        return response;
      });

    }

    function getAreasActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/areas/filter/state/true'
      });

      return promise.success(function (response, status) {
        return response;
      });

    }

    function getAreaById(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/areas/' + id
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateArea(token, area) {

      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/areas',
        data: area
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function insertArea(token, area) {

      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/areas',
        data: area
      });

      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
