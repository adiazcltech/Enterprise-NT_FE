/* jshint ignore:start */
(function () {
  "use strict";

  angular.module("app.core").factory("appointmentDS", appointmentDS);

  appointmentDS.$inject = ["$http", "settings"];
  /* @ngInject */

  function appointmentDS($http, settings) {
    var service = {
      getavailability: getavailability,
      getByEntryDate: getByEntryDate,
      getByOrder: getByOrder,
      getByPatientIdWithDoc: getByPatientIdWithDoc,
      getByPatientInfo: getByPatientInfo,
      getAppointment: getAppointment,
      getshift: getshift,
      getappointment: getappointment,
      appointmentconcurrence: appointmentconcurrence,
      updateAppointment: updateAppointment,
      cancelAppointment: cancelAppointment,
      changeappointment: changeappointment,
      reprogramappointment: reprogramappointment,
      deleteconcurrencebyId: deleteconcurrencebyId,
      getsendemail: getsendemail,
      getuseravailable: getuseravailable,
      NumberOfAssignedPeople:NumberOfAssignedPeople
    };

    return service;

    /*  servicio para el control de la fecha  */
    function getavailability(token, branch, init, quantity) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: {
          Authorization: token,
        },
        url:
          settings.serviceUrl +
          "/appointments/availability/branch/" +
          branch +
          "/range/" +
          init +
          "/" +
          quantity,
      }).then(function (response) {
        return response;
      });
    }

    /*  servicio para el control de la fecha  */
    function getshift(token) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: {
          Authorization: token,
        },
        url: settings.serviceUrl + "/shifts",
      }).then(function (response) {
        return response;
      });
    }

    /*  servicio para cargar las jornadas de una sede */
    function getappointment(token, branch, date, day) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/appointments/branch/" +
          branch +
          "/date/" +
          date +
          "/day/" +
          day,
      }).then(function (response) {
        return response;
      });
    }

    /*  servicio para cargar las jornadas de una sede */
    function appointmentconcurrence(token, json) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments/concurrences",
        data: json,
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
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/appointments/filter/entryDate/" +
          entryDate +
          "/" +
          branch,
      }).then(function (response) {
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
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/appointments/filter/order/" +
          order +
          "/" +
          branch,
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
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/appointments/filter/patientId/" +
          patientId +
          "/documentType/" +
          docType +
          "/" +
          branch,
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
        method: "GET",
        headers: { Authorization: token },
        url:
          settings.serviceUrl +
          "/appointments/filter/info/" +
          lastName.toUpperCase().trim() +
          "/" +
          surName.toUpperCase().trim() +
          "/" +
          name1.toUpperCase().trim() +
          "/" +
          name2.toUpperCase().trim() +
          "/" +
          branch,
      }).then(function (response) {
        return response;
      });
    }

    function getAppointment(token, order) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments/" + order,
      }).then(function (response) {
        return response;
      });
    }

    function updateAppointment(token, json) {
      return $http({
        hideOverlay: true,
        method: "PUT",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments",
        data: json,
      }).then(function (response) {
        return response;
      });
    }

    function cancelAppointment(token, json) {
      return $http({
        hideOverlay: true,
        method: "PUT",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments/cancel",
        data: json,
      }).then(function (response) {
        return response;
      });
    }

    //** Método que reprograma una cita
    function reprogramappointment(token, appoinment) {
      return $http({
        method: "PUT",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments/reprogram",
        data: appoinment,
      }).then(function (response) {
        return response;
      });
    }

    //** Método que crea las concurrencias*//
    function deleteconcurrencebyId(token, id) {
      return $http({
        method: "DELETE",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments/concurrences/id/" + id,
      }).then(function (response) {
        return response;
      });
    }

    function changeappointment(token, json) {
      return $http({
        hideOverlay: true,
        method: "PUT",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments/changeappointment",
        data: json,
      }).then(function (response) {
        return response;
      });
    }

    function NumberOfAssignedPeople(token, json) {
      return $http({
        hideOverlay: true,
        method: "PUT",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/samplingSites/updateNumberOfAssignedPeople",
        data: json,
      }).then(function (response) {
        return response;
      });
    }

    function getsendemail(token, email) {
      return $http({
        hideOverlay: true,
        method: "POST",
        headers: { Authorization: token },
        url: settings.serviceUrl + "/appointments/email",
        data: email,
      }).then(success);
      function success(response) {
        return response;
      }
    }

    /*  servicio para el control de la fecha  */
    function getuseravailable(token) {
      return $http({
        hideOverlay: true,
        method: "GET",
        headers: {
          Authorization: token,
        },
        url: settings.serviceUrl + "/samplingSites/samplingSitesDisponible",
      }).then(function (response) {
        return response;
      });
    }
  }
})();
/* jshint ignore:end */