(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicDS', demographicDS);

  demographicDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function demographicDS($http, settings) {
    var service = {
      getDemographics: getDemographics,
      getDemographicsALL: getDemographicsALL,
      getorderingAll:getorderingAll,
      getDemographicsId: getDemographicsId,
      getDemographicsbranch: getDemographicsbranch,
      getbranchitem: getbranchitem,
      savebranchitem: savebranchitem,
      saveDemographicsbranch: saveDemographicsbranch,
      NewDemographics: NewDemographics,
      updateDemographics: updateDemographics,
      updatevaluerequired: updatevaluerequired,
      getDemoEncodeds: getDemoEncodeds,
      demographicsordering: demographicsordering,
      demographicsorderingAll:demographicsorderingAll
    };

    return service;

    function getDemographics(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    function getDemographicsALL(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/all'
      });
      return promise.success(function (response, status) {
        return response;
      });

    }


    function getorderingAll(token, origin) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/orderingAll/' + origin
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDemographicsId(token, id) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/' + id
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getDemographicsbranch(token, branch, demographic) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branchitem/itemsdemographic/branch/' + branch + '/demographic/' + demographic
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function getbranchitem(token, branch) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branchitem/branch/' + branch
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function saveDemographicsbranch(token, Demographics) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branchitem/itemsdemographic/saves',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function savebranchitem(token, Demographics) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branchitem/savesdemographics',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });
    }

    function NewDemographics(token, Demographics) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function demographicsordering(token, Demographics) {
      var promise = $http({
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/ordering',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function demographicsorderingAll(token, Demographics) {
      var promise = $http({
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/orderingAll',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function updateDemographics(token, Demographics) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function updatevaluerequired(token, Demographics) {
      var promise = $http({
        method: 'PUT',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/branchitem/demographics/valuerequired',
        data: Demographics
      });
      return promise.success(function (response, status) {
        return response;
      });

    }

    function getDemoEncodeds(token) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/filter/encoded/true'
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

  }
})();
