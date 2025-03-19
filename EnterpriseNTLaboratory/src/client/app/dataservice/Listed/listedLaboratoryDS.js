(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('listedLaboratoryDS', listedLaboratoryDS);

  listedLaboratoryDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
    function listedLaboratoryDS($http, $q, exception, logger,settings) {
     var service = {
      getListedLaboratory: getListedLaboratory,
      getListedLaboratoryHl7: getListedLaboratoryHl7

    };

    return service;

    
    function getListedLaboratoryHl7(token, json) {

       return $http({
        hideOverlay: true,
          method: 'PATCH',
          headers: {'Authorization': token},
          url: settings.serviceUrl + '/listorders/laboratory/hl7',
          data: json,  
          transformResponse: [
              function (data) { 
                  return data; 
              }
          ]
       }).then(function(response) {
            return response;
       });
  
    }

    function getListedLaboratory(token, json) {

       return $http({
        hideOverlay: true,
          method: 'PATCH',
          headers: {'Authorization': token},
          url: settings.serviceUrl + '/listorders/laboratory',
          data: json
       }).then(function(response) {
            return response;
       });
  
    }


  }
})();

