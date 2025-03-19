(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicsItemDS', demographicsItemDS);

  demographicsItemDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function demographicsItemDS($http, settings) {
    var service = {
      getDemographicsItems: getDemographicsItems,
      getDemographicsItemsIddata: getDemographicsItemsIddata,
      getDemographicsItemsIddataweb:getDemographicsItemsIddataweb,
      getDemographicReportEncrypt: getDemographicReportEncrypt,
      getDemographicsItemsId: getDemographicsItemsId,
      NewDemographicsItems: NewDemographicsItems,
      updateDemographicsItems: updateDemographicsItems,
      getDemographicsItemsAll: getDemographicsItemsAll,
      getDemographicsItemsFilter: getDemographicsItemsFilter,
      getState: getState,
      saveDemographicReportEncrypt: saveDemographicReportEncrypt
    };

    return service;

    function getDemographicsItems(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDemographicsItemsIddata(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems/filter/demographic/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDemographicsItemsIddataweb(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems/filter/demographicwebquery/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDemographicReportEncrypt(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/getDemographicReportEncrypt/idDemographic/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    //** Método que consulta el servicio por estado y trae los datos de item demografico*/
    function getState(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems/filter/state/true'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDemographicsItemsId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems/filter/id/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea un requerimento*/
    function NewDemographicsItems(token, DemographicsItems) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems',
        data: DemographicsItems
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateDemographicsItems(token, DemographicsItems) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems',
        data: DemographicsItems
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function getDemographicsItemsAll(token, system, demographic) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/centralsystems/standardization/demographics/system/' + system + '/demographic/' + demographic
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDemographicsItemsFilter(token, demographicId) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicitems/filter/demographic/' + demographicId
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //** Método que crea una tércnica*/
    function saveDemographicReportEncrypt(token, Demographics) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/saveDemographicReportEncrypt',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

  }
})();
