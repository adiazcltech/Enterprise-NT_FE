(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('alarmdayDS', alarmdayDS);

  alarmdayDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function alarmdayDS($http, $q, exception, logger,settings) {
    var service = {
      deletealarmdays: deletealarmdays,
      getId: getId,
      update:update
    };

    return service;
    //** Método que elimina *// 
    function deletealarmdays(token,id,item) {
      var promise = $http({
              method: 'DELETE',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/demographics/alarmdays/filter/demographic/'+ id +'/demographicitem/'+ item 
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id  del demografico*/
    function getId(token,id,item) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/demographics/alarmdays/filter/demographic/'+ id +'/demographicitem/'+ item 
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }

    //** Método que Actualiza el servicio demografico*/
    function update(token,alarmdays) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/demographics/alarmdays',
               data: alarmdays
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 