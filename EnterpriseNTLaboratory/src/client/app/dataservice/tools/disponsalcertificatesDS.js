(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('disponsalcertificatesDS', disponsalcertificatesDS);

  disponsalcertificatesDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function disponsalcertificatesDS($http, settings) {
    var service = {
      getdisposalcertificates: getdisposalcertificates,
      getdetaildisposalcertificates: getdetaildisposalcertificates,
      insertdisposalcertificates: insertdisposalcertificates,
      insertsampledisposalcertificates: insertsampledisposalcertificates,
      insertrackdisposalcertificates: insertrackdisposalcertificates,
      closedisposalcertificates: closedisposalcertificates
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de unidades*// 
    function getdisposalcertificates(token) {
      return $http({
        hideOverlay: true,
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/disposalcertificates'    
          }).then(function(response) {
        return response;
      });
    }

    function getdetaildisposalcertificates(token, id) {
      return $http({
        hideOverlay: true,
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/disposalcertificates/detail/' + id    
          }).then(function(response) {
        return response;
      });
    }

    function insertdisposalcertificates(token,disposalcertificates) {
      return $http({
        hideOverlay: true,
          method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/disposalcertificates',
              data: disposalcertificates    
          }).then(function(response) {
        return response;
      });
    } 

    function insertsampledisposalcertificates(token,disposalcertificates) {
      return $http({
        hideOverlay: true,
          method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/disposalcertificates/add/sample',
              data: disposalcertificates    
          }).then(function(response) {
        return response;
      });
    }

    function insertrackdisposalcertificates(token,disposalcertificates) {
      return $http({
        hideOverlay: true,
          method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/disposalcertificates/add/rack',
              data: disposalcertificates    
          }).then(function(response) {
        return response;
      });
    }

    function closedisposalcertificates(token,disposalcertificates) {
      return $http({
        hideOverlay: true,
          method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/disposalcertificates/close',
              data: disposalcertificates    
          }).then(function(response) {
        return response;
      });
    } 
  }
})();


 