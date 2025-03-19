(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('cytotoxicantibodiesDS', cytotoxicantibodiesDS);
  cytotoxicantibodiesDS.$inject = ['$http', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function cytotoxicantibodiesDS($http, settings) {
    var service = {
      getlistDonor: getlistDonor,
      getlistreceiverpatient: getlistreceiverpatient,
      newytotoxicantibodies: newytotoxicantibodies,
      updatecytotoxicantibodies: updatecytotoxicantibodies,
      filtercytotoxicantibodies: filtercytotoxicantibodies,
      detailcytotoxicantibodies: detailcytotoxicantibodies,

    };
    return service;

    function getlistDonor(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/list'
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getlistreceiverpatient(token, idinstitution) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/list/' + idinstitution
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function newytotoxicantibodies(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/cytotoxicantibodies',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function updatecytotoxicantibodies(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/cytotoxicantibodies',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function filtercytotoxicantibodies(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/cytotoxicantibodies/filter',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function detailcytotoxicantibodies(token, idDonor, idReceiver) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/cytotoxicantibodies/detail/' + idDonor + '/' + idReceiver
      })
        .then(success);

      function success(response) {
        return response;
      }
    }


  }
})();
