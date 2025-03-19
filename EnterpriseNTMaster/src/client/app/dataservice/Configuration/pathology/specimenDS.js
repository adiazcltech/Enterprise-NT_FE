(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('specimenDS', specimenDS);

    specimenDS.$inject = ['$http', 'settings'];
    /* @ngInject */

    function specimenDS($http, settings) {
        var service = {
            getSpecimens: getSpecimens,
            insertSubsamples: insertSubsamples,
            getSubsamplesBySpecimen: getSubsamplesBySpecimen,
            getStudies: getStudies
        };

        return service;

        function getSpecimens(token) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/specimen'
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function getSubsamplesBySpecimen(token, id) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/specimen/subsamples/' + id
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function insertSubsamples(token, specimen) {

            var promise = $http({
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/specimen/subsamples',
                data: specimen
            });

            return promise.success(function(response, status) {
                return response;
            });
        }

        function getStudies(token) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/specimen/study'
            });

            return promise.success(function(response, status) {
                return response;
            });

        }
    }
})();
