(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('unlockorderhistoryDS', unlockorderhistoryDS);

  unlockorderhistoryDS.$inject = ['$http', '$q', 'exception', 'logger','settings'];
  /* @ngInject */
    function unlockorderhistoryDS($http, $q, exception, logger,settings) {
     var service = {
      getUnlockAll: getUnlockAll,
      getUnlockHistory: getUnlockHistory,
      getUnlockOrder: getUnlockOrder

    };

    return service;

    
     //** Método que realizar borrado de toda la concurrencia de datos en el ingreso de órdenes.*/
    function getUnlockAll(token) {
       return $http({
        hideOverlay: true,
          method: 'DELETE',
          headers: {'Authorization': token},
          url: settings.serviceUrl  +'/concurrencies'
       }).then(success)
         .catch(fail);

        function success(response) {
          return response;
        }

        function fail(e) {
          return exception.catcher('XHR Failed for getPeople')(e);
        }    
    }

     //** Método que realizar borrado la concurrencia de datos de la historia en el ingreso de órdenes.*/
    function getUnlockHistory(token, type, numdocument) {
       return $http({
        hideOverlay: true,
          method: 'DELETE',
          headers: {'Authorization': token},
          url: settings.serviceUrl  +'/concurrencies/record/' + type + '/' + numdocument
       }).then(success)
         .catch(fail);

        function success(response) {
          return response;
        }

        function fail(e) {
          return exception.catcher('XHR Failed for getPeople')(e);
        }    
    }

     //** Método que realizar borrado la concurrencia de datos de la orden en el ingreso de órdenes.*/
    function getUnlockOrder(token, numorder) {
       return $http({
        hideOverlay: true,
          method: 'DELETE',
          headers: {'Authorization': token},
          url: settings.serviceUrl  +'/concurrencies/order/'+ numorder
       }).then(success)
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

