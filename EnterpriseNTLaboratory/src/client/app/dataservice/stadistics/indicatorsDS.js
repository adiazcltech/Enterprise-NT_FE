(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('indicatorsDS', indicatorsDS);

  indicatorsDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function indicatorsDS($http, settings) {
    var service = {
      getHistogram: getHistogram,
      getResolution: getResolution,
      getIndicatorsHistogram: getIndicatorsHistogram,
      getIndicators: getIndicators,
      getTracking: getTracking,
      getOpportunityTime: getOpportunityTime,
      getAverageTime: getAverageTime
    };

    return service;

    function getHistogram(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/binds'
      }).then(function (response) {
        return response;
      });
    }

    function getResolution(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/resolutions/getResolution4505',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function getIndicatorsHistogram(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/indicators/histogram',
        data: data
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    //** Obtiene el filtro base */
    function getIndicators(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/indicators',
        data: data
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    //** Obtiene el filtro base */
    function getTracking(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/indicators/control',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getAverageTime(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/indicators/averagetime',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOpportunityTime(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/indicators/opportunitytime',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

  }
})();
