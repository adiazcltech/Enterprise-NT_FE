(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('webqueryDS', webqueryDS);

    webqueryDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function webqueryDS($http, settings) {
    var service = {
      getusertype: getusertype,
      updatepassworduser: updatepassworduser
    };

    return service;


    function getusertype(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/webQuery/usertypes'
      }).then(success);

      function success(response) {
        return response;
      }
    }
  

    function updatepassworduser(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/webQuery/assignpassword',
        data: data
      }).then(function (response) {
        return response;
      });
    }

   
  }
})();
