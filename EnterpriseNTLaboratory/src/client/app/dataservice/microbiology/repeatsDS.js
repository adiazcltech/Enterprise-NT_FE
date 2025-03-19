(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('repeatsDS', repeatsDS);

  repeatsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function repeatsDS($http, $q, exception, logger, settings) {
    var service = {
      getrepeats: getrepeats

    };

    return service;
     //** Método que consulta la lista de todas las repeticiones de un examen o prueba de una orden*/
    function getrepeats(token, order, test) {
      return $http({
        hideOverlay: true,
                    method: 'GET',
                    headers: {'Authorization': token},
                    url: settings.serviceUrl  + '/results/repeats/order/' + order + '/test/' + test
      }).then(function (response) {
        return response;
      });

    }

  }
 
})();



 