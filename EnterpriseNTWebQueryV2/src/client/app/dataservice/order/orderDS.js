(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('orderDS', orderDS);

  orderDS.$inject = ['$http', 'localStorageService', 'settings'];
  /* @ngInject */

  function orderDS($http, localStorageService, settings) {
    var service = {
      getfilterorders: getfilterorders,
      getordersresult: getordersresult,
      getResultsHistory: getResultsHistory,
      printreport: printreport,
      getUserValidate: getUserValidate,
      getOrderPreliminaryend: getOrderPreliminaryend,
      changeStateTest: changeStateTest,
      getOrderHeader: getOrderHeader,
      mergepdf: mergepdf
    };

    return service;

    function getfilterorders(token, filter) {
      return $http({
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/orders/filter',
        data: filter
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getordersresult(token, order, area) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/orders/results/order/' + order + '/' + area,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getResultsHistory(token, filter) {
      return $http({
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/orders/results/history',
        data: filter,
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function printreport(token, filter) {
      return $http({
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/orders/reports',
        data: filter,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrderPreliminaryend(token, filter) {
      var serviceUrl = localStorageService.get('ServiciosLISUrl') + '/api'
      return $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: serviceUrl + '/reports/finalReport',
        data: filter,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function changeStateTest(token, filter) {
      var serviceUrl = localStorageService.get('ServiciosLISUrl') + '/api'
      return $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: serviceUrl + '/reports/changestatetest',
        data: filter,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getOrderHeader(token, filter) {
      var serviceUrl = localStorageService.get('ServiciosLISUrl') + '/api'
      return $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: serviceUrl + '/reports/orderheader',
        data: filter,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function printreport(token, filter) {
      var serviceUrl = localStorageService.get('ServiciosLISUrl') + '/api'
      return $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: serviceUrl + '/reports/printingreport',
        data: filter,
        hideOverlay: true
      })
        .then(success);

      function success(response) {
        return response;
      }
    }


    function getUserValidate(order, url) {
      var serviceUrl = localStorageService.get('ServiciosLISUrl');
      return $http({
        method: 'GET',
        url: serviceUrl + '/api/orders/getUserValidate/idOrder/' + order,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
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

  }
})();
