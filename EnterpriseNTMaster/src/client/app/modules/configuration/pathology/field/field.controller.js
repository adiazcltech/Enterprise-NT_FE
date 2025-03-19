(function () {
    'use strict';

    angular
        .module('app.field')
        .controller('fieldController', fieldController);

    fieldController.$inject = ['fieldDS', 'configurationDS', 'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
    ];

    function fieldController(fieldDS, configurationDS, localStorageService, logger, $filter, $state, moment, $rootScope, LZString, $translate) {

        var vm = this;
        $rootScope.menu = true;
        vm.init = init;

        vm.title = 'Field';
        vm.name = ['name', 'state'];
        vm.state = ['-state', '+name'];
        vm.sortReverse = false;
        vm.sortType = vm.name;
        vm.selected = -1;

        vm.getFields = getFields;
        vm.getFieldById = getFieldById;
        vm.fieldDetail = [];
        vm.addField = addField;
        vm.editField = editField;
        vm.saveField = saveField;
        vm.insertField = insertField;
        vm.updateField = updateField;
        vm.cancelField = cancelField;
        vm.isDisabled = true;
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabledState = true;
        vm.isAuthenticate = isAuthenticate;
        vm.stateButton = stateButton;
        vm.changeState = changeState;
        vm.modalError = modalError;
        vm.generateFile = generateFile;
        vm.nameRepeat = false;
        vm.getConfigurationFormatDate = getConfigurationFormatDate;
        vm.windowOpenReport = windowOpenReport;
        vm.loadingdata = true;
        vm.listTypes = [
            { 'id': 1, 'name': $filter('translate')('0429') },
            { 'id': 2, 'name': $filter('translate')('0430') },
            { 'id': 3, 'name': $filter('translate')('3108') }
        ];
        vm.listGrid = [
            { 'id': 1, 'name': '1' },
            { 'id': 2, 'name': '2' },
            { 'id': 3, 'name': '3' },
            { 'id': 4, 'name': '4' },
            { 'id': 5, 'name': '5' }
        ];

        //** Metodo configuración formato**/
        function getConfigurationFormatDate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
                vm.getFields();
                if (data.status === 200) {
                    vm.formatDate = data.data.value.toUpperCase();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion para consultar el listado de campos para las plantillas de macroscopia */
        function getFields() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return fieldDS.getFields(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.dataFields = data.data;
                }
                vm.loadingdata = false;
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion consultar el detalle de un campo por id.*/
        function getFieldById(id, index, form) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.selected = id;
            vm.fieldDetail = [];
            vm.nameRepeat = false;
            vm.loadingdata = true;
            form.$setUntouched();
            return fieldDS.getFieldById(auth.authToken, id).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.usuario = $filter('translate')('0017') + ' ';
                    if (data.data.updatedAt) {
                        vm.usuario = vm.usuario + moment(data.data.updatedAt).format(vm.formatDate) + ' - ';
                        vm.usuario = vm.usuario + data.data.userUpdated.userName;
                    } else {
                        vm.usuario = vm.usuario + moment(data.data.createdAt).format(vm.formatDate) + ' - ';
                        vm.usuario = vm.usuario + data.data.userCreated.userName;
                    }
                    vm.oldfieldDetail = data.data;
                    vm.fieldDetail = data.data;
                    vm.fieldDetail.type = _.find(vm.listTypes, function (o) { return o.id === vm.fieldDetail.type });
                    vm.fieldDetail.grid = _.find(vm.listGrid, function (o) { return o.id === vm.fieldDetail.grid });
                    vm.stateButton('update');
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion para evaluar si un campo se va a actualizar o a insertar */
        function saveField(form) {
            form.$setUntouched();
            vm.fieldDetail.status = vm.fieldDetail.status ? 1 : 0;
            vm.fieldDetail.required = vm.fieldDetail.required ? 1 : 0;
            vm.fieldDetail.dictation = vm.fieldDetail.dictation ? 1 : 0;
            vm.fieldDetail.grid = vm.fieldDetail.grid.id;
            vm.fieldDetail.type = vm.fieldDetail.type.id;
            if (vm.fieldDetail.id === null) {
                vm.insertField();
            } else {
                vm.updateField();
            }
        }

        /** Funcion ejecutar el servicio que actualiza los datos de un campo */
        function updateField() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.fieldDetail.userUpdated = auth;
            return fieldDS.updateField(auth.authToken, vm.fieldDetail).then(function (data) {
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.fieldDetail.type = _.find(vm.listTypes, function (o) { return o.id === vm.fieldDetail.type });
                    vm.fieldDetail.grid = _.find(vm.listGrid, function (o) { return o.id === vm.fieldDetail.grid });
                    vm.getFields();
                    logger.success($filter('translate')('0042'));
                    vm.stateButton('update');
                    return data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /**Funcion ejecutar el servicio que inserta los datos de un campo.*/
        function insertField() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return fieldDS.insertField(auth.authToken, vm.fieldDetail).then(function (data) {
                if (data.status === 200) {
                    vm.fieldDetail = data.data;
                    vm.fieldDetail.type = _.find(vm.listTypes, function (o) { return o.id === vm.fieldDetail.type });
                    vm.fieldDetail.grid = _.find(vm.listGrid, function (o) { return o.id === vm.fieldDetail.grid });
                    vm.getFields();
                    vm.selected = data.data.id;
                    vm.stateButton('insert');
                    logger.success($filter('translate')('0042'));
                    return data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion ejecutar el servicio que inserta los datos de un campo.*/
        function editField() {
            vm.stateButton('edit');
        }

        /**Funcion para habilitar los controles del form */
        function addField(form) {
            form.$setUntouched();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.usuario = '';
            vm.selected = -1;
            vm.fieldDetail = {
                id: null,
                name: '',
                type: vm.listTypes[0],
                grid: vm.listGrid[0],
                required: false,
                dictation: false,
                status: true,
                userCreated: auth
            };
            vm.stateButton('add');
        }

        /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de un campo.*/
        function cancelField(form) {
            form.$setUntouched();
            vm.nameRepeat = false;
            vm.loadingdata = false;
            if (vm.fieldDetail.id === null || vm.fieldDetail.id === undefined) {
                vm.fieldDetail = [];
            } else {
                vm.getFieldById(vm.fieldDetail.id, vm.selected, form);
            }
            vm.stateButton('init');
        }

        /** funcion para confirmar el cambio del estado que se realice sobre un campo.*/
        function changeState() {
            if (!vm.isDisabledState) {
                vm.ShowPopupState = true;
            }
        }

        //** Método  para imprimir el reporte**//
        function generateFile() {
            if (vm.filtered.length === 0) {
                vm.open = true;
            } else {
                vm.variables = {};
                vm.datareport = vm.filtered;
                vm.pathreport = '/report/configuration/pathology/field/field.mrt';
                vm.openreport = false;
                vm.report = false;
                vm.windowOpenReport();
            }
        }
        // función para ver pdf el reporte detallado del error
        function windowOpenReport() {
            var parameterReport = {};
            parameterReport.variables = vm.variables;
            parameterReport.pathreport = vm.pathreport;
            parameterReport.labelsreport = JSON.stringify($translate.getTranslationTable());
            var datareport = LZString.compressToUTF16(JSON.stringify(vm.datareport));
            localStorageService.set('parameterReport', parameterReport);
            localStorageService.set('dataReport', datareport);
            window.open('/viewreport/viewreport.html');
        }
        //** Metodo que valida la autenticación**//
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            } else {
                vm.init();
            }
        }
        //** Metodo que evalua los estados de los botones**//
        function stateButton(state) {
            if (state === 'init') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = vm.fieldDetail.id === null || vm.fieldDetail.id === undefined ? true : false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
                vm.isDisabledState = true;
            }
            if (state === 'add') {
                vm.isDisabledAdd = true;
                vm.isDisabledEdit = true;
                vm.isDisabledSave = false;
                vm.isDisabledCancel = false;
                vm.isDisabledPrint = true;
                vm.isDisabled = false;
                setTimeout(function () {
                    document.getElementById('nameField').focus()
                }, 100);
            }
            if (state === 'edit') {
                vm.isDisabledState = false;
                vm.isDisabledAdd = true;
                vm.isDisabledEdit = true;
                vm.isDisabledSave = false;
                vm.isDisabledCancel = false;
                vm.isDisabledPrint = true;
                vm.isDisabled = false;
                setTimeout(function () {
                    document.getElementById('nameField').focus()
                }, 100);
            }
            if (state === 'insert') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
            }
            if (state === 'update') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
                vm.isDisabledState = true;
            }
        }

        //** Método para sacar el popup de error**//
        function modalError(error) {
            vm.loadingdata = false;
            if (error.data !== null) {
                if (error.data.code === 2) {
                    error.data.errorFields.forEach(function (value) {
                        var item = value.split('|');
                        if (item[0] === '1' && item[1] === 'name') {
                            vm.nameRepeat = true;
                        }
                    });
                    vm.loadingdata = false;
                }
            }
            if (vm.nameRepeat === false) {
                vm.Error = error;
                vm.ShowPopupError = true;
                vm.loadingdata = false;
            }
        }
        /** funcion inicial que se ejecuta cuando se carga el modulo */
        function init() {
            vm.getConfigurationFormatDate();
            vm.stateButton('init');
        }
        vm.isAuthenticate();
    }
})();
