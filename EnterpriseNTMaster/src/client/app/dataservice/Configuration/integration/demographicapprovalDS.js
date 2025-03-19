(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('demographicapprovalDS', demographicapprovalDS);

  demographicapprovalDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function demographicapprovalDS($http, $q, exception, logger, settings) {
    var service = {
      getStandarizationDemographicExists: getStandarizationDemographicExists,
      updateStandarizationDemographic: updateStandarizationDemographic,
      importStandarizationDemographic: importStandarizationDemographic
    };

    return service;



    function getStandarizationDemographicExists(token, idCentral, idDemographic, demographicitem, code) {
        var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/centralsystems/standardization/demographics/exists/' + idCentral + '/' + idDemographic + '/' + demographicitem + '/' + code,
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

    function updateStandarizationDemographic(token,Standarization) {
       var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/centralsystems/standardization/demographics',
              data: Standarization
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

    function importStandarizationDemographic(token,Standarization) {
       var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/centralsystems/standardization/demographics/import',
              data: Standarization
         });
         return promise.success(function (response, status) {
           return response;
         });

   }
  }
})();
