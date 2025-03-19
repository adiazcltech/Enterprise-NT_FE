(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('usertypesDS', usertypesDS);

  usertypesDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function usertypesDS($http, $q, exception, logger,settings) {
    var service = {
      getusertype: getusertype,
      updateusertype: updateusertype
    };
    return service;
    //Consulta las llaves de configuración
     function getusertype(token) {
      return $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl + '/usertypes'
      }).then(function(response) {
        return response;
      });
    }
     //Actualiza las llaves de configuracion enviadas
     function updateusertype(token,datakey) {
      return $http({
        method: 'PUT',
        headers: {'Authorization': token},
        url: settings.serviceUrl + '/usertypes',
        data: datakey
      }).then(function(response) {
        return response;
      });
    }
  }
})();
