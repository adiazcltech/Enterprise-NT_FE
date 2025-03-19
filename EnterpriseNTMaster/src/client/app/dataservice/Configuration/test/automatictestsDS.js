(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('automatictestsDS', automatictestsDS);

  automatictestsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function automatictestsDS($http, $q, exception, logger,settings) {
    var service = {
      getautomatictestId: getautomatictestId,
      Newautomatictest:Newautomatictest
    };

    return service;
    //** Método que consulta el servicio por id de la prueba y trae los datos de la prueba automatica*/
    function getautomatictestId(token,test) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/tests/automatictests/test/'+ test
          });
          return promise.success(function (response, status) {
            return response;
          });

    }  

        
    //** Método que crea prueba automatica*/
     function Newautomatictest(token,automatictest,test) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/tests/automatictests/test/'+ test,
               data: automatictest
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
  }
})();
