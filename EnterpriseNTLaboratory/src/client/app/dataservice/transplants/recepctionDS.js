(function () {
  'use strict';
  angular
    .module('app.core')
    .factory('recepctionDS', recepctionDS);
  recepctionDS.$inject = ['$http', 'settings'];

  /* @ngInject */
  //** Método que define los metodos a usar*/
  function recepctionDS($http, settings) {
    var service = {
      getinsuranceidremission: getinsuranceidremission,
      gethistoricalHLA: gethistoricalHLA,
      gethistoricalPRA: gethistoricalPRA,
      gethistoricalCUAN: gethistoricalCUAN,
      gethistoricalCIEN: gethistoricalCIEN,
      gethistoricalAN: gethistoricalAN,
      newreceiverpatient: newreceiverpatient,
      convertdocumentspdf: convertdocumentspdf,
      newtranplantpatient: newtranplantpatient,
      getreceiverpatient: getreceiverpatient,
      updatereceiverpatient: updatereceiverpatient,
      updateorgan: updateorgan,
      getinsurance: getinsurance,
      getpartaker: getpartaker,
      getinstitution: getinstitution,
      getUserTransplant: getUserTransplant,
      newResultText: newResultText,
      getTesttransplant: getTesttransplant,
      EditResultText: EditResultText,
      deletedtransplant: deletedtransplant,
      updatepartaker: updatepartaker,
      getinstitutionId: getinstitutionId,
      saveReport: saveReport,
      getparticipantsReport:getparticipantsReport,
      getparticipantAll: getparticipantAll
    };
    return service;

    function getinsuranceidremission(token, idpatient) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/remission/' + idpatient
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function gethistoricalHLA(token, idtransplant) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail/historicalReceiverHLAMolecular/' + idtransplant
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function gethistoricalPRA(token, idtransplant) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail/historicalReceiverPRALuminexCualitativo/' + idtransplant
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function gethistoricalCUAN(token, idtransplant) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail/historicalPRALuminexCuantitativo/' + idtransplant
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function gethistoricalAN(token, idtransplant) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail/historicalPRALuminexAntigeno/' + idtransplant
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function gethistoricalCIEN(token, idtransplant) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail/historicaFlowCytometry/' + idtransplant
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function newreceiverpatient(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function getparticipantsReport(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/listreceiver',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function saveReport(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reporttranplant',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function convertdocumentspdf(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/convertdocumentspdf',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function newtranplantpatient(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/tranplant',
        data: data
      }).then(function (response) {
        return response;
      });
    }
    function getreceiverpatient(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/filter',
        data: data
      }).then(function (response) {
        return response;
      });
    }
    function updatereceiverpatient(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/remission',
        data: data
      }).then(function (response) {
        return response;
      });
    }
    function updateorgan(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/organ',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function getUserTransplant(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/users/getUserTransplant'
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getinsurance(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/insurance/listActive'
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getinstitution(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/institution/listActive'
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function getinstitutionId(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/institution/' + id
      })
        .then(success);

      function success(response) {
        return response;
      }
    }
    function newResultText(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function getTesttransplant(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail/' + id,
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function EditResultText(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/detail',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function deletedtransplant(token, id) {
      return $http({
        hideOverlay: true,
        method: 'DELETE',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/transplant/delete/' + id,
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

    function getpartaker(token, data) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/filter/partaker',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function updatepartaker(token, data) {
      return $http({
        hideOverlay: true,
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/partaker',
        data: data
      }).then(function (response) {
        return response;
      });
    }

    function getparticipantAll(token, idorgan) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/receiverpatient/all/' + idorgan
      })
        .then(success);

      function success(response) {
        return response;
      }
    }

  }
})();
