(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('generalfunctionDS', generalfunctionDS);

  generalfunctionDS.$inject = ['$http', '$q', '$filter', 'exception', 'logger','settings','moment', '$translate'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function generalfunctionDS($http, $q, $filter, exception, logger,settings, moment, $translate) {
   
    var parameterReport = {};

    var service = {
      sendEmail: sendEmail
    };

    return service; 
  
    //** Método que envia mails con archivo pdf adjunto*/
    function sendEmail(parameterEmail) {
      return $http.post('/api/sendEmail', parameterEmail)
      .then(success)

      function success(response) {
        return response.data;
      }  
    }
  }
})();
