(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('barcodeDS', barcodeDS);

  barcodeDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function barcodeDS($http, settings) {
    var service = {
      testServerPrint: testServerPrint,
      getOrderHeaderBarcode: getOrderHeaderBarcode,
      printOrderBodyBarcode: printOrderBodyBarcode
    };

    return service;



    function testServerPrint(url) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        url: url + 'testServerPrint',
        transformResponse: [
          function (data) {
            return data;
          }
        ]
      }).then(function (response) {
        return response;
      }); 
    }

    function getOrderHeaderBarcode(token, json) {
      return $http({
          hideOverlay: true,
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/reports/ordersbarcode',
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
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/reports/printingbybarcode',
          data: json
        })
        .then(success);

      function success(response) {
        return response;
      }
    }



  }
})();
