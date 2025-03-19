(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('versionDS', versionDS);

  versionDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function versionDS($http, $q, exception, logger,settings) {
    var service = {
      getVersionBE: getVersionBE
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de bancos*// 
    function getVersionBE() {
      var promise = $http({
          method: 'GET',
              url: settings.serviceUrl  +'/banks'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
   
   

  }
})();


 