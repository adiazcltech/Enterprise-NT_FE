(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('destinationDS', destinationDS);

  destinationDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function destinationDS($http, settings) {
    var service = {
      get: get,
      getId: getId,
      New: New,
      update: update,
      getDestinationActive: getDestinationActive,
      getDestinationAssignment: getDestinationAssignment,
      NewDestinationAssignment: NewDestinationAssignment
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de destinos *//
    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/destinations'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que consulta el servicio por id y trae los datos de destinos*/
    function getId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/destinations/' + id

      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que crea destino*/
    function New(token, motive) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/destinations',
        data: motive
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que Actualiza destino*/
    function update(token, motive) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/destinations',
        data: motive
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDestinationActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/destinations/filter/state/true'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDestinationAssignment(token, branch, sample, typeorder) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/destinations/assignment/branch/' + branch + '/sample/' + sample + '/typeorder/' + typeorder
      });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function NewDestinationAssignment(token, destinationAssignment) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/destinations/assignment',
        data: destinationAssignment
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

  }
})();
