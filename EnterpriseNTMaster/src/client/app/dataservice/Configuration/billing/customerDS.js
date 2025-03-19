(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('customerDS', customerDS);

  customerDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function customerDS($http, $q, exception, logger, settings) {
    var service = {
      getCustomer: getCustomer,
      getCustomerId: getCustomerId,
      getCustomerate:getCustomerate,
      getCustomerstate:getCustomerstate,
      newCustomer: newCustomer,
      updateCustomer: updateCustomer,
      newCustomerate:newCustomerate
    };

    return service;

    function getCustomer(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/accounts'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    function getCustomerId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/accounts/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

     function getCustomerate(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/accounts/ratesofaccount/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

      function getCustomerstate(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/accounts/filter/state/true'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea un cliente*/
    function newCustomer(token,Customer) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/accounts',
              data: Customer
         });
         return promise.success(function (response, status) {
           return response;
         });

   }
    //** Método que soacia un cliente con tarifa*/
    function newCustomerate(token,Customer) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/accounts/ratesofaccount',
              data: Customer
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function updateCustomer(token,Customer) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/accounts',
              data: Customer
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
