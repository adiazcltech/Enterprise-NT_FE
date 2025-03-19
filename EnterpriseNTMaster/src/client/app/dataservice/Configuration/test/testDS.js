(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('testDS', testDS);

  testDS.$inject = ['$http','settings'];
  /* @ngInject */

  function testDS($http,settings) {
    var service = {
      getTest: getTest,
      getprofiles:getprofiles,
      getTestById: getTestById,
      getTestActive: getTestActive,
      getTestName: getTestName,
      getTestCode: getTestCode,
      getTestAbbr: getTestAbbr,
      getTestArea: getTestArea,
      updateTest: updateTest,
      insertTest: insertTest,
      insertTestLaboratory:insertTestLaboratory,
      getTestTypeResult: getTestTypeResult,
      getTestConcurrences: getTestConcurrences,
      getTestLaboratoryBranch: getTestLaboratoryBranch,
      getConcurrence: getConcurrence,
      getTestFormula: getTestFormula,
      updatePrintOrder: updatePrintOrder,
      updateProcessingDay:updateProcessingDay,
      updateTestEdition:updateTestEdition,
      getTestmicrobiology:getTestmicrobiology,
      updateTax: updateTax,
      insertTestAlarm: insertTestAlarm,
      getTestReference: getTestReference,
      getPathology: getPathology
    };

    return service;

    function getTest(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests'
          });

      return promise.success(function (response, status) {
        return response;
      });

    }
   //Obtiene los perfiles y paquetes de la aplicacion con sus examenes
    function getprofiles(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/profiles'
          });

      return promise.success(function (response, status) {
        return response;
      });

    }


    function getTestActive(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/filter/state/true'
          });

      return promise.success(function (response, status) {
        return response;
      });

    }

    function getTestName(token, name) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/filter/name/' + name
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getTestCode(token, code) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/filter/code/' + code
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getTestAbbr(token, abbr) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/filter/abbr/' + abbr
          });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function getTestArea(token,type,state,area) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/filter/type/'+type+'/state/'+state+'/area/'+ area
          });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function getTestById(token,id) {
      var promise = $http({
        method: 'GET',
        headers: {'Authorization': token},
        url: settings.serviceUrl   + '/tests/' + id
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateTest(token,test) {

      var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests',
              data: test
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function insertTest(token,test) {

      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests',
              data: test
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function insertTestLaboratory(token,testLaboratory) {

      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/laboratory',
              data: testLaboratory
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function updatePrintOrder(token, printOrder){
      var promise = $http({
            method: 'PUT',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/tests/printorder',
            data: printOrder
      });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateProcessingDay (token, processingDay){
      var promise = $http({
            method: 'PUT',
            headers: {'Authorization': token},
            url: settings.serviceUrl  + '/tests/processingdays',
            data: processingDay
      });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function getTestTypeResult(token, type,state,area,processingby) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/filter/resulttype/'+type+'/state/'+state+/area/+area+/processingby/+processingby
          });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function getTestConcurrences(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/concurrence/typetest/0'
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getTestLaboratoryBranch(token,laboratory, branch) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/laboratory/'+ laboratory +'/branch/'+ branch
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getConcurrence(token){
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/concurrence'
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getTestFormula(token, idTest){
       var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/filter/test/'+ idTest
          });

      return promise.success(function (response, status) {
        return response;
      });
    }


    function updateTestEdition(token,testEdit) {
      var promise = $http({
              method: 'PATCH',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests',
              data: testEdit
          });

      return promise.success(function (response, status) {
        return response;
      });
    }
    // metodo para consultar las pruebas que tienen muestras de mmicroobiologia
       function getTestmicrobiology(token){
       var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/microbiology'
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function updateTax(token,testEdit){
      var promise = $http({
              method: 'PUT',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/tax',
              data: testEdit
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function insertTestAlarm(token, testalarm) {
      var promise = $http({
              method: 'POST',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/testalarm',
              data: testalarm
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getTestReference(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/referencevalues/tests'
          });

      return promise.success(function (response, status) {
        return response;
      });
    }

    function getPathology(token) {
      var promise = $http({
              method: 'GET',
              headers: {'Authorization': token},
              url: settings.serviceUrl  + '/tests/pathology'
          });

      return promise.success(function (response, status) {
        return response;
      });

    }

  }
})();
