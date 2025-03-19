(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('moduleDS', moduleDS);

  moduleDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function moduleDS($http, $q, exception, logger,settings) {
    var service = {
      getModuleMasterUser: getModuleMasterUser,
      getModules: getModules
    };

    return service;


    //** Método que consulta los modulos de configuracion a los que tiene permiso un  usuario*/
    function getModuleMasterUser(token,id) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/modules/filter/user/'+ id

               })

        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }
    }

   

    function getModules(token) {
      var promise = $http({
        hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/modules'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }




  }
})();
