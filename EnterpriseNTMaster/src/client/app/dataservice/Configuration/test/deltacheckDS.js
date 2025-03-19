(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('deltacheckDS', deltacheckDS);

  deltacheckDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function deltacheckDS($http, $q, exception, logger,settings) {
    var service = {    
      updatedeltacheck:updatedeltacheck     
    };
    return service;  
    //** Método que Actualiza Deltacheck*/
    function updatedeltacheck(token,deltacheck) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl+'/tests/deltacheck',
               data: deltacheck
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
  }
})();
