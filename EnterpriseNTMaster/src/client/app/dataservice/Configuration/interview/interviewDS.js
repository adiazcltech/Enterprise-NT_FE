(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('interviewDS', interviewDS);

  interviewDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  //** Método que define los metodos a usar*/
  function interviewDS($http, $q, exception, logger,settings) {
    var service = {
      get: get,
      getId: getId,
      getidinterviewtype:getidinterviewtype,
      New:New,
      update:update
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de roles*// 
    function get(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/interviews'
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos del rol*/
    function getId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/interviews/filter/id/'+ id
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Obtiene los tipos de entrevista de una entrevista*/
    function getidinterviewtype(token,idinterview,type) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/interviews/filter/typeinterview/idinterview/'+ idinterview+'/type/'+ type
              
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
     //** Método que crea rol*/
     function New(token,interview) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/interviews',
               data: interview
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza rol*/
    function update(token,interview) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/interviews',
               data: interview
          });
          return promise.success(function (response, status) {
            return response;
          });

    } 
   

  }
})();


 