(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('organDS', organDS);
    organDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

    /* @ngInject */
    //** Método que define los metodos a usar*/
    function organDS($http, $q, exception, logger, settings) {
        var service = {
            getByStatus: getByStatus,
        };
        return service;
        //** Obtiene los organos activos*/
        function getByStatus(token) {
            return $http({
                    hideOverlay: true,
                    method: 'GET',
                    headers: { 'Authorization': token },
                    url: settings.serviceUrl + '/pathology/organ/filter/state/1'
                })
                .then(success);

            function success(response) {
                return response;
            }
        }
    }
})();