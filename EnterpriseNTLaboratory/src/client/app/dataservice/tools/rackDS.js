(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('rackDS', rackDS);

  rackDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
    function rackDS($http, $q, exception, logger,settings) {
     var service = {
      getrackbybranch: getrackbybranch,
      getrackbyfilter: getrackbyfilter,
      getdetailrack: getdetailrack,
      getrackid : getrackid,
      getracksbyordersample : getracksbyordersample,
      insertsamplebyrack : insertsamplebyrack,
      insertrack:insertrack,
      insertcloserack:insertcloserack,
      updaterack:updaterack,
      removesamplerack: removesamplerack,
      insertsamplebyrackold: insertsamplebyrackold,
      getbarcoderack: getbarcoderack,
      getracktodiscard:getracktodiscard,
      getauditsamplestorage:getauditsamplestorage,
    };

    return service;

    function getrackbybranch(token, branch) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/racks/filter/branch/' + branch
           })

        .then(success);

      function success(response) {
        return response;
      }
    }

    function getrackbyfilter(token, filter) {
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/filter/',
                  data: filter
      }).then(function (response) {
        return response;
      });    
    }

    function getdetailrack(token, rack) {
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/detail/' + rack
      }).then(function (response) {
        return response;
      });    
    }

    function getracksbyordersample(token, order, sample) {
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/find/' + order + '/' + sample
      }).then(function (response) {
        return response;
      });    
    }

    function getrackid(token, id) {
           return $http({
            hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/racks/filter/id/' + id
           })

        .then(success);

      function success(response) {
        return response;
      }
    }

    function insertsamplebyrack(token, racks) {
       return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/store',
                  data: racks
      }).then(function (response) {
        return response;
      });    
    }

    function insertrack(token, rack) {
       return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks',
                  data: rack
      }).then(function (response) {
        return response;
      });    
    }

    function insertcloserack(token, rack) {
       return $http({
        hideOverlay: true,
                  method: 'PUT',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/close',
                  data: rack
      }).then(function (response) {
        return response;
      });    
    }

    function updaterack(token, rack) {
       return $http({
        hideOverlay: true,
                  method: 'PUT',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks',
                  data: rack
      }).then(function (response) {
        return response;
      });    
    }

    function removesamplerack(token, rack) {
       return $http({
        hideOverlay: true,
                  method: 'PUT',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/remove',
                  data: rack
      }).then(function (response) {
        return response;
      });    
    }

    function insertsamplebyrackold(token, racks) {
       return $http({
        hideOverlay: true,
                  method: 'POST',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/storeold',
                  data: racks
      }).then(function (response) {
        return response;
      });    
    }

    function getbarcoderack(token, rack){
      return $http({
        hideOverlay: true,
                  method: 'PATCH',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/racks/barcode',
                  data: rack, 
                  transformResponse: [
                      function (data) { 
                          return data; 
                      }
                  ]
      }).then(function (response) {
        return response;
      });  
    }

    function getracktodiscard(token){
      return $http({
        hideOverlay: true,
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/racks/todiscard'
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getauditsamplestorage(token, order, sample){
      return $http({
        hideOverlay: true,
                  method: 'GET',
                  headers: { 'Authorization': token },
                  url: settings.serviceUrl + '/audits/samplestorage/order/' + order + '/sample/' + sample
      }).then(function (response) {
        return response;
      });    
    }

   }
})();

