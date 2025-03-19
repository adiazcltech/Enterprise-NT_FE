(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('feescheduleDS', feescheduleDS);
    feescheduleDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function feescheduleDS($http, $q, exception, logger, settings) {
        var service = {
            get: get,
            getId: getId,
            New: New,
            update: update
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de vigencias *// 
        function get(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/feeschedules',
                hideOverlay: true
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        
        //** Método que consulta el servicio por id y trae los datos de vigencias*/
        function getId(token, id) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/feeschedules/filter/id/' + id,
                hideOverlay: true
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que crea una vigencia*/
        function New(token, feeSchedule) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/feeschedules',
                data: feeSchedule,
                hideOverlay: true
            });
            return promise.success(function (response, status) {
                return response;
            });

        }
        //** Método que Actualiza una vigencia*/
        function update(token, feeSchedule) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/feeschedules',
                data: feeSchedule,
                hideOverlay: true
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
    }
})();

 