(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('processingtimeDS', processingtimeDS);

  processingtimeDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function processingtimeDS($http, settings) {
    var service = {
      getByStatus: getByStatus,
    };

    return service;

    //** Obtiene las horas de procesamiento activas*/
    function getByStatus(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/pathology/processingtime/filter/state/1'
      })
      .then(success);
      function success(response) {
        return response;
      }
    }
  }
})();
