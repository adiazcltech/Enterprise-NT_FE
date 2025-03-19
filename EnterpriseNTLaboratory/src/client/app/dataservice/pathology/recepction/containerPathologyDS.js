(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('containerPathologyDS', containerPathologyDS);
    containerPathologyDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];

    /* @ngInject */
    //** Método que define los metodos a usar*/
    function containerPathologyDS($http, $q, exception, logger, settings) {
        var service = {
            getByStatus: getByStatus,
        };
        return service;
        //** Obtiene los contenedores activos*/
        function getByStatus(token) {
            return $http({
                    hideOverlay: true,
                    method: 'GET',
                    headers: { 'Authorization': token },
                    url: settings.serviceUrl + '/pathology/container/filter/state/1'
                })
                .then(success);

            function success(response) {
                return response;
            }
        }
    }
})();