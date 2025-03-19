(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('listDS', listDS);

  listDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function listDS($http, $q, exception, logger,settings) {
    var service = {
      getList: getList,
      getListUsers: getListUsers
    };

    return service;


    function getList(token,id) {
      
      return  $http({
        hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/lists/' + id
          }) .then(function(response) {
        return response;
      });
    }


    function getListUsers(token) {
       return $http({
        hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/users'
        }).then(function(response) {
          return response;
        });

    }
  }
  
})();
