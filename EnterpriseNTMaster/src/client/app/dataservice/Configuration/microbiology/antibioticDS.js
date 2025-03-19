(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('antibioticDS', antibioticDS);
    antibioticDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function antibioticDS($http, $q, exception, logger, settings) {
        var service = {
            get: get,
            getId: getId,
            New: New,
            update: update,
            getState : getState,
            getIdsensitivity : getIdsensitivity,
            updateantibiotic : updateantibiotic,
            deletesensitivity :deletesensitivity
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de Antibioticos*// 
        function get(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/antibiotics'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de Antibioticos*/
        function getId(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/antibiotics/filter/id/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que consulta el servicio por estado y trae los datos de Antibioticos*/
        function getState(token, state) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/antibiotics/filter/state/' + state
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que crea Antibiotico*/
        function New(token, antibiotic) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/antibiotics',
                data: antibiotic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que Actualiza Antibiotico*/
        function update(token, antibiotic) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/antibiotics',
                data: antibiotic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de antibiotico asociado a un antibiograma*/
        function getIdsensitivity(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/antibiotics/filter/sensitivity/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de antibiotico asociado a un antibiograma*/
        function deletesensitivity(token, id) {
            var promise = $http({
                method: 'DELETE',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/sensitivities/antibiotics/' + id
            });
            return promise.success(function (response, status) {
                //return response;
            });
        }

          //** Método que Actualiza microorganismo*/
        function updateantibiotic(token, microorganism) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/sensitivities/antibiotics',
                data: microorganism
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
    }
})();
 