(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('answerDS', answerDS);

  answerDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function answerDS($http, $q, exception, logger,settings) {
    var service = {
      getAnswer: getAnswer,
      getAnswerId: getAnswerId,
      newAnswer:newAnswer,
      updateAnswer:updateAnswer
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de respuestas*/
    function getAnswer(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/questions/answer'
          });
          return promise.success(function (response, status) {
            return response;
          });
    }

    function getAnswerId(token, id) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/questions/answer/'+ id
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
  
    //** Método que crea respuestas*/
    function newAnswer(token,Unit) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/questions/answer',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
    //** Método que Actualiza respuestas*/
    function updateAnswer(token,Unit) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/questions/answer',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
  }
})();
