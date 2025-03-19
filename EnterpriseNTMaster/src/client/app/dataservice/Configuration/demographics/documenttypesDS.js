(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('documenttypesDS', documenttypesDS);

  documenttypesDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function documenttypesDS($http, settings) {
    var service = {
      get: get,
      getState: getState,
      getId: getId,
      New: New,
      update: update
    };

    return service;
    //** Método trae una lista de tipo de documento*// 
    function get(token) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/documenttypes'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método trae una lista de tipo de documento*// 
    function getState(token) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/documenttypes/filter/state/true'

      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método que consulta el servicio por id y trae los datos de la tipo de documento*/
    function getId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/documenttypes/' + id

      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método que crea tipo de documento*/
    function New(token, documenttypes) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/documenttypes',
        data: documenttypes
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que Actualiza tipo de documento*/
    function update(token, documenttypes) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/documenttypes',
        data: documenttypes
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


  }
})();


