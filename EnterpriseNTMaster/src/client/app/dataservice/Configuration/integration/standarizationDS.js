(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('standarizationDS', standarizationDS);

  standarizationDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function standarizationDS($http, $q, exception, logger, settings) {
    var service = {
      getStandarizationId: getStandarizationId,
      getStandarizationExists: getStandarizationExists,
      updateStandarization: updateStandarization
    };

    return service;


    function getStandarizationId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/centralsystems/standardization/test/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }


    function getStandarizationExists(token, idCentral, idTest , code) {
        var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/centralsystems/standardization/test/exists/' + idCentral + '/' + idTest + '/' + code,
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function updateStandarization(token,Standarization) {
       var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/centralsystems/standardization/test/',
              data: Standarization
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
