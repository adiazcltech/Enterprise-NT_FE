(function () {
  "use strict";

  angular.module("app.core").factory("phlebotomistakeDS", phlebotomistakeDS);

  phlebotomistakeDS.$inject = ["$http", "settings"];
  /* @ngInject */
  function phlebotomistakeDS($http, settings) {
    var service = {
      getcubicledisponible: getcubicledisponible,
      getcubicledisponibleid: getcubicledisponibleid,
      updatephlebotomistake: updatephlebotomistake,
    };

    return service;

    function getcubicledisponible(token) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/samplingSites/samplingSitesDisponible",
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getcubicledisponibleid(token, id) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/samplingSites/orderPendingTakePoint/" + id,
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function updatephlebotomistake(token, data) {
      return $http({
        hideOverlay: true,
        method: "PUT",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/samplingSites/updateDateTake",
        data: data,
      }).then(success);

      function success(response) {
        return response;
      }
    }    
  }
})();
