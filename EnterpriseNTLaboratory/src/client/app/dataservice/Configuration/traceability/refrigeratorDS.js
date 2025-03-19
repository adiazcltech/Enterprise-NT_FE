(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('refrigeratorDS', refrigeratorDS);

  refrigeratorDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function refrigeratorDS($http, $q, exception, logger,settings) {
    var service = {
      getrefrigerator: getrefrigerator
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de Neveras*// 
    function getrefrigerator(token) {
       return $http({
                hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/refrigerators/filter/state/true'
      }).then(function (response) {
        return response;
      }); 
     
    }
   

  }
})();


 