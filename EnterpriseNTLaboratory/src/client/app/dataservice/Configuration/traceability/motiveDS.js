(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('motiveDS', motiveDS);

    motiveDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    function motiveDS($http, $q, exception, logger, settings) {
        var service = {
            getmotive: getmotive,
            getMotiveByState: getMotiveByState,
            getMotivePathology: getMotivePathology
        };

        return service;

        function getmotive(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/motives'
            })

            .then(success);

            function success(response) {
                return response;
            }
        }

        function getMotiveByState(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/motives/filter/state/true'
            })

            .then(success);

            function success(response) {
                return response;
            }
        }

        function getMotivePathology(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/pathology/motives/filter/state/true'
            })

            .then(success);

            function success(response) {
                return response;
            }
        }


    }
})();