(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('listedSampleDS', listedSampleDS);

  listedSampleDS.$inject = ['$http', 'exception', 'settings'];
  /* @ngInject */
  function listedSampleDS($http, exception, settings) {
    var service = {
      getListedSample: getListedSample,
      gettempetature: gettempetature

    };

    return service;


    //** Método que  Verifica la muestra ingresada.*/
    function getListedSample(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/listorders/rejectsample',
        data: json
      }).then(function (response) {
        return response;
      });
    }

    function gettempetature(token, initialDate, endDate, idSample, idService) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/sampletrackings/getOrdersBySampleAndFilter/initialDate/' + initialDate + '/endDate/' + endDate + '/idSample/' + idSample + '/idService/' + idService,
      }).then(function (response) {
        return response;
      });
    }

  }
})();
