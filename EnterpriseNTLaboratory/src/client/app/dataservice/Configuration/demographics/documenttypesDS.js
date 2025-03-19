(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('documenttypesDS', documenttypesDS);

  documenttypesDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function documenttypesDS($http, $q, exception, logger,settings) {
    var service = {
      getDocumentType: getDocumentType,
      getId: getId,
      New:New,
      update:update,
      getstatetrue:getstatetrue
    };

    return service;
    //** Método trae una lista de tipo de documento*// 
    function getDocumentType(token) {
      return $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/documenttypes',
              hideOverlay: true
          }).then(function(response) {
        return response;
      });
    }

    //** Método que consulta el servicio por id y trae los datos de la tipo de documento*/
    function getId(token,id) {
         return $http({
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/documenttypes/'+ id,
                hideOverlay: true
              
          }).then(function(response) {
        return response;
      });
    }

     //** Método que consulta Lista los tipos de documento registrados por estado*/
    function getstatetrue(token,id) {
         return $http({
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/documenttypes/filter/state/true',
                hideOverlay: true
              
          }).then(function(response) {
        return response;
      });
    }

    //** Método que crea tipo de documento*/
     function New(token,documenttypes) {
        return $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/documenttypes',
               data: documenttypes,
               hideOverlay: true
          }).then(function(response) {
        return response;
      });
    }
    //** Método que Actualiza tipo de documento*/
    function update(token,documenttypes) {
        return $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/documenttypes',
               data: documenttypes,
               hideOverlay: true
               
          }).then(function(response) {
        return response;
      });
    }


   

  }
})();


 