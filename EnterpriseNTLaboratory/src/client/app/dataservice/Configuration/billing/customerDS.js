(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('customerDS', customerDS);

  customerDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function customerDS($http, settings) {
    var service = {
      getCustomer: getCustomer,
      getCustomerId: getCustomerId,
      getCustomerate: getCustomerate,
      getCustomerstate: getCustomerstate,
      newCustomer: newCustomer,
      updateCustomer: updateCustomer,
      newCustomerate: newCustomerate,
      getrateState: getrateState,
      getEmailCustomerId: getEmailCustomerId
    };

    return service;

    function getCustomer(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });

    }

    function getCustomerId(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts/' + id,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }


    function getEmailCustomerId(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts/accounts/email/' + id,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getCustomerate(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts/ratesofaccount/' + id,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getCustomerstate(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts/filter/state/true',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }
    //** Método que crea un cliente*/
    function newCustomer(token, Customer) {
      return $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts',
        data: Customer,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }
    //** Método que soacia un cliente con tarifa*/
    function newCustomerate(token, Customer) {
      return $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts/ratesofaccount',
        data: Customer,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function updateCustomer(token, Customer) {
      return $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/accounts',
        data: Customer,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getrateState(token) {
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
