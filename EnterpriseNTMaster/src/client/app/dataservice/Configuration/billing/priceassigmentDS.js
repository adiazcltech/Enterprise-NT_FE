(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('priceassigmentDS', priceassigmentDS);

  priceassigmentDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  function priceassigmentDS($http, $q, exception, logger, settings) {
    var service = {
      getPriceAssigmentId: getPriceAssigmentId,
      updatePriceAssigment: updatePriceAssigment,
      updateFeescheduleApply: updateFeescheduleApply,
      updatePriceFormula: updatePriceFormula,
      updateImportPriceTest: updateImportPriceTest,
      updateImportBatchPriceTest: updateImportBatchPriceTest

    };

    return service;


    function getPriceAssigmentId(token, idValid, idRate, idArea) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/priceassigments/' + idValid + '/' + idRate + '/' + idArea,
      });
      return promise.success(function (response, status) {
        return response;
      });
    }


    function updatePriceAssigment(token, PriceAssigment) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/priceassigments',
        data: PriceAssigment
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateFeescheduleApply(token, FeescheduleApply) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/priceassigments/apply',
        data: FeescheduleApply
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updatePriceFormula(token, PriceFormula) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/priceassigments/formula',
        data: PriceFormula
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateImportPriceTest(token, ImportPriceTest) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/priceassigments/import',
        data: ImportPriceTest
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateImportBatchPriceTest(token, ImportPriceTest) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/priceassigments/import/batch',
        data: ImportPriceTest
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

  }
})();
