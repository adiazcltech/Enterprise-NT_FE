(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('microorganismDS', microorganismDS);
    microorganismDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function microorganismDS($http, $q, exception, logger, settings) {
        var service = {
            getState:getState
        };
        return service;
        //** Método que consulta el servicio por estado y trae los datos de microorganismo*/      
    function getState(token) {
      return $http({
        hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/microorganisms/filter/state/true'   
      }).then(function (response) {
        return response;
      });
       
    }


    }
})();
 