(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('userDS', userDS);

  userDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function userDS($http, settings) {
    var service = {
      getUsers: getUsers,
      getUserssimple: getUserssimple,
      getUsersId: getUsersId,
      NewUsers: NewUsers,
      updateUsers: updateUsers,
      getuserActive: getuserActive,
      getestforuser: getestforuser,
      updatetestforuser: updatetestforuser,
      deleteexclude: deleteexclude,
      getstandardizationusers: getstandardizationusers,
      standardizationusers: standardizationusers,
      changepasswordexpirit: changepasswordexpirit,
      newIntegrationAnalyzer: newIntegrationAnalyzer,
      updateIntegrationAnalyzer: updateIntegrationAnalyzer
    };

    return service;

    function getUsers(token) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    function getUserssimple(token) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/simplelist'
      });
      return promise.success(function (response, status) {
        return response;
      });
    }
    function getUsersId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //** Método que crea una tércnica*/
    function NewUsers(token, Users) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users',
        data: Users
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function updateUsers(token, Users) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users',
        data: Users
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    function getuserActive(token) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/filter/state/true'
      });

      return promise.success(function (response, status) {
        return response;
      });

    }
    function getestforuser(token, id) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/exclude/id/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updatetestforuser(token, Users) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/exclude/',
        data: Users
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function deleteexclude(token, id) {
      var promise = $http({
        method: 'DELETE',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/exclude/id/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    //Lista de usuarios por sistema central
    function getstandardizationusers(token, id) {
      var promise = $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/centralsystems/standardization/users/system/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }


    //** Método que Homologa usuarios*/
    function standardizationusers(token, Users) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/centralsystems/standardization/users',
        data: Users
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function changepasswordexpirit(user) {
      var promise = $http({
        method: 'PUT',
        url: settings.serviceUrl + '/authentication/updatepassword',
        data: user
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function newIntegrationAnalyzer(token, user) {
      var promise = $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/bytype',
        data: user
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateIntegrationAnalyzer(token, user) {
      var promise = $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/bytype',
        data: user
      });
      return promise.success(function (response, status) {
        return response;
      });
    }





  }
})();
