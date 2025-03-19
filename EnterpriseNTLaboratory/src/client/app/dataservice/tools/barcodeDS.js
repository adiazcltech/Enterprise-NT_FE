(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('barcodeDS', barcodeDS);

  barcodeDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
    function barcodeDS($http, $q, exception, logger,settings) {
     var service = {
      getBarcode: getBarcode,
      insertBarcode: insertBarcode,
      updateBarcode: updateBarcode
    };

    return service;

    function getBarcode(token) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/barcode/designer'
           })

        .then(success);

      function success(response) {
        return response;
      }
    }
    
    function insertBarcode(token, barcode) {
           return $http({
            hideOverlay: true,
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/barcode/designer',
              data: barcode
           })

        .then(success);

      function success(response) {
        return response;
      }
    }

    function updateBarcode(token, barcode) {
           return $http({
            hideOverlay: true,
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/barcode/designer',
              data: barcode
           })

        .then(success);

      function success(response) {
        return response;
      }
    }
   }
})();

