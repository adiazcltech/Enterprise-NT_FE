(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('configurationDS', configurationDS);

  configurationDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  function configurationDS($http, $q, exception, logger, settings) {
    var service = {
      getConfiguration: getConfiguration,
      getDemographicsALL: getDemographicsALL,
      updateConfiguration: updateConfiguration,
      getDocumentype: getDocumentype,
      getwebquery: getwebquery,
      getDemographicskey: getDemographicskey,
      getlistReportFile:getlistReportFile,
      getlistidiome:getlistidiome
    };
    return service;
    //Consulta las llaves de configuración
    function getConfiguration(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/configuration'
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
    function getlistReportFile(parameters) {
      return $http.post('/api/getlistReportFile', parameters)
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getlistidiome(parameters) {
      var view={ hideOverlay: true}
      return $http
        .post("/api/getlistidiome", parameters,view)    
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
    //Actualiza las llaves de configuracion enviadas
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

    function getDocumentype() {
      return $http({
        method: 'GET',
        url: settings.serviceUrl + '/configuration/documenttypes'
      }).then(function (response) {
        return response;
      });
    }
    function getwebquery() {
      return $http({
        method: 'GET',
        url: settings.serviceUrl + '/demographic/webquery'
      }).then(function (response) {
        return response;
      });
    }
  }
})();
