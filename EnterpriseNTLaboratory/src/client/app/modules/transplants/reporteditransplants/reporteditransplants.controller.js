/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.reporteditransplants')
        .controller('ReportEdittransplantsController', ReportEdittransplantsController);


    ReportEdittransplantsController.$inject = ['localStorageService', '$scope', 'logger', '$filter', '$state', '$rootScope', 'reportadicional', 'common', 'listreportsfile'];
    function ReportEdittransplantsController(localStorageService, $scope, logger, $filter, $state, $rootScope, reportadicional, common, listreportsfile) {
        var vm = this;
        vm.title = 'reporteditransplants';
        vm.isAuthenticate = isAuthenticate;
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0782');
        vm.modalError = modalError;
        vm.loading = false;
        vm.loadReportDesigner = loadReportDesigner;
        vm.getlistReportFile = getlistReportFile;
        vm.treeReports = treeReports;
        vm.loadingReport = false;
        vm.init = init;
        vm.getDataTree = getDataTree;
        vm.loadDesingnerAndData = loadDesingnerAndData;
        $rootScope.pageview = 3;
        $scope.$on('selection-changed', function (e, node) {
            if (node.path === undefined) {
                vm.options5 == { expandOnClick: false, filter: {} };
                return;
            }
            vm.loadDesingnerAndData(node.pathjson, node.path, node.json, node.filename);

        });
        vm.options5 == { expandOnClick: true, filter: {} };

        function loadDesingnerAndData(pathjson, path, json, nameFile) {
            common.getDataJson(pathjson).then(function (response) {
                var dataJson = response.data;
                if (dataJson === '') {
                    vm.loadReportDesigner(path, null, nameFile);
                    var messageErr = $filter('translate')('0944').replace('@@@@', json);
                    logger.error(messageErr);
                    return;
                }
                if (vm.loadReportDesigner(path, dataJson, nameFile)) {
                    var messageOk = $filter('translate')('0934')
                    logger.success(messageOk);
                }

            }, function (e) {
                vm.loadReportDesigner(path, null);
                var messageErr = $filter('translate')('0936').replace('@@@@', json);
                logger.error(messageErr);
            });
        }
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        function isAuthenticate() {
            vm.loadingReport = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.getlistReportFile(false);
            }
        }
        function treeReports(data) {
            var basicTree = [];
            data.data.forEach(function (value, key) {
                var children = treeorderadd(value.orders)
                var object1 = {
                    displayname: value.displayname,
                    name: value.name,
                    image: 'images/folder.png',
                    children: $filter('orderBy')(children, 'displayname')
                }
                basicTree.push(object1);
            });
            return basicTree;
        }
        function loadReportDesigner(path, jsonData, nameFile) {
            setTimeout(function () {
                // Create a new report instance
                var report = new Stimulsoft.Report.StiReport();
                var dataSet = new Stimulsoft.System.Data.DataSet('Demo');
                // Load JSON data file from specified URL to the DataSet object
                try {
                    dataSet.readJson(jsonData);
                } catch (e) {
                    logger.error($filter('translate')('3629'));
                    return false;
                }

                // Load reports from JSON object
                report.loadFile(path);
                // Remove all connections from the report template
                report.dictionary.databases.clear();
                // Register DataSet object
                report.regData('Demo', 'Demo', dataSet);
                report.render();
                // Assign the report to the viewer
                vm.designer.report = report;
                vm.pathDemos = path;
                path = path.replace('reports.mrt', nameFile);
                vm.designer.onSaveReport = function (e) {
                    var jsonString = e.report.saveToJsonString();
                    e.fileName = nameFile;
                    e.preventDefault = true;


                    var parameters = { 'path': path, 'file': jsonString };
                    reportadicional.uploadFile(parameters).then(function (response) {

                        if (response.status === 200) {
                            if (vm.pathDemos == '/Report/reportsandconsultations/reports/reports.mrt') {
                                vm.getlistReportFile(true);
                            }
                            logger.success($filter('translate')('0989').replace('@@@', nameFile));
                        }
                    }, function (error) {
                        logger.error($filter('translate')('0990').replace('@@@', nameFile));
                    });
                }
                vm.designer.invokeSaveReport(vm.designer.onSaveReport());
                return true;

            }, 50);
        }
        function getlistReportFile(reset) {
            vm.init(reset);
        }
        function init(reset) {
            vm.getDataTree();
            if (!reset) {
                vm.options = new Stimulsoft.Designer.StiDesignerOptions();
                vm.options.appearance.fullScreenMode = true;
                vm.options.appearance.interfaceType = Stimulsoft.Designer.StiInterfaceType.Mouse;
                vm.options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;
                vm.options.appearance.showSaveDialog = true;
                vm.options.appearance.showLocalization = false;
                vm.options.viewerOptions.appearance.fullScreenMode = true;
                vm.options.viewerOptions.appearance.reportDisplayMode = 3;
                vm.options.viewerOptions.reportDesignerMode = true;
                vm.options.viewerOptions.toolbar.autoHide = true;
                vm.options.viewerOptions.toolbar.displayMode = 0;
                vm.options.viewerOptions.toolbar.viewMode = 0;
                vm.options.viewerOptions.toolbar.showCurrentPageControl = false;
                vm.language = [$filter('translate')('0106'), $filter('translate')('0107')]

                Stimulsoft.Base.Localization.StiLocalization.addLocalizationFile('stimulsoft/locales/es.xml', false, vm.language[0]);
                Stimulsoft.Base.Localization.StiLocalization.addLocalizationFile('stimulsoft/locales/en.xml', false, vm.language[1]);

                if ($filter('translate')('0000') === 'esCo') {
                    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile('stimulsoft/locales/es.xml', true, vm.language[0]);
                    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile('stimulsoft/locales/es.xml');
                } else {
                    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile('stimulsoft/locales/en.xml', true, vm.language[1]);
                    Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile('stimulsoft/locales/en.xml');
                }

                // Create an instance of the designer
                vm.designer = new Stimulsoft.Designer.StiDesigner(vm.options, 'StiDesigner', false);
                vm.designer.renderHtml('designerContent');
                vm.designer.visible = true;
            }
        }
        function getDataTree() {
            var dataFileReports = listreportsfile.getListReportsFiletransplants();
            vm.basicTree = dataFileReports;
            vm.loadingReport = false;
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */