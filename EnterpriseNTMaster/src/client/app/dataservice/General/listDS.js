(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('listDS', listDS);

  listDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function listDS($http, $q, exception, logger,settings) {
    var service = {
      getList: getList
    };

    return service;

    function getList(token,id) {
      
    return $http({
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/lists/' + id
          }).then(success)
           
        function success(response) {
          return response;
        }

    }
  }

  
})();
