(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('cashboxDS', cashboxDS);
    cashboxDS.$inject = ['$http', 'settings'];
    function cashboxDS($http, settings) {
        var service = {
            getActiveBanks: getActiveBanks,
            getprovider: getprovider,
            getActiveCards: getActiveCards,
            getActivePaymentTypes: getActivePaymentTypes,
            saveCashbox: saveCashbox,
            saveCashboxTotals: saveCashboxTotals,
            getCashbox: getCashbox,
            getCashboxTotals: getCashboxTotals,
            deleteCashbox: deleteCashbox,
            subsequentPayments: subsequentPayments,
            preinvoice: preinvoice,
            invoice: invoice,
            paymentOfInvoice: paymentOfInvoice,
            createCreditNote: createCreditNote,
            getinvoicedetail: getinvoicedetail,
            recalculateRates: recalculateRates,
            getinvoceorder: getinvoceorder,
            getinvoiceparticular: getinvoiceparticular,
            generalCashReport: generalCashReport,
            detailedCashReport: detailedCashReport,
            getSimpleInvoiceDetail: getSimpleInvoiceDetail,
            getdetailinvoice: getdetailinvoice,
            getCreditNoteinvoiceNumber: getCreditNoteinvoiceNumber,
            getContractsForTheAssociatedRates: getContractsForTheAssociatedRates,
            getExpiredInvoicesByCustomer: getExpiredInvoicesByCustomer,
            getCustomerInvoices:getCustomerInvoices,
            getCashBalances: getCashBalances,
            getUnbilled: getUnbilled,
            changePrices: changePrices,
            consolidatedAccount: consolidatedAccount,
            preinvoiceByOrder: preinvoiceByOrder,
            invoiceByOrder: invoiceByOrder
        };
        return service;

        /**
         * Obtiene los bancos activos en la aplicación
         * @param {*} token Token de autenticacion
         */
        function getActiveBanks(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/banks/filter/state/1'
            }).then(function (response) {
                return response;
            });
        }
        /**
        * Obtiene los los contratos asociados
        * @param {*} token Token de autenticacion
        */
        function getContractsForTheAssociatedRates(token, cashbox) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/contracts/getContractsForTheAssociatedRates',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }
        /**
        * Obtiene los bancos activos en la aplicación
        * @param {*} token Token de autenticacion
        */
        function getprovider(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/providers/filter/state/true'
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene las tarjetas activas en la aplicación
         * @param {*} token Token de autenticacion
         */
        function getActiveCards(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/cards/filter/state/1'
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene los tipos de pagos activos en la aplicación
         * @param {*} token Token de autenticacion
         */
        function getActivePaymentTypes(token) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/paymenttypes/filter/state/1'
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Guarda los registros de caja
         * @param {*} token Token de Autenticación
         * @param {*} cashbox Objeto de Caja
         */
        function saveCashbox(token, cashbox) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/cashboxes',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Elimina todos los datos de la caja de una orden
         * @param {*} token Token de Autenticación
         * @param {*} Número de orden
         */
        function deleteCashbox(token, order) {
            return $http({
                hideOverlay: true,
                method: 'DELETE',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/cashboxes/delete/id/' + order
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Guarda los totales de la caja
         * @param {*} token Token de Autenticación
         * @param {*} cashbox Objeto de los totales de Caja
         */
        function saveCashboxTotals(token, cashbox, method) {
            return $http({
                hideOverlay: true,
                method: method,
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/cashboxes/totalpayments',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }


        /**
         * Obtiene los registros de caja de una orden
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de Orden
         */
        function getCashbox(token, order) {
            if (order !== undefined) {
                return $http({
                    hideOverlay: true,
                    method: 'GET',
                    headers: { 'Authorization': token },
                    url: settings.serviceUrl + '/cashboxes/' + order
                }).then(function (response) {
                    return response;
                });
            }
        }

        /**
         * Obtiene los registros de los totales de la caja
         * @param {*} token Token de autenticacion
         * @param {*} order Numero de Orden
         */
        function getCashboxTotals(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/cashboxes/cashbox/order/' + order
            }).then(function (response) {
                return response;
            });
        }

        /**
       * listado para realizar los pagos posteriores
       * @param {*} token Token de Autenticación
       * @param {*} cashbox Objeto de filtro
       */
        function subsequentPayments(token, cashbox) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/orders/filter/subsequentPayments',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }
        /**
         * Obtiene los datos necesarios para la pre-facturación
         * @param {*} token Token de Autenticación
         * @param {*} cashbox Objeto de Caja
         */
        function preinvoice(token, cashbox) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/pre-invoice',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }

        /**
         * Obtiene los datos necesarios para la pre-facturación
         * @param {*} token Token de Autenticación
         * @param {*} cashbox Objeto de Caja
         */
        function invoice(token, cashbox) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }


        /**
         * Crea una nota credito
         * @param {*} token Token de Autenticación
         * @param {*} cashbox Objeto de Caja
         */
        function createCreditNote(token, creditnote) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/createCreditNote',
                data: creditnote
            }).then(function (response) {
                return response;
            });
        }


        /**
       * Obtiene los registros de los totales de la caja
       * @param {*} token Token de autenticacion
       * @param {*} order Numero de Orden
       */
        function getinvoicedetail(token, invoiceNumber) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/getSimpleInvoiceDetail/invoiceNumber/' + invoiceNumber
            }).then(function (response) {
                return response;
            });
        }

        /**
      * listado para Recalcula las tarifas
      * @param {*} token Token de Autenticación
      * @param {*} cashbox Objeto de filtro
      */
        function recalculateRates(token, cashbox) {
            return $http({
                hideOverlay: true,
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/recalculateRates',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }


        /**
      * listado para Recalcula las tarifas
      * @param {*} token Token de Autenticación
      * @param {*} cashbox Objeto de filtro
      */
        function paymentOfInvoice(token, cashbox) {
            return $http({
                hideOverlay: true,
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/paymentOfInvoice',
                data: cashbox
            }).then(function (response) {
                return response;
            });
        }

        /**
     * Crea una nota credito
     * @param {*} token Token de Autenticación
     * @param {*} cashbox Objeto de Caja
     */
        function getinvoceorder(token, order) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/saveInvoiceParticular',
                data: order
            }).then(function (response) {
                return response;
            });
        }


        /**
     * Crea una nota credito
     * @param {*} token Token de Autenticación
     * @param {*} cashbox Objeto de Caja
     */
        function getExpiredInvoicesByCustomer(token, order) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/statement/getExpiredInvoicesByCustomer',
                data: order
            }).then(function (response) {
                return response;
            });
        }

        /**
 * Crea una nota credito
 * @param {*} token Token de Autenticación
 * @param {*} cashbox Objeto de Caja
 */
        function getCustomerInvoices(token, order) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/statement/getCustomerInvoices',
                data: order
            }).then(function (response) {
                return response;
            });
        }


        /**
  * Crea una nota credito
  * @param {*} token Token de Autenticación
  * @param {*} cashbox Objeto de Caja
  */
        function getinvoiceparticular(token, order) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/particular/' + order
            }).then(function (response) {
                return response;
            });
        }


        /**
            * Crea una nota credito
            * @param {*} token Token de Autenticación
            * @param {*} cashbox Objeto de Caja
            */
        function generalCashReport(token, CashReport) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/generalCashReport',
                data: CashReport
            }).then(function (response) {
                return response;
            });
        }

        /**
            * Obtiene el reporte detallado de caja
            * @param {*} token Token de Autenticación
            * @param {*} cashbox Objeto de Caja
            */
        function detailedCashReport(token, CashReport) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/detailedCashReport',
                data: CashReport
            }).then(function (response) {
                return response;
            });
        }

        /**
           * 	Obtiene el detalle simple de las facturas que apliquen a los filtros enviados
           * @param {*} token Token de Autenticación
           * @param {*} cashbox Objeto de Caja
           */
        function getSimpleInvoiceDetail(token, invoice) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/getSimpleInvoiceDetail',
                data: invoice
            }).then(function (response) {
                return response;
            });
        }
        /**
              * Obtiene la factura por el número de esta
              * @param {*} token Token de Autenticación
              * @param {*} cashbox Objeto de Caja
              */
        function getdetailinvoice(token, invoice) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/getInvoice/invoiceNumber/' + invoice
            }).then(function (response) {
                return response;
            });
        }
        /**
           * Obtiene las notas credito relacionadas a una factura
           * @param {*} token Token de Autenticación
           * @param {*} cashbox Objeto de Caja
           */
        function getCreditNoteinvoiceNumber(token, invoice) {
            return $http({
                hideOverlay: true,
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/invoice/getCreditNote/invoiceNumber/' + invoice
            }).then(function (response) {
                return response;
            });
        }

        /**
          * Obtiene la lista de ordenes pendientes de saldo
          * @param {*} token Token de Autenticación
          * @param {*} filter Filtros
          */
        function getCashBalances(token, filter) {
          return $http({
              hideOverlay: true,
              method: 'POST',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/invoice/cashbalance',
              data: filter
          }).then(function (response) {
              return response;
          });
        }

        /**
          * Obtiene la lista de ordenes sin caja
          * @param {*} token Token de Autenticación
          * @param {*} filter Filtros
          */
         function getUnbilled(token, filter) {
          return $http({
              hideOverlay: true,
              method: 'POST',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/invoice/unbilled',
              data: filter
          }).then(function (response) {
              return response;
          });
        }

          /**
      * listado para cambiar los precios de los examenes de una orden
      * @param {*} token Token de Autenticación
      * @param {*} prices Objeto
      */
      function changePrices(token, prices) {
        return $http({
            hideOverlay: true,
            method: 'PUT',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/invoice/pricechange',
            data: prices
        }).then(function (response) {
            return response;
        });
      }

      /**
      * Obtiene el reporte consolidado de convenios
      * @param {*} token Token de Autenticación
      * @param {*} cashbox Objeto de Caja
      */
      function consolidatedAccount(token, CashReport) {
        return $http({
            hideOverlay: true,
            method: 'POST',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/invoice/consolidatedaccount',
            data: CashReport
        }).then(function (response) {
            return response;
        });
      }

      /**
         * Obtiene los datos necesarios para la pre-facturación
         * @param {*} token Token de Autenticación
         * @param {*} cashbox Objeto de Caja
         */
      function preinvoiceByOrder(token, cashbox) {
        return $http({
            hideOverlay: true,
            method: 'POST',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/invoice/pre-invoice/order',
            data: cashbox
        }).then(function (response) {
            return response;
        });
      }

      /**
         * Obtiene los datos necesarios para la pre-facturación
         * @param {*} token Token de Autenticación
         * @param {*} cashbox Objeto de Caja
         */
      function invoiceByOrder(token, cashbox) {
        return $http({
            hideOverlay: true,
            method: 'POST',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/invoice/order',
            data: cashbox
        }).then(function (response) {
            return response;
        });
      }

    }
})();
