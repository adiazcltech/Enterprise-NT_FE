(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('testDS', testDS);

  testDS.$inject = ['$http', 'settings'];
  /* @ngInject */

  function testDS($http, settings) {
    var service = {
      getTest: getTest,
      getgroups:getgroups,
      getTestById: getTestById,
      getTestByIdType: getTestByIdType,
      getTestActive: getTestActive,
      getTestName: getTestName,
      getTestCode: getTestCode,
      getTestAbbr: getTestAbbr,
      getTestArea: getTestArea,
      getTestTypeResult: getTestTypeResult,
      getTestConcurrences: getTestConcurrences,
      getTestLaboratoryBranch: getTestLaboratoryBranch,
      getConcurrence: getConcurrence,
      getTestFormula: getTestFormula,
      getTestmicrobiology: getTestmicrobiology,
      getTestConfidential: getTestConfidential,
      getRequirements: getRequirements,
      getProfileChilds: getProfileChilds,
      insertquote: insertquote,
      getquotebyname: getquotebyname,
      getquotebydate: getquotebydate
    };

    return service;

    function getTest(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests'
      }).then(function (response) {
        return response;
      });

    }

    
    function getgroups(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/groups/tests'
      }).then(function (response) {
        return response;
      });

    }

    function getTestByIdType(token, test, type) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/informationbyid/' + test + '/' + type
      }).then(function (response) {
        return response;
      });

    }

    function getTestActive(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/state/true'
      }).then(function (response) {
        return response;
      });

    }

    function getTestName(token, name) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/name/' + name
      }).then(function (response) {
        return response;
      });
    }

    function getTestCode(token, code) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/code/' + code
      }).then(function (response) {
        return response;
      });
    }

    function getTestAbbr(token, abbr) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/abbr/' + abbr
      }).then(function (response) {
        return response;
      });
    }


    function getTestArea(token, type, state, area) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/type/' + type + '/state/' +
          state + '/area/' + area
      })
        .then(function (response) {
          return response;
        });
    }


    function getTestById(token, id) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/' + id
      }).then(function (response) {
        return response;
      });
    }



    function getTestTypeResult(token, type, state, area, processingby) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/resulttype/' + type + '/state/' +
          state + /area/ + area + /processingby/ + processingby
      }).then(function (response) {
        return response;
      });
    }


    function getTestConcurrences(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/concurrence/typetest/0'
      }).then(function (response) {
        return response;
      });
    }

    function getTestLaboratoryBranch(token, laboratory, branch) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/laboratory/' + laboratory + '/branch/' + branch
      }).then(function (response) {
        return response;
      });
    }

    function getConcurrence(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/concurrence'
      }).then(function (response) {
        return response;
      });
    }

    function getTestFormula(token, idTest) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/test/' + idTest
      }).then(function (response) {
        return response;
      });
    }

    // metodo para consultar las pruebas que tienen muestras de mmicroobiologia
    function getTestmicrobiology(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/microbiology'
      }).then(function (response) {
        return response;
      });
    }

    function getTestConfidential(token) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/filter/confidentials'
      }).then(function (response) {
        return response;
      });
    }

    /**
     * Obtiene los requerimientos asociados los examenes enviados
     * @param {*} token Token de autenticacion 
     * @param {*} testAsJson Json de los examenes solo es requerido el campo id
     */
    function getRequirements(token, testAsJson) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/requirements',
        data: testAsJson
      }).then(function (response) {
        return response;
      });
    }

    /**
     * Obtiene los hijos de un paquete o perfil
     * @param {*} token Token de autenticacion
     * @param {*} idProfile Id del perfil o paquete
     */
    function getProfileChilds(token, idProfile) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/tests/childs/' + idProfile
      }).then(function (response) {
        return response;
      });
    }

    function insertquote(token, quote) {
      return $http({
        hideOverlay: true,
        method: 'POST',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/quotation/quotation',
        data: quote
      }).then(function (response) {
        return response;
      });
    }

    function getquotebyname(token, name) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/quotation/quotation/filter/name/' + name
      }).then(function (response) {
        return response;
      });
    }

    function getquotebydate(token, init, end) {
      return $http({
        hideOverlay: true,
        method: 'GET',
        headers: { 'Authorization': token },
        url: settings.serviceUrl + '/quotation/quotation/init/' + init + '/end/' + end
      }).then(function (response) {
        return response;
      });
    }
  }
})();
