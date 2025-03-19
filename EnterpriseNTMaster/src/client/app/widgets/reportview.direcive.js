/* jshint ignore:start */
(function () {
    'use strict';

    angular
      .module('app.widgets')
      .directive('reportview', reportview);

      reportview.$inject = ['ModalService'];

    /* @ngInject */
    function reportview(ModalService) {
        var directive = {
            templateUrl: 'app/widgets/reportview.html',
            restrict: 'EA',
            scope: {
              openmodal: '=',
              pathreport:'=',
              listreport:'=',
              labelsreport:'=',
              dataname:'=', 
              disabled:'=',
              classbutton: '='

            },

            controller: ['$scope', function ($scope) {
                
                var vm = this;
                vm.createViewer = createViewer;
                vm.createDesigner = createDesigner;
                vm.setReport = setReport;
                vm.classbutton = $scope.classbutton;
             

                $scope.$watch('listreport', function () {                  
                    vm.listreport = $scope.listreport;
                    vm.labelsreport = $scope.labelsreport;
                    vm.pathreport = $scope.pathreport;
                    vm.dataname =  $scope.dataname;
                });

                $scope.$watch('disabled', function () {                  
                    vm.disabled = $scope.disabled;
                });
                
                $scope.$watch('classbutton', function () { 
                    vm.classbutton = $scope.classbutton                  
                });

             function createViewer() {
                  // Specify necessary options for the viewer
                 
                 
                  var options = new Stimulsoft.Viewer.StiViewerOptions();
                  options.height = '100%';
                  options.appearance.scrollbarsMode = true;
                  options.toolbar.showDesignButton = false;
                  options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
                  options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;

                  // Create an instance of the viewer
                  vm.viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false);
                  
                  // Add the design button event
                  vm.viewer.onDesignReport = function (e) {
                    this.visible = false;
                    if (vm.designer == null) vm.createDesigner();
                    vm.designer.visible = true;
                    vm.designer.report = e.report;
                  };
                  
                  vm.viewer.renderHtml('viewerContent');
                }

              function createDesigner() {
                  var options = new Stimulsoft.Designer.StiDesignerOptions();
                  options.appearance.fullScreenMode = true;
                  options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;
                  
                  // Create an instance of the designer
                  vm.designer = new Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false);
                  
                  // Add the exit menu item event
                  vm.designer.onExit = function (e) {
                    this.visible = false;
                    vm.viewer.visible = true;
                  };
                  
                  vm.designer.renderHtml('designerContent');
                }
                
            function setReport(reportObject) {
              // Forcibly show process indicator
              vm.viewer.showProcessIndicator();
              
              // Timeout need for immediate display loading report indicator
              setTimeout(function () {
                var report = new Stimulsoft.Report.StiReport();
          
                report.loadFile(vm.pathreport);


                // Load reports from JSON object
                var jsonData = { 'data'  : [ vm.listreport ],'Labels' : [ vm.labelsreport ]};

                var dataSet = new Stimulsoft.System.Data.DataSet();
                dataSet.readJson(jsonData);

                // Remove all connections from the report template
                report.dictionary.databases.clear();
                // Register DataSet object
                report.regData('Demo', 'Demo', dataSet);
                // Render report with registered data
                report.render();

                vm.viewer.report = report;
              }, 50);
            }
            

              
            }],
            controllerAs: 'report'
        };
        return directive;
    }


})();
/* jshint ignore:end */