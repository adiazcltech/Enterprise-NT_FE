(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('resultemplateDS', resultemplateDS);

  resultemplateDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function resultemplateDS($http, $q, exception, logger,settings) {
    var service = {
      getresultemplateId: getresultemplateId,
      deleteresultemplate:deleteresultemplate,
      Newresultemplate:Newresultemplate
    };

    return service;
    //** Método que consulta el servicio por id de la prueba y trae los datos de la plantilla de resultado*/
    function getresultemplateId(token,test) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/templates/filter/test/'+ test
          });
          return promise.success(function (response, status) {
            return response;
          });

    }  
    //** Método que elimina todas la plantilla de resultado asociado a las pruebas*/
    function deleteresultemplate(token,test) {
         var promise = $http({
              method: 'DELETE',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/templates/test/'+ test
          });
          return promise.success(function (response, status) {
            return response;
          });

    }          
    //** Método que crea  plantilla de resultado*/
     function Newresultemplate(token,templates) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/templates',
               data: templates
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
  }
})();
