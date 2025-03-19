(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('contractDS', contractDS);

  contractDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function contractDS($http, settings) {
    var service = {
      getCustomerid: getCustomerid,
      getRatesByCustomerId: getRatesByCustomerId,
      getId: getId,
      New: New,
      validatesContractActivation: validatesContractActivation,
      update: update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de contratos*// 
    function getCustomerid(token, idCustomer) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/contracts/idCustomer/' + idCustomer

      });
      return promise.success(function (response) {
        return response;
      });

    }
    //** Método que consulta el servicio por id y trae los datos del contratos*/
    function getId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/contracts/getContract/id/' + id

      });
      return promise.success(function (response) {
        return response;
      });

    }
    //** Método que consulta el servicio por id y trae los datos del contratos*/
    function getRatesByCustomerId(token, customerId) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/contracts/getRatesByCustomerId/customerId/' + customerId

      });
      return promise.success(function (response) {
        return response;
      });

    }
    //** Método que crea bancos*/
    function New(token, bank) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/contracts/newcontract',
        data: bank
      });
      return promise.success(function (response) {
        return response;
      });

    }
    //** Método que crea bancos*/
    function validatesContractActivation(token, contract) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/contracts/validatesContractActivation',
        data: contract
      });
      return promise.success(function (response) {
        return response;
      });

    }
    //** Método que Actualiza bancos*/
    function update(token, bank) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/contracts/updcontract',
        data: bank
      });
      return promise.success(function (response) {
        return response;
      });
    }
  }
})();


