(function () {
    'use strict';

    angular
        .module('app.protocol')
        .controller('protocolController', protocolController)
        .controller('protocolTemplateController', protocolTemplateController);
    protocolController.$inject = ['ModalService', 'protocolDS', 'organDS', 'specimenDS', 'caseteDS', 'colorationDS', 'configurationDS', 'localStorageService', 'logger',
        '$filter', '$state', 'moment', '$rootScope', 'LZString', '$translate'
    ];
    function protocolController(ModalService, protocolDS, organDS, specimenDS, caseteDS, colorationDS, configurationDS, localStorageService,
        logger, $filter, $state, moment, $rootScope, LZString, $translate) {

        var vm = this;
        $rootScope.menu = true;
        vm.init = init;
        vm.title = 'Protocol';
        vm.sample = ['sample', 'organ'];
        vm.organ = ['organ', 'sample'];
        vm.sortReverse = false;
        vm.sortType = vm.sample;
        vm.protocolDetail = [];
        vm.listSpecimens = [];
        vm.idSpecimen = 0;
        // vm.listColorations = [];
        vm.idColoration = 0;
        vm.selected = -1;
        vm.listCasetes = [];
        vm.idCasete = 0;
        vm.listOrgans = [];
        vm.idOrgan = 0;
        vm.getProtocols = getProtocols;
        vm.getProtocolById = getProtocolById;
        vm.addProtocol = addProtocol;
        vm.saveProtocol = saveProtocol;
        vm.insertProtocol = insertProtocol;
        vm.editProtocol = editProtocol;
        vm.updateProtocol = updateProtocol;
        vm.cancelProtocol = cancelProtocol;
        // vm.loadDataSheets = loadDataSheets;
        // vm.getDataSheets = getDataSheets;
        // vm.getColorations = getColorations;
        vm.getCasetes = getCasetes;
        vm.getSpecimens = getSpecimens;
        vm.getOrgans = getOrgans;
        // vm.sheetsTemplate = [];
        // vm.loadSheetsTemplate = loadSheetsTemplate;
        // vm.cloneSection = cloneSection;
        // vm.deleteSection = deleteSection
        vm.isAuthenticate = isAuthenticate;
        vm.getConfigurationFormatDate = getConfigurationFormatDate;
        vm.stateButton = stateButton;
        vm.generateFile = generateFile;
        vm.windowOpenReport = windowOpenReport;
        vm.modalError = modalError;
        vm.modalRequired = false;
        vm.modalrequired = modalrequired;
        // vm.colorationsRepeat = false;
        vm.specimenRepeat = false;
        vm.loadingdata = true;
        vm.colorationRequired = false;
        vm.quantityRequired = false;
        vm.selectSpecimen = selectSpecimen;
        vm.listAllOrgans = [];

        function selectSpecimen(type) {
          if(vm.protocolDetail.specimen && type) {
            vm.listOrgans = _.filter(vm.listAllOrgans, function(o) { return o.sample === vm.protocolDetail.specimen.id; });
          } else if(vm.protocolDetail.specimen) {
            vm.listOrgans = _.filter(vm.listAllOrgans, function(o) { return o.sample === vm.protocolDetail.specimen; });
          } else {
            vm.listOrgans = vm.listAllOrgans;
          }
        }

        //** Metodo configuración formato**/
        function getConfigurationFormatDate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return configurationDS.getConfigurationKey(auth.authToken, 'FormatoFecha').then(function (data) {
                vm.getProtocols();
                if (data.status === 200) {
                    vm.formatDate = data.data.value.toUpperCase();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        /** Funcion para consultar el listado de protocolos existentes en el sistema */
        function getProtocols() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return protocolDS.getProtocol(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.dataProtocols = data.data;
                } else {
                    vm.dataProtocols = [];
                }
                vm.getCasetes();
            }, function (error) {
                vm.modalError(error);
            });
        }
        /**Metodo para obtener una lista de casetes*/
        function getCasetes() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return caseteDS.getCasetes(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.listCasetes = _.filter(data.data, function (o) { return o.status === 1; });
                    vm.listCasetes = $filter('orderBy')(vm.listCasetes, 'name');
                    vm.idCasete = data.data[0].id;
                } else {
                    vm.listCasetes = [];
                }
                vm.getSpecimens();
            }, function (error) {
                vm.modalError(error);
            });
        }


        /**Metodo para obtener una lista de especimenes*/
        function getSpecimens() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return specimenDS.getSpecimens(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.listSpecimens = _.filter(data.data, function (o) { return o.state; });
                    vm.listSpecimens = $filter('orderBy')(vm.listSpecimens, 'name');
                    vm.idSpecimen = data.data[0].id;
                } else {
                    vm.listSpecimens = [];
                }
                vm.getOrgans();
            }, function (error) {
                vm.modalError(error);
            });
        }

        /**Metodo para obtener una lista de organos*/
        function getOrgans() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return organDS.getOrgan(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.listOrgans = _.filter(data.data, function (o) { return o.status === 1; });
                    vm.listOrgans = $filter('orderBy')(vm.listOrgans, 'name');
                    vm.listAllOrgans = vm.listOrgans;
                    vm.idOrgan = data.data[0].id;
                } else {
                    vm.listOrgans = [];
                }
                vm.loadingdata = false;
                // vm.getColorations();
            }, function (error) {
                vm.modalError(error);
            });
        }

        /**Metodo para obtener una lista de coloraciones*/
        // function getColorations() {
        //     var auth = localStorageService.get('Enterprise_NT.authorizationData');
        //     return colorationDS.getColorations(auth.authToken).then(function (data) {
        //         if (data.status === 200) {
        //             vm.listColorations = _.filter(data.data, function (o) { return o.status === 1; });
        //             vm.listColorations = $filter('orderBy')(vm.listColorations, 'name');
        //             vm.idColoration = data.data[0].id;
        //             vm.loadSheetsTemplate();
        //         } else {
        //             vm.listColorations = [];
        //         }
        //         if (vm.listCasetes.length === 0 || vm.listSpecimens.length === 0 || vm.listColorations.length === 0) {
        //             vm.modalrequired();
        //         }
        //         vm.loadingdata = false;
        //     }, function (error) {
        //         vm.modalError(error);
        //     });
        // }

        //** Método para sacar un popup de los datos requridos**//
        function modalrequired() {
            ModalService.showModal({
                templateUrl: 'Requeridprotocol.html',
                controller: 'protocolTemplateController',
                inputs: {
                    listCasetes: vm.listCasetes.length,
                    listSpecimens: vm.listSpecimens.length,
                    // listColorations: vm.listColorations.length
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    $state.go(result.page);
                });
            });
        }

        /** Funcion consultar el detalle de un protocolo por id.*/
        function getProtocolById(id, index, form) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.selected = id;
            vm.protocolDetail = [];
            vm.specimenRepeat = false;
            vm.loadingdata = true;
            form.$setUntouched();
            return protocolDS.getProtocolById(auth.authToken, id).then(function (data) {
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
                    vm.oldProtocolDetail = data.data;
                    vm.protocolDetail = data.data;
                    vm.selectSpecimen(true);
                    // vm.loadDataSheets();
                    vm.stateButton('update');
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        // function loadDataSheets() {
        //     var sheets = [];
        //     vm.protocolDetail.sheets.forEach(function (value) {
        //         var template = JSON.parse(JSON.stringify(vm.sheetsTemplate));
        //         _.find(template, function (o) { return o.name === "coloration" }).value = value.coloration;
        //         _.find(template, function (o) { return o.name === "quantity" }).value = value.quantity;
        //         sheets.push(template);
        //     });
        //     vm.protocolDetail.sheets = sheets;
        // }

        /**Funcion para habilitar los controles del form */
        function addProtocol(form) {
            form.$setUntouched();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.usuario = '';
            vm.selected = -1;
            vm.protocolDetail = {
                id: null,
                organ: null,
                casete: {
                    id: vm.idCasete
                },
                quantity: 1,
                processingHours: 1,
                status: true,
                // sheets: [JSON.parse(JSON.stringify(vm.sheetsTemplate))],
                userCreated: auth
            };
            vm.stateButton('add');
        }

        /** Funcion para evaluar si un protocolo se va a actualizar o a insertar */
        function saveProtocol(form) {
            form.$setUntouched();
            vm.protocolDetail.status = vm.protocolDetail.status ? 1 : 0;
            vm.specimenRepeat = false;
            if (vm.protocolDetail.id === null) {
                vm.insertProtocol();
            } else {
                vm.updateProtocol();
            }
        }

        /**Funcion ejecutar el servicio que inserta los datos de un protocolo.*/
        function insertProtocol() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            // var oldSheets = vm.protocolDetail.sheets;
            // vm.protocolDetail.sheets = vm.getDataSheets(vm.protocolDetail);
            // if (vm.colorationsRepeat) {
            //     // vm.protocolDetail.sheets = oldSheets;
            //     vm.loadingdata = false;
            //     return false;
            // }
            return protocolDS.insertProtocol(auth.authToken, vm.protocolDetail).then(function (data) {
                if (data.status === 200) {
                    vm.protocolDetail = data.data;
                    vm.getProtocols();
                    vm.selected = data.data.id;
                    // vm.protocolDetail.sheets = oldSheets;
                    // vm.colorationsRepeat = false;
                    vm.stateButton('insert');
                    logger.success($filter('translate')('0042'));
                    return data;
                }
            }, function (error) {
                // vm.protocolDetail.sheets = oldSheets;
                // vm.colorationsRepeat = false;
                vm.modalError(error);
            });
        }

        /** Funcion ejecutar el servicio que inserta los datos de un protocolo.*/
        function editProtocol() {
            vm.stateButton('edit');
        }

        /** Funcion ejecutar el servicio que actualiza los datos de un protocolo */
        function updateProtocol() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.protocolDetail.userUpdated = auth;
            // var oldSheets = vm.protocolDetail.sheets;
            // vm.protocolDetail.sheets = vm.getDataSheets(vm.protocolDetail);
            // if (vm.colorationsRepeat) {
            //     vm.protocolDetail.sheets = oldSheets;
            //     vm.loadingdata = false;
            //     return false;
            // }
            return protocolDS.updateProtocol(auth.authToken, vm.protocolDetail).then(function (data) {
                if (data.status === 200) {
                    vm.getProtocols();
                    // vm.protocolDetail.sheets = oldSheets;
                    // vm.colorationsRepeat = false;
                    logger.success($filter('translate')('0042'));
                    vm.stateButton('update');
                    return data;
                }
            }, function (error) {
                // vm.protocolDetail.sheets = oldSheets;
                // vm.colorationsRepeat = false;
                vm.modalError(error);
            });
        }

        // function getDataSheets(data) {
        //     vm.colorationsRepeat = false;
        //     var sheets = [];
        //     data.sheets.forEach(function (value) {
        //         var quantity = '';
        //         var coloration = '';
        //         value.forEach(function (form) {
        //             if (form.name == "quantity") {
        //                 quantity = form.value;
        //             }
        //             if (form.name == "coloration") {
        //                 coloration = form.value;
        //             }
        //         });
        //         var validateColoration = _.find(sheets, function (o) { return o.coloration.id === coloration.id; });
        //         if (validateColoration) {
        //             vm.colorationsRepeat = true;
        //         }
        //         sheets.push({ quantity: quantity, coloration: coloration });
        //     });
        //     return sheets;
        // }

        // function loadSheetsTemplate() {
        //     vm.sheetsTemplate = [
        //         {
        //             'type': 'selectize',
        //             'name': 'coloration',
        //             'label': $filter('translate')('3063'),
        //             'placeholder': $filter('translate')('0463'),
        //             'code': true,
        //             'data': vm.listColorations,
        //             'required': true,
        //             'value': ''
        //         },
        //         {
        //             'type': 'text',
        //             'name': 'quantity',
        //             'label': $filter('translate')('0053'),
        //             'required': true,
        //             'value': ''
        //         },
        //     ];
        // }

        // function cloneSection($event, $index) {
        //     if (!vm.isDisabled) {
        //         $event.preventDefault();
        //         vm.colorationRequired = false;
        //         vm.quantityRequired = false;
        //         vm.colorationsRepeat = false;
        //         if (vm.protocolDetail.sheets[$index][0].value === '' || vm.protocolDetail.sheets[$index][0].value === undefined) {
        //             vm.colorationRequired = true;
        //         }
        //         if (vm.protocolDetail.sheets[$index][1].value === '' || vm.protocolDetail.sheets[$index][1].value === undefined) {
        //             vm.quantityRequired = true;
        //         }
        //         if (!vm.colorationRequired && !vm.quantityRequired) {
        //             var indexC = _.findIndex(vm.protocolDetail.sheets, function (o) { return o[0].value.id === vm.protocolDetail.sheets[$index][0].value.id; });
        //             if (indexC !== $index) {
        //                 vm.colorationsRepeat = true;
        //             } else {
        //                 vm.protocolDetail.sheets.push(JSON.parse(JSON.stringify(vm.sheetsTemplate)));
        //             }
        //         }
        //     }
        // }

        // function deleteSection($event, $index) {
        //     if (!vm.isDisabled) {
        //         vm.colorationRequired = false;
        //         vm.quantityRequired = false;
        //         vm.colorationsRepeat = false;
        //         $event.preventDefault();
        //         vm.protocolDetail.sheets.splice($index, 1);
        //     }
        // }

        /**funcion para reversas todos los cambios que haya realizado el usuario sobre los datos de un organo.*/
        function cancelProtocol(form) {
            form.$setUntouched();
            vm.specimenRepeat = false;
            vm.loadingdata = false;
            if (vm.protocolDetail.id === null || vm.protocolDetail.id === undefined) {
                vm.protocolDetail = [];
            } else {
                vm.getProtocolById(vm.protocolDetail.id, vm.selected, form);
            }
            vm.stateButton('init');
        }


        //** Método  para imprimir el reporte**//
        function generateFile() {
            if (vm.filtered.length === 0) {
                vm.open = true;
            } else {
                vm.variables = {};

                vm.datareport = [];
                vm.filtered.forEach(function (value) {
                    vm.datareport.push(
                        {
                            specimen: value.specimen.name,
                            organ: value.organ.name,
                            casete: value.casete.name,
                            quantity: value.quantity,
                            userCreated: value.userCreated,
                            userUpdated: value.userUpdated
                        }
                    )
                });
                vm.pathreport = '/report/configuration/pathology/protocol/protocol.mrt';
                vm.openreport = false;
                vm.report = false;
                vm.windowOpenReport();
            }
        }

        //función para ver pdf el reporte detallado del error
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
                vm.isDisabledEdit = vm.protocolDetail.id === null || vm.protocolDetail.id === undefined ? true : false;
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
                    document.getElementById('specimen').focus()
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
                    document.getElementById('specimen').focus()
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
                        if (item[0] === '1' && item[1] === 'specimen') {
                            vm.specimenRepeat = true;
                        }
                    });
                    vm.loadingdata = false;
                }
            }
            if (vm.specimenRepeat === false) {
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

    /** funcion inicial la modal para mostrar la modal de requridos*/
    function protocolTemplateController($scope, listCasetes, listSpecimens, listColorations, close) {
        $scope.listCasetes = listCasetes;
        $scope.listSpecimens = listSpecimens;
        // $scope.listColorations = listColorations;
        $scope.close = function (page) {
            close({
                page: page
            }, 500);
        };
    }
})();
