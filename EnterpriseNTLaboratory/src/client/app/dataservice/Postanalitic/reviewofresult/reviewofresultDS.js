(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('reviewofresultDS', reviewofresultDS);

  reviewofresultDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function reviewofresultDS($http,settings) {
    var service = {
      getresultspending: getresultspending,
      getresultManagement: getresultManagement,
      getPanicInterview: getPanicInterview,
      getCriticalValues: getCriticalValues,
      getresultsOrderDate: getresultsOrderDate
    };

    return service;

    function getresultspending(token, json) { 
      return $http({
        hideOverlay: true,
          method: 'PATCH',
              headers: {'Authorization': token},
              //url: settings.serviceUrl  +'/checkresults/pending',
              url: settings.serviceUrlApi  +'/resultschecking/management',
              data: json
          }).then(function(response) {
              return response;
          });

    }

    function getresultsOrderDate(token,  initialDate, finalDate) { 
      return $http({
        hideOverlay: true,
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/results/orderFilterDate/initialDate/'+ initialDate +'/finalDate/'+ finalDate +'',
          
          }).then(function(response) {
              return response;
          });

    }

    function getresultManagement(token, json) {
      return $http({
        hideOverlay: true,
          method: 'PATCH', 
              headers: {'Authorization': token},
              //url: settings.serviceUrl  +'/checkresults',
              url: settings.serviceUrlApi  +'/resultschecking/management',
              data: json
          }).then(function(response) {
              return response;
          });

    }

    function getPanicInterview(token, json) {


      
      return $http({
        hideOverlay: true,
          method: 'PATCH',
              headers: {'Authorization': token},
              url: settings.serviceUrlApi +'/resultschecking/management/panic',
              data: json
          }).then(function(response) {
              return response;
          });
    }

    function getCriticalValues(token, json) {
      return $http({
        hideOverlay: true,
          method: 'PATCH',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/checkresults/criticalvalues',
              data: json
          }).then(function(response) {
              return response;
          });
    }




  }
})();

