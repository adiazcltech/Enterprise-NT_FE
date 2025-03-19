/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.reportedit')
        .controller('ReportEditController', ReportEditController);


    ReportEditController.$inject = ['localStorageService', '$scope', 'logger', '$filter', '$state', '$rootScope', 'demographicDS',
        'demographicsItemDS', 'reportadicional', 'common', 'listreportsfile'];

    function ReportEditController(localStorageService, $scope, logger, $filter, $state, $rootScope, demographicDS,
        demographicsItemDS, reportadicional, common, listreportsfile) {

        var vm = this;
        vm.title = 'ReportEdit';
        vm.isAuthenticate = isAuthenticate;
        var auth = localStorageService.get('Enterprise_NT.authorizationData');
        vm.demographicTitle = localStorageService.get('DemograficoTituloInforme');
        //vm.pathReports = localStorageService.get('RutaReportes');        

        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0782');
        vm.modalError = modalError;
        vm.loading = false;
        $rootScope.helpReference = '06.Tools/reportedit.htm';
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';

        //vm.windowOpenReport = windowOpenReport;
        vm.loadReportDesigner = loadReportDesigner;
        vm.existsReport = existsReport;
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
            if (node.path === '/Report/reportsandconsultations/reports/reports.mrt' && vm.reportsDemographics.length > 2) {
                vm.reportsDemographicsFalse = $filter('filter')(vm.reportsDemographics, { accessreport: false }, true);
                UIkit.modal('#modalReportDemographics').show();
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

        // Función para sacar la vantana del modal error
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }

        function isAuthenticate() {
            //var auth = null
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.getlistReportFile(false);

            }
        }


        //** Método para tratar el arreglo de busqueda para los padres del arbol**//
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

        var viewer = null;
        var designer = null;
        var dataSet = null;

        function loadReportDesigner(path, jsonData, nameFile) {


            setTimeout(function () {
                // Create a new report instance
                var report = new Stimulsoft.Report.StiReport();
                var dataSet = new Stimulsoft.System.Data.DataSet('Demo');
                // Load JSON data file from specified URL to the DataSet object
                try {
                    dataSet.readJson(jsonData);
                } catch (e) {
                    logger.error('Compruebe el nombre o la ruta de acceso de los archivos .mrt o .json');
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

        function getLocName(locShortName) {
            switch (locShortName) {
                case 'en': return vm.language[1];
                case 'es': return vm.language[0];
                default: return null;
            }
        }

        function getlistReportFile(reset) {
            reportadicional.getlistReportFile().then(function (response) {
                if (response.status === 200) {
                    vm.listreports = response.data;
                    vm.init(reset);
                }
                else {
                    vm.listreports = [];
                }
            }, function (error) {
                return false;
            })
        }

        //Función que comprueba la existencia de un archivo en el servidor.
        function existsReport(file) {

            var report = _.filter(vm.listreports, function (o) { return o.name === file });
            return (report.length > 0);

            // if(report.length > 0) return true;
            // else return false;
            // var report = new Stimulsoft.Report.StiReport();
            // report.loadFile(path);

        }

        // Función para inicializar la pagina
        function init(reset) {
            vm.loadingReport = true;
            vm.reportsDemographics = [{ filename: 'reportprintedorders.mrt', accessreport: true, filejson: 'reportprintedorders.json', displayname: $filter('translate')('0383'), subfiles: [] },
            { filename: 'reports.mrt', accessreport: true, filejson: 'reports.json', displayname: $filter('translate')('0938'), subfiles: [] }];
            vm.pathReports = '/Report/reportsandconsultations/reports/';
            var fileName = '';
            var displayName = '';
            var namePrefix = $filter('translate')('0031').replace('s', ' - ');
            demographicDS.getDemographicsALL(auth.authToken).then(function (data) {
                data.data.forEach(function (value, key) {
                    switch (value.id) {
                        case -1: data.data[key].name = $filter('translate')('0085'); break; //Cliente
                        case -2: data.data[key].name = $filter('translate')('0086'); break; //Médico
                        case -3: data.data[key].name = $filter('translate')('0087'); break; //Tarifa
                        case -4: data.data[key].name = $filter('translate')('0088'); break; //Tipo de orden
                        case -5: data.data[key].name = $filter('translate')('0003'); break; //Sede
                        case -6: data.data[key].name = $filter('translate')('0090'); break; //Servicio
                        case -7: data.data[key].name = $filter('translate')('0091'); break; //Raza
                        default: data.data[key].name = data.data[key].name; // Demográfico codificado y no codificado
                    }
                });

                if (parseInt(vm.demographicTitle) !== 0) {
                    vm.nameDemographic = _.filter(data.data, function (v) { return v.id === parseInt(vm.demographicTitle) })[0].name;
                    var dataDemographic = _.filter(data.data, function (v) { return v.id === parseInt(vm.demographicTitle) });
                    if (dataDemographic[0].encoded) {
                        demographicsItemDS.getDemographicsItemsAll(auth.authToken, 0, vm.demographicTitle).then(function (response) {
                            response.data.forEach(function (value2, key2) {
                                fileName = 'reports_' + dataDemographic[0].name + '_' + value2.demographicItem.code + '.mrt';
                                displayName = namePrefix + dataDemographic[0].name + ': ' + value2.demographicItem.name;
                                vm.reportsDemographics.push({ filename: fileName, accessreport: vm.existsReport(fileName), filejson: 'reports.json', displayname: displayName, subfiles: [] });
                            });
                            vm.getDataTree();
                        });
                    } else {
                        fileName = 'reports_' + dataDemographic[0].name + '.mrt';
                        displayName = namePrefix + dataDemographic[0].name;
                        vm.reportsDemographics.push({ filename: fileName, accessreport: vm.existsReport(fileName), filejson: 'reports.json', displayname: displayName, subfiles: [] });
                        vm.getDataTree();
                    }

                } else {
                    vm.getDataTree();
                }
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


            }, function (error) {
                vm.modalError();
            });

        }

        function getDataTree() {
            var dataFileReports = listreportsfile.getListReportsFile(true, vm.reportsDemographics);
            var dataTree = [];
            dataFileReports.forEach(function (dir, key1) {
                var json_sub = [];
                dir.children.forEach(function (subdir, key2) {
                    var json_file = [];
                    subdir.children.forEach(function (file) {
                        var json_subfile = [];
                        if (file.subfiles.length > 0) {
                            file.subfiles.forEach(function (subfile) {
                                if (vm.existsReport(subfile.filename)) {
                                    json_subfile.push({ 'name': subfile.displayname, 'filename': subfile.filename, 'image': subfile.image, 'path': subfile.path, 'accessreport': subfile.accessreport, 'pathjson': subfile.pathjson, 'json': subfile.filejson });
                                }
                            });
                            json_file.push({ 'name': file.displayname, 'filename': file.filename, 'image': file.image, 'path': file.path, 'accessreport': file.accessreport, 'pathjson': file.pathjson, 'json': file.filejson, 'children': json_subfile });
                        } else {
                            if (vm.existsReport(file.filename)) { //|| subdir.subdirname === 'reviewofresult' 
                                json_file.push({ 'name': file.displayname, 'filename': file.filename, 'image': file.image, 'path': file.path, 'accessreport': file.accessreport, 'pathjson': file.pathjson, 'json': file.filejson, 'children': [] });
                            }
                        }

                    });
                    if (json_file.length > 0) {
                        json_sub.push({ 'name': subdir.displayname, 'filename': subdir.subdirname, 'image': subdir.image, 'children': json_file });
                    }
                });
                if (json_sub.length > 0) {
                    dataTree.push({ 'name': dir.displayname, 'filename': dir.dirname, 'image': dir.image, 'children': json_sub });
                }
            });
            vm.basicTree = dataTree;
            vm.loadingReport = false;
        }

        vm.isAuthenticate();


    }
})();
/* jshint ignore:end */