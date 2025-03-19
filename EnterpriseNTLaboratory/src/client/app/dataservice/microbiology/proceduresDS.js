(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('proceduresDS', proceduresDS);

  proceduresDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function proceduresDS($http, $q, exception, logger, settings) {
    var service = {
      getproceduresAll: getproceduresAll,
      getproceduresActive: getproceduresActive,
      getprocedurestestid: getprocedurestestid,
      getproceduresId: getproceduresId,
      updatetestofprocedures: updatetestofprocedures
    };

    return service;

    function getproceduresAll(token) {
      return $http({
        hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/procedures'
      }).then(function (response) {
        return response;
      });

    }

    function getproceduresActive(token) {
      return $http({
        hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/procedures/filter/state/true'   
      }).then(function (response) {
        return response;
      });
       
    }

    function getproceduresId(token,id) {
      return $http({
        hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/procedures/'+ id
      }).then(function (response) {
        return response;
      });
       
    }

    function getprocedurestestid(token,id) {
     return $http({
      hideOverlay: true,
            method: 'GET',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/procedures/testprocedure/filter/idtest/'+ id
      }).then(function (response) {
        return response;
      });
    }

   
    //** asocia las  medios de cultivo a las pruebas*/
    function updatetestofprocedures(token,mediaCultures) {
        return $http({
          hideOverlay: true,
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/procedures/testprocedure',
              data: mediaCultures
        }).then(function (response) {
          return response;
        });

   }

  }
})();



 