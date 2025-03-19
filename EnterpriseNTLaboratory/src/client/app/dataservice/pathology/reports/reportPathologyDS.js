(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('reportPathologyDS', reportPathologyDS);

  reportPathologyDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  function reportPathologyDS($http, $q, exception, logger, settings) {
    var service = {
      printCaseBarcode: printCaseBarcode,
    };
    return service;

    function printCaseBarcode(token, json) {
      return $http({
        hideOverlay: true,
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/pathology/reports/printingbybarcode',
               data: json
          })
        .then(success);

      function success(response) {
        return response;
      }
    }
  }
})();
