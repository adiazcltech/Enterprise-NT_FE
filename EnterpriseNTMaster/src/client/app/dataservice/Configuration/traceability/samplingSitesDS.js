(function () {

    'use strict';

    angular
        .module('app.core')
        .factory('samplingSitesDS', samplingSitesDS);

    samplingSitesDS.$inject = ['$http', 'settings', 'localStorageService'];
    /* @ngInject */

    function samplingSitesDS($http, settings, localStorageService) {

        function token() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return auth.authToken;
        }

        function insertSamplingSites(body) {

            var request = {
                method: 'POST',
                headers: { 'Authorization': token() },
                url: settings.serviceUrl + '/samplingSites',
                data: body
            };

            return $http(request)
                .then(function (response) {
                    return response;
                });

        }

        function updateSamplingSites(body) {

            var request = {
                method: 'PUT',
                headers: { 'Authorization': token() },
                url: settings.serviceUrl + '/samplingSites',
                data: body
            };

            return $http(request)
                .then(function (response) {
                    return response;
                });
        }

        function getSamplingSites() {

            var request = {
                method: 'GET',
                headers: { 'Authorization': token() },
                url: settings.serviceUrl + '/samplingSites'
            };

            return $http(request)
                .then(function (response) {
                    return response;
                });
        }

        function getSamplingSiteById(id) {

            var request = {
                method: 'GET',
                headers: { 'Authorization': token() },
                url: settings.serviceUrl + '/samplingSites/' + id
            };

            return $http(request)
                .then(function (response) {
                    return response;
                });
        }

        return {
            insertSamplingSites: insertSamplingSites,
            updateSamplingSites: updateSamplingSites,
            getSamplingSites: getSamplingSites,
            getSamplingSiteById: getSamplingSiteById
        };

    }

})();


