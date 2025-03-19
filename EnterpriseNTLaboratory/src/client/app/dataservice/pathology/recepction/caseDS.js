(function() {
  'use strict';
  angular
      .module('app.core')
      .factory('caseDS', caseDS);
  caseDS.$inject = ['$http', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function caseDS($http, settings) {
        var service = {
            getCaseById: getCaseById,
            createCase: createCase,
            samplesReject: samplesReject,
            getByEntryDate: getByEntryDate,
            updateCase: updateCase,
            getFiles: getFiles,
            saveDocument: saveDocument,
            deleteDocument: deleteDocument,
            getRejectSamples: getRejectSamples,
            activeSamples: activeSamples,
            saveCasetes: saveCasetes,
            getFilterCases: getFilterCases,
            changeStatus: changeStatus,
            getCaseByOrder: getCaseByOrder,
            assignPathologist: assignPathologist
        };
        return service;
        /*Crea caso de patologia*/
        function createCase(token, casePat) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/pathology/case',
                data: casePat
            })
            .then(success);

            function success(response) {
                return response;
            }
        }

        /*Modifica caso de patologia*/
        function updateCase(token, casePat) {
          return $http({
              hideOverlay: true,
              method: 'PUT',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/pathology/case',
              data: casePat
          })
          .then(success);
          function success(response) {
              return response;
          }
        }

        /*Rechaza una orden*/
        function samplesReject(token, reject) {
            return $http({
                hideOverlay: true,
                method: 'POST',
                headers: { 'Authorization': token },
                url: settings.serviceUrl + '/pathology/order/rejection',
                data: reject
            })
            .then(success);

            function success(response) {
                return response;
            }
        }

        /**
        * Obtiene los casos de acuerdo al dia de ingreso
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
                url: settings.serviceUrl + '/pathology/case/filter/entryDate/' + entryDate + '/' + branch
            }).then(function(response) {
                return response;
            });
        }

        /**
        * Obtiene un caso por id
        *
        * @param {*} token Token de autenticacion
        * @param {*} id Id del caso
        */
        function getCaseById(token, id, order) {
          return $http({
              hideOverlay: true,
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/pathology/case/filter/id/' + id + '/order/' + order
          }).then(function(response) {
              return response;
          });
        }

        /**
        * Obtiene los archivos de un caso
        *
        * @param {*} token Token de autenticacion
        * @param {*} id Id del caso
        */
        function getFiles(token, id) {
          return $http({
              hideOverlay: true,
              method: 'GET',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/pathology/file/case/' + id
          }).then(function(response) {
              return response;
          });
        }

        /*Guarda archivos de los casos*/
        function saveDocument(token, file) {
          return $http({
              hideOverlay: true,
              method: 'POST',
              headers: { 'Authorization': token },
              url: settings.serviceUrl + '/pathology/file',
              data: file
          })
          .then(success);

          function success(response) {
              return response;
          }
        }

        /**
        * Elimina un archivo del caso
        *
        * @param {*} token Token de autenticacion
        * @param {*}  file
        */
       function deleteDocument(token, file) {
        return $http({
            hideOverlay: true,
            method: 'PATCH',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/file',
            data: file
        }).then(function(response) {
            return response;
        });
      }

      /**
        * Obtiene la lista de muestras rechazadas a partir de un rango dado a las ordenes
        *
        * @param {*} token Token de autenticacion
        * @param {*} filter Filtro
        */
       function getRejectSamples(token, filter) {
        return $http({
            hideOverlay: true,
            method: 'PATCH',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/order/rejection',
            data: filter
         }).then(function(response) {
            return response;
        });
      }

      /**
        * Activa muestras rechazadas
        *
        * @param {*} token Token de autenticacion
        * @param {*} samples Lista de muestras a activar
        */
       function activeSamples(token, samples) {
        return $http({
            hideOverlay: true,
            method: 'PATCH',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/order/activate',
            data: samples
         }).then(function(response) {
            return response;
        });
      }

      /*Guarda los casetes de las muestras de un caso de patologia*/
      function saveCasetes(token, samples) {
        return $http({
            hideOverlay: true,
            method: 'POST',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/samples/casetes',
            data: samples
        })
        .then(success);

        function success(response) {
            return response;
        }
      }

      /*Obtiene las casos filtrados*/
      function getFilterCases(token, filter) {
        return $http({
            hideOverlay: true,
            method: 'PATCH',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/case/filters',
            data: filter
        })
        .then(success);

        function success(response) {
            return response;
        }
      }

      /*Cambia el estado de un caso*/
      function changeStatus(token, casePat) {
        return $http({
          hideOverlay: true,
          method: 'PUT',
          headers: { 'Authorization': token },
          url: settings.serviceUrl + '/pathology/case/changestatus',
          data: casePat
        })
        .then(success);
        function success(response) {
          return response;
        }
      }

      /**
        * Obtiene un caso por id
        *
        * @param {*} token Token de autenticacion
        * @param {*} id Id del caso
        */
      function getCaseByOrder(token, order) {
        return $http({
            hideOverlay: true,
            method: 'GET',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/case/' + order
        }).then(function(response) {
            return response;
        });
      }

      /*Asigna el patologo a un caso*/
      function assignPathologist(token, casePat) {
        return $http({
            hideOverlay: true,
            method: 'POST',
            headers: { 'Authorization': token },
            url: settings.serviceUrl + '/pathology/case/assignpathologist',
            data: casePat
        })
        .then(success);
        function success(response) {
            return response;
        }
      }
  }
})();
