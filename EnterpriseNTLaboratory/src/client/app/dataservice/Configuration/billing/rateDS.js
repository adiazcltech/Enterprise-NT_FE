(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('rateDS', rateDS);

  rateDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function rateDS($http, $q, exception, logger, settings) {
    var service = {
      getRates: getRates,
      getIdRate: getIdRate,
      getState: getState,
      getPayers: getPayers
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de tarifas*// 
    function getRates(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/rates',
        hideOverlay: true

      }).then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }


    }
    //** Método que consulta el Servicio y trae una lista de tarifas*// 
    function getPayers(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/rates/payers',
        hideOverlay: true

      }).then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }

    }
    //** Método que consulta el servicio por id y trae los datos de tarifas*/
    function getIdRate(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/rates/' + id,
        hideOverlay: true

      }).then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }

    }
    //** Método que consulta el servicio por estado y trae los datos de tarifas*/
    function getState(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/rates/filter/state/true',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }


  }
})();


