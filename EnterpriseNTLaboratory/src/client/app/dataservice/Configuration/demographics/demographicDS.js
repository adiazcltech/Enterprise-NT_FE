(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicDS', demographicDS);

  demographicDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function demographicDS($http, settings) {
    var service = {
      getDemographics: getDemographics,
      getDemographicstrue: getDemographicstrue,
      getDemographicsALL: getDemographicsALL,
      getDemographicsId: getDemographicsId,
      getDemoEncodeds: getDemoEncodeds,
      getDemographicsOrigin: getDemographicsOrigin,
      getDemographicdepency: getDemographicdepency,
      getDemographicsoon: getDemographicsoon,
      getsoonaccount: getsoonaccount,
      getdemographictest: getdemographictest,
      getdemographictestById: getdemographictestById,
      getorderingAll: getorderingAll
    };

    return service;

    function getDemographics(token) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getDemographicstrue(token) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/filter/state/true',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }



    function getDemographicsALL(token) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/all',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }



    function getDemographicsId(token, id) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/' + id,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }



    function getDemoEncodeds(token) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/filter/encoded/true',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getDemographicsOrigin(token, origin) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/filter/origin/' + origin,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getorderingAll(token, origin) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/orderingAll/' + origin,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getDemographicdepency(token, idfather, idfatheritem) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicsitemssons/idfather/' + idfather + '/idfatheritem/' + idfatheritem,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getDemographicsoon(token, idfather) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicsitemssons/idfather/' + idfather,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getsoonaccount(token, account) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/orders/demographics/account/' + account,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getdemographictest(token) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographictest',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    function getdemographictestById(token, id) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographictest/filter/id/' + id,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }



  }
})();
