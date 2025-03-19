/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('orderDS', orderDS);

    orderDS.$inject = ['$http', 'settings'];
    /* @ngInject */

    function orderDS($http, settings) {
        var service = {
            getOrder: getOrder,
            getOrderTestEdit: getOrderTestEdit,
            getrequirement: getrequirement,
            gettestInexclude:gettestInexclude,
            gettestresultentry: gettestresultentry,
            getOrderbyOrder: getOrderbyOrder,
            insertOrder: insertOrder,
            updateOrder: updateOrder,
            insertOrderBlock: insertOrderBlock,
            getfilterOrderdeleted: getfilterOrderdeleted,
            getactivateorders: getactivateorders,
            getPriceTestOrder: getPriceTestOrder,
            getByOrder: getByOrder,
            getByEntryDate: getByEntryDate,
            getsearchByDate: getsearchByDate,
            getByPatientId: getByPatientId,
            getByPatientInfo: getByPatientInfo,
            getTestToOrderEntry: getTestToOrderEntry,
            getDocumentTypes: getDocumentTypes,
            getByPatientIdWithDoc: getByPatientIdWithDoc,
            getTicketTest: getTicketTest,
            getTestInfo: getTestInfo,
            getRecallByOrder: getRecallByOrder,
            getRecallByDate: getRecallByDate,
            getRecallByPatientId: getRecallByPatientId,
            getRecallByPatient: getRecallByPatient,
            getDetailRecall: getDetailRecall,
            recall: recall,
            insertdiagnosticorder: insertdiagnosticorder,
            cancel: cancel,
            getPathologyFilter: getPathologyFilter,
            getLastOrder: getLastOrder,
            getInconsistency: getInconsistency,
            getexternalId: getexternalId,
            checkValidation: checkValidation,
            getPriceTests: getPriceTests,
            getLastOrderDemos: getLastOrderDemos,
            insertPackageTracking: insertPackageTracking,
        };

        return service;

        function getrequirement(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/orders/requirement/' + order
            }).then(function (response) {
                return response;
            });
        }
        function insertPackageTracking(token, json) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/packagetracking',
                data: json
            }).then(function (response) {
                return response;
            });
        }

        function getInconsistency(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/orders/getOrdersWithInconsistencies'
            }).then(function (response) {
                return response;
            });
        }

        function gettestInexclude(token, id, item) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/demographics/testInexclude/id/' + id + '/item/' + item
            }).then(function (response) {
                return response;
            });
        }

        
        function getOrderTestEdit(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/orderedittest/' + order
            }).then(function (response) {
                return response;
            });
        }

        function getexternalId(token, externalId, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: {
                    'Authorization': token
                },
                url: settings.serviceUrl + '/integration/ingreso/getOrdersByOrderHIS/externalId/' + externalId + '/branch/' + branch
            }).then(function (response) {
                return response;
            });
        }

        function getOrder(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/' + order
            }).then(function (response) {
                return response;
            });
        }

        function gettestresultentry(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/test/entry/' + order
            }).then(function (response) {
                return response;
            });
        }

        function getOrderbyOrder(token, order) {
            order = order === undefined ? 0 : order;
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/map/demographics/' + order
            }).then(function (response) {
                return response;
            });
        }

        function insertOrder(token, json) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders',
                data: json
            }).then(function (response) {
                return response;
            });
        }

        function updateOrder(token, json) {
            return $http({
                hideOverlay: true,
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders',
                data: json
            }).then(function (response) {
                return response;
            });
        }

        function insertOrderBlock(token, json, init, quantity, type) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/batch/init/' + init + '/quantity/' + quantity + '/type/' + type,
                data: json
            }).then(function (response) {
                return response;
            });
        }


        function getfilterOrderdeleted(token, order) {
            return $http({
                hideOverlay: true,
                method: 'PATCH',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/audits/filter/deleted',
                data: order

            })
                .then(function (response) {
                    return response;
                });

        }

        function getactivateorders(token, order) {
            return $http({
                hideOverlay: true,
                method: 'PATCH',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/activate',
                data: order
            })
                .then(function (response) {
                    return response;
                });
        }

        function getPriceTestOrder(token, test, rate) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/price/test/' + test + '/rate/' + rate
            })
                .then(function (response) {
                    return response;
                });
        }

        /**
         * Obtiene una orden por numero de orden
         *
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de orden
         * @param {*} branch Sede, si no se maneja por sede enviar -1
         */
        function getByOrder(token, order, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/order/' + order + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene las ordenes de acuerdo al dia de ingreso
         *
         * @param {*} token Token de autenticacion
         * @param {*} entryDate Fecha de ingreso en formato YYYYMMDD
         * @param {*} branch Sede, si no se maneja por sede enviar -1
         */
        function getByEntryDate(token, entryDate, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/entryDate/' + entryDate + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
        * Obtiene las ordenes de acuerdo al dia de ingreso
        *
        * @param {*} token Token de autenticacion
        * @param {*} entryDate Fecha de ingreso en formato YYYYMMDD
        * @param {*} branch Sede, si no se maneja por sede enviar -1
        */
        function getsearchByDate(token, entryDate, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/entryDateNumOrder/' + entryDate + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes por historia del paciente
         *
         * @param {*} token Token de autenticacion
         * @param {*} patientId Historia del paciente
         * @param {*} branch Sede, si no se maneja por sede enviar -1
         */
        function getByPatientId(token, patientId, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/patientId/' + patientId + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes por historia del paciente
         *
         * @param {*} token Token de autenticacion
         * @param {*} patientId Historia del paciente
         * @param {*} docType Id Tipo de Documento
         * @param {*} branch Sede, si no se maneja por sede enviar -1
         */
        function getByPatientIdWithDoc(token, patientId, docType, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/patientId/' + patientId + '/documentType/' + docType + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes con informacion de un paciente
         *
         * @param {*} token  Token de autenticacion
         * @param {*} lastName Apellido, si no se usa enviar la palabra undefined
         * @param {*} surName Segundo Apellido, si no se usa enviar la palabra undefined
         * @param {*} name1 Primer nombre, si no se usa enviar la palabra undefined
         * @param {*} name2 Segundo nombre, si no se usa enviar la palabra undefined
         * @param {*} branch Sede, si no se maneja por sede enviar -1
         */
        function getByPatientInfo(token, lastName, surName, name1, name2, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/info/' +
                    lastName.toUpperCase().trim() +
                    '/' + surName.toUpperCase().trim() + '/' +
                    name1.toUpperCase().trim() + '/' +
                    name2.toUpperCase().trim() + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene los examenes activos que estan configurados para mostrar en el ingreso
         * @param {*} token Token de autenticación
         */
        function getTestToOrderEntry(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/tests/filter/order_entry'
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene los tipos de documentos creados en la aplicacion
         * @param {*} token Token de autenticación
         */
        function getDocumentTypes(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/documenttypes/filter/state/true'
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene los examenes para el talon de reclamacion
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de Orden
         */
        function getTicketTest(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/ticket/' + order
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene informacion del examen
         * @param {*} token Token de Autenticacion
         * @param {*} patient Id Paciente -1 si es un paciente nuevo
         * @param {*} test Id Prueba
         * @param {*} testType Tipo de Prueba
         * @param {*} rate Id Tarifa -1 si no se maneja tarifa
         */
        function getTestInfo(token, patient, test, testType, rate) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/test/detail/' + patient + '/' + test + '/' + testType + '/' + rate
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes de rellamado
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de Orden
         */
        function getRecallByOrder(token, order, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/recalled/order/' + order + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes de rellamado
         * @param {*} token Token de autenticacion
         * @param {*} date Fecha en formato YYYYMMDD
         * @param {*} branch sede
         */
        function getRecallByDate(token, date, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/recalled/entryDatep/' + date + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes de rellamado
         * @param {*} token Token de autenticacion
         * @param {*} patientId Historia
         * @param {*} documentType Tipo de documento, si no se maneja enviar -1
         */
        function getRecallByPatientId(token, patientId, documentType, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/recalled/patientId/' + patientId +
                    '/documentType/' + documentType + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes de rellamado
         * @param {*} token Token de autenticacion
         * @param {*} lastName Apellido
         * @param {*} surName Segundo Apellido
         * @param {*} name1 Nombre 1
         * @param {*} name2 Nombre 2
         */
        function getRecallByPatient(token, lastName, surName, name1, name2, branch) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/recalled/info/' + lastName + '/' + surName +
                    '/' + name1 + '/' + name2 + '/' + branch
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Busca ordenes de rellamado
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de la orden
         */
        function getDetailRecall(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/recalled/order/' + order
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Realiza el rellamado de una orden
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de orden
         */
        function recall(token, order) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/recall/' + order
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Actualiza los diagnosticos de una orden
         * @param {*} token Token de autenticacion
         * @param {*} listado de diagnosticos para una orden
         */
        function insertdiagnosticorder(token, data) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/insertdiagnostic',
                data: data
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Realiza la cancelacion de una orden
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de orden
         */
        function cancel(token, order) {
            return $http({
                hideOverlay: true,
                method: 'PATCH',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/cancel/' + order
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene la lista de ordenes filtradas con muestras de patologia
         * @param {*} token Token de autenticación
         */
        function getPathologyFilter(token, filter) {
            return $http({
                hideOverlay: true,
                method: 'PATCH',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/pathology/order/filters',
                data: filter
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene la ultima orden de un paciente
         * @param {*} token Token de autenticación
         */
        function getLastOrder(token, id) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/last/patient/' + id
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene la ultima orden de un paciente para historicos de demograficos
         * @param {*} token Token de autenticación
         */
        function getLastOrderDemos(token, id) {
          return $http({
              hideOverlay: true,
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/orders/historical/patient/' + id
          }).then(function (response) {
              return response;
          });
        }

         /**
         * Obtiene el estado minimo de la lista de examenes de una orden
         * @param {*} token Token de autenticación
         */
        function checkValidation(token, order) {
          return $http({
              hideOverlay: true,
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/results/checkvalidation/' + order
          }).then(function (response) {
              return response;
          });
        }

        function getPriceTests(token, filter) {
          return $http({
              hideOverlay: true,
              method: 'PATCH',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/orders/prices/tests',
              data: filter
          })
          .then(function (response) {
              return response;
          });
        }
    }
})();
/* jshint ignore:end */
