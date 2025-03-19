(function () {
    'use strict';
    angular
      .module('app.core')
      .factory('referencemicrobiologyDS', referencemicrobiologyDS);
    referencemicrobiologyDS.$inject = ['$http', '$q', 'exception', 'logger', 'settings'];
    /* @ngInject */
    //** Método que define los metodos a usar*/
    function referencemicrobiologyDS($http, $q, exception, logger, settings) {
        var service = {
            getreferencevalues: getreferencevalues,
            getId: getId,
            New: New,
            update: update,
            deleterelation : deleterelation
        };
        return service;
        //** Método que consulta el Servicio y trae una lista de Antibioticos*// 
        function getreferencevalues(token) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/antibiotics'
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
        //** Método que consulta el servicio por id y trae los datos de Antibioticos*/
        function getId(token,microorganism,antibiotic,method,interpretation) {
            var promise = $http({
                method: 'GET',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/antibiotics/filter/'+microorganism+'/'+antibiotic+'/'+method+'/'+interpretation
            });
            return promise.success(function (response, status) {
                return response;
            });
        }      
        //** Método que crea los valores de referencia microorganismo - antibiotico*/
        function New(token, antibiotic) {
            var promise = $http({
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/antibiotics',
                data: antibiotic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }
       //** Método Actualiza los valores de referencia microorganismo - antibiotico*/
        function update(token, antibiotic) {
            var promise = $http({
                method: 'PUT',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/antibiotics',
                data: antibiotic
            });
            return promise.success(function (response, status) {
                return response;
            });
        }     
           //** Método elimina los valores de referencia microorganismo - antibiotico*/
        function deleterelation(token,microorganism,antibiotic,method,interpretation) {
            var promise = $http({
                method: 'DELETE',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/microorganisms/antibiotics/filter/'+microorganism+'/'+antibiotic+'/'+method+'/'+interpretation
            });
            return promise.success(function (response, status) {
              return response;
            });
        }
    }
})();
 