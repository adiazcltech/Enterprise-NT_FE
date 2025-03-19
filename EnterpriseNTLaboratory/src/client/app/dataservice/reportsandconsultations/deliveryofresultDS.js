(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('deliveryofresultDS', deliveryofresultDS);

  deliveryofresultDS.$inject = ['$http', 'settings'];

  function deliveryofresultDS($http, settings) {
    var service = {
      getdeliveryresults: getdeliveryresults,
      getdeliveryresultspending: getdeliveryresultspending,
      searchdates: searchdates,
      searchpatienid: searchpatienid,
      searchlastname: searchlastname,
      searchorders: searchorders,
      deliveryresults: deliveryresults,
      getdeliverytypedate: getdeliverytypedate,
      getdeliverytype: getdeliverytype
    };
    return service;

    function getdeliveryresults(token, order) {
      return $http({
          hideOverlay: true,
          method: 'PATCH',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/deliveryresults',
          data: order
        })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getdeliveryresultspending(token, order) {
      return $http({
          hideOverlay: true,
          method: 'PATCH',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/deliveryresults/pending',
          data: order
        })
        .then(success);

      function success(response) {
        return response;
      }
    }


    function searchdates(token, init, end) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/searchorders/init/' + init + '/end/' + end
        })

        .then(function (response) {
          return response;
        });
    }

    function searchpatienid(token, record, documet, init, end) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/searchorders/record/' + record + '/document/' +
            documet + '/init/' + init + '/end/' + end
        })

        .then(function (response) {
          return response;
        });
    }

    function searchlastname(token, lastname, surname, gender, init, end) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/searchorders/lastname/' + lastname.toUpperCase().trim() + '/surname/' + surname.toUpperCase().trim() +'/gender/' + gender + '/init/' + init + '/end/' + end
        })

        .then(function (response) {
          return response;
        });
    }


    function searchorders(token, order) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/searchorders/order/' + order
        })

        .then(function (response) {
          return response;
        });
    }

    function deliveryresults(token, data) {
      return $http({
          hideOverlay: true,
          method: 'POST',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/deliveryresults',
          data: data
        })

        .then(success);

      function success(response) {
        return response;
      }
    }

    function getdeliverytypedate(token, init, end) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/orders/deliverytype/init/' + init + '/end/' + end
        })

        .then(function (response) {
          return response;
        });
    }

    function getdeliverytype(token, init, end, type) {
      return $http({
          hideOverlay: true,
          method: 'GET',
          headers: {
            'Authorization': token
          },
          url: settings.serviceUrl + '/orders/deliverytype/init/' + init + '/end/' + end + '/type/' + type
        })

        .then(function (response) {
          return response;
        });
    }



  }
})();
