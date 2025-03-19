(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('ordertypeDS', ordertypeDS);

  ordertypeDS.$inject = ['$http', 'exception', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function ordertypeDS($http, exception, settings) {
    var service = {
      getOrderTypeActive: getOrderTypeActive,
      getIdOrderType: getIdOrderType,
      getlistOrderType: getlistOrderType
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de tipo de orden*// 
    function getlistOrderType(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/ordertypes',
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
    //** Método que consulta el servicio por id y trae los datos de  tipo de orden*/
    function getIdOrderType(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/ordertypes/filter/id/' + id,
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


    function getOrderTypeActive(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/ordertypes/filter/state/true',
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


  }
})();


