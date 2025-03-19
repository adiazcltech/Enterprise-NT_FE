(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('testdemographicpypDS', testdemographicpypDS);

  testdemographicpypDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function testdemographicpypDS($http, $q, exception, logger, settings) {
    var service = {
      getTestdemographicpyp: getTestdemographicpyp,
      updateTestdemographicpyp: updateTestdemographicpyp

    };

    return service;

    function getTestdemographicpyp(token, id) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/pyp/' + id   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

    function updateTestdemographicpyp(token, dataTestDemographic) {
      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/pyp/',
              data: dataTestDemographic   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

 
    
  }
})();
