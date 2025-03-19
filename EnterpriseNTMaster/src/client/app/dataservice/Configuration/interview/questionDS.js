(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('questionDS', questionDS);

  questionDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function questionDS($http, $q, exception, logger,settings) {
    var service = {
      getQuestion: getQuestion,
      getidinterview:getidinterview,
      getQuestionId: getQuestionId,
      getQuestionActive:getQuestionActive,
      newQuestion:newQuestion,
      updateQuestion:updateQuestion,
      getAllByIdInterview: getAllByIdInterview
    };

    return service;

    //** Método que consulta el Servicio y trae una lista de preguntas*//
    function getQuestion(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/questions'
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
     //** Obtiene las preguntas de una entrevista*/
    function getidinterview(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/interviews/filter/question/'+ id

          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de la preguntas*/
    function getQuestionId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/questions/'+ id
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
        //** Método que consulta el servicio por estado y trae los datos de las preguntas activas*/
        function getQuestionActive(token) {
             var promise = $http({
                  method: 'GET',
                  headers: {'Authorization': token},
                  url: settings.serviceUrl  +'/questions/filter/state/true'

              });
              return promise.success(function (response, status) {
                return response;
              });

        }
    //** Método que crea preguntas*/
    function newQuestion(token,Unit) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/questions',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });
    }
    //** Método que Actualiza preguntas*/
    function updateQuestion(token,Unit) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/questions',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });
    }

     //** Obtiene las preguntas de una entrevista*/
    function getAllByIdInterview(token,id) {
      var promise = $http({
           method: 'GET',
           headers: {'Authorization': token},
           url: settings.serviceUrl  +'/interviews/filter/allquestions/'+ id

       });
       return promise.success(function (response, status) {
         return response;
       });

    }

  }
})();
