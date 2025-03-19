(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('queriesDS', queriesDS);

  queriesDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

  function queriesDS($http, $q, exception, logger, settings) {
    var service = {
      getsearch: getsearch,
      getsearchtestidparient: getsearchtestidparient, 
      getOrdersbyPatient: getOrdersbyPatient,
      getOrdersbyPatientStorage:getOrdersbyPatientStorage
    };
    return service;
 
   function getsearch(token, order) {
      return $http({
        hideOverlay: true,
                 method: 'PATCH',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl  +'/searchorders/filter',
                 data: order
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }

    function getOrdersbyPatient(token, order) {
      return $http({
        hideOverlay: true,
                 method: 'PATCH',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl  +'/searchorders/filterpatient',
                 data: order
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
    function getOrdersbyPatientStorage(token, order) {
      return $http({
        hideOverlay: true,
                 method: 'PATCH',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl  +'/searchorders/filterpatientstorage',
                 data: order
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }

     function getsearchtestidparient(token,record,docum,test) {
      return $http({
        hideOverlay: true,
                 method: 'GET',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl  +'/checkresults/results/record/'+record+/document/+docum+/test/+test
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }
  }
})();