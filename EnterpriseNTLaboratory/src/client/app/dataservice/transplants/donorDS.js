(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('donorDS', donorDS);
  donorDS.$inject = ['$http', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function donorDS($http, settings) {
    var service = {
      getdetailpatient: getdetailpatient,
      receiverbyDonor:receiverbyDonor,
      updatereceiverbyDonor:updatereceiverbyDonor,
      newDonar:newDonar,
      donorpatientfilter:donorpatientfilter,
      updateDonar:updateDonar,
      getDonorAll: getDonorAll
    };
    return service;
  
    function getdetailpatient(token, idpatient) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/detail/' + idpatient
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function receiverbyDonor(token, idDonor) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/receiverbyDonor/' + idDonor
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function updatereceiverbyDonor(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/receiverbyDonor',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function newDonar(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function donorpatientfilter(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/filter',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function updateDonar(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function getDonorAll(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/all'
      }).then(function (response) {
        return response;
      });
    }

  }
})();
