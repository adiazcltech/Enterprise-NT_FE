/********************************************************************************
  ENTERPRISENT - Todos los derechos reservados CLTech Ltda.
  PROPOSITO:    ...
  PARAMETROS:   cancel       @descripción
                listener     @descripción
                history      @descripción

  AUTOR:        @autor
  FECHA:        2018-06-21
  IMPLEMENTADA EN:
  1.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historypatient/historypatient.html
  2.02_EnterpriseNT_FE/EnterpriseNTLaboratory/src/client/app/modules/pre-analitic/historyreassignment/historyreassignment.html


  MODIFICACIONES:

  1. aaaa-mm-dd. Autor
     Comentario...

********************************************************************************/
(function () {
    'use strict';
    angular
        .module('app.widgets')
        .directive('patientsearch', patientsearch);
    patientsearch.$inject = ['orderDS', 'patientDS', 'localStorageService', '$filter'];
    /* @ngInject */
    function patientsearch(orderDS, patientDS, localStorageService, $filter) {
        var directive = {
            templateUrl: 'app/widgets/userControl/patientsearch.html',
            restrict: 'EA',
            scope: {
                cancel: '=cancel',
                listener: '=listener',
                namespatient: '=namespatient'
            },
            controller: ['$scope', function ($scope) {
                var vm = this;
                vm.init = init;
                vm.dateFormat = localStorageService.get('FormatoFecha').toUpperCase();
                vm.orderDigits = parseInt(localStorageService.get('DigitosOrden'));
                vm.dateFormatToSearch = '{format:"' + vm.dateFormat + '"}';
                //vm.searchByOrder = searchByOrder;
                vm.selectHistory = selectHistory;
                vm.searchByHistory = searchByHistory;
                vm.searchByPatient = searchByPatient;
                vm.orderToSearch = undefined;
                vm.patientDocToSearch = '2';
                vm.patientIdToSearch = undefined;
                vm.lastNameToSearch = '';
                vm.surNameToSearch = '';
                vm.name1ToSearch = '';
                vm.name2ToSearch = '';
                vm.dateToSearch = moment().format(vm.dateFormat);
                vm.patients = [];
                vm.documentTypes = [];
                vm.managedocumenttype = localStorageService.get('ManejoTipoDocumento') === 'True';
                vm.managehistoryauto = localStorageService.get('HistoriaAutomatica').toLowerCase() === 'true';
                vm.eventSelectOrder = eventSelectOrder;
                vm.eventSelectPatientId = eventSelectPatientId;
                vm.eventSelectPatient = eventSelectPatient;
                vm.maxWidth = vm.managedocumenttype ? 'min-width: 130px' : 'min-width: 141px';
                vm.twoNames = localStorageService.get('DosNombresPaciente') === 'True';
                vm.twosurnames = localStorageService.get('DosApellidosPaciente') === 'True';


                $scope.$watch('cancel', function () {
                    if ($scope.cancel) {
                        vm.orderToSearch = undefined;
                        vm.patientIdToSearch = undefined;
                        vm.lastNameToSearch = '';
                        vm.surNameToSearch = '';
                        vm.name1ToSearch = '';
                        vm.name2ToSearch = '';
                        vm.patients = [];
                        vm.documentTypes = [];
                        vm.dateToSearch = moment().format(vm.dateFormat);
                        vm.init();
                    }
                    $scope.cancel = false;
                });

                $scope.$watch('namespatient', function () {
                    if (vm.managehistoryauto) {
                        vm.lastNameToSearch = $scope.namespatient.lastNameToSearch === undefined ? '' : $scope.namespatient.lastNameToSearch;
                        vm.surNameToSearch = $scope.namespatient.surNameToSearch === undefined ? '' : $scope.namespatient.surNameToSearch;
                        vm.name1ToSearch = $scope.namespatient.name1ToSearch === undefined ? '' : $scope.namespatient.name1ToSearch;
                        vm.name2ToSearch = $scope.namespatient.name2ToSearch === undefined ? '' : $scope.namespatient.name2ToSearch;
                        vm.searchByPatient();
                    }
                });

                /**
                * Evento cuando se busca una historia clinica, evalua si tiene configurado el tipo de documento en la aplicacion
               */
                function searchByHistory() {
                    vm.patients = [];
                    if (vm.patientIdToSearch !== undefined && vm.patientIdToSearch !== '') {
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        if (!vm.managehistoryauto) {
                            vm.patientDocToSearch = !vm.managedocumenttype ? 1 : vm.patientDocToSearch;
                        } else {
                            vm.patientDocToSearch = 1;
                        }
                        vm.tooltip = [$filter('translate')('1453'),
                        $filter('translate')('1452'),
                        $filter('translate')('1451')];
                        //Busca con tipo de documento
                        patientDS.getPatientIdDocumentType(auth.authToken, vm.patientIdToSearch, vm.patientDocToSearch).then(function (response) {
                            if (response.status === 200) {
                                var dataPatient = response.data;
                                var documentTypeId = dataPatient.documentType.id === undefined ? 0 : dataPatient.documentType.id;
                                var element = {
                                    'birthday': moment(dataPatient.birthday).format(vm.dateFormat),
                                    'documentType': dataPatient.documentType.name,
                                    'documentTypeId': documentTypeId,
                                    'lastName': dataPatient.lastName,
                                    'name1': dataPatient.name1,
                                    'name2': dataPatient.name2,
                                    'order': '--' + $filter('translate')('0664') + '--',
                                    'history': vm.patientIdToSearch,
                                    'patientId': vm.patientIdToSearch,
                                    'patientIdDB': dataPatient.id,
                                    'recallId': 0,
                                    'phone': dataPatient.phone,
                                    'address': dataPatient.address,
                                    'sex': $filter('translate')('0000') === 'esCo' ? dataPatient.sex.esCo : dataPatient.sex.enUsa,
                                    'surName': dataPatient.surName,
                                    'tooltip': documentTypeId > 1 ? vm.tooltip[2] : vm.tooltip[documentTypeId]
                                };

                                vm.patients.push(element);
                                document.getElementById('txt_patientsearch_patient_id').select();
                            } else {
                                vm.patients = [];
                            }
                        }, function (error) {
                            if (error.status === 500) {
                                vm.errorservice = vm.errorservice + 1;
                                vm.Error = error;
                                vm.ShowPopupError = true;
                            }
                        });
                    } else {
                        document.getElementById('txt_patientsearch_patient_id').focus();
                    }
                }

                /**
                 * Evento cuando se busca un paciente por nombre
                */
                function searchByPatient() {
                    vm.patients = [];
                    if (vm.lastNameToSearch.trim() === '' &&
                        vm.surNameToSearch.trim() === '' &&
                        vm.name1ToSearch.trim() === '' &&
                        vm.name2ToSearch.trim() === '') {
                    } else {

                        var lastNameToSearch = vm.lastNameToSearch === '' ? ' ' : vm.lastNameToSearch;
                        var surNameToSearch = vm.surNameToSearch === '' ? ' ' : vm.surNameToSearch;
                        var name1ToSearch = vm.name1ToSearch === '' ? ' ' : vm.name1ToSearch;
                        var name2ToSearch = vm.name2ToSearch === '' ? ' ' : vm.name2ToSearch;

                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        if (lastNameToSearch !== ' ' || surNameToSearch !== ' ' || name1ToSearch !== ' ' || name2ToSearch !== ' ') {
                            //Invoca el metodo del servicio
                            vm.tooltip = [$filter('translate')('1453'),
                            $filter('translate')('1452'),
                            $filter('translate')('1451')];
                            patientDS.getPatientBYDatapatient(auth.authToken, lastNameToSearch.toUpperCase(), surNameToSearch.toUpperCase(), name1ToSearch.toUpperCase(), name2ToSearch.toUpperCase(), 0).then(function (data) {
                                if (data.status === 200) {
                                    data.data.forEach(function (dataPatient) {
                                        var documentTypeId = dataPatient.documentType.id === undefined ? 0 : dataPatient.documentType.id;
                                        var element = {
                                            'birthday': moment(dataPatient.birthday).format(vm.dateFormat),
                                            'documentType': dataPatient.documentType.name,
                                            'documentTypeId': documentTypeId,
                                            'lastName': dataPatient.lastName,
                                            'name1': dataPatient.name1,
                                            'name2': dataPatient.name2,
                                            'order': '--' + $filter('translate')('0664') + '--',
                                            'history': dataPatient.patientId,
                                            'patientId': dataPatient.patientId,
                                            'patientIdDB': dataPatient.id,
                                            'recallId': 0,
                                            'phone': dataPatient.phone,
                                            'address': dataPatient.address,
                                            'sex': $filter('translate')('0000') === 'esCo' ? dataPatient.sex.esCo : dataPatient.sex.enUsa,
                                            'surName': dataPatient.surName,
                                            'tooltip': documentTypeId > 1 ? vm.tooltip[2] : vm.tooltip[documentTypeId]
                                        };
                                        vm.patients.push(element);

                                    }, function (error) {
                                        if (error.status === 500) {
                                            vm.errorservice = vm.errorservice + 1;
                                            vm.Error = error;
                                            vm.ShowPopupError = true;
                                        }
                                    });
                                    document.getElementById('txt_patientsearch_patient_id').select();
                                }
                            });
                        }


                    }
                }

                /**
                 * Evento cuando se selecciona una historia
                 * @param {*} history
                 */
                function selectHistory(history, documentType, patientIdDB) {
                    var documentTypeObj = vm.managedocumenttype ? { 'id': documentType } : undefined;
                    var history = { 'id': history, 'documentType': documentTypeObj, 'IdDB': patientIdDB };
                    setTimeout(function () {
                        $scope.listener(history);
                    }, 100);
                }

                /**
                 * Evento cuando se selecciona el tab de orden
                */
                function eventSelectOrder() {
                    vm.orderToSearch = '';
                    setTimeout(function () {
                        document.getElementById('txt_patientsearch_order').focus();
                    }, 400);
                }

                /**
                 * Evento cuando se selecciona el tab de historia
                */
                function eventSelectPatientId() {
                    vm.patientIdToSearch = '';
                    setTimeout(function () {
                        document.getElementById('txt_patientsearch_patient_id').focus();
                    }, 400);
                }

                /**
                 * Evento cuando se selecciona el tab de paciente
                */
                function eventSelectPatient() {
                    vm.patientDocToSearch = '2';
                    vm.lastNameToSearch = '';
                    vm.surNameToSearch = '';
                    vm.name1ToSearch = '';
                    vm.name2ToSearch = '';
                    setTimeout(function () {
                        document.getElementById('txt_patientsearch_patient_last_name').focus();
                    }, 400);
                }

                /**
                 * Funcion inicial de la directiva
                */
                function init() {
                    // if (vm.managedocumenttype) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    orderDS.getDocumentTypes(auth.authToken).then(
                        function (response) {
                            if (response.status === 200) {
                                var documentTypes = response.data;

                                documentTypes = documentTypes.sort(function (a, b) {
                                    if (a.id > b.id) {
                                        return 1;
                                    } else if (a.id < b.id) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                });
                                vm.documentTypes = documentTypes;
                                vm.patientDocToSearch = '2';
                            }
                        }, function (error) {
                            console.error(error);
                        });
                    // }
                }
                vm.init();
            }],
            controllerAs: 'patientsearch'
        };
        return directive;
    }
})();
