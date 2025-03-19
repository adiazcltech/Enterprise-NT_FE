(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('reportsDS', reportsDS);

  reportsDS.$inject = ['$http', 'settings'];

  function reportsDS($http, settings) {
    var service = {
      getReports: getReports,
      getOrderPreliminaryend: getOrderPreliminaryend,
      getdemo: getdemo,
      updateState: updateState,
      getOrderHeader: getOrderHeader,
      printOrderBody: printOrderBody,
      getOrderPreliminary: getOrderPreliminary,
      getOrderHeaderBarcode: getOrderHeaderBarcode,
      getOrderHeaderBarcodeFast: getOrderHeaderBarcodeFast,
      printOrderBodyBarcode: printOrderBodyBarcode,
      getUserValidate: getUserValidate,
      getOrdersResults: getOrdersResults,
      getSendPrintFinalReport: getSendPrintFinalReport,
      changeStateTest: changeStateTest,
      mergepdf: mergepdf,
      generarpdf: generarpdf
    };
    return service;

    function changeStateTest(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/changestatetest',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getSendPrintFinalReport(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/printFinalReport',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrderPreliminary(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/printingreport',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrderPreliminaryend(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/finalReport',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getReports(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrderHeader(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/orderheader',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function updateState(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/reported/tests',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrderHeaderBarcodeFast(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/ordersbarcodeheader',
        //url: 'http://10.28.110.80:8080/Enterprise_NT/api/reports/ordersbarcode',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrderHeaderBarcode(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/ordersbarcode',
        //url: 'http://10.28.110.80:8080/Enterprise_NT/api/reports/ordersbarcode',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function printOrderBody(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/printingbytype',
        //url: 'http://10.28.110.80:8080/Enterprise_NT/api/reports/printingbytype',

        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function printOrderBodyBarcode(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/printingbybarcode',
        data: json
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getUserValidate(order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        url: settings.serviceUrl + '/orders/getUserValidate/idOrder/' + order
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getdemo(token, order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/orders/emailItem/' + order
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrdersResults(token, orderInit, orderFinal) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/getOrdersResults/' + orderInit + '/' + orderFinal
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function mergepdf(json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        url: settings.serviceUrlSocketIO + '/api/mergepdf',
        data: json
      })
        .then(success);
      function success(response) {
        return response;
      }
    }

    function generarpdf(json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        url: settings.serviceUrlSocketIO + '/api/generarpdf',
        //url: 'http://192.168.1.90:10004/api/generarpdf',
        data: json
      })
        .then(success);
      function success(response) {
        return response;
      }
    }
  }
})();
