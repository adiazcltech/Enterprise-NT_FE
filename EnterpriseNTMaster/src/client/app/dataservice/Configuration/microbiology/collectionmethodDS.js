(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('collectionmethodDS', collectionmethodDS);

  collectionmethodDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function collectionmethodDS($http, $q, exception, logger, settings) {
    var service = {
      getcollectionmethod: getcollectionmethod,
      getcollectionmethodId: getcollectionmethodId,
      newcollectionmethod: newcollectionmethod,
      updatecollectionmethod: updatecollectionmethod
    };

    return service;

    function getcollectionmethod(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/collectionmethod'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function getcollectionmethodId(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/collectionmethod/'+ id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function newcollectionmethod(token,collectionmethod) {
        var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/collectionmethod',
              data: collectionmethod
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

   function updatecollectionmethod(token,collectionmethod) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/collectionmethod',
              data: collectionmethod
         });
         return promise.success(function (response, status) {
           return response;
         });

   }

  }
})();
