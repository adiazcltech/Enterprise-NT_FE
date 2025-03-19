(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicsItemDS', demographicsItemDS);

  demographicsItemDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  function demographicsItemDS($http, $q, exception, logger, settings) {
    var service = {
      getDemographicsItems: getDemographicsItems,
      getDemographicsItemsId: getDemographicsItemsId,
      getDemographicsItemsAll: getDemographicsItemsAll,
      NewDemographicsItems:NewDemographicsItems,
      getDemographicsItemsFilter: getDemographicsItemsFilter,
      getState: getState
    };

    return service;

    function getDemographicsItems(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographicitems',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    //** Método que consulta el servicio por estado y trae los datos de item demografico*/
    function getState(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographicitems/filter/state/true',
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }


    function getDemographicsItemsId(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographicitems/filter/id/' + id,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

     //** Método que crea tipo de documento*/
     function NewDemographicsItems(token,DemographicsItems) {
      return $http({
             method: 'POST',
             headers: {'Authorization': token},
             url: settings.serviceUrl  +'/demographicitems',
             data: DemographicsItems,
             hideOverlay: true
        }).then(function(response) {
      return response;
    });
  }


    function getDemographicsItemsAll(token, system, demographic) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/centralsystems/standardization/demographics/system/' +
          system + '/demographic/' + demographic,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }


    function getDemographicsItemsFilter(token, demographicId) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographicitems/filter/demographic/' + demographicId,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }


  }
})();
