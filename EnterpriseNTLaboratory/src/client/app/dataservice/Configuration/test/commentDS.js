(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('commentDS', commentDS);

  commentDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function commentDS($http, settings) {
    var comment = {
      getComment: getComment
    };

    return comment;

    function getComment(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/comments'

      })
        .then(success);

      function success(response) {
        return response;
      }
    }
  }
})();
