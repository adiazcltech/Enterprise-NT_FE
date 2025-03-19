(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('auditsorderDS', auditsorderDS);

  auditsorderDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  function auditsorderDS($http, settings) {
    var service = {
      getorder: getorder,
      getaudituser: getaudituser,
      rangeorder: rangeorder,
      getTraceabilityOfInvoices:getTraceabilityOfInvoices,
      getordersample: getordersample,
      getpatientorder: getpatientorder,
      getgeneral: getgeneral,
      getInvoiceTraceability:getInvoiceTraceability,
      getconsolidated: getconsolidated, 
      getTraceabilityCashOrder: getTraceabilityCashOrder
    };

    return service;

    function getorder(token, order) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/order/' + order,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getTraceabilityCashOrder(token, order) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/getTraceabilityCashOrder/orderNumber/' + order,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getaudituser(token, inicial, final, user) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/user/date/' + inicial + '/' + final + '/user/' + user
      }).then(function (response) {
        return response;
      });

    }
    function rangeorder(token, data) {
      return $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/searchorders/orderswithpatient',
        data: data,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getTraceabilityOfInvoices(token, data) {
      return $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/getTraceabilityOfInvoices',
        data: data,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getordersample(token, order, sample) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/order/' + order + '/sample/' + sample,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getpatientorder(token, order) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/patient/order/' + order,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getgeneral(token, init, end) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/order/general/' + init + '/' + end,
        hideOverlay: true
      })
      .then(success);
      function success(response) {
        return response;
      }
    }

    function getconsolidated(token, consult) {
      return $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/order/consolidated',
        hideOverlay: true,
        data: consult
      })
      .then(success);
      function success(response) {
        return response;
      }
    }

    function getInvoiceTraceability(token, invoiceNumber) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/audits/getTraceabilityOfInvoice/invoiceNumber/' + invoiceNumber,
        hideOverlay: true
      })
      .then(success);
      function success(response) {
        return response;
      }
    }
  }
})();

