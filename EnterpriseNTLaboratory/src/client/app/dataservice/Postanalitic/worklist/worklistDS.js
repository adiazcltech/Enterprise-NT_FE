(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('worklistDS', worklistDS);

  worklistDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function worklistDS($http,settings) {
    var service = {
      getWorkListGenerate: getWorkListGenerate,
      getIdWorkList: getIdWorkList,
      getWorkListDelete: getWorkListDelete,
      getWorkListSequence: getWorkListSequence
    };

    return service;
    //** Método que consulta el Servicio que genera y devuelve la información de una hoja de trabajo nueva.*//
    function getWorkListGenerate(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/worklists/generate',
        data: json
      }).then(function (response) {
        return response;
      });
    }
    //** Método que consulta el servicio por id y trae la información de una hoja de trabajo consultada.*/
    function getIdWorkList(token, group, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/worklists/filter/group/' + group + '/worklist/' + id
      }).then(function (response) {
        return response;
      });
    }
    //** Método que reinicia la secuencia de una hoja de trabajo., internamente elimina los registros.*/
    function getWorkListDelete(token, id) {
      return $http({
        hideOverlay: true,
        method: 'DELETE',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/worklists/' + id
      }).then(function (response) {
        return response;
      });
    }
    function getWorkListSequence(token, worksheet) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/worklists/secuence/' + worksheet
      }).then(function (response) {
        return response;
      });
    }
  }
})();

