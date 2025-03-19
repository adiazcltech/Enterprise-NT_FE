(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('alarmDS', alarmDS);
    alarmDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function alarmDS($http, $q, exception, logger, settings) {
        var service = {
            get: get,
            getId: getId,
            getActive: getActive,
            New: New,
            update: update
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de Alarma *// 
        function get(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/alarms'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
         //** Método que consulta el Servicio y trae una lista de Alarma *// 
        function getActive(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/alarms/filter/state/1'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de alarmas*/
        function getId(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/alarms/filter/id/' + id
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que crea una alarma*/
        function New(token, alarms) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/alarms',
                data: alarms
            });
            return promise.success(function (response, status) {
                return response;
            });

        }
        //** Método que Actualiza una alarma*/
        function update(token, alarms) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/alarms',
                data: alarms
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
    }
})();

 