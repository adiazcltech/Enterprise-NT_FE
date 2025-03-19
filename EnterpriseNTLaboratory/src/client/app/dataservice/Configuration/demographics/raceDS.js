(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('raceDS', raceDS);

  raceDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function raceDS($http, $q, exception, logger,settings) {
    var service = {
      getrace: getrace
    };

    return service;
    //** Método trae una lista de  razas*// 
    function getrace(token) {
      return $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/races',
              hideOverlay: true
              
          }).then(function(response) {
        return response;
      });
    }

    
  }
})();


 