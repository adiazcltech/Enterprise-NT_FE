(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('sigaDS', sigaDS);

  sigaDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function sigaDS($http, $q, exception, logger, settings) {
    var service = {
      getsigabranches: getsigabranches,
      getsigaservices: getsigaservices,
      getsigabranchesurl: getsigabranchesurl,
      getsigaserviceurl: getsigaserviceurl
    };

    return service;

     function getsigabranches(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/integration/siga/branches'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    function getsigaservices(token,branch) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/integration/siga/services/'+ branch
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
      //** Método que Actualiza el servicio demografico*/
    function getsigabranchesurl(token,branche) {
        var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/integration/siga/verification/url',
               data: branche
          });
          return promise.success(function (response, status) {
            return response;
          });
    }  
      //** Método que Actualiza el servicio demografico*/
    function getsigaserviceurl(token,service) {
        var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/integration/siga/service/url/branch',
               data: service
          });
          return promise.success(function (response, status) {
            return response;
          });
    }  
  }
})();
