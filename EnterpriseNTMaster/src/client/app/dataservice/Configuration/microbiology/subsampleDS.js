(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('subsampleDS', subsampleDS);

  subsampleDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
  
  function subsampleDS($http, $q, exception, logger, settings) {
    var service = {
      getSubSample: getSubSample,
      updateSubSample: updateSubSample
    };

    return service;

    function getSubSample(token, id) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/samples/subsamplesselect/' + id   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }

    function updateSubSample(token, dataSubSample) {
      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/samples/subsamples/',
              data: dataSubSample   
          });
      
      return promise.success(function (response, status) {
        return response;
      });
       
    }
  }
})();
