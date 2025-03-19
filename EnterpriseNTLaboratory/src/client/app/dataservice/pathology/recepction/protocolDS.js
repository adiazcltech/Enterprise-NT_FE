(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('protocolDS', protocolDS);
  protocolDS.$inject = ['$http','settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function protocolDS($http,settings) {
      var service = {
          getBySpecimen: getBySpecimen
      };
      return service;

      //** Obtiene el protocolo de un especimen*/
      function getBySpecimen(token, specimen, organ) {
        return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/pathology/protocol/filter/specimen/' + specimen + '/organ/' + organ
            })
            .then(success);
        function success(response) {
            return response;
        }
      }
  }
})();
