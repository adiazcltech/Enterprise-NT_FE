(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('priceassigmentDS', priceassigmentDS);

  priceassigmentDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function priceassigmentDS($http, $q, exception, logger, settings) {
    var service = {
      getPriceAssigmentId: getPriceAssigmentId,
      updatePriceAssigment: updatePriceAssigment,
      updateFeescheduleApply: updateFeescheduleApply,
      updatePriceFormula: updatePriceFormula,
      updateImportPriceTest: updateImportPriceTest

    };

      return service;


      function getPriceAssigmentId(token,idValid, idRate, idArea) {
        var promise = $http({
          method: 'GET',
          headers: {'Authorization': token},
          url: settings.serviceUrl  + '/priceassigments/'+ idValid + '/' + idRate + '/' + idArea,
          hideOverlay: true
        });
        return promise.success(function (response, status) {
          return response;
        });
      }


     function updatePriceAssigment(token,PriceAssigment) {
         var promise = $http({
                method: 'POST',
                headers: {'Authorization': token},
                url: settings.serviceUrl  + '/priceassigments',
                data: PriceAssigment,
                hideOverlay: true
           });
           return promise.success(function (response, status) {
             return response;
           });
     }

     function updateFeescheduleApply(token,FeescheduleApply) {
         var promise = $http({
                method: 'POST',
                headers: {'Authorization': token},
                url: settings.serviceUrl  + '/priceassigments/apply',
                data: FeescheduleApply,
                hideOverlay: true
           });
           return promise.success(function (response, status) {
             return response;
           });
     }    

     function updatePriceFormula(token,PriceFormula) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/priceassigments/formula',
              data: PriceFormula,
              hideOverlay: true
         });
         return promise.success(function (response, status) {
           return response;
         });
     }  

     function updateImportPriceTest(token, ImportPriceTest){
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/priceassigments/import',
              data: ImportPriceTest,
              hideOverlay: true
         });
         return promise.success(function (response, status) {
           return response;
         });     
     } 

  }
})();
