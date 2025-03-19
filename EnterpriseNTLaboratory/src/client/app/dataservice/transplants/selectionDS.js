(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('selectionDS', selectionDS);
  selectionDS.$inject = ['$http', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function selectionDS($http, settings) {
    var service = {
      getDonorIntitutionOrgan: getDonorIntitutionOrgan,
      getdonorHLAPatient: getdonorHLAPatient,
      getreciverSelection:getreciverSelection
    };
    return service;

    function getDonorIntitutionOrgan(token, intitution, organ) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/intitution/' + intitution + '/organ/' + organ
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getdonorHLAPatient(token, idPatient) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/donorpatient/donorHLAPatient/' + idPatient
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getreciverSelection(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/reciverSelection',
        data: data
      }).then(function (response) {
        return response;
      });
    }
  }
})();
