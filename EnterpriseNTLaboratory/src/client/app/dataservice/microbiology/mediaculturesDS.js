(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('mediaculturesDS', mediaculturesDS);

  mediaculturesDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function mediaculturesDS($http, $q, exception, logger, settings) {
    var service = {
      getmediaculturesAll: getmediaculturesAll,
      getmediaculturesId: getmediaculturesId,
      getmediaculturesActive:getmediaculturesActive,
      getmediaculturestestId:getmediaculturestestId,
      updatetestofmediacultures:updatetestofmediacultures
    };

    return service;
     //** Método que consulta la lista de todos los medios de cultivo*/
    function getmediaculturesAll(token) {
      return $http({
        hideOverlay: true,
                    method: 'GET',
                    headers: {'Authorization': token},
                    url: settings.serviceUrl  + '/mediacultures'
      }).then(function (response) {
        return response;
      });

    }
      //** Método que  consulta la lista de medios de cultivo que están activos*/
     function getmediaculturesActive(token) {
      return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  + '/mediacultures/filter/state/true'   
      }).then(function (response) {
        return response;
      });
       
    }

      //** Método que  consulta un  medio de cultivo por id*/
    function getmediaculturesId(token,id) {
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: {'Authorization': token},
                  url: settings.serviceUrl  + '/mediacultures/filter/id/'+ id
      }).then(function (response) {
            return response;
      });
    }

    //** Método Obtiene los medios de cultivo de una prueba*/
    function getmediaculturestestId(token,id) {
      return $http({
        hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/mediacultures/filter/test/'+ id
      }).then(function (response) {
            return response;
      });
    }
      //** asocia las  medios de cultivo a las pruebas*/
    function updatetestofmediacultures(token,mediacultures) {
        return $http({
          hideOverlay: true,
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/mediacultures/testofmediacultures',
              data: mediacultures
         }).then(function (response) {
            return response;
      });

   }

  }
 
})();



 