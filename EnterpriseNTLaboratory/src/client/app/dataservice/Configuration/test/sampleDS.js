(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('sampleDS', sampleDS);

  sampleDS.$inject = ['$http','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function sampleDS($http, settings) {
    var service = {
      getSample: getSample,
      getId: getId,
      getSampleActive: getSampleActive
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de muestras*// 
    function getSample(token) {
        return $http({
          hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  +'/samples'
            
        }).then(function(response) {
        return response;
      });
       
    }   
    //** Método que consulta el servicio por id y trae los datos de la muestra*/
    function getId(token,id) {
       return $http({
        hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  +'/samples/filter/id/'+ id
            
        }).then(function(response) {
        return response;
      });
       
    }

    //** Método que consulta el servicio por estado y trae los datos de las muestras activas*/
    function getSampleActive(token) {
       return $http({
        hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  +'/samples/filter/state/true'
            
        }).then(function(response) {
        return response;
      });
       
    }   
  }
})();


 