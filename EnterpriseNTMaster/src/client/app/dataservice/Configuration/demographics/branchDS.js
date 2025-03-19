(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('branchDS', branchDS);

  branchDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function branchDS($http, settings) {
    var service = {
      getBranch: getBranch,
      getBranchAutenticate: getBranchAutenticate,
      getById: getById,
      getBranchActive: getBranchActive,
      getBranchUsername: getBranchUsername,
      update: update,
      insert: insert
    };

    return service;

    function getBranch(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branches'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getBranchActive(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branches/filter/state/true'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getBranchAutenticate() {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': ''
        },
        url: settings.serviceUrl + '/authentication/branches'
      });

      return promise.success(function (response, status) {
        return response;
      });

    }

    function getBranchUsername(username) {

      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': ''
        },
        url: settings.serviceUrl + '/authentication/branches/filter/username/' + username
      });

      return promise.success(function (response, status) {
        return response;
      });

    }

    function getById(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branches/' + id
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function update(token, branch) {

      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branches',
        data: branch
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function insert(token, branch) {

      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branches',
        data: branch
      });

      return promise.success(function (response, status) {
        return response;
      });
    }
  }
})();
