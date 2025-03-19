(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('unitDS', unitDS);

  unitDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function unitDS($http, $q, exception, logger,settings) {
    var service = {
      getUnit: getUnit,
      getUnitId: getUnitId,
      getUnitActive: getUnitActive,
      NewUnit:NewUnit,
      updateunit:updateunit,
      getUnitState:getUnitState
    };

    return service;
    //** Método que consulta el Servicio y trae una lista de unidades*//
    function getUnit(token) {
      var promise = $http({
          method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/units'
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que consulta el servicio por id y trae los datos de la unidad*/
    function getUnitId(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/units/filter/id/'+ id
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
     //** Método que consulta el servicio por estado*/
    function getUnitState(token,state) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/units/filter/state/'+ state
          });
          return promise.success(function (response, status) {
            return response;
          });

    }

     //** Método que consulta el servicio por estado y trae los datos de las unidades activas*/
    function getUnitActive(token,id) {
         var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  +'/units/filter/state/true'

          });
          return promise.success(function (response, status) {
            return response;
          });

    }
       
    //** Método que crea unidad*/
     function NewUnit(token,Unit) {
         var promise = $http({
               method: 'POST',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/units',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
    //** Método que Actualiza unidad*/
    function updateunit(token,Unit) {
        var promise = $http({
               method: 'PUT',
               headers: {'Authorization': token},
               url: settings.serviceUrl  +'/units',
               data: Unit
          });
          return promise.success(function (response, status) {
            return response;
          });

    }
  }
})();
