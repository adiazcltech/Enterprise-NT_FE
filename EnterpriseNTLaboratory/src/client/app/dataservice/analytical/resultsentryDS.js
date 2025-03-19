(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('resultsentryDS', resultsentryDS);

  resultsentryDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function resultsentryDS($http, settings) {
    var service = {
      getsampletrackings: getsampletrackings,
      sendemailupdate: sendemailupdate,
      assignformulavalue: assignformulavalue,
      getOrdersByFilter: getOrdersByFilter,
      getTestByOrderId: getTestByOrderId,
      getTesConsult: getTesConsult,
      getDetailByOrderId: getDetailByOrderId,
      updatereference: updatereference,
      updateTest: updateTest,
      getResultStatistic: getResultStatistic,
      updateComment: updateComment,
      getDocuments: getDocuments,
      saveDocument: saveDocument,
      deleteDocument: deleteDocument,
      getResultsHistory: getResultsHistory,
      validateTestsAlarms: validateTestsAlarms,
      validateTests: validateTests,
      getAddRemove: getAddRemove,
      getLiterals: getLiterals,
      blockTest: blockTest,
      getobservations: getobservations,
      saveobservations: saveobservations,
      getinternalcomment: getinternalcomment,
      saveinternalcomment: saveinternalcomment,
      getinformationtestorder: getinformationtestorder,
      getPanicSurvey: getPanicSurvey,
      getOrderGrouping: getOrderGrouping,
      getresults: getresults,
      changuestateprint: changuestateprint,
      getTypeInterview: getTypeInterview,
      getInterviewPanic: getInterviewPanic
    };

    return service;

    //** Obtiene el detalle de una orden */
    function getsampletrackings(token, order, sample) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/sampletrackings/verify/destination/order/' + order + '/sample/' + sample,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Obtiene el detalle de una orden */
    function sendemailupdate(token, order) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/reports/validOrderComplete/' + order,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    function changuestateprint(token, filter) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/print',
        data: filter,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }


    function assignformulavalue(token, filter) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/order/assignformulavalue',
        data: filter,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Obtiene el listado de órdenes */
    function getOrdersByFilter(token, filter) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/orders',
        data: filter,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Obtiene los exámenes de una orden */
    function getTestByOrderId(token, order) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/orders/tests',
        data: order,
        hideOverlay: true
      })

        .then(function (response) {
          console.log("response " + response);
          return response;
        });
    }

    //** Obtiene los exámenes de una orden */
    function getTesConsult(token, order) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/orders/tests',
        data: order,
        hideOverlay: true
      })

        .then(function (response) {
          console.log("response " + response);
          return response;
        });
    }


    //** Obtiene el detalle de una orden */
    function getDetailByOrderId(token, orderId) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/orders/detail/' + orderId,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }


    //** Obtiene el detalle de una orden */
    function updatereference(token, idOrder) {
      return $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/updateReferenceValues/idOrder/' + idOrder,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    //** Actualiza el estado de un examen */
    function updateTest(token, Test) {
      return $http({
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results',
        data: Test,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    //** Obtiene las estadísticas según el filtro */
    function getResultStatistic(token, filter) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/orders/statistics',
        data: filter,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Obtiene el detalle de una orden */
    function updateComment(token, orderDetail) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/orders/detail',
        data: orderDetail,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Obtiene los documentos de un examen */
    function getDocuments(token, orderId, testId) {
      return $http({
        method: 'GET',
        headers: { 'Authorization':'Bearer '+ token },
        url: settings.serviceUrlApi + '/documents/order/' + orderId + (testId > 0 ? '/test/' + testId : ''),
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    //** Guarda un documento */
    function saveDocument(token, attach) {
      return $http({
        method: 'POST',
        headers: { 'Authorization':'Bearer '+ token },
        url: settings.serviceUrlApi + '/documents',
        data: attach,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Elimina un documento */
    function deleteDocument(token, attach) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization':'Bearer '+ token },
        url: settings.serviceUrlApi + '/documents',
        data: attach,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Consulta el histórico de resultados de un examen */
    function getResultsHistory(token, patient) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/history',
        data: patient,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    //** Consulta las adventencias de validación para los exámenes indicados */
    function validateTestsAlarms(token, tests) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/order/validate/alarms',
        data: tests,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    //** Realiza la validación de los exámenes indicados */
    function validateTests(token, tests) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/order/validate',
        data: tests,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    //* Inserta y/o elimina exámenes de una orden desde el registro de resultados */
    function getAddRemove(token, json, type) {
      return $http({
        method: 'PUT',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/tests/addremove/type/' + type,
        data: json,
        hideOverlay: true
      }).then(function (response) {
        return response;
      });
    }

    //* Obtiene los resultados literales de todos los exámenes para el registro de resultados */
    function getLiterals(token) {
      return $http({
        method: 'GET',
        hideOverlay: true,
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/literalresults/resultsentry'
      }).then(function (response) {
        return response;
      });
    }

    //* Obtiene los resultados literales de todos los exámenes para el registro de resultados */
    function getInterviewPanic(token, order, test) {
      return $http({
        method: 'GET',
        hideOverlay: true,
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/checkresults/panicinterview/' + order + '/' + test
      }).then(function (response) {
        return response;
      });
    }

    //** Bloquea o desbloquea un examen */
    function blockTest(token, blockedTest) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/blocked',
        data: blockedTest,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }
    function getinternalcomment(token, order, test) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        hideOverlay: true,
        url: settings.serviceUrl + '/results/internalcomment/order/' + order + '/test/' + test
      })
        .then(function (response) {
          return response;
        });
    }

    function getobservations(token, order) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        hideOverlay: true,
        url: settings.serviceUrl + '/results/observations/order/' + order
      })
        .then(function (response) {
          return response;
        });
    }
    //**Guarda el comentario de un examen */
    function saveinternalcomment(token, comment) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/saveinternalcomment',
        data: comment,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    //**Guarda el comentario de un examen */
    function saveobservations(token, comment) {
      return $http({
        method: 'PATCH',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/saveobservations',
        data: comment,
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getinformationtestorder(token, order, test) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        hideOverlay: true,
        url: settings.serviceUrl + '/results/information/order/' + order + '/test/' + test
      })
        .then(function (response) {
          return response;
        });
    }

    function getPanicSurvey(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/survey',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    function getOrderGrouping(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/ordergrouping',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }

    //** Obtiene el listado de órdenes */
    function getresults(token, order) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/getresults/' + order,
        hideOverlay: true
      })

        .then(function (response) {
          return response;
        });
    }

    function getTypeInterview(token) {
      return $http({
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/results/survey/tests',
        hideOverlay: true
      })
        .then(function (response) {
          return response;
        });
    }
  }
})();
