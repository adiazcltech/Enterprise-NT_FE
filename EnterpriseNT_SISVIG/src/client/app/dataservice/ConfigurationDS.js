/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('configurationDS', configurationDS);
  configurationDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  function configurationDS($http, settings) {
    var service = {
      getConfiguration: getConfiguration,
      getConfigurationKey: getConfigurationKey,
      restartsequencemanually: restartsequencemanually,
      restartsequence: restartsequence,
      updateconfiguration: updateconfiguration

    };

    return service;

    function getConfiguration(token) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/configuration'
        })
        .then(success);

      function success(response) {
        return response;
      }

    }

    function getConfigurationKey(token, llave) {

      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/configuration/' + llave
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function restartsequencemanually(token) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/configuration/restartsequencemanually',
        })
        .then(success);

      function success(response) {
        return response;
      }

    }

    function restartsequence(token, hour) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/configuration/restartsequence/' + hour
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function updateconfiguration(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration',
        data: data
      }).then(success);

      function success(response) {
        return response;
      }
    }
  }
})();
/* jshint ignore:end */
