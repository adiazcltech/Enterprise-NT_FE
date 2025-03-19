(function () {
    'use strict';

    angular
        .module('app.studytype')
        .controller('studytypeControllerTemplate', studytypeControllerTemplate)
        .controller('StudyTypeController', StudyTypeController);

    StudyTypeController.$inject = ['studytypeDS', 'specimenDS', 'configurationDS', 'localStorageService', 'logger',
        '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate','ModalService'
    ];

    function StudyTypeController(studytypeDS, specimenDS, configurationDS, localStorageService,
        logger, $filter, $state, moment, $rootScope, LZString, $translate,ModalService) {

        var vm = this;
        $rootScope.menu = true;
        vm.init = init;
        vm.title = 'StudyType';
        vm.code = ['code', 'name', 'state'];
        vm.name = ['name', 'code', 'state'];
        vm.state = ['-state', '+code', '+name'];
        vm.sortReverse = false;
        vm.sortType = vm.code;
        vm.codeStudy = ["code", "name", "selected"];
        vm.nameStudy = ["name", "code", "selected"];
        vm.selectedStudy = ["-selected", "+code", "+name"];
        vm.sortReverse1 = false;
        vm.sortType1 = vm.selectedStudy;
        vm.selected = -1;
        vm.searchStudies = '';
        vm.listStudies = [];
        vm.studies = [];
        vm.studyTypeDetail = [];
        vm.isDisabled = true;
        vm.isDisabledAdd = false;
        vm.isDisabledEdit = true;
        vm.isDisabledSave = true;
        vm.isDisabledCancel = true;
        vm.isDisabledPrint = false;
        vm.isDisabledState = true;
        vm.isAuthenticate = isAuthenticate;
        vm.getStudyType = getStudyType;
        vm.getStudyTypeById = getStudyTypeById;
        vm.getListStudies = getListStudies;
        vm.listStudiesSelected = listStudiesSelected;
        vm.listStudiesById = listStudiesById;
        vm.listValidStudies = listValidStudies;
        vm.requiredStudies = false;
        vm.editStudyType = editStudyType;
        vm.addStudytype = addStudytype;
        vm.updateStudyType = updateStudyType;
        vm.insertStudytype = insertStudytype;
        vm.cancelStudyType = cancelStudyType;
        vm.saveStudytype = saveStudytype;
        vm.stateButton = stateButton;
        vm.changeState = changeState;
        vm.modalError = modalError;
        vm.generateFile = generateFile;
        vm.codeRepeat = false;
        vm.nameRepeat = false;
        vm.studyRepeat = false;
        vm.getConfigurationFormatDate = getConfigurationFormatDate;
        vm.windowOpenReport = windowOpenReport;
        vm.loadingdata = true;

        //** Metodo configuración formato**/
        function getConfigurationFormatDate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
                vm.getListStudies();
                if (data.status === 200) {
                    vm.formatDate = data.data.value.toUpperCase();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion para consultar el listado de tipos de estudios existentes en el sistema */
        function getStudyType(id) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return studytypeDS.getStudyType(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.dataStudyType = data.data;
                    vm.listValidStudies(data.data, id);
                }
                vm.loadingdata = false;
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion consultar el detalle de un tipo de estudio.*/
        function getStudyTypeById(id, index, form) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.selected = id;
            vm.studyTypeDetail = [];
            vm.nameRepeat = false;
            vm.codeRepeat = false;
            vm.studyRepeat = false;
            vm.loadingdata = true;
            form.$setUntouched();
            return studytypeDS.getStudyTypeById(auth.authToken, id).then(function (data) {
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
                    vm.oldStudyTypeDetail = data.data;
                    vm.studyTypeDetail = data.data;
                    vm.listStudiesById(data);
                    vm.stateButton('update');
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion consultar el listado de estudios del sistema */
        function getListStudies() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return specimenDS.getStudies(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.listStudies = $filter('orderBy')(data.data, 'name');
                    vm.getStudyType(null);
                } else {
                    vm.loadingdata = false;
                    vm.modalrequired();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        vm.modalrequired = modalrequired;
        //** para sacar la ventana modal de requeridos**//
        function modalrequired() {
            ModalService.showModal({
                templateUrl: 'Requeridstudytype.html',
                controller: 'studytypeControllerTemplate'
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $state.go(result.page);
                });
            });
        }

        /** Funcion para evaluar si un tipo de estudio se va a actualizar o a insertar */
        function saveStudytype(form) {
            form.$setUntouched();
            vm.requiredStudies = false;
            vm.studyTypeDetail.studies = vm.studies.length === 0 ? [] : vm.listStudiesSelected();
            if (vm.studyTypeDetail.studies.length !== 0) {
                vm.studyTypeDetail.status = vm.studyTypeDetail.status ? 1 : 0;
                if (vm.studyTypeDetail.id === null) {
                    vm.insertStudytype();
                } else {
                    vm.updateStudyType();
                }
            } else {
                vm.requiredStudies = true;
            }
        }
        /** Funcion ejecutar el servicio que actualiza los datos de un tipo de estudio */
        function updateStudyType() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.studyTypeDetail.userUpdated = auth;
            return studytypeDS.updateStudyType(auth.authToken, vm.studyTypeDetail).then(function (data) {
                if (data.status === 200) {
                    vm.getStudyType(vm.studyTypeDetail.id);
                    logger.success($filter('translate')('0042'));
                    vm.stateButton('update');
                    return data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /**Funcion ejecutar el servicio que inserta los datos de un tipo de estudio.*/
        function insertStudytype() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return studytypeDS.insertStudyType(auth.authToken, vm.studyTypeDetail).then(function (data) {
                if (data.status === 200) {
                    vm.studyTypeDetail = data.data;
                    vm.getStudyType(data.data.id);
                    vm.selected = data.data.id;
                    vm.listStudiesById(data);
                    vm.stateButton('insert');
                    logger.success($filter('translate')('0042'));
                    return data;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }


        //** Metodo que obtiene la lista de estudios seleccionados de un tipo de estudio**//
        function listStudiesById(data) {
            vm.listStudies.forEach(function (value, key) {
                value.selected = false;
            });
            if (data) {
                vm.listValidStudies(vm.dataStudyType, data.data.id);
                data.data.studies.forEach(function (value, key) {
                    var study = _.find(vm.studies, function (o) { return o.id === value.id });
                    if (study) {
                        study.selected = true;
                    }
                });
            } else {
                vm.listValidStudies(vm.dataStudyType, null);
            }
        }

        //** Metodo que obtiene la lista de estudios validos y disponibles**//
        function listValidStudies(data, id) {
            vm.studies = vm.listStudies.slice();
            if (data) {
                data.forEach(function (value, key) {
                    if (value.id != id) {
                        value.studies.forEach(function (val, key) {
                            var index = _.findIndex(vm.studies, function (o) { return o.id === val.id });
                            vm.studies.splice(index, 1);
                        });
                    }
                });
            }
        }

        //** Metodo que elimina los elementos sobrantes en la grilla**/
        function listStudiesSelected() {
            var studies = [];
            vm.studies.forEach(function (value, key) {
                if (value.selected === true) {
                    studies.push(value);
                }
            });
            return studies;
        }
        /** Funcion ejecutar el servicio que inserta los datos de un tipo de estudio.*/
        function editStudyType() {
            vm.stateButton('edit');
        }

        /**Funcion para habilitar los controles del form */
        function addStudytype(form) {
            form.$setUntouched();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.usuario = '';
            vm.selected = -1;
            vm.studyTypeDetail = {
                id: null,
                name: '',
                code: '',
                status: true,
                studies: [],
                userCreated: auth
            };
            vm.listStudiesById(null);
            vm.stateButton('add');
        }
        /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de un tipo de estudio.*/
        function cancelStudyType(form) {
            form.$setUntouched();
            vm.nameRepeat = false;
            vm.codeRepeat = false;
            vm.studyRepeat = false;
            vm.code = false;
            vm.loadingdata = false;
            if (vm.studyTypeDetail.id === null || vm.studyTypeDetail.id === undefined) {
                vm.studyTypeDetail = [];
            } else {
                vm.getStudyTypeById(vm.studyTypeDetail.id, vm.selected, form);
            }
            vm.stateButton('init');
        }
        /** funcion para confirmar el cambio del estado que se realice sobre un tipo de estudio.*/
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
                vm.pathreport = '/report/configuration/pathology/studytype/studytype.mrt';
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
                vm.isDisabledEdit = vm.studyTypeDetail.id === null || vm.studyTypeDetail.id === undefined ? true : false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
                vm.isDisabledState = true;
                vm.acoodionStudies = false;
            }
            if (state === 'add') {
                vm.isDisabledAdd = true;
                vm.isDisabledEdit = true;
                vm.isDisabledSave = false;
                vm.isDisabledCancel = false;
                vm.isDisabledPrint = true;
                vm.isDisabled = false;
                vm.acoodionStudies = false;
                setTimeout(function () {
                    document.getElementById('codeStudyType').focus()
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
                vm.acoodionStudies = true;
                setTimeout(function () {
                    document.getElementById('codeStudyType').focus()
                }, 100);
            }
            if (state === 'insert') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
                vm.acoodionStudies = false;
            }
            if (state === 'update') {
                vm.isDisabledAdd = false;
                vm.isDisabledEdit = false;
                vm.isDisabledSave = true;
                vm.isDisabledCancel = true;
                vm.isDisabledPrint = false;
                vm.isDisabled = true;
                vm.isDisabledState = true;
                vm.acoodionStudies = true;
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

                        if (item[0] === '1' && item[1] === 'study') {
                            vm.studyRepeat = true;
                        }
                    });
                    vm.loadingdata = false;
                }
            }
            if (vm.codeRepeat === false && vm.nameRepeat === false && vm.studyRepeat === false) {
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
    function studytypeControllerTemplate($scope, close) {
        $scope.close = function (page) {
          close({
            page: page
          }, 500);
        };
      }
})();

