(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authenticationsessionDS', authenticationsessionDS);

  authenticationsessionDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function authenticationsessionDS($http, settings) {
    var service = {
      getauthenticationsession: getauthenticationsession,
      newauthenticationsession: newauthenticationsession,
      deleteallsession: deleteallsession,
      deleteonesession: deleteonesession,
      loginlaboratory: loginlaboratory
    };

    return service;


    function getauthenticationsession(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/sessionviewer'
      }).then(function (response) {
        return response;
      });
    }

    function newauthenticationsession(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/sessionviewer',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function deleteallsession(token) {
      return $http({
        hideOverlay: true,
        method: 'DELETE',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/sessionviewer'
      }).then(function (response) {
        return response;
      });
    }

    function deleteonesession(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/sessionviewer/deleteBySession',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function loginlaboratory(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/authentication',
        data: data
      }).then(function (response) {
        return response;
      });
    }
  }
})();
