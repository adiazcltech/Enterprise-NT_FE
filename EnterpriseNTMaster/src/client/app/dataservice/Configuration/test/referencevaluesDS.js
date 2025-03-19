(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('referencevaluesDS', referencevaluesDS);

  referencevaluesDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function referencevaluesDS($http, settings) {
    var service = {
      getreferencevaluesTest: getreferencevaluesTest,
      insertreferencevaluesTest: insertreferencevaluesTest,
      updatereferencevaluesTest: updatereferencevaluesTest,
      deletereferencevaluesTest: deletereferencevaluesTest
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de unidades*//
    function getreferencevaluesTest(token, test) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/referencevalues/test/' + test
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método que consulta el Servicio y trae una lista de unidades*//
    function insertreferencevaluesTest(token, data) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/referencevalues',
        data: data
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método que consulta el Servicio y trae una lista de unidades*//
    function updatereferencevaluesTest(token, data) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/referencevalues',
        data: data
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    //** Método que consulta el Servicio y trae una lista de unidades*//
    function deletereferencevaluesTest(token, test) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/referencevalues/' + test
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

  }
})();
