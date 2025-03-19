(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('printBarcodeDS', printBarcodeDS);

  printBarcodeDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  function printBarcodeDS($http, settings) {
    var service = {
      getprintBarcode: getprintBarcode,
      printBarcode: printBarcode

    };
    return service;
    //** Metodo para obtener cadena ZPL de las muestras.*/
    function getprintBarcode(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/listorders/barcode',
        data: json
      })
        .then(success);
      function success(response) {
        return response;
      }
    }
    //** Metodo para mandar a imprimir codigos de barras.*/
    function printBarcode(token, listbarcode) {
      return $http.post('/api/printBarcode', listbarcode)
        .then(success);
      function success(response) {
        return response;
      }
    }

  }
})();

