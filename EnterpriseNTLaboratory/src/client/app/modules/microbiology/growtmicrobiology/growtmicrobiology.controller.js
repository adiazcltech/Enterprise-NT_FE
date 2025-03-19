/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.growtmicrobiology')
        .controller('growtmicrobiologyController', growtmicrobiologyController);

    growtmicrobiologyController.$inject = ['common', 'microbiologyDS', 'sampletrackingsDS', 'queriesDS',
        'localStorageService', 'logger', '$filter', '$state', 'moment', '$rootScope', 'orderentryDS'];

    function growtmicrobiologyController(common, microbiologyDS, sampletrackingsDS, queriesDS,
        localStorageService, logger, $filter, $state, moment, $rootScope, orderentryDS) {

        var vm = this;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.title = 'Growtmicrobiology';
        vm.state = true;
        $rootScope.menu = true;
        $rootScope.helpReference = '03.Microbiology/growtmicrobiology.htm';
        $rootScope.NamePage = $filter('translate')('0025');
        vm.getSampleOrder = getSampleOrder;
        vm.modalError = modalError;
        vm.menssageinformative = '';
        vm.numberOrder = null;
        vm.verification = verification;
        vm.sample = '';
        vm.gettestprocedureid = gettestprocedureid;
        vm.gettestmediaculturesid = gettestmediaculturesid;
        vm.openanatomic = false;
        vm.Repeatabbr = false;
        vm.Repeat = false;
        vm.getDetailSample = getDetailSample;
        vm.detail = [];
        vm.Trazability = localStorageService.get('Trazabilidad');
        vm.insertdatamicrobiology = insertdatamicrobiology;
        vm.samplesate = -1;
        vm.buttonedit = false;
        $rootScope.pageview = 3;
        vm.detailpatient = [];
        vm.formatDate = localStorageService.get('FormatoFecha').toUpperCase() + ', HH:mm:ss';
        vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
        vm.getDetailtracking = getDetailtracking;
        vm.mediaCultures = [];
        vm.procedure = [];
        vm.prueba = false;
        vm.commentrequerid = false;
        vm.enablesiembra = false;
        vm.enablecomment = false;
        vm.checklist = [];
        vm.requerid = false;
        vm.loadingdata = false;

        function modalError(error) {
            if (error.data !== null) {
                if (error.data.code === 2) {
                    error.data.errorFields.forEach(function (value) {
                        var item = value.split('|');
                        if (item[0] === '0' && item[1] === 'The sample has not been configured') {
                            vm.menssageinformative = 'La muestra no se encuentra configurada para microobiologia';
                        }
                        if (item[0] === '0' && item[1] === 'Not tests to growth') {
                            vm.menssageinformative = 'la Prueba no se encuentra configurada en la orden';
                        }
                    });
                }
            }
            if (vm.menssageinformative === '') {
                vm.Error = error;
                vm.ShowPopupError = true;
            }
        }
        function verification() {
            vm.Butonbarcode = false;
            vm.Butondemographics = false;
            angular.element('#verification').select();
            vm.numberOrder = vm.order;
            vm.getSampleOrder();
            vm.detail = [];
            vm.detailpatient = [];
            vm.Repeat = false;
            vm.Repeatabbr = false;
            vm.commentrequerid = false;
            vm.prueba = false;
            vm.commentMicrobiology = '';
            vm.enablesiembra = false;
            vm.mediaCultures = [];
            vm.procedure = [];
        }
        function getSampleOrder() {
            vm.listSample = [];
            vm.menssageinformative = '';
            vm.enablesiembra = false;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (vm.order !== undefined) {
                return sampletrackingsDS.sampleorder(auth.authToken, vm.order).then(function (data) {
                    if (data.status === 200) {
                        if (data.data.length > 0) {
                            vm.Butonbarcode = true;
                            vm.Butondemographics = true;
                            if (vm.sample !== '') {
                                var sample = $filter('filter')(data.data, { codesample: vm.sample });
                                if (sample.length === 0) {
                                    vm.enablesiembra = false;
                                    vm.menssageinformative = $filter('translate')('0180');
                                } else {
                                    if ($filter('filter')(sample, { sampleTrackings: { state: 0 } }).length === 0) {
                                        vm.samplesate = sample[0].sampleState.state;
                                        vm.getDetailtracking();
                                    } else {
                                        vm.menssageinformative = $filter('translate')('0507');
                                    }
                                }
                            }
                        }
                    }
                    else {
                        vm.numberOrder = null;
                        vm.menssageinformative = $filter('translate')('0179');
                    }
                }, function (error) {
                    if (error.data === null) {
                        vm.modalError(error);
                    }
                });
            }
        }
        function getDetailtracking() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.getgrowthortrackingsample(auth.authToken, vm.order, vm.sample).then(function (data) {
                if (data.status === 200) {
                    vm.dateverification = moment(data.data[0].date).format(vm.formatDate);
                    vm.getDetailSample();
                } else {
                    vm.menssageinformative = $filter('translate')('0510');
                }
            }, function (error) {
                vm.modalError(error);

            });
        }
        function getDetailSample() {
            vm.menssageinformative = '';
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.getgrowthordersample(auth.authToken, vm.order, vm.sample).then(function (data) {
                if (data.status === 200) {
                    vm.createdDate = moment(data.data.order.createdDate).format(vm.formatDate);
                    if (data.data.userGrowth === undefined) {
                        if (data.data.dateGrowth !== undefined) {
                            vm.enablesiembra = true;
                            vm.menssageinformative = $filter('translate')('0511');
                        } else {
                            vm.detail = data.data;
                            vm.gettestprocedureid(data.data.test.id);
                            vm.gettestmediaculturesid(data.data.test.id);
                        }
                    } else {
                        if (data.data.userGrowth.id === 0) {
                            vm.detail = data.data;
                            vm.gettestprocedureid(data.data.test.id);
                            vm.gettestmediaculturesid(data.data.test.id);
                        } else {
                            vm.enablesiembra = true;
                            vm.menssageinformative = $filter('translate')('0511');
                        }
                    }
                }
                else {
                    vm.menssageinformative = $filter('translate')('0179');
                    vm.numberOrder = null;
                }
            }, function (error) {
                vm.modalError(error);

            });
        }
        function gettestprocedureid(id) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.gettestprocedureid(auth.authToken, id).then(function (data) {
                if (data.status === 200) {
                    vm.procedure = $filter('filter')(data.data, { procedure: { selected: true } });
                }
            }, function (error) {
                vm.modalError(error);

            });
        }
        function gettestmediaculturesid(id) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.gettestmediaculturesid(auth.authToken, id).then(function (data) {
                if (data.status === 200) {
                    vm.mediaCultures = $filter('filter')(data.data.mediaCultures, { select: true });
                }
            }, function (error) {
                vm.modalError(error);

            });
        }
        function insertdatamicrobiology() {
            vm.loadingdata = true;
            vm.detail.mediaCultures = $filter('filter')(vm.mediaCultures, { defectValue: true });
            var laboratorio = [];
            vm.procedure.forEach(function (value, key) {
                if (value.procedure.defaultvalue === true) {
                    var object = {
                        'id': value.procedure.id,
                        'confirmatorytest': value.procedure.confirmatorytest,
                        'selected': value.procedure.selected
                    };
                    laboratorio.push(object);
                }
            });
            vm.detail.procedures = laboratorio;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.microbiologygrowth(auth.authToken, vm.detail).then(function (data) {
                if (data.status === 200) {
                    var searchconsult = {
                        'rangeType': 1,
                        'init': vm.order,
                        'end': vm.order
                    };
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return queriesDS.getsearch(auth.authToken, searchconsult).then(function (data) {
                        if (data.status === 200) {
                            data.data[0].patient.birthday = common.getAgeAsString(moment(data.data[0].patient.birthday).format(vm.formatDateAge), vm.formatDateAge);
                            if (($filter('translate')('0000')) === 'esCo') {
                                var sexname = data.data[0].patient.sex.esCo;
                            }
                            else {
                                var sexname = data.data[0].patient.sex.enUsa;
                            }

                            vm.detailpatient = {
                                'photo': data.data[0].patient.photo === undefined ? '' : data.data[0].patient.photo,
                                'name1': data.data[0].patient.name1,
                                'name2': data.data[0].patient.name2 === undefined ? '' : data.data[0].patient.name2,
                                'lastName': data.data[0].patient.lastName === undefined ? '' : data.data[0].patient.lastName,
                                'surName': data.data[0].patient.surName === undefined ? '' : data.data[0].patient.surName,
                                'order': data.data[0].patient.orderNumber,
                                'patientid': data.data[0].patient.patientId,
                                'ages': data.data[0].patient.birthday,
                                'sex': sexname,
                                'email': data.data[0].patient.email === undefined ? '' : data.data[0].patient.email
                            };
                            vm.getSampleOrder();
                            vm.detail = [];
                            vm.mediaCultures = [];
                            vm.procedure = [];
                            vm.loadingdata = false;
                            logger.success($filter('translate')('0512'));

                        } else {
                            vm.getSampleOrder();
                            vm.detail = [];
                            vm.mediaCultures = [];
                            vm.procedure = [];
                            vm.loadingdata = false;
                            logger.success($filter('translate')('0512'));
                        }
                    },
                        function (error) {
                            vm.loadingdata = false;
                            vm.modalError(error);
                        });
                }
            }, function (error) {
                vm.loadingdata = false;
                vm.modalError(error);

            });
        }
        vm.loadDemographicControls = loadDemographicControls;
        function loadDemographicControls() {
            vm.demopatient = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            orderentryDS.getDemographics(auth.authToken, 'H').then(
                function (response) {
                    vm.demopatient = $filter('orderBy')(response.data, 'orderingDemo');
                },
                function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
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
        function init() {
            vm.loadDemographicControls()
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */