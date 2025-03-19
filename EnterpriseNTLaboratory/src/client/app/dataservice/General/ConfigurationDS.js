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
      getsecurity: getsecurity,
      updateConfiguration: updateConfiguration,
      getpasswordrecovery: getpasswordrecovery
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

    function getsecurity() {
      return $http({
        method: 'GET', //
        url: settings.serviceUrl + '/configuration/securitypolitics',
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }
    function getpasswordrecovery() {
      return $http({
        method: 'GET', //
        url: settings.serviceUrl + '/configuration/passwordrecovery',
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }


    function updateConfiguration(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration',
        data: json
      })

        .then(function (response) {
          return response;
        });
    }
  }
})();
/* jshint ignore:end */
