(function() {
  'use strict';

  angular
  .module('app.core')
  .factory('orderinterviewDS', orderinterviewDS);

  orderinterviewDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function orderinterviewDS($http, $q, exception, logger, settings) {
    var service = {
      getInterviewOrder: getInterviewOrder,
      updateInterviewOrder: updateInterviewOrder,
      listordersnopatient:listordersnopatient
    };

    return service;

     function listordersnopatient(token, order) {
      return $http({
        hideOverlay: true,
                 method: 'PATCH',
                 headers: {'Authorization': token},
                 url: settings.serviceUrl  +'/listorders/filter/nopatient',
                data: order 
            })
          .then(success);
          
        function success(response) {
          return response;
        }     
    }


    function getInterviewOrder(token, order) {
      return $http({
        hideOverlay: true,
                method: 'GET',
                headers: {'Authorization': token},
                url: settings.serviceUrl  + '/sampletrackings/interview/order/' + order
            })

          .then(success);
          
        function success(response) {
          return response;
        }     
    }

    function updateInterviewOrder(token, order, data) {
      return $http({
        hideOverlay: true,
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/sampletrackings/interview/order/'+ order,
              data: data  
          })

        .then(success);
      function success(response) {
        return response;
      }     
    }

    


   

  }
})();
