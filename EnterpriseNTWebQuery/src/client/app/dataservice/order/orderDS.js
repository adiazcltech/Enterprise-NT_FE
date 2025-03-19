(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('orderDS', orderDS);

  orderDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  function orderDS($http, $q, exception, logger, settings) {
    var service = {
      getfilterorders: getfilterorders,
      getordersresult: getordersresult,
      getResultsHistory: getResultsHistory,
      printreport: printreport,
      getUserValidate: getUserValidate,
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

    function getordersresult(token, order) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/orders/results/order/' + order,
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

    function getUserValidate(order, url) {
      return $http({
        method: 'GET',
        url: url + '/api/orders/getUserValidate/idOrder/' + order,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function mergepdf(json) {
      return $http({
        hideOverlay: true,
          method: 'POST',
          url: settings.serviceUrlSocketIO  +'/api/mergepdf',
          data: json
        })
        .then(success);
      function success(response) {
        return response;
      }
    }

  }
})();
