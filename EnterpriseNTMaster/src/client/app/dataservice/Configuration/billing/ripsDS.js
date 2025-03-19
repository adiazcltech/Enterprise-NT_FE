(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('ripsDS', ripsDS);

  ripsDS.$inject = ['$http','settings'];
  /* @ngInject */

  function ripsDS($http, settings) {
    var service = {
      getrips: getrips,
      getripsId: getripsId,
      updaterips: updaterips
    };

    return service;

    function getrips(token) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/configuration/rips'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function getripsId(token,key) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl  + '/configuration/rips/'+ key
      });
      return promise.success(function (response, status) {
        return response;
      });
    }  

   function updaterips(token,rips) {
       var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/configuration/rips',
              data: rips
         });
         return promise.success(function (response, status) {
           return response;
         });
   }

  }
})();
