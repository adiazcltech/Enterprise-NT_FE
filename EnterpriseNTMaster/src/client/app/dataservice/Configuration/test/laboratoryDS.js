(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('laboratoryDS', laboratoryDS);
  laboratoryDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  //** Método que define los metodos a usar*/
  function laboratoryDS($http, settings) {
    var service = {
      get: get,
      getdatareport: getdatareport,
      getId: getId,
      getLaboratorytestBranchType: getLaboratorytestBranchType,
      New: New,
      update: update,
      updateintegration: updateintegration,
      getLaboratoryActive: getLaboratoryActive,
      testConnectionMiddleware: testConnectionMiddleware,
      getlaboratoriesbybranches: getlaboratoriesbybranches,
      updatelaboratoriesbybranches: updatelaboratoriesbybranches

    };
    return service;
    //** Método que consulta el Servicio y trae una lista de laboratorios*//
    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/laboratories'

      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que consulta el Servicio y trae una lista de laboratorios*//
    function getdatareport(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/tests/branch/laboratory'

      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que consulta el servicio por estado y trae los datos de las laboratorios activas*/
    function getLaboratoryActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/laboratories/filter/state/true'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que consulta el servicio por id y trae los datos del laboratorios*/
    function getId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/laboratories/filter/id/' + id

      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que consulta el servicio por estado y trae los datos de las muestras activas*/
    function getLaboratorytestBranchType(token, test, branch, grouptype) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/tests/laboratory/test/' + test + '/branch/' + branch + '/grouptype/' + grouptype
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que crea un laboratorio*/
    function New(token, laboratory) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/laboratories',
        data: laboratory
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que Actualiza un laboratorio*/
    function update(token, laboratory) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/laboratories',
        data: laboratory
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que Actualiza un laboratorio*/
    function updateintegration(token, laboratory) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/laboratories/integration',
        data: laboratory
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que sirve para probar la URL delc laboratorio para la conexión con Middleware*/
    function testConnectionMiddleware(token, json) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/integration/middleware/verification/url',
        data: json
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que consulta el servicio por id y trae los datos del laboratorios por sede*/
    function getlaboratoriesbybranches(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branches/laboratories/' + id

      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que Actualiza un laboratorio por sede*/
    function updatelaboratoriesbybranches(token, laboratory) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branches/laboratories',
        data: laboratory
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
