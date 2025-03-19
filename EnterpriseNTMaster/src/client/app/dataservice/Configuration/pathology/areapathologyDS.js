(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('areapathologyDS', areapathologyDS);

    areapathologyDS.$inject = ['$http', 'settings'];
    /* @ngInject */

    function areapathologyDS($http, settings) {
        var service = {
            getAreas: getAreas,
            getAreaById: getAreaById,
            updateArea: updateArea,
            insertArea: insertArea
        };

        return service;

        function getAreas(token) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/areas'
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function getAreaById(token, id) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/areas/filter/id/' + id
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function insertArea(token, area) {

            var promise = $http({
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/areas',
                data: area
            });

            return promise.success(function(response, status) {
                return response;
            });
        }

        function updateArea(token, area) {

            var promise = $http({
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/areas',
                data: area
            });

            return promise.success(function(response, status) {
                return response;
            });
        }
    }
})();