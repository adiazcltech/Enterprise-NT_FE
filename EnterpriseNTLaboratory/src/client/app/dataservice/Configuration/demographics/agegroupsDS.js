(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('agegroupsDS', agegroupsDS);

  agegroupsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  function agegroupsDS($http, $q, exception, logger,settings) {
    var service = {
      getagegroupsActive:getagegroupsActive

    };

    return service;

    function getagegroupsActive(token) {
      return $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/agegroups/filter/state/true',
              hideOverlay: true   
          })
           .then(function(response) {
        return response;
      });
    }

  }
})();

