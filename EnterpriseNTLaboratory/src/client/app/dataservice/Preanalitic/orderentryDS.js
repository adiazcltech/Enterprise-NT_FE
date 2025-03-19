(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('orderentryDS', orderentryDS);

  orderentryDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  function orderentryDS($http, $q, exception, logger, settings) {
    var service = {
      getDemographics: getDemographics
    };
    return service;

    function getDemographics(token, type) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl + '/orders/demographics/' + type
      })

      .then(function(response) {
        return response;
      });
    }

    
  }
})();