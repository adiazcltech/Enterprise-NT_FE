(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('diagnosticDS', diagnosticDS);
    diagnosticDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function diagnosticDS($http, $q, exception, logger, settings) {
        var service = {
            get: get,
            getId: getId,
            getIdtest:getIdtest,
            getIdiagnostics:getIdiagnostics,
            getstateactive:getstateactive,
            New: New,
            update: update,
            updatediagnosticstest:updatediagnosticstest,
            updatetestdiagnostics:updatetestdiagnostics,
            importdata: importdata
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de diagnostico*// 
        function get(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de diagnostico*/
        function getId(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics/filter/id/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
          //** Método que consulta los diagnosticos por prueba*/
        function getIdtest(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics/filter/test/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
          //** Método que consulta los diagnosticos por prueba*/
        function getIdiagnostics(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics/test/filter/diagnostic/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
           //** Método que consulta los diagnosticos activos*/
        function getstateactive(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics/filter/state/true'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
      
        //** Método que crea diagnostico*/
        function New(token, diagnostic) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics',
                data: diagnostic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que Actualiza diagnostico*/
        function update(token, diagnostic) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics',
                data: diagnostic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que Actualiza diagnostico*/
        function updatediagnosticstest(token, diagnostic) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics/assign/test',
                data: diagnostic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que Actualiza diagnostico*/
        function updatetestdiagnostics(token, diagnostic) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics/assign/diagnostic',
                data: diagnostic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que importa un diagnostico*/
        function importdata(token, diagnostic) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/diagnostics/import',
                data: diagnostic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
    }
})();
 