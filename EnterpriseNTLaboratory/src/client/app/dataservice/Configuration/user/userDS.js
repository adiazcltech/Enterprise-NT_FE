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
      getUpdateTestEntry: getUpdateTestEntry,
      changepasswordUser: changepasswordUser,
      recoverpassword: recoverpassword,
      getUsersOnline: getUsersOnline,
      getUsers: getUsers,
      changepasswordexpirit: changepasswordexpirit,
      getUsersAnalyzers: getUsersAnalyzers,
      getsendemail: getsendemail,
      getUserssimple:getUserssimple

    };

    return service;

    function getUserssimple(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/simplelist'
      })
        .then(success);

      function success(response) {
        return response;
      }

    }


    function getuserActive(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/filter/state/true'
      })
        .then(success);

      function success(response) {
        return response;
      }

    }
    function getUsersAnalyzers(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/getUsersAnalyzers'
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
        headers: { 'Authorization': token },
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
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/' + id
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getUpdateTestEntry(token, username, password) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/filter/username/' + username + '/password/' + password
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
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/authentication/updateprofile',
        data: User
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function recoverpassword(User) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        url: settings.serviceUrl + '/authentication/recoverpassword',
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
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/chats/user/'
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getsendemail(token, email) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/email',
        data: email
      })
        .then(success);
      function success(response) {
        return response;
      }
    }

  }
})();
