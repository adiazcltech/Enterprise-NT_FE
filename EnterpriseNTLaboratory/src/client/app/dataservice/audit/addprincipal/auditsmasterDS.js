(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('auditsmasterDS', auditsmasterDS);

  auditsmasterDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
    function auditsmasterDS($http, $q, exception, logger,settings) {
     var service = {
      getauditsmaster: getauditsmaster,
      getaudituser: getaudituser,
      getauditmodule :getauditmodule
    };

    return service;

    function getauditsmaster(token,inicial,final) {
           return $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/trackings/filter/dates/'+ inicial +'/'+ final,
              hideOverlay: true
           })
        .then(success);

      function success(response) {
        return response;
      }
    }

     function getaudituser(token,inicial,final,user) {
             return $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/trackings/filter/date/'+ inicial +'/'+ final+'/user/'+ user,
              hideOverlay: true
           })
        .then(success);

      function success(response) {
        return response;
       }
    }

     function getauditmodule(token,inicial,final,modul) {
             return $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/trackings/filter/dates/'+ inicial +'/'+ final,
              data: modul,
              hideOverlay: true
           })
        .then(success);

      function success(response) {
        return response;
       }
    }

   }
})();


