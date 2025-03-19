(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('shiftsDS', shiftsDS);

  shiftsDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function shiftsDS($http, $q, exception, logger, settings) {
      var service = {
          getshift: getshift,
          getshifttrue: getshifttrue,
          getshiftid: getshiftid,
          newshift: newshift,
          updateshift: updateshift,
          bybranch: bybranch,
          updatebranch: updatebranch
      };

      return service;
      //** Método que consulta la lista de Jornadas creadas*//
      function getshift(token) {
          return $http({
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/shifts'
          }).then(function (response) {
              return response;
          });
      }
      //** Método que consulta la lista de Jornadas activas*//
      function getshifttrue(token) {
          return $http({
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/shifts/filter/state/true'
          }).then(function (response) {
              return response;
          });
      }
      //** Método que consulta el detalle de una Jornada*/
      function getshiftid(token, id) {
          return $http({
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/shifts/' + id
          }).then(function (response) {
              return response;
          });
      }
      //** Método crea nueva Jornada*/
      function newshift(token, shifts) {
          return $http({
              method: 'POST',
              headers: { 'Authorization': token },
              url: settings.serviceUrl +'/shifts',
              data: shifts
          }).then(function (response) {
              return response;
          });
      }
      //** Método que Actualiza una Jornada*/
      function updateshift(token, shifts) {
          return $http({
              method: 'PUT',
              headers: { 'Authorization': token },
              url: settings.serviceUrl +'/shifts',
              data: shifts
          }).then(function (response) {
              return response;
          });
      }

      //** Método que consulta la lista de las jornadas por sede*//
      function bybranch(token, idBranch) {
        return $http({
            method: 'GET',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/shifts/filter/branch/' + idBranch
        }).then(function (response) {
            return response;
        });
      }

      //** Método que Actualiza una Jornada por sede*/
      function updatebranch(token, shifts) {
        return $http({
            method: 'PUT',
            headers: { 'Authorization': token },
            url: settings.serviceUrl +'/shifts/branch',
            data: shifts
        }).then(function (response) {
            return response;
        });
      }
  }
})();


