(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('exceptionDS', exceptionDS);

  exceptionDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function exceptionDS($http, $q, exception, logger,settings) {
    var service = {
      getexception: getexception
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de unidades*// 
    function getexception(token,initial,final) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/exceptions/filter/date/'+ initial+'/'+final 
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }  
   

  }
})();


 