(function() {
    'use strict';
  
    angular
      .module('app.core')
      .factory('ripsDS', ripsDS);
  
    ripsDS.$inject = ['$http','settings'];
    /* @ngInject */
      function ripsDS($http, settings) {
       var service = {
        getconfiguration: getconfiguration,
        getrips: getrips
      };
  
      return service;

      function getconfiguration(token) {
        return $http({
           method: 'GET',
           headers: {'Authorization': token},
           url: settings.serviceUrl  +'/configuration/rips'
        })
        .then(success);

        function success(response) {
            return response;
        }
    }
  
      function getrips(token,data) {
             return $http({
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/rips',
                data: data 
             })
          .then(success);
  
        function success(response) {
          return response;
        }
      }
     }
  })();
  
  
  