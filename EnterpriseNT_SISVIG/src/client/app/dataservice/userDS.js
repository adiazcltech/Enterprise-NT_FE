(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('userDS', userDS);

  userDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function userDS($http, settings) {
    var service = {
      getuserActive: getuserActive,
      getUsersId: getUsersId,
      changepasswordUser: changepasswordUser,
      getUsersOnline: getUsersOnline,
      getUsers: getUsers,
      changepasswordexpirit: changepasswordexpirit

    };

    return service;


    function getuserActive(token) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/users/filter/state/true'
        })
        .then(success);

      function success(response) {
        return response;
      }

    }

    function getUsers(token) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/users'
        })
        .then(success);

      function success(response) {
        return response;
      }

    }


    function getUsersId(token, id) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/users/' + id
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function changepasswordUser(token, User) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/authentication/updateprofile',
        data: User
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function changepasswordexpirit(User) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        url: settings.serviceUrl + '/authentication/updatepassword',
        data: User
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getUsersOnline(token) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/chats/user/'
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

  }
})();
