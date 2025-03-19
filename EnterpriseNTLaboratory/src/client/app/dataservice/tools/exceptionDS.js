(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('exceptionDS', exceptionDS);

  exceptionDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function exceptionDS($http, settings) {
    var service = {
      getexception: getexception,
      insertexception :insertexception
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de unidades*// 
    function getexception(token,initial,final) {
      return $http({
        hideOverlay: true,
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/exceptions/filter/date/'+ initial+'/'+final               
          }).then(function(response) {
        return response;
      });

    }

     function insertexception(token, data) {
       return $http({
        hideOverlay: true,
                method: 'POST',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/exceptions',
                data: data 
            })
          .then(success);      
        function success(response) {
          return response;
        }     
    }  
   

  }
})();


 