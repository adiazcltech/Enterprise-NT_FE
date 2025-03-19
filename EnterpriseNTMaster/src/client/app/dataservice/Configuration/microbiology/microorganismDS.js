(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('microorganismDS', microorganismDS);
    microorganismDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function microorganismDS($http, $q, exception, logger, settings) {
        var service = {
            get: get,
            getId: getId,
            getState:getState,
            New: New,
            update: update,
            importdata: importdata,
            getIdsensitivity: getIdsensitivity,
            updatemicroorganism: updatemicroorganism,
            getIdsensitivitymicroorganisms:getIdsensitivitymicroorganisms
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de microorganismo*//
        function get(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de microorganismo*/
        function getId(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/filter/id/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que consulta el servicio por estado y trae los datos de microorganismo*/
        function getState(token, state) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/filter/state/' + state
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que crea microorganismo*/
        function New(token, microorganism) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms',
                data: microorganism
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que Actualiza microorganismo*/
        function update(token, microorganism) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms',
                data: microorganism
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que importa un microorganismo*/
        function importdata(token, microorganisms) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/import',
                data: microorganisms
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que consulta si el microorganismo y la prueba pertenencen a un antibiograma*/
        function getIdsensitivity(token, microorganism,test) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/sensitivity/microorganism/' + microorganism+ '/test/' + test
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
          //** Método que consulta el servicio por id de antibiograma y trae los microorganismo y pruebas relacionados*/
        function getIdsensitivitymicroorganisms(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/filter/sensitivity/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que Actualiza microorganismo*/
        function updatemicroorganism(token, microorganism) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/sensitivity',
                data: microorganism
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
    }
})();
