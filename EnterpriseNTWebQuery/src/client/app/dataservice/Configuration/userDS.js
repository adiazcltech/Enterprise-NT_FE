(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('userDS', userDS);

  userDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  function userDS($http, $q, exception, logger, settings) {
    var service = {
      getUsers: getUsers,
      getUsersId: getUsersId,
      changepasswordUser: changepasswordUser,
      passwordrecovery: passwordrecovery,
      passwordrecoveryemail: passwordrecoveryemail,
      passwordreset: passwordreset,
      changepasswordexpirit: changepasswordexpirit,
      getUsersrouter: getUsersrouter,
      getdocumenttypes: getdocumenttypes,

    };
 
    return service;

    function getUsers(token) {
      return $http({
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
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/' + id
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    //** Método que crea una tércnica*/
    function changepasswordUser(token, User) {
      return $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/authentication/updateprofile',
        data: User
      }).then(success);

      function success(response) {
        return response;
      }

    }
    //** Método que crea una tércnica*/
    function passwordrecovery(user, type,historyNumber) {
      return $http({
        method: 'GET',
        url: settings.serviceUrl + '/authentication/passwordrecovery/' + user + '/' + type+ '/' + historyNumber
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function passwordrecoveryemail(token, detail) {
      return $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/authentication/email',
        data: detail,
        transformResponse: [
          function (data) {
            return data;
          }
        ]
      }).then(function (response) {
        return response;
      })

    }


    function passwordreset(token, password) {
      return $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/authentication/passwordreset',
        data: { "password": password }
      }).then(success);

      function success(response) {
        return response;
      }

    }

    function changepasswordexpirit(password) {
      return $http({
        method: 'PUT',
        url: settings.serviceUrl + '/authentication/updatepassword',
        data: password
      }).then(success);

      function success(response) {
        return response;
      }

    }

    function getUsersrouter(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/routers'
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getdocumenttypes(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/configuration/documenttypes'
      })
        .then(success);

      function success(response) {
        return response;
      }
    }


  }
})();
