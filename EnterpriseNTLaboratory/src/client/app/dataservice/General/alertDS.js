(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('alertDS', alertDS);

  alertDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function alertDS($http, $q, exception, logger,settings) {
    var service = {
      getAlert: getAlert
    };

    return service;

    //** Método que consulta las alertas generadas en una pagina*/
    function getAlert(token,page) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/alerts/'+ page 
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
  }
})();
