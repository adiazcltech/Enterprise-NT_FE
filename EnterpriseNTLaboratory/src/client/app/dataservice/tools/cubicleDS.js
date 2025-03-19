(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('cubicleDS', cubicleDS);

  cubicleDS.$inject = ['$http', 'settings'];
  /* @ngInject */
    function cubicleDS($http,settings) {
     var service = {
      getcubicle: getcubicle, 
      updatecubicle: updatecubicle
    };

    return service;

    function getcubicle(token) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/samplingSites'
           })

        .then(success);

      function success(response) {
        return response;
      }
    }   


    function updatecubicle(token, data) {
           return $http({
            hideOverlay: true,
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/samplingSites',
              data: data
           })

        .then(success);

      function success(response) {
        return response;
      }
    }
   }
})();

