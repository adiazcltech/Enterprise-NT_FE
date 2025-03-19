
/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.audituser')
        .controller('AudituserController', AudituserController);


    AudituserController.$inject = ['LZString', '$translate', 'localStorageService',
        '$filter', '$state', 'moment', '$rootScope', 'userDS', 'auditsorderDS', 'listaudit'];

    function AudituserController(LZString, $translate, localStorageService,
        $filter, $state, moment, $rootScope, userDS, auditsorderDS, listaudit) {

        var vm = this;
        vm.title = 'Audituser';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0928');
        $rootScope.helpReference = '07.Audit/audituser.htm';
        vm.report = false;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.modalError = modalError;
        vm.search = search;
        vm.windowOpenReport = windowOpenReport;
        vm.generateFileorder = generateFileorder;
        vm.rangeInit = moment().format();
        vm.rangeEnd = moment().format();
        vm.listuser = listuser;
        vm.listdata = listdata;
        vm.datachangeaudit = datachangeaudit;
        vm.formatDate = 'dd/MM/yyyy, HH:mm:ss';
        vm.max = moment().format();
        vm.maxend = moment().format();
        vm.min = moment().format();
        vm.startDate = moment().format();
        vm.endDate = moment().format();
        vm.tomorrow = new Date();
        vm.tomorrow.setDate(vm.tomorrow.getDate() - 7);
        vm.startChange = startChange;
        $rootScope.pageview = 3;
        vm.endChange = endChange;
        function listdata() {
            vm.auditmasterlist = listaudit.add(vm.data);
            vm.generateFileorder();
        }
        function startChange() {
            if (vm.startDate) {
                vm.startDate = new Date(vm.startDate);
                vm.startDate.setDate(vm.startDate.getDate());
                vm.min = vm.startDate;
            } else if (vm.endDate) {
                vm.max = new Date(vm.endDate);
                vm.startDate = new Date(vm.endDate);
            } else {
                vm.endDate = new Date();
                vm.startDate = new Date();
                vm.max = vm.endDate;
                vm.min = vm.endDate;
            }
        }
        function endChange() {
            if (vm.endDate) {
                vm.endDate = new Date(vm.endDate);
                vm.endDate.setDate(vm.endDate.getDate());
                vm.max = vm.endDate;
            } else if (vm.startDate) {
                vm.min = new Date(vm.startDate);
                vm.endDate = new Date(vm.startDate);

            } else {
                vm.endDate = new Date();
                vm.startDate = new Date();
                vm.max = vm.endDate;
                vm.min = vm.endDate;
            }
        }
        function generateFileorder() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.variables = {
                'user': vm.list.name,
                'date': moment().format('DD/MM/YYYY, HH:mm:ss'),
                'username': auth.userName
            };
            vm.datareport = [
                {
                    'auditmaster': vm.auditmasterlist,
                    'auditorder': vm.auditorderactive,
                    'auditdemographic': vm.auditdemographic,
                    'audittest': vm.audittest,
                    'auditsample': vm.auditsample
                }
            ];

            vm.pathreport = '/Report/audit/audituser/audituser.mrt';
            vm.openreport = false;
            vm.report = false;
            vm.windowOpenReport();
        }
        function windowOpenReport() {
            if (vm.auditmasterlist.length > 0 || vm.auditdemographic.length > 0 ||
                vm.audittest.length > 0 || vm.auditsample.length > 0) {
                var parameterReport = {};
                parameterReport.variables = vm.variables;
                parameterReport.pathreport = vm.pathreport;
                parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
                var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
                localStorageService.set('parameterReport', parameterReport);
                localStorageService.set('dataReport', datareport);
                window.open('/viewreport/viewreport.html');
            } else {
                UIkit.modal('#modalReportError').show();
            }
        }
        function search() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.loadingdata = true;
            vm.auditmasterlist = [];
            vm.auditdemographic = [];
            vm.auditorderactive = [];
            vm.audittest = [];
            vm.auditsample = [];
            return auditsorderDS.getaudituser(auth.authToken, moment(vm.startDate).format('YYYYMMDD HH:mm:ss'), moment(vm.endDate).format('YYYYMMDD HH:mm:ss'), vm.list.id).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.data = data.data;
                    vm.datachangeaudit();
                } else {
                    UIkit.modal('#nofoundfilter').show();
                }
            },
                function (error) {
                    vm.modalError(error);
                });
        }
        function datachangeaudit() {
            var listinformationtest = [];
            var listinformationsample = [];
            var listinformationorder = [];
            var listinformationpacient = [];
            if (vm.data.length !== 0) {
                vm.datachange = $filter('orderBy')(vm.data, 'date');
                vm.datachange.forEach(function (value, key) {
                    //trazabilidad de la prueba
                    if (value.fieldType === 'T' && value.testType === 0 || value.fieldType === 'BK' && value.testType === 0 ||
                        value.fieldType === 'RT' && value.testType === 0 || value.fieldType === 'MD' && value.testType === 0 || value.fieldType === 'RC' && value.testType === 0) {
                        if (value.information === '0') {
                            var test = {
                                "id": value.id,
                                "abbreviation": "",
                                "name": value.fieldDescription,
                                "order": value.order,
                                "action": [
                                    {
                                        "name": $filter('translate')('1014'),
                                        "result": "",
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment
                                    }
                                ]
                            }
                            listinformationtest.push(test);
                        } else {
                            var test = $filter("filter")(listinformationtest, function (e) {
                                return e.id === value.id;
                            })

                            if (test.length > 0) {
                                if (value.fieldType === "RC") {
                                    var statetest = {
                                        "name": "Comentario del resultado",
                                        "resultemplate": value.information,
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "order": value.order,
                                        "comment": value.comment
                                    }
                                    test[0].action.push(statetest);

                                } else if (value.fieldType === "RT") {

                                    var statetest = {
                                        "name": 'Ingreso platilla de resultados',
                                        "resultemplate": JSON.parse(value.information),
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "order": value.order,
                                        "comment": value.comment
                                    }
                                    test[0].action.push(statetest);

                                } else if (value.fieldType === "MD") {
                                    var MD = JSON.parse(value.information);
                                    if (MD[0].id === undefined) {
                                        var statetest = {
                                            "name": 'Antibiograma-ingreso microorganismo',
                                            "sensitive": MD,
                                            "order": value.order,
                                            "date": moment(value.date).format(vm.formatDateHours),
                                            "user": value.username,
                                            "comment": value.comment
                                        }
                                        test[0].action.push(statetest);
                                    } else {
                                        var statetest = {
                                            "name": 'Antibiograma-Ingreso antibiótico',
                                            "sensitive": MD,
                                            "order": value.order,
                                            "date": moment(value.date).format(vm.formatDateHours),
                                            "user": value.username,
                                            "comment": value.comment
                                        }
                                        test[0].action.push(statetest);
                                    }
                                } else if (value.fieldType === "MDC") {
                                    var statetest = {
                                        "name": 'Comentario del antibigrama',
                                        "sensitive": value.information,
                                        "order": value.order,
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment
                                    }
                                    test[0].action.push(statetest);

                                } else if (value.action === "D") {
                                    var statetest = {
                                        "name": $filter('translate')('0954'),
                                        "result": "",
                                        "order": value.order,
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment
                                    }
                                    test[0].action.push(statetest);
                                } else if (value.fieldType === "BK") {
                                    var statetest = {
                                        "name": $filter('translate')('1541'),
                                        "result": "",
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "order": value.order,
                                        "comment": value.comment
                                    }
                                    test[0].action.push(statetest);
                                } else {
                                    switch (value.information) {
                                        case "1":
                                            var name = $filter('translate')('0355');
                                            break;
                                        case "2":
                                            var name = $filter('translate')('0019');
                                            break;
                                        case "3":
                                            var name = $filter('translate')('0055');
                                            break;
                                        case "4":
                                            var name = $filter('translate')('0751');
                                            break;
                                        case "5":
                                            var name = $filter('translate')('0752');
                                            break;
                                        case "6":
                                            var name = 'Entrega final';
                                            break;
                                        default:
                                            var name = ''
                                            break;
                                    }
                                    var statetest = {
                                        "name": name,
                                        "order": value.order,
                                        "result": value.result,
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment === null ? $filter('translate')('0000') === 'enUsa' ? value.deliveryEnUSA : value.deliveryEsCo : value.comment,
                                    }
                                    test[0].action.push(statetest);
                                }

                            } else {
                                if (value.fieldType === "RC") {
                                    var test = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "name": value.fieldDescription,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": "Comentario del resultado",
                                                "resultemplate": value.information,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "order": value.order,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationtest.push(test);

                                } else if (value.fieldType === "RT") {

                                    var test = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "name": value.fieldDescription,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": 'Ingreso platilla de resultados',
                                                "resultemplate": JSON.parse(value.information),
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "order": value.order,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationtest.push(test);

                                } else if (value.fieldType === "MD") {
                                    var MD = JSON.parse(value.information);
                                    if (MD[0].id === undefined) {
                                        var test = {
                                            "id": value.id,
                                            "abbreviation": "",
                                            "name": value.fieldDescription,
                                            "order": value.order,
                                            "action": [
                                                {
                                                    "name": 'Antibiograma-ingreso microorganismo',
                                                    "sensitive": MD,
                                                    "order": value.order,
                                                    "date": moment(value.date).format(vm.formatDateHours),
                                                    "user": value.username,
                                                    "comment": value.comment
                                                }
                                            ]
                                        }
                                        listinformationtest.push(test);
                                    } else {
                                        var test = {
                                            "id": value.id,
                                            "abbreviation": "",
                                            "name": value.fieldDescription,
                                            "order": value.order,
                                            "action": [
                                                {
                                                    "name": 'Antibiograma-Ingreso antibiótico',
                                                    "sensitive": MD,
                                                    "order": value.order,
                                                    "date": moment(value.date).format(vm.formatDateHours),
                                                    "user": value.username,
                                                    "comment": value.comment
                                                }
                                            ]
                                        }
                                        listinformationtest.push(test);
                                    }
                                } else if (value.fieldType === "MDC") {


                                    var test = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "name": value.fieldDescription,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": 'Comentario del antibigrama',
                                                "sensitive": value.information,
                                                "order": value.order,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationtest.push(test);

                                } else if (value.action === "D") {
                                    var test = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "name": value.fieldDescription,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": $filter('translate')('0954'),
                                                "result": "",
                                                "order": value.order,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationtest.push(test);

                                } else if (value.fieldType === "BK") {
                                    var test = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "name": value.fieldDescription,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": $filter('translate')('1541'),
                                                "result": "",
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "order": value.order,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationtest.push(test);
                                } else {
                                    switch (value.information) {
                                        case "1":
                                            var name = $filter('translate')('0355');
                                            break;
                                        case "2":
                                            var name = $filter('translate')('0019');
                                            break;
                                        case "3":
                                            var name = $filter('translate')('0055');
                                            break;
                                        case "4":
                                            var name = $filter('translate')('0751');
                                            break;
                                        case "5":
                                            var name = $filter('translate')('0752');
                                            break;
                                        case "6":
                                            var name = 'Entrega final';
                                            break;
                                        default:
                                            var name = ''
                                            break;
                                    }

                                    var test = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "name": value.fieldDescription,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": name,
                                                "order": value.order,
                                                "result": value.result,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": value.comment === null ? $filter('translate')('0000') === 'enUsa' ? value.deliveryEnUSA : value.deliveryEsCo : value.comment,

                                            }
                                        ]
                                    }
                                    listinformationtest.push(test);
                                }
                            }
                        }
                    }
                    //trazabilidad de la muestra
                    if (value.fieldType === 'S' || value.fieldType === 'SS') {
                        if (value.information === '2') {
                            var sample = {
                                "id": value.id,
                                "abbreviation": "",
                                "order": value.order,
                                "name": value.fieldDescription,
                                "action": [
                                    {
                                        "name": $filter('translate')('1014'),
                                        "result": "",
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment
                                    }
                                ]
                            }
                            listinformationsample.push(sample);
                        } else {
                            var sample = $filter("filter")(listinformationsample, function (e) {
                                return e.id === value.id;
                            })
                            if (sample.length > 0) {
                                if (value.action === "D") {
                                    var statesample = {
                                        "name": $filter('translate')('0954'),
                                        "result": "",
                                        "order": value.order,
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment
                                    }
                                    sample[0].action.push(statesample);
                                } else if (value.fieldType === "SS") {
                                    var posicion = JSON.parse(value.information)
                                    var statesample = {
                                        "name": $filter('translate')('0801'),
                                        "result": "",
                                        "order": value.order,
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": "Gradilla: " + posicion.rack.name + "Posicion: " + posicion.position
                                    }
                                    sample[0].action.push(statesample);
                                } else {
                                    switch (value.information) {
                                        case "-1":
                                            var name = $filter('translate')('0413');
                                            break;
                                        case "0":
                                            var name = $filter('translate')('0128');
                                            break;
                                        case "1":
                                            var name = $filter('translate')('3126');
                                            break;
                                        case "3":
                                            var name = $filter('translate')('1540');
                                            break;
                                        case "4":
                                            var name = value.destination === null ? $filter('translate')('0572') : value.destination;
                                            break;
                                        default:
                                            var name = ''
                                            break;
                                    }
                                    var statesample = {
                                        "name": name,
                                        "order": value.order,
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment
                                    }
                                    sample[0].action.push(statesample);
                                }


                            } else {
                                if (value.action === "D") {
                                    var sample = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "order": value.order,
                                        "name": value.fieldDescription,
                                        "action": [
                                            {
                                                "name": $filter('translate')('0954'),
                                                "result": "",
                                                "order": value.order,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationsample.push(sample);
                                } else if (value.fieldType === "SS") {
                                    var posicion = JSON.parse(value.information)
                                    var sample = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "order": value.order,
                                        "name": value.fieldDescription,
                                        "action": [
                                            {
                                                "name": $filter('translate')('0801'),
                                                "result": "",
                                                "order": value.order,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": "Gradilla: " + posicion.rack.name + "Posicion: " + posicion.position

                                            }
                                        ]
                                    }
                                    listinformationsample.push(sample);
                                } else {
                                    switch (value.information) {
                                        case "-1":
                                            var name = $filter('translate')('0413');
                                            break;
                                        case "0":
                                            var name = $filter('translate')('0128');
                                            break;
                                        case "1":
                                            var name = $filter('translate')('3126');
                                            break;
                                        case "3":
                                            var name = $filter('translate')('1540');
                                            break;
                                        case "4":
                                            var name = value.destination === null ? $filter('translate')('0572') : value.destination;
                                            break;
                                        default:
                                            var name = ''
                                            break;
                                    }
                                    var sample = {
                                        "id": value.id,
                                        "abbreviation": "",
                                        "order": value.order,
                                        "name": value.fieldDescription,
                                        "action": [
                                            {
                                                "name": name,
                                                "order": value.order,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationsample.push(sample);
                                }
                            }
                        }
                    }
                    //trazabilidad de la orden
                    if (value.fieldType === 'O' || value.fieldType === 'OC') {
                        if (value.fieldType === 'OC') {


                        } else {

                            if (value.action === 'D') {
                                var auditorder = {
                                    "before": "ACTIVA",
                                    "order": value.order,
                                    "after": "INACTIVA",
                                    "date": moment(value.date).format(vm.formatDateHours),
                                    "user": value.username,
                                    "comment": value.comment
                                }
                                vm.auditorderactive.push(auditorder);
                            } else if (value.action === 'I') {
                                var datademo = JSON.parse(value.information)
                                datademo.forEach(function (demo) {
                                    var order = {
                                        "id": demo.idDemographic,
                                        "name": demo.demographic,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": $filter('translate')('1014'),
                                                "field": demo.value,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": value.comment,
                                                "order": value.order
                                            }
                                        ]
                                    }
                                    listinformationorder.push(order);
                                });
                            } else {
                                var datademo = JSON.parse(value.information);
                                if (datademo.orderNumber !== undefined) {
                                    var auditorder = {
                                        "order": value.order,
                                        "before": "Inactiva",
                                        "after": "Activa",
                                        "date": moment(value.date).format(vm.formatDateHours),
                                        "user": value.username,
                                        "comment": value.comment
                                    }
                                    vm.auditorderactive.push(auditorder);
                                } else {
                                    if (typeof (datademo) === 'number') {
                                        var auditorder = {
                                            "before": "Sin turno",
                                            "after": "Turno " + datademo,
                                            "date": moment(value.date).format(vm.formatDateHours),
                                            "user": value.username,
                                            "order": value.order,
                                            "comment": value.comment
                                        }
                                        vm.auditorderactive.push(auditorder);
                                    }
                                    else {
                                        datademo.forEach(function (demo) {
                                            var order = $filter("filter")(listinformationorder, function (e) {
                                                return e.id === demo.idDemographic;
                                            })
                                            var statesample = {
                                                "name": 'modificado',
                                                "field": demo.value,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "order": value.order,
                                                "comment": value.comment
                                            }
                                            order[0].action.push(statesample);
                                        });
                                    }
                                }
                            }
                        }
                    }
                    // trazabilidad del paciente
                    if (value.fieldType === 'P') {
                        if (value.action === 'I') {
                            var datademo = JSON.parse(value.information)
                            datademo.forEach(function (demo) {
                                var order = {
                                    "id": demo.idDemographic,
                                    "name": demo.demographic,
                                    "order": value.order,
                                    "action": [
                                        {
                                            "name": $filter('translate')('1014'),
                                            "field": demo.value,
                                            "order": value.order,
                                            "date": moment(value.date).format(vm.formatDateHours),
                                            "user": value.username,
                                            "comment": value.comment
                                        }
                                    ]
                                }
                                listinformationpacient.push(order);
                            });
                        } else {
                            if (listinformationpacient.length === 0) {
                                var datademo = JSON.parse(value.information)
                                datademo.forEach(function (demo) {
                                    var order = {
                                        "id": demo.idDemographic,
                                        "name": demo.demographic,
                                        "order": value.order,
                                        "action": [
                                            {
                                                "name": $filter('translate')('1014'),
                                                "field": demo.value,
                                                "date": moment(value.date).format(vm.formatDateHours),
                                                "user": value.username,
                                                "comment": value.comment
                                            }
                                        ]
                                    }
                                    listinformationpacient.push(order);
                                });
                            } else {
                                var datademo = JSON.parse(value.information);
                                datademo.forEach(function (demo) {
                                    var order = $filter("filter")(listinformationpacient, function (e) {
                                        return e.id === demo.idDemographic;
                                    })
                                    if (order.length === 0) {
                                        var order = {
                                            "id": demo.idDemographic,
                                            "name": demo.demographic,
                                            "order": value.order,
                                            "action": [
                                                {
                                                    "name": $filter('translate')('1014'),
                                                    "field": demo.value,
                                                    "date": moment(value.date).format(vm.formatDateHours),
                                                    "user": value.username,
                                                    "comment": value.comment
                                                }
                                            ]
                                        }
                                        listinformationpacient.push(order);
                                    } else {
                                        var statesample = {
                                            "name": 'modificado',
                                            "order": value.order,
                                            "field": demo.value,
                                            "date": moment(value.date).format(vm.formatDateHours),
                                            "user": value.username,
                                            "comment": value.comment
                                        }
                                        order[0].action.push(statesample);
                                    }
                                });
                            }
                        }
                    }
                });
                vm.auditsample = listinformationsample;
                vm.audittest = listinformationtest;
                vm.auditdemographicorder = listinformationorder;
                vm.auditdemographicpacient = listinformationpacient;
            }

            vm.listdata();

        }
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            }
            else {
                vm.init();
            }
        }
        function listuser() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return userDS.getUsers(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.user = removeData(data);
                }
            },
                function (error) {
                    vm.modalError(error);
                });
        }
        function removeData(data) {
            data.data.forEach(function (value, key) {
                data.data[key].namecompleted = data.data[key].name + ' ' + data.data[key].lastName;
            });
            return data.data;
        }
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
            vm.loadingdata = false;
        }
        function init() {
            vm.listuser();
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */