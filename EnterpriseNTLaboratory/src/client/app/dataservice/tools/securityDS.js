(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('securityDS', securityDS); // Define the factory on the module.

    securityDS.$inject = ['$http', 'siteSettings', 'settings'];
    /* @ngInject */

    function securityDS($http, siteSettings , settings) {
        var service = {
            validateToken: validateToken,
        };

        return service;

        function validateToken(token) {
            console.log("settngs", settings)
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token },
                url: settings.serviceUrlApi + '/security/validatetoken' // Asegúrate de que serviceUrlApi esté definido
            }).then(success, error);

            function success(response) {
                return response;
            }

            function error(response) {
                // Manejo del error
                return $q.reject(response);
            }
        }
    }
})();
