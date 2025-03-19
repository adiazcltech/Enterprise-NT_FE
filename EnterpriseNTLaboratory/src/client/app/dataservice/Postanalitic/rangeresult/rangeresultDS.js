(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('rangeresultDS', rangeresultDS);

  rangeresultDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function rangeresultDS($http, $q, exception, logger,settings) {
    var service = {
      insertrangeresult: insertrangeresult
    };

    return service;
    //** Método que consulta el Servicio que genera y devuelve la información de una hoja de trabajo nueva.*//
    function insertrangeresult(token, json) {
      return $http({
        hideOverlay: true,
          method: 'PATCH',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/results/batch',
              data: json 
          }).then(function(response) {
              return response;
          });

    }

 

  }
})();

