(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('areaDS', areaDS);

  areaDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  function areaDS($http, $q, exception, logger, settings) {
    var service = {
      getAreas: getAreas,
      getAreaById: getAreaById,
      getAreasActive: getAreasActive
    };

    return service;

    function getAreas(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/areas',
      }).then(function (response) {
        return response;
      });
    }

    function getAreasActive(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/areas/filter/state/true',
      }).then(function (response) {
        return response;
      });



    }

    function getAreaById(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/areas/' + id,
      }).then(function (response) {
        return response;
      });
    }
  }
})();

