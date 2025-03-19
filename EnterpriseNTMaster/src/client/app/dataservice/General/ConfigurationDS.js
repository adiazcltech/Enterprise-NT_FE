(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('configurationDS', configurationDS);

  configurationDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function configurationDS($http, settings) {
    var service = {
      getConfigurationKey: getConfigurationKey,
      getConfiguration: getConfiguration,
      updateConfiguration: updateConfiguration,
      insertconfigurationinitial: insertconfigurationinitial,
      configurationinitial: configurationinitial,
      getConectionEvents: getConectionEvents,
      getGroupingOrders: getGroupingOrders,
      saveGroupingOrders: saveGroupingOrders,
      deleteGroupingOrders: deleteGroupingOrders,
      getsecurity: getsecurity,
      updatesecurity: updatesecurity,
      getrecalled: getrecalled,
      getappointment: getappointment,
      getlicenciedashboard:getlicenciedashboard,
    };

    return service;

    function getConfigurationKey(token, llave) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration/' + llave
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getConfiguration(token) {

      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateConfiguration(token, json) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration',
        data: json
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function insertconfigurationinitial(token, json) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration/start/settings',
        data: json
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function configurationinitial(token, json) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration/start/settings',
        data: json
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getConectionEvents(token, json) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/events/validateUrl',
        data: json

      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getGroupingOrders(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/ordergrouping'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function updatesecurity(json) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': ''
        },
        url: settings.serviceUrl + '/configuration/updatesecurity',
        data: json
      });

      return promise.success(function (response, status) {
        return response;
      });

    }

    function getsecurity() {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': ''
        },
        url: settings.serviceUrl + '/configuration/securitypolitics'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function saveGroupingOrders(token, json) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/ordergrouping',
        data: json
      });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function deleteGroupingOrders(token) {
      var promise = $http({
        method: 'DELETE',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/ordergrouping'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function getrecalled(token) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration/restartsequence/recalled'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getappointment(token) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration/restartsequence/appointment'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getlicenciedashboard() {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': ''
        },
        url: settings.serviceUrl + '/dashboard/boardLicenses'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }


  }
})();
