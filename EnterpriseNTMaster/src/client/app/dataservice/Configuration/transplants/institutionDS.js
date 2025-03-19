(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('institutionDS', institutionDS);
    institutionDS.$inject = ['$http', 'settings'];

    //** Método que define los metodos a usar*/
    function institutionDS($http, settings) {
        var service = {
            get: get,
            getId: getId,
            New: New,
            update: update
        };

        return service;
        //** Método que consulta el Servicio y trae una lista de bancos*// 
        function get(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/institution'

            });
            return promise.success(function (response, status) {
                return response;
            });

        }
        //** Método que consulta el servicio por id y trae los datos del banco*/
        function getId(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/institution/' + id

            });
            return promise.success(function (response, status) {
                return response;
            });

        }
        //** Método que crea bancos*/
        function New(token, bank) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/institution',
                data: bank
            });
            return promise.success(function (response, status) {
                return response;
            });

        }
        //** Método que Actualiza bancos*/
        function update(token, bank) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/institution',
                data: bank
            });
            return promise.success(function (response, status) {
                return response;
            });

        }
    }
})();