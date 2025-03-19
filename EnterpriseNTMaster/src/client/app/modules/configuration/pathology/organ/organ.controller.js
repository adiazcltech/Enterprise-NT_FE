(function () {
    'use strict';

    angular
        .module('app.organ')
        .controller('organControllerTemplate', organControllerTemplate)
        .controller('OrganController', OrganController)
    OrganController.$inject = ['organDS', 'specimenDS', 'ModalService', 'configurationDS', 'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
    ];
    function OrganController(organDS, specimenDS, ModalService, configurationDS, localStorageService, logger, $filter, $state, moment, $rootScope, LZString, $translate) {

        var vm = this;
        $rootScope.menu = true;
        vm.init = init;
        vm.title = 'Organ';
        vm.code = ['code', 'name', 'state'];
        vm.name = ['name', 'code', 'state'];
        vm.state = ['-state', '+code', '+name'];
        vm.sortReverse = false;
        vm.sortType = vm.code;
        vm.selected = -1;
        vm.getOrgan = getOrgan;
        vm.getOrganById = getOrganById;
        vm.getSpecimens = getSpecimens;
        vm.organDetail = [];
        vm.listSpecimens = [];
        vm.addOrgan = addOrgan;
        vm.editOrgan = editOrgan;
        vm.saveOrgan = saveOrgan;
        vm.insertOrgan = insertOrgan;
        vm.updateOrgan = updateOrgan;
        vm.cancelOrgan = cancelOrgan;
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
        vm.codeRepeat = false;
        vm.nameRepeat = false;
        vm.getConfigurationFormatDate = getConfigurationFormatDate;
        vm.windowOpenReport = windowOpenReport;
        vm.loadingdata = true;

        //** Metodo configuración formato**/
        function getConfigurationFormatDate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
                vm.getSpecimens();
                if (data.status === 200) {
                    vm.formatDate = data.data.value.toUpperCase();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /**Metodo para obtener una lista de especimenes*/
        function getSpecimens() {
            vm.sortTypeSubs = '';
            vm.nameSample = '';
            vm.selected = -1;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return specimenDS.getSpecimens(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.listSpecimens = data.data === '' ? [] : _.filter(data.data, function (o) { return o.state; });
                } else {
                    vm.listSpecimens = [];
                }
                if (vm.listSpecimens.length === 0) {
                    vm.modalrequired();
                }
                vm.getOrgan();
                vm.loadingdata = false;
            }, function (error) {
                vm.modalError(error);
            });
        }

        vm.modalrequired = modalrequired;
        //** para sacar la ventana modal de requeridos**//
        function modalrequired() {
            ModalService.showModal({
                templateUrl: 'Requeridorgan.html',
                controller: 'organControllerTemplate'
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $state.go(result.page);
                });
            });
        }

        /** Funcion para consultar el listado de organos de patologia existentes en el sistema */
        function getOrgan() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return organDS.getOrgan(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.dataOrgan = data.data;
                }
                vm.loadingdata = false;
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion consultar el detalle de un organo por id.*/
        function getOrganById(id, index, form) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.selected = id;
            vm.organDetail = [];
            vm.nameRepeat = false;
            vm.codeRepeat = false;
            vm.loadingdata = true;
            form.$setUntouched();
            return organDS.getOrganById(auth.authToken, id).then(function (data) {
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
                    vm.oldOrganDetail = data.data;
                    vm.organDetail = data.data;
                    vm.organDetail.sample = {
                        id: data.data.sample
                    }
                    vm.stateButton('update');
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion para evaluar si un organo se va a actualizar o a insertar */
        function saveOrgan(form) {
            form.$setUntouched();
            vm.organDetail.status = vm.organDetail.status ? 1 : 0;
            vm.organDetail.sample = vm.organDetail.sample === null || vm.organDetail.sample === undefined ? null : vm.organDetail.sample.id;
            if (vm.organDetail.id === null) {
                vm.insertOrgan();
            } else {
                vm.updateOrgan();
            }
        }

        /** Funcion ejecutar el servicio que actualiza los datos de un organo */
        function updateOrgan() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.organDetail.userUpdated = auth;
            return organDS.updateOrgan(auth.authToken, vm.organDetail).then(function (data) {
                if (data.status === 200) {
                    vm.organDetail = data.data;
                    vm.organDetail.sample = {
                        id: data.data.sample
                    }
                    vm.getOrgan();
                    logger.success($filter('translate')('0042'));
                    vm.stateButton('update');
                    return data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /**Funcion ejecutar el servicio que inserta los datos de un organo.*/
        function insertOrgan() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return organDS.insertOrgan(auth.authToken, vm.organDetail).then(function (data) {
                if (data.status === 200) {
                    vm.organDetail = data.data;
                    vm.organDetail.sample = {
                        id: data.data.sample
                    }
                    vm.getOrgan();
                    vm.selected = data.data.id;
                    vm.stateButton('insert');
                    logger.success($filter('translate')('0042'));
                    return data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion ejecutar el servicio que inserta los datos de un organo.*/
        function editOrgan() {
            vm.stateButton('edit');
        }

        /**Funcion para habilitar los controles del form */
        function addOrgan(form) {
            form.$setUntouched();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.usuario = '';
            vm.selected = -1;
            vm.organDetail = {
                id: null,
                name: '',
                code: '',
                sample: null,
                status: true,
                userCreated: auth
            };
            vm.stateButton('add');
        }

        /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de un organo.*/
        function cancelOrgan(form) {
            form.$setUntouched();
            vm.nameRepeat = false;
            vm.codeRepeat = false;
            vm.code = false;
            vm.loadingdata = false;
            if (vm.organDetail.id === null || vm.organDetail.id === undefined) {
                vm.organDetail = [];
            } else {
                vm.getOrganById(vm.organDetail.id, vm.selected, form);
            }
            vm.stateButton('init');
        }

        /** funcion para confirmar el cambio del estado que se realice sobre un organo.*/
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
                vm.pathreport = '/report/configuration/pathology/organ/organ.mrt';
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
                vm.isDisabledEdit = vm.organDetail.id === null || vm.organDetail.id === undefined ? true : false;
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
                    document.getElementById('codeOrgan').focus()
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
                    document.getElementById('codeOrgan').focus()
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
                        if (item[0] === '1' && item[1] === 'code') {
                            vm.codeRepeat = true;
                        }
                        if (item[0] === '1' && item[1] === 'name') {
                            vm.nameRepeat = true;
                        }
                    });
                    vm.loadingdata = false;
                }
            }
            if (vm.codeRepeat === false && vm.nameRepeat === false) {
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
    function organControllerTemplate($scope, close) {
        $scope.close = function (page) {
            close({
                page: page
            }, 500);
        };
    }
})();
