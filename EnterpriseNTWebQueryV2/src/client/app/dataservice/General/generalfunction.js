(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('generalfunctionDS', generalfunctionDS);

  generalfunctionDS.$inject = ['$http', '$q', '$filter', 'exception', 'logger','settings','moment', '$translate'];
  /* @ngInject */

  //** Método que define los metodos a usar*/
  function generalfunctionDS($http, $q, $filter, exception, logger,settings, moment, $translate) {
   
    var parameterReport = {};

    var service = {
      sendEmail: sendEmail, 
      saveReportPdfAll: saveReportPdfAll
    };

    return service; 
  
    //** Método que envia mails con archivo pdf adjunto*/
    function sendEmail(parameterEmail) {
      return $http.post('/api/sendEmail', parameterEmail)
      .then(success)

      function success(response) {
        return response.data;
      }  
    }

      //Descarga todos los archivos PDF en un zip
    function saveReportPdfAll(listReport) {
        var zip = new JSZip();
        // Load reports from JSON object
        listReport.forEach(function (value) {
            if (value.nameReport == "Resumen") {
                zip.file(value.nameReport + ".xlsx", value.buffer, { binary: true });
            } else {
                zip.file(value.nameReport + ".pdf", value.buffer, { binary: true });
            }
        });
        var nameZip = "Órdenes " + '[' + listReport.length.toString() + '].zip';
        zip.generateAsync({type:"blob"})
        .then(function(content) {
       
            download(content, nameZip);
        });
    }
  }
})();
