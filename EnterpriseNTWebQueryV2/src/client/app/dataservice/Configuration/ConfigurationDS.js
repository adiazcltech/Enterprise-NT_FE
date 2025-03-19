(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('configurationDS', configurationDS);

  configurationDS.$inject = ['$http', 'settings','localStorageService'];
  /* @ngInject */
  function configurationDS($http, settings,localStorageService) {
    var service = {
      getConfiguration: getConfiguration,
      getDemographicsALL: getDemographicsALL,
      updateConfiguration: updateConfiguration,
      getDocumentype: getDocumentype,
      getwebquery: getwebquery,
      getDemographicskey: getDemographicskey,
      getlistReportFile: getlistReportFile,
      getlistidiome: getlistidiome,
      getsensitive: getsensitive,
      getuser:getuser,
      getAreasActive:getAreasActive
    };

    return service;
    function getConfiguration(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': '' },
        url: settings.serviceUrl + '/configuration/encrypted'
      }).then(function (response) {
        return response;
      });
    }
    function getDemographicsALL(token, url) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: url + '/api/demographics/all',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }
    function getAreasActive(token, url) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: url + '/api/areas/filter/state/true',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getlistReportFile(parameters) {
      return $http.post('/api/getlistReportFile', parameters)
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getuser() {
      return $http.post('/api/user')
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getlistidiome(parameters) {
      var view = { hideOverlay: true }
      return $http
        .post("/api/getlistidiome", parameters, view)
        .then(success);
      function success(response) {
        return response;
      }
    }
    function getDemographicskey(token, url, key) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: url + '/api/configuration/' + key,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }
    function updateConfiguration(token, datakey) {
      return $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/configuration',
        data: datakey
      }).then(function (response) {
        return response;
      });
    }
    function getDocumentype(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/configuration/documenttypes'
      }).then(function (response) {
        return response;
      });
    }
    function getwebquery(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographic/webquery'
      }).then(function (response) {
        return response;
      });
    }
    function getsensitive(token, order, test) {
      var serviceUrl = localStorageService.get('ServiciosLISUrl') + '/api'
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: serviceUrl + '/microbiology/microbialdetection/order/' + order + '/test/' + test
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
  }
})();
