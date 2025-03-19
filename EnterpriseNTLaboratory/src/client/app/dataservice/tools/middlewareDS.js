(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('middlewareDS', middlewareDS);

  middlewareDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function middlewareDS($http, settings) {
    var service = {
      getlistprocessing: getlistprocessing,
      middlewareresend: middlewareresend
    };

    return service;
    //** Método que Obtiene lista laboratorios de procesamiento*// 
    function getlistprocessing(token) {
      return $http({
        hideOverlay: true,
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/laboratories/listprocessing'    
          }).then(function(response) {
        return response;
      });
    }   
     //** Método que  Reenvio de ordenes al middleware por rango de fechas y/o por ordenes*// 
    function middlewareresend(token,data) {
      return $http({
        hideOverlay: true,
          method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/integration/middleware/resend',
              data: data    
          }).then(function(response) {
        return response;
      });
    }
  }
})();


 