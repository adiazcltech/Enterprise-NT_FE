(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('taskDS', taskDS);

  taskDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function taskDS($http, $q, exception, logger, settings) {
    var service = {
      getTask: getTask,
      getTaskId: getTaskId,
      newTask: newTask,
      updateTask: updateTask
    };

    return service;

    function getTask(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/tasks'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    function getTaskId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/tasks/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea un cliente*/
    function newTask(token,Task) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tasks',
              data: Task
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function updateTask(token,Task) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tasks',
              data: Task
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
