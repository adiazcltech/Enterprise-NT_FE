(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('destinationDS', destinationDS);

  destinationDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function destinationDS($http, $q, exception, logger,settings) {
    var service = {
      getDestinationActive:getDestinationActive,
      getdestinations:getdestinations
      
    };

    return service;
    

    function getDestinationActive(token) {
         return $http({
          hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/destinations/filter/state/true'   
          })

        .then(success);

      function success(response) {
        return response;
      }
    }

     function getdestinations(token) {
         return $http({
          hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/destinations'   
          })

        .then(success);

      function success(response) {
        return response;
      }
    }

  
 
  }
})();


 