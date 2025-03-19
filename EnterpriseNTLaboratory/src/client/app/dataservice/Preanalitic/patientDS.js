(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('patientDS', patientDS);

  patientDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function patientDS($http, settings) {
    var service = {
      getPatientbyId: getPatientbyId,
      getPatientbyOrder: getPatientbyOrder,
      getPatientbyIddocument: getPatientbyIddocument,
      changePatientOrder: changePatientOrder,
      verifyPatientOrder: verifyPatientOrder,
      getPatientOnlyId: getPatientOnlyId,
      getPatientNumDocument: getPatientNumDocument,
      updatePatient: updatePatient,
      insertPatient: insertPatient,
      insertphotopatient: insertphotopatient,
      getPhotoPatient: getPhotoPatient,
      getPatientObjectByOrder: getPatientObjectByOrder,
      getPatientIdDocumentType: getPatientIdDocumentType,
      getPatientBYDatapatient: getPatientBYDatapatient,
      getPatientbydemographics: getPatientbydemographics
    };

    return service;


    function getPatientOnlyId(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/' + id
      }).then(success);

      function success(response) {
        return response;
      }
    }
    function getPatientbyId(token, patientId) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/patients/filter/patient_id/' + patientId + '/map/demographics'
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getPatientbyIddocument(token, patientId, documenttype) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/patients/filter/patient_id/' +
          patientId + '/documenttype/' + documenttype +
          '/map/demographics'
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getPatientbyOrder(token, order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/patients/filter/order/' + order + '/map/demographics'
      }).then(function (response) {
        return response;
      });
    }

    function changePatientOrder(token, data) {

      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/orders/assign/',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function verifyPatientOrder(token, data) {

      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/orders/assign/verify',
        data: data
      }).then(function (response) {
        return response;
      });
    }


    function getPatientNumDocument(token, numDocument) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/filter/patientId/' + numDocument
      }).then(function (response) {
        return response;
      });
    }


    function insertPatient(token, json) {

      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients',
        data: json
      }).then(function (response) {
        return response;
      });
    }


    function updatePatient(token, json) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients',
        data: json
      }).then(function (response) {
        return response;
      });
    }

    function insertphotopatient(token, data) {

      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/photo',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function getPhotoPatient(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/filter/' + id + '/photo'
      }).then(function (response) {
        return response;
      });
    }

    /**
     * Busca un paciente por numero de orden
     * @param {*} token Token de autenticacion
     * @param {*} order Numero de Orden
     */
    function getPatientObjectByOrder(token, order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/filter/order/' + order
      }).then(function (response) {
        return response;
      });
    }

    function getPatientIdDocumentType(token, patientId, documenttype) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/filter/patientId/' + patientId + '/documentType/' + documenttype
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getPatientBYDatapatient(token, lastName, surName, name1, name2, birthday) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/filter/lastName/' + lastName +
          '/surName/' + surName + '/name1/' + name1 + '/name2/' + name2 +
          '/sex/0/birthday/' + birthday
      }).then(success);

      function success(response) {
        return response;
      }
    }

    function getPatientbydemographics(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/patients/listpatientsbypag',
        data: data
      }).then(function (response) {
        return response;
      });
    }
  }
})();
