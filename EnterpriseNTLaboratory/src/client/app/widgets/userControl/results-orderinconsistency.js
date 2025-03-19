(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('resultsorderinconsistency', resultsorderinconsistency);

    resultsorderinconsistency.$inject = ['$filter', 'localStorageService', 'logger',
        'inconsistenciesDS', 'common', 'moment', 'listDS'];

    /* @ngInject */
    function resultsorderinconsistency($filter, localStorageService, logger,
        inconsistenciesDS, common, moment, listDS) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/widgets/userControl/results-orderinconsistency.html',
            scope: {
                openmodal: '=openmodal',
                patientinformation: '=patientinformation',
                photopatient: '=photopatient',
                order: '=order',
                testcode: '=testcode',
                testname: '=testname',
                notes: '=notes'
            },

            controller: ['$scope', function ($scope) {
                var vm = this;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.closemodal = closemodal;
                vm.init = init;
                vm.getInconsistency = getInconsistency;
                vm.getDetail = getDetail;
                vm.DemograficoInconsistensias = localStorageService.get('DemograficoInconsistensias').toUpperCase();
                vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
                vm.modalError = modalError;
                vm.getsex = getsex;
                vm.order = [];
                vm.varnull = $filter('translate')('0681');
                vm.hisname = '';
                vm.lisname = '';
                vm.HISbirthday = '';
                vm.LISbirthday = '';
                vm.demograficohis = '';
                vm.demograficolis = '';
                vm.sexhis = '';
                vm.sexlis = '';


                $scope.$watch('openmodal', function () {
                    if ($scope.openmodal) {
                        vm.order = [];
                        vm.patient = $scope.patientinformation;
                        vm.photopatient = $scope.photopatient;
                        vm.orderId = $scope.order;
                        vm.testcode = $scope.testcode;  //TODO:
                        vm.testname = $scope.testname;  //TODO:
                        vm.notes = $scope.notes === undefined ? [] : $scope.notes;
                        vm.getInconsistency();
                        vm.init();
                        $scope.openmodal = false;
                    }
                });
                //** Método para obtener lista de género **//
                function getsex() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return listDS.getList(auth.authToken, 6).then(function (data) {
                        if (data.status === 200) {
                            vm.sex = data.data;
                        }
                    },
                        function (error) {
                            vm.modalError(error);
                        });
                }
                //** Método que llena la listas de lis y his **//
                function getDetail() {
                    vm.order = [];
                    if ($filter('translate')('0000') === 'esCo') {

                        if (vm.Listlisthis.patientHIS.sex.id === undefined) {
                            vm.sexhis = vm.varnull;
                        } else {
                            if (vm.Listlisthis.patientHIS.sex.id === 7 || vm.Listlisthis.patientHIS.sex.id === 8 || vm.Listlisthis.patientHIS.sex.id === 9 || vm.Listlisthis.patientHIS.sex.id === 42) {
                                vm.sexhis = $filter('filter')(vm.sex, { id: vm.Listlisthis.patientHIS.sex.id })[0].esCo;
                            } else {
                                vm.sexhis = vm.varnull;
                            }
                        }

                        if (vm.Listlisthis.patientLIS.sex.id === undefined) {
                            vm.sexlis = vm.varnull;
                        } else {
                            if (vm.Listlisthis.patientLIS.sex.id === 7 || vm.Listlisthis.patientLIS.sex.id === 8 || vm.Listlisthis.patientLIS.sex.id === 9 || vm.Listlisthis.patientLIS.sex.id === 42) {
                                vm.sexlis = $filter('filter')(vm.sex, { id: vm.Listlisthis.patientLIS.sex.id })[0].esCo;
                            } else {
                                vm.sexlis = vm.varnull;
                            }
                        }
                    } else {
                        if (vm.Listlisthis.patientHIS.sex.id === undefined) {
                            vm.sexhis = vm.varnull;
                        } else {
                            if (vm.Listlisthis.patientHIS.sex.id === 7 || vm.Listlisthis.patientHIS.sex.id === 8 || vm.Listlisthis.patientHIS.sex.id === 9 || vm.Listlisthis.patientHIS.sex.id === 42) {
                                vm.sexhis = $filter('filter')(vm.sex, { id: vm.Listlisthis.patientHIS.sex.id })[0].enUsa;
                            } else {
                                vm.sexhis = vm.varnull;
                            }
                        }

                        if (vm.Listlisthis.patientLIS.sex.id === undefined) {
                            vm.sexlis = vm.varnull;
                        } else {
                            if (vm.Listlisthis.patientLIS.sex.id === 7 || vm.Listlisthis.patientLIS.sex.id === 8 || vm.Listlisthis.patientLIS.sex.id === 9 || vm.Listlisthis.patientLIS.sex.id === 42) {
                                vm.sexlis = $filter('filter')(vm.sex, { id: vm.Listlisthis.patientLIS.sex.id })[0].enUsa;
                            } else {
                                vm.sexlis = vm.varnull;
                            }
                        }
                    }

                    vm.HISbirthday = common.getAgeAsString(moment(vm.Listlisthis.patientHIS.birthday).format(vm.formatDateAge), vm.formatDateAge);
                    vm.LISbirthday = common.getAgeAsString(moment(vm.Listlisthis.patientLIS.birthday).format(vm.formatDateAge), vm.formatDateAge);
                    vm.lisname = vm.Listlisthis.patientLIS.name2 === undefined ? vm.Listlisthis.patientLIS.name1 : vm.Listlisthis.patientLIS.name1 + ' ' + vm.Listlisthis.patientLIS.name2;
                    var Hisname2 = vm.Listlisthis.patientHIS.name2 === undefined ? '' : vm.Listlisthis.patientHIS.name2;
                    vm.hisname = vm.Listlisthis.patientHIS.name1 + ' ' + Hisname2;
                    vm.demograficolis = '';
                    vm.demograficohis = '';
                    vm.demographicsname = '';

                    if (vm.DemograficoInconsistensias !== '?' && vm.DemograficoInconsistensias != '0') {

                        vm.demolis = $filter('filter')(vm.Listlisthis.patientLIS.demographics, { idDemographic: parseInt(vm.DemograficoInconsistensias) }, true);

                        if (vm.demolis.length !== 0) {

                            if (vm.demolis[0].notCodifiedValue === undefined) {
                                vm.demo = $filter('filter')(vm.demographicsItem, { id: vm.demolis[0].codifiedId })[0];
                                vm.demograficolis = vm.demo.name;
                                vm.demographicsname = vm.demolis[0].demographic.toLowerCase();
                            }
                            else {
                                vm.demograficolis = vm.demolis[0].notCodifiedValue;
                                vm.demographicsname = vm.demolis[0].demographic.toLowerCase();
                            }

                        }

                        vm.demohis = $filter('filter')(vm.Listlisthis.patientHIS.demographics, { idDemographic: parseInt(vm.DemograficoInconsistensias) }, true);


                        if (vm.demohis.length !== 0) {

                            if (vm.demohis[0].notCodifiedValue === undefined) {
                                vm.demo = $filter('filter')(vm.demographicsItem, { id: vm.demohis[0].codifiedId })[0];
                                vm.demograficohis = vm.demo.name;
                                vm.demographicsname = vm.demolis[0].demographic.toLowerCase();
                            }
                            else {
                                vm.demograficohis = vm.demohis[0].notCodifiedValue;
                                vm.demographicsname = vm.demolis[0].demographic.toLowerCase();
                            }

                        }
                    }

                    vm.inconsistencies = vm.Listlisthis.inconsistencies;
                    vm.errorpatientId = vm.inconsistencies.indexOf('patientId') >= 0 ? true : false;
                    vm.errorname = vm.inconsistencies.indexOf('name') >= 0 ? true : false;
                    vm.errorlastName = vm.inconsistencies.indexOf('lastName') >= 0 ? true : false;
                    vm.errorsurName = vm.inconsistencies.indexOf('surName') >= 0 ? true : false;
                    vm.errorbirthday = vm.inconsistencies.indexOf('birthday') >= 0 ? true : false;
                    vm.errorsex = vm.inconsistencies.indexOf('sex') >= 0 ? true : false;
                    vm.errordemographip = vm.demograficohis === vm.demograficolis ? false : true;

                    vm.order = vm.Listlisthis;
                }
                //** Método que consulta la incossistencia **//
                function getInconsistency() {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    vm.Listlisthis = [];
                    return inconsistenciesDS.getinconsistency(auth.authToken, vm.orderId).then(function (data) {
                        vm.order = [];
                        if (data.status === 200) {
                            vm.Listlisthis = data.data;
                            vm.getDetail();
                            UIkit.modal('#rs-modal-orderinconsistency').show();
                        } else {
                            logger.success($filter('translate')('0303'));
                        }

                    }, function (error) {
                        vm.modalError(error);
                    });
                }
                //** Método que inicializa la directiva **//
                function init() {
                    vm.getsex();
                }
                //** Método que cierra la ventana modal **//
                function closemodal() {
                    vm.order = [];
                    UIkit.modal('#rs-modal-orderinconsistency').hide();
                }
                //** Método que muestra la ventana de error **//
                function modalError(error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                }
            }],
            controllerAs: 'vmd'
        };
        return directive;
    }
})();
/* jshint ignore:end */
