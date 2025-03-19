(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('demographicsoonDS', demographicsoonDS);

  demographicsoonDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function demographicsoonDS($http, settings) {
    var service = {
      getdemographicsitemssons: getdemographicsitemssons,
      demographicsitemssons: demographicsitemssons,
      demographicssons: demographicssons,
      updatedemographicsitemssons: updatedemographicsitemssons
    };

    return service;
    //Lista los demograficos items hijos
    function getdemographicsitemssons(token, idfather, idfatheritem, idson) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicsitemssons/idfather/' + idfather + '/idfatheritem/' + idfatheritem + '/idson/' + idson
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //	Description: Id del demografico padre
    function demographicsitemssons(token, idfather, idfatheritem) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicsitemssons/idfather/' + idfather + '/idfatheritem/' + idfatheritem
      });
      return promise.success(function (response, status) {
        return response;
      });

    }
    //	Retorna el id demografico hijo asociado
    function demographicssons(token, idfather) {
      var promise = $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicsitemssons/idfather/' + idfather
      });
      return promise.success(function (response) {
        return response;
      });
    }
    //Actualizar el demografico Padre y sus hijos
    function updatedemographicsitemssons(token, Demographics) {
      var promise = $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographicsitemssons',
        data: Demographics
      });
      return promise.success(function (response) {
        return response;
      });
    }
  }
})();
