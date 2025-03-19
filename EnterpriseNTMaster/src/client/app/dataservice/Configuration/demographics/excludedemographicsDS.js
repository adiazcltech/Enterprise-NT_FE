(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('excludedemographicsDS', excludedemographicsDS);

  excludedemographicsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function excludedemographicsDS($http, $q, exception, logger, settings) {
    var service = {
      getTestExcludeDemographics: getTestExcludeDemographics,
      updateExcludeDemographics: updateExcludeDemographics,
      deleteExcludeDemographics: deleteExcludeDemographics
    };

    return service;

    function getTestExcludeDemographics(token,idDemographic,idItemDemographic) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/demographics/exclude/id/'+ idDemographic +'/item/' + idItemDemographic   
          });
      
      return promise.success(function (response, status) {
        return response;
      });     
    }

    function updateExcludeDemographics(token,test) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/demographics/exclude/',
              data: test
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  function deleteExcludeDemographics(token,idDemographic,idItemDemographic) {
       var promise = $http({
              method: 'DELETE',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/demographics/exclude/id/'+ idDemographic +'/item/' + idItemDemographic 
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   
  }
})();
