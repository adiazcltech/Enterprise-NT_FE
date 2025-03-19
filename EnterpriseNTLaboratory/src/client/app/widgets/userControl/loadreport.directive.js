/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   pathreport  @descripción
                datareport  @descripción
                variables   @descripción
                openmodal   @descripción
                orientatio  @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/reviewofresults/reviewofresults.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/post-analitic/worklist/worklist.html
  3.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/activationorder/activationorder.html
  4.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/listed/listed.html
  5.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/controldeliveryreports/controldeliveryreports.html
  6.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/patientconsultation/patientconsultation.html
  7.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/queries/queries.html
  8.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/reportsandconsultations/reports/reports.html
  9.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/destinationsample/destinationsample.html
  10.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/earlywarning/earlywarning.html
  11.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/histogram/histogram.html
  12.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/indicators/indicators.html
  13.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/indicators/indicators.html
  14.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/specialstadistics/specialstadistics.html
  15.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/stadistics/statisticswithprices/statisticswithprices.html
  16.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/tools/traceability/traceability.html

  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...
********************************************************************************/
/* jshint ignore:start */
(function () {
  'use strict';
  angular
    .module('app.widgets')
    .directive('loadreport', loadreport);
  loadreport.$inject = ['$translate', 'localStorageService', 'keyStimulsoft'];
  /* @ngInject */
  function loadreport($translate, localStorageService, keyStimulsoft) {
    var directive = {
      templateUrl: 'app/widgets/userControl/loadreport.html',
      restrict: 'EA',
      scope: {
        pathreport: '=pathreport',
        datareport: '=datareport',
        variables: '=variables',
        openmodal: '=?openmodal',
        orientation: '=orientation'
      },
      controller: ['$scope', function ($scope) {
        var vm = this;
        vm.labelsreport = JSON.stringify($translate.getTranslationTable());
        vm.labelsreport = JSON.parse(vm.labelsreport);
        vm.createViewer = createViewer;
        vm.setReport = setReport;
        vm.datareport = [];
        vm.entity = localStorageService.get('Entidad');
        vm.abbreviation = localStorageService.get('Abreviatura');


        $scope.$watch('openmodal', function () {
          if ($scope.openmodal) {
            vm.datareport = $scope.datareport;
            vm.pathreport = $scope.pathreport;
            vm.variables = $scope.variables;
            vm.orientation = $scope.orientation === undefined ? 'vertical' : $scope.orientation.toLowerCase();
            if (vm.datareport !== undefined) {
              if (vm.datareport.length > 0) {
                vm.createViewer();

              } else {
                UIkit.modal('#modalReportError').show();
              }
              $scope.pathreport = '';
            }
            $scope.openmodal = false;
          }


        });

        function createViewer() {
          // Specify necessary options for the viewers
          Stimulsoft.Base.StiLicense.key = keyStimulsoft;
          var options = new Stimulsoft.Viewer.StiViewerOptions();
          options.height = '100%';
          options.appearance.scrollbarsMode = true;
          options.toolbar.showDesignButton = false;
          options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
          options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;

          // Create an instance of the viewer
          vm.viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);

          vm.setReport();
          vm.viewer.renderHtml('viewerContent');


        }


        function setReport(reportObject) {
          // Forcibly show process indicator
          vm.viewer.showProcessIndicator();
          vm.variables.entity = vm.entity;
          vm.variables.abbreviation = vm.abbreviation;
          // Timeout need for immediate display loading report indicator
          setTimeout(function () {
            var report = new Stimulsoft.Report.StiReport();

            report.loadFile(vm.pathreport);

            // Load reports from JSON object
            var jsonData = {
              'data': [vm.datareport],
              'Labels': [vm.labelsreport],
              'variables': [vm.variables]
            };

            var dataSet = new Stimulsoft.System.Data.DataSet();
            dataSet.readJson(jsonData);

            // Remove all connections from the report template
            report.dictionary.databases.clear();
            // Register DataSet object
            report.regData('Demo', 'Demo', dataSet);
            // Render report with registered data
            report.render();


            vm.viewer.report = report;

            UIkit.modal('#modalReport').show();

          }, 50);
        }

      }],
      controllerAs: 'loadreport'
    };
    return directive;
  }


})();
/* jshint ignore:end */
