(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('reportransDS', reportransDS);
  reportransDS.$inject = ['$http', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function reportransDS($http, settings) {
    var service = {
      getdonorcitometria: getdonorcitometria,
      gethaplotypes: gethaplotypes,
      getsavetypereport: getsavetypereport,
      gethistoricalcytotoxico: gethistoricalcytotoxico,
      getdonordeath: getdonordeath,
      getdetaildonor: getdetaildonor,
      getListParticipants: getListParticipants,
      getListReport: getListReport,
      getbase64:getbase64
    };
    return service;


    function getdonorcitometria(token, idreceptor) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/donorbyreceptor/' + idreceptor
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function gethistoricalcytotoxico(token, idReceiver) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/cytotoxicantibodies/historical/' + idReceiver
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function gethaplotypes(token, idreceptor) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/haplotypes/' + idreceptor
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getsavetypereport(token, tyreport) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reporttranplant/' + tyreport
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getdonordeath(token, type) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/type/' + type
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getdetaildonor(token, idPatient) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/detail/' + idPatient
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getListParticipants(token, idDonor, idorgan) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/detailreceiverbyDonor/' + idDonor + '/' + idorgan
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getListReport(token, tyreport) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reporttranplant/historicalreporttranplant/' + tyreport
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getbase64(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reporttranplant/attachmentBase64',
        data: data
      }).then(function (response) {
        return response;
      });
    }
  }
})();
