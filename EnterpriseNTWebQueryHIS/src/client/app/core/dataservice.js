(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', 'settings', 'moment', '$filter'];
  /* @ngInject */
  function dataservice($http, settings, moment, $filter) {
    var service = {
      changeStateTest: changeStateTest,
      getuser: getuser,
      printreport: printreport,
      getUserValidate: getUserValidate,
      getOrderPreliminaryend: getOrderPreliminaryend,
      getConfiguration: getConfiguration,
      getconsulpatient: getconsulpatient,
      getresultexample: getresultexample,
      getKeyConfiguration: getKeyConfiguration,
      getOrderHeader: getOrderHeader,
      getOrderPreliminary: getOrderPreliminary,
      getDemographicsALL: getDemographicsALL,
      getorder: getorder,
      getlistReportFile: getlistReportFile,
      getAgeAsString: getAgeAsString,
      getAge: getAge,

    };

    return service;

    function getuser() {
      return $http.post('/api/user')
        .then(success);

      function success(response) {
        return response;
      }
    }

    function changeStateTest(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/changestatetest',
        data: json
      }).then(function (response) {
        return response;
      });
    }

    function printreport(token, filter) {
      return $http({
        method: 'PATCH',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/reports',
        data: filter
      }).then(function (response) {
        return response;
      });
    }

    function getOrderPreliminaryend(token, json) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/finalReport',
        data: json
      }).then(function (response) {
        return response;
      });
    }

    function getUserValidate(order) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        url: settings.serviceUrl + '/orders/getUserValidate/idOrder/' + order
      }).then(function (response) {
        return response;
      });
    }


    function getConfiguration(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration'
      }).then(function (response) {
        return response;
      });
    }

    function getconsulpatient(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/webQueryHis/getAllTestsForPatientByIdOrderHis/idOrderHis/' + id
      }).then(function (response) {
        return response;
      });
    }

    function getresultexample(token, patientId, idTest) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/webQueryHis/allPacientHistory/idPatient/' + patientId + '/idTest/' + idTest
      }).then(function (response) {
        return response;
      });
    }

    function getKeyConfiguration(token, key) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/configuration/' + key
      }).then(function (response) {
        return response;
      });
    }


    function getOrderHeader(token, json) {
      return $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/reports/orderheader',
        data: json
      }).then(function (response) {
        return response;
      });
    }


    function getOrderPreliminary(token, json) {
      return $http({
        method: 'POST',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/reports/printingreport',
        data: json
      }).then(function (response) {
        return response;
      });
    }

    function getDemographicsALL(token) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/demographics/all'
      }).then(function (response) {
        return response;
      });
    }


    function getorder(token, externalId) {
      return $http({
        method: 'GET',
        headers: {
          'Authorization': token
        },
        url: settings.serviceUrl + '/integration/ingreso/getOrdersByOrderHIS/externalId/' + externalId
      }).then(function (response) {
        return response;
      });
    }


    function getlistReportFile() {
      return $http.post('/api/getlistReportFile')
        .then(success);
      function success(response) {
        return response;
      }
    }

    function getAgeAsString(date, format) {
      var age = getAge(date, format);
      if (age !== '') {
        var ageFields = age.split(".");
        if (Number(ageFields[0]) !== 0) {
          if (Number(ageFields[0]) === 1) {
            //Año
            return ageFields[0] + " " + $filter('translate')('0428');
          } else {
            //Años
            return ageFields[0] + " " + $filter('translate')('0103');
          }
        } else if (Number(ageFields[1]) !== 0) {
          if (Number(ageFields[1]) === 1) {
            //Mes 
            return ageFields[1] + " " + $filter('translate')('0567');
          } else {
            //Meses
            return ageFields[1] + " " + $filter('translate')('0569');
          }
        } else {
          if (Number(ageFields[2]) === 1) {
            //Dia
            return ageFields[2] + " " + $filter('translate')('0568');
          } else {
            //Dias
            return ageFields[2] + " " + $filter('translate')('0476');
          }
        }
      } else {
        return $filter('translate')('0570');
      }
    }

    /**
         * Calcula la edad del paciente
         * @param {*} date Fecha en string
         * @param {*} format Formato en que viene la fecha
         */
    function getAge(date, format) {
      if (!moment(date, format, true).isValid()) {
        return "";
      }
      var birthday = moment(date, format).toDate();
      var current = new Date();
      var diaActual = current.getDate();
      var mesActual = current.getMonth() + 1;
      var anioActual = current.getFullYear();
      var diaInicio = birthday.getDate();
      var mesInicio = birthday.getMonth() + 1;
      var anioInicio = birthday.getFullYear();
      var b = 0;
      var mes = mesInicio;
      if (mes === 2) {
        if ((anioActual % 4 === 0 && anioActual % 100 !== 0) || anioActual % 400 === 0) {
          b = 29;
        } else {
          b = 28;
        }
      } else if (mes <= 7) {
        if (mes === 0) {
          b = 31;
        } else if (mes % 2 === 0) {
          b = 30;
        } else {
          b = 31;
        }
      } else if (mes > 7) {
        if (mes % 2 === 0) {
          b = 31;
        } else {
          b = 30;
        }
      }

      var anios = -1;
      var meses = -1;
      var dies = -1;
      if ((anioInicio > anioActual) || (anioInicio === anioActual && mesInicio > mesActual) ||
        (anioInicio === anioActual && mesInicio === mesActual && diaInicio > diaActual)) {
        return "";
      } else if (mesInicio <= mesActual) {
        anios = anioActual - anioInicio;
        if (diaInicio <= diaActual) {
          meses = mesActual - mesInicio;
          dies = diaActual - diaInicio;
        } else {
          if (mesActual === mesInicio) {
            anios = anios - 1;
          }
          meses = (mesActual - mesInicio - 1 + 12) % 12;
          dies = b - (diaInicio - diaActual);
        }
      } else {
        anios = anioActual - anioInicio - 1;
        if (diaInicio > diaActual) {
          meses = mesActual - mesInicio - 1 + 12;
          dies = b - (diaInicio - diaActual);
        } else {
          meses = mesActual - mesInicio + 12;
          dies = diaActual - diaInicio;
        }
      }
      return (anios < 10 ? "0" + anios : anios) + "." + (meses < 10 ? "0" + meses : meses) + "." + (dies < 10 ? "0" + dies : dies);
    }


  }
})();
