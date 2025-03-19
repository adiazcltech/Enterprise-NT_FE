(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('resultstemplateDS', resultstemplateDS);

  resultstemplateDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function resultstemplateDS($http, settings) {
    var service = {
      getresultemplateId: getresultemplateId,
      newupdateresultstemplate: newupdateresultstemplate
    };

    return service;
    //** Método que consulta el servicio por medio de la orden*/
    function getresultemplateId(token, order, test) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/microbiology/templates/order/' + order + '/test/' + test
      }).then(function (response) {
        return response;
      });
    }

    function newupdateresultstemplate(token, order, test, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/microbiology/templates/order/' + order + '/test/' + test,
        data: json
      }).then(function (response) {
        return response;
      });
    }

  }
})();
