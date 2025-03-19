(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('integrationconsentDS', integrationconsentDS);
  integrationconsentDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  //** Método que define los metodos a usar*/
  function integrationconsentDS($http, settings) {
    var service = {
      getorder: getorder,
      getdocumenttype: getdocumenttype,
      getinformedconsent: getinformedconsent

    };
    return service;
    //** Método que consulta por el número de la orden los datos del paciente de un concentimiento informado*/
    function getorder(token, order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/integration/skl/consentbase64/order/' + order
      }).then(function (response) {
        return response;
      });

    }
    //** Método que consulta po la historia los datos del paciente de un concentimiento informado*/
    function getdocumenttype(token, history, documenttype) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/integration/skl/consentbase64/history/' + history + '/documenttype/' + documenttype
      }).then(function (response) {
        return response;
      });
    }
    //** Método que consulta los examanes con consentimiento informado*/
    function getinformedconsent(token, order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/integration/skl/informedconsent/order' + order
      }).then(function (response) {
        return response;
      });
    }
  }
})();
