(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('stadisticsDS', stadisticsDS);

  stadisticsDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  function stadisticsDS($http, $q, exception, logger, settings) {
    var service = {
      getgeneralStadistics: getgeneralStadistics,
      getmotiverejectStadistics:getmotiverejectStadistics,
      getmotiverepeatedStadistics:getmotiverepeatedStadistics,
      getpriceStadistics: getpriceStadistics,
      getspecialstadistics: getspecialstadistics,
      getsampledestination: getsampledestination,
      getstatisticsmicrobiology:getstatisticsmicrobiology,
      getplanowhonet:getplanowhonet,
      getpriceBox: getpriceBox,
      getgeneralStadisticsV2: getgeneralStadisticsV2
    };

    return service;

    //** Obtiene el filtro base */
    function getgeneralStadistics(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }

    function getpriceStadistics(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics/price',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }

    //** Obtiene el filtro base */
    function getmotiverejectStadistics(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics/motivereject',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }

     //** Obtiene el filtro base */
    function getmotiverepeatedStadistics(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics/repeated',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }

     //** Obtiene el filtro base */
    function getspecialstadistics(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics/special',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }


    function getsampledestination(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics/sample/destination',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }

    //  Lista estadisticas de microbiologia.
    function getstatisticsmicrobiology(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics/microbiology',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }

    //  Lista estadisticas del plano de whonet
    function getplanowhonet(token, data) {
       return $http({
        hideOverlay: true,
                method: 'PATCH',
                headers: {'Authorization': token},
                url: settings.serviceUrl  +'/statistics/microbiology/whonet',
                data: data
            })
          .then(success);

        function success(response) {
          return response;
        }
    }

    function getpriceBox(token, data) {
      return $http({
        hideOverlay: true,
          method: 'PATCH',
          headers: {'Authorization': token},
          url: settings.serviceUrl  +'/statistics/priceBox',
          data: data
        })
        .then(success);

        function success(response) {
          return response;
        }
    }

    function getgeneralStadisticsV2(data) {
      return $http({
       hideOverlay: true,
               method: 'PATCH',
               url: settings.serviceUrlApi  +'/statistics/general',
               data: data
           })
         .then(success);

       function success(response) {
         return response;
       }
    }

  }
})();
