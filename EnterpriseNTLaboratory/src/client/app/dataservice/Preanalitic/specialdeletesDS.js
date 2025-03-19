(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('specialdeletesDS', specialdeletesDS);

  specialdeletesDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function specialdeletesDS($http, $q, exception, logger, settings) {
    var service = {
      deletespecialrange: deletespecialrange,
      queryspecialdeletes: queryspecialdeletes
    };

    return service;

     function deletespecialrange(token, order) {
      return $http({
        hideOverlay: true,
                 method: 'PUT',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl  +'/specialdeletes',
                data: order 
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }

    function queryspecialdeletes(token, order) {
      return $http({
        hideOverlay: true,
                 method: 'PATCH',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl  +'/specialdeletes/query',
                data: order 
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }

  }
})();
