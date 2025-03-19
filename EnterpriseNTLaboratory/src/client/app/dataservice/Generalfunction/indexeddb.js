/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('indexeddb', indexeddb);

    indexeddb.$inject = ['$http', '$q', 'exception', 'logger', 'settings', 'moment', '$filter'];
    /* @ngInject */

    //** Método que define los metodos a usar*/
    function indexeddb($http, $q, exception, logger, settings, moment, $filter) {
        var service = {
            getindexeddb: getindexeddb,
            createserial: createserial,
            searchserial: searchserial,
            getserial: getserial,
            executeserial: executeserial

        };
        return service;
        /**
		       * Lenin Bueno Escolar
        */

        // Función que crea y/o abre la base de datos del navegador indexeddb 
        function getindexeddb() {
            var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            var dataBase = indexedDB.open('WebDB', 1);

            // dataBase.onupgradeneeded = function (e) {

            //        var active = dataBase.result;

            //        var object = active.createObjectStore('tableserial', { keyPath : 'id', autoIncrement : true });
            //        object.createIndex('by_serial', 'serial', { unique : true });
            //        object.createIndex('by_ip', 'ip', { unique : false });
            // };

            //    dataBase.onsuccess = function (e) {
            //        logger.success('Base de datos cargada correctamente');
            //        searchserial(dataBase);
            //    };

            //    dataBase.onerror = function (e)  {
            //        logger.error('Error cargando la base de datos');
            //        var registerSerial = {'found': false, 'serial': ''}
            //    };

            return dataBase;

        }


        function searchserial(dataBase) {
            var active = dataBase.result;
            var data = active.transaction(['tableserial'], 'readonly');
            var object = data.objectStore('tableserial');
            return object;
            var elements = [];

            // object.openCursor().onsuccess = function (e) {

            //     var result = e.target.result;
            //     var registerSerial = {};
            //     if (result === null) {
            //     	registerSerial = {'installprinter': true, 'serial': ''}

            //     }else{
            //     	registerSerial = {'installprinter': false, 'serial': result.value}

            //     }

            //     //elements.push(result.value);
            //     //result.continue();
            //     return registerSerial;

            // };
        }

        /* Función encargada de buscar o insertar el serial para imprimir desde el equipo cliente.
           1. transaction: Busca el serial en indexedDB.
           2. transaciton: Inserta un serial desde el backend */
        function executeserial(transaction) {
            var saveSerial = false;
            if (transaction === 1) {
                setTimeout(function () {
                    var dataBase = getindexeddb();
                    dataBase.onupgradeneeded = function (e) {
                        var active = dataBase.result;
                        var object = active.createObjectStore('tableserial', { keyPath: 'id', autoIncrement: true });
                        object.createIndex('by_serial', 'serial', { unique: true });
                        object.createIndex('by_ip', 'ip', { unique: false });
                        object.createIndex('by_date', 'date', { unique: false });
                    };

                    dataBase.onsuccess = function (e) {
                        //logger.success('Base de datos cargada correctamente');
                        var objSerial = searchserial(dataBase);
                        objSerial.openCursor().onsuccess = function (e) {

                            var result = e.target.result;
                            var registerSerial = {};
                            if (result === null) {
                                registerSerial = { 'saveserial': true, 'serial': '' }

                            } else {
                                registerSerial = { 'saveserial': false, 'serial': result.value.serial }

                            }
                            saveSerial = registerSerial.saveserial;
                            return saveSerial;
                        };
                    };

                    dataBase.onerror = function (e) {
                        logger.error('Error cargando la base de datos');
                        var registerSerial = { 'saveserial': true, 'serial': '' }
                        saveSerial = registerSerial.saveserial;
                        return saveSerial;
                    };

                }, 200)

            } else {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                if (auth != undefined) {
                    getserial(auth.authToken).then(function (data) {
                        //var serial = 'D234DFWRET3TGERG442S0';
                        data.data.ip = $rootScope.ipUser;
                        var objSerial = data.data;
                        var dataBase = getindexeddb();
                        dataBase.onupgradeneeded = function (e) {
                            var active = dataBase.result;
                            var object = active.createObjectStore('tableserial', { keyPath: 'id', autoIncrement: true });
                            object.createIndex('by_serial', 'serial', { unique: true });
                            object.createIndex('by_ip', 'ip', { unique: false });
                            object.createIndex('by_date', 'date', { unique: false });
                        };

                        dataBase.onsuccess = function (e) {
                            //logger.success('Base de datos cargada correctamente');
                            return createserial(objSerial, dataBase);
                        };

                        dataBase.onerror = function (e) {
                            logger.error('Error cargando la base de datos');
                            var registerSerial = { 'saveserial': true, 'serial': '' }
                            saveSerial = registerSerial.saveserial;
                            return saveSerial;
                        };

                    }, function (error) {
                        if (error.data === null) {
                            logger.error(error);
                        }
                    });
                }
            }
        }

        function createserial(objSerial, dataBase) {
            // var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            // var dataBase = indexedDB.open('WebDB', 1);

            var active = dataBase.result;
            var data = active.transaction(['tableserial'], 'readwrite');
            var object = data.objectStore('tableserial');

            var request = object.put({
                serial: objSerial.serial,
                ip: objSerial.ip,
                date: objSerial.date
            });

            request.onerror = function (e) {
                logger.error(request.error.name + '\n\n' + request.error.message);
            };

            data.oncomplete = function (e) {
                // document.querySelector('#dni').value = '';
                // document.querySelector('#name').value = '';
                // document.querySelector('#surname').value = '';
                logger.success('Serial: ' + objSerial.serial);
                //loadAll();
            };

        }


        function getserial(token) {
            return $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/reports/serial'
            })

                .then(success)
                .catch(fail);
            function success(response) {
                return response;
            }

            function fail(e) {
                return exception.catcher('XHR Failed for getPeople')(e);
            }
        }


    }
})();
/* jshint ignore:end */