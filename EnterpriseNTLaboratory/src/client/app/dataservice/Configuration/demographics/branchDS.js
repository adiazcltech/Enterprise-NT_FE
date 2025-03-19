(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('branchDS', branchDS);

  branchDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  function branchDS($http, settings) {
    var service = {
      getBranchAutenticate: getBranchAutenticate,
      getConfig:getConfig,
      getBranch: getBranch,
      getBranchActive: getBranchActive,
      getBranchstate: getBranchstate,
      getBranchId: getBranchId,
      getBranchUsername: getBranchUsername
    };

    return service;


    function getBranchAutenticate() {
      return $http({
        method: 'GET', // 
        url: settings.serviceUrl + '/authentication/branches',
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    function getConfig() {
      return $http({
        method: 'GET', // 
        url: settings.serviceUrl + '/configuration/inbranch',
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    function getBranch(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/branches',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getBranchUsername(username) {
      return $http({
        method: 'GET',
        url: settings.serviceUrl + '/authentication/branches/filter/username/' + username,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getBranchActive(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/branches',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getBranchstate(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/branches/filter/state/true',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getBranchId(token, id) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/branches/' + id,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

  }
})();

