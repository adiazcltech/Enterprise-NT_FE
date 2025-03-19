(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicwebqueryDS', demographicwebqueryDS);

  demographicwebqueryDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function demographicwebqueryDS($http, settings) {
    var service = {
      getdemographicwebqueryId: getdemographicwebqueryId,
      Newdemographicwebquery: Newdemographicwebquery,
      updatedemographicwebquery: updatedemographicwebquery
    };

    return service;
    function getdemographicwebqueryId(token, idDemographicItem, demographicwebquery) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographicwebquery/filter/idDemographicItem/' + idDemographicItem + '/demographicwebquery/' + demographicwebquery
      });
      return promise.success(function (response) {
        return response;
      });
    }

    //** Método que crea una demograficos consulta web*/
    function Newdemographicwebquery(token, Demographics) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographicwebquery',
        data: Demographics
      });
      return promise.success(function (response) {
        return response;
      });
    }
    //** Método que actualizar una demograficos consulta web*/
    function updatedemographicwebquery(token, Demographics) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/demographicwebquery',
        data: Demographics
      });
      return promise.success(function (response) {
        return response;
      });

    }
  }
})();
