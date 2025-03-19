(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('organDS', organDS);

    organDS.$inject = ['$http', 'settings'];
    /* @ngInject */

    function organDS($http, settings) {
        var service = {
            getOrgan: getOrgan,
            getOrganById: getOrganById,
            updateOrgan: updateOrgan,
            insertOrgan: insertOrgan
        };

        return service;

        function getOrgan(token) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/organ'
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function getOrganById(token, id) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/organ/filter/id/' + id
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function insertOrgan(token, organ) {

            var promise = $http({
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/organ',
                data: organ
            });

            return promise.success(function(response, status) {
                return response;
            });
        }

        function updateOrgan(token, organ) {

            var promise = $http({
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/organ',
                data: organ
            });

            return promise.success(function(response, status) {
                return response;
            });
        }
    }
})();