(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('containerpathologyDS', containerpathologyDS);

    containerpathologyDS.$inject = ['$http', 'settings'];
    /* @ngInject */

    function containerpathologyDS($http, settings) {
        var service = {
            getContainers: getContainers,
            getContainerById: getContainerById,
            updateContainer: updateContainer,
            insertContainer: insertContainer
        };

        return service;

        function getContainers(token) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/container'
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function getContainerById(token, id) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/container/filter/id/' + id
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function insertContainer(token, container) {

            var promise = $http({
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/container',
                data: container
            });

            return promise.success(function(response, status) {
                return response;
            });
        }

        function updateContainer(token, container) {

            var promise = $http({
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/container',
                data: container
            });

            return promise.success(function(response, status) {
                return response;
            });
        }
    }
})();