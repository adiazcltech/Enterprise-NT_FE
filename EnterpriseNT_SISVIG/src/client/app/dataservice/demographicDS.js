(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicDS', demographicDS);

  demographicDS.$inject = ['$http', 'settings'];
  /* @ngInject */
  function demographicDS($http, settings) {
    var service = {
      getDemographicsALL: getDemographicsALL,
      getDemographics: getDemographics,
      getTestToOrderEntry: getTestToOrderEntry,
      integration: integration,
      patientIdlis: patientIdlis,
      insertOrder: insertOrder,
      getdatahis: getdatahis
    };

    return service;

    function getDemographicsALL(token) {
      return $http({
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/demographics/all',
          hideOverlay: true
        })
        .then(function (response) {
          return response;
        });
    }

    function getDemographics(token, type) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/orders/demographics/' + type
        })

        .then(function (response) {
          return response;
        });
    }

    function getTestToOrderEntry(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/tests/filter/order_entry'
      }).then(function (response) {
        return response;
      });
    }


    function integration(token, User) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/integration/ingreso/DemographicsHomologationSystem',
        data: User
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function patientIdlis(token, patientId, documentType) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/patients/filter/patientId/' + patientId + '/documentType/' + documentType
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function insertOrder(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/orders',
        data: json
      }).then(function (response) {
        return response;
      });
    }



    function getdatahis(parameters) {
      var view={ hideOverlay: true}
      return $http
        .post("/api/getsisvi", parameters,view)    
        .then(success);
      function success(response) {
        return response;
      }     
    }


  }
})();
