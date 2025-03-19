(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authenticationsessionDS', authenticationsessionDS);

  authenticationsessionDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  function authenticationsessionDS($http, $q, exception, logger, settings) {
    var service = {
      getauthenticationsession: getauthenticationsession,
      gettestpassword: gettestpassword,
      newauthenticationsession: newauthenticationsession,
      deleteallsession: deleteallsession,
      deleteonesession: deleteonesession
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

    function gettestpassword(data) {
      return $http({
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(data),
        url: settings.serviceUrl + '/authentication/laboratory',
        hideOverlay: true
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
  }
})();
