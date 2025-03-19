(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('inconsistenciesDS', inconsistenciesDS);

  inconsistenciesDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function inconsistenciesDS($http, $q, exception, logger, settings) {
    var service = {
      getinconsistencies: getinconsistencies,
      resolveinconsistencies: resolveinconsistencies,
      getinconsistency: getinconsistency
    };

    return service;

    function getinconsistencies(token, init,end) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl + '/inconsistencies/init/'+ init +'/end/'+ end 
      }).then(function(response) {
        return response;
      });
    }

     function resolveinconsistencies(token, order,lis) {
      return $http({
        hideOverlay: true,
                 method: 'PUT',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl + '/inconsistencies/resolve/order/'+ order +'/lis/'+ lis 
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
 
    function getinconsistency(token, orderId) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl + '/inconsistencies/order/'+ orderId  
      }).then(function(response) {
        return response;
      });
    }

  }
})();
