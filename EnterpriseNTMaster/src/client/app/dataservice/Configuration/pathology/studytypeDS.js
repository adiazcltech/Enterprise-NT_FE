(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('studytypeDS', studytypeDS);

    studytypeDS.$inject = ['$http', 'settings'];
    /* @ngInject */

    function studytypeDS($http, settings) {
        var service = {
            getStudyType: getStudyType,
            getStudyTypeById: getStudyTypeById,
            updateStudyType: updateStudyType,
            insertStudyType: insertStudyType
        };

        return service;

        function getStudyType(token) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/studytype'
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function getStudyTypeById(token, id) {
            var promise = $http({
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/studytype/filter/id/' + id
            });

            return promise.success(function(response, status) {
                return response;
            });

        }

        function insertStudyType(token, studyType) {

            var promise = $http({
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/studytype',
                data: studyType
            });

            return promise.success(function(response, status) {
                return response;
            });
        }

        function updateStudyType(token, studyType) {

            var promise = $http({
                method: 'PUT',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/pathology/studytype',
                data: studyType
            });

            return promise.success(function(response, status) {
                return response;
            });
        }
    }
})();