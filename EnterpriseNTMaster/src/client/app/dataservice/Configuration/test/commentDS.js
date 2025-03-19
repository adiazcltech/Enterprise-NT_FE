(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('commentDS', commentDS);

  commentDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function commentDS($http, $q, exception, logger, settings) {
    var comment = {
      getComment: getComment,
      getById: getById,
      update: update,
      insert: insert
    };

    return comment;

    function getComment(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/comments'   
          });
      
      return promise.success(function (response, status) {
        return response;
      });     
    }


    function getById(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl   + '/comments/filter/id/' +id
      });
      
      return promise.success(function (response, status) {
        return response;
      });
    }

    function update(token,comments) {

      var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/comments',
              data: comments
          });
      
      return promise.success(function (response, status) {
        return response;
      });
    }

    function insert(token,service) {

      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/comments',
              data: service
          });
      
      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
