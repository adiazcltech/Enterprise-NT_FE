(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('socket', socket);
    socket.$inject = ['$http', 'settings', '$rootScope'];

    /* @ngInject */
    //** Método que define los metodos a usar*/
    function socket($http, settings, $rootScope) {
        try {
            var socket = io.connect(settings.serviceUrlSocketIO);
        } catch (error) {}
        var service = {
            on: on,
            emit: emit
        };
        return service;
        //** Obtiene las laminas de un caso de patologia*/
        function on(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        }

        function emit(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    }
})();