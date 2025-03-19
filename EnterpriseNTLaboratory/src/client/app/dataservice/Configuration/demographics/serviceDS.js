(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('serviceDS', serviceDS);

  serviceDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function serviceDS($http, settings) {
    var service = {
      getService: getService,
      getServiceActive: getServiceActive,
      getserviceId: getserviceId
    };

    return service;

    function getService(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/services',
        hideOverlay: true
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getServiceActive(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/services/filter/state/true',
        hideOverlay: true
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getserviceId(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/services/filter/id/' + id,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }


  }
})();
