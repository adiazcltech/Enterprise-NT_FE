/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.inconsistency')
        .controller('InconsistencyController', InconsistencyController);

    InconsistencyController.$inject = ['common', 'inconsistenciesDS', 'listDS', 'demographicsItemDS', 'localStorageService', 'logger',
        '$filter', '$state', 'moment', '$rootScope', 'documenttypesDS', 'raceDS'];
    function InconsistencyController(common, inconsistenciesDS, listDS, demographicsItemDS, localStorageService,
        logger, $filter, $state, moment, $rootScope, documenttypesDS, raceDS) {
        var vm = this;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.title = 'Inconsistency';
        $rootScope.helpReference = '01. LaboratoryOrders/inconsistency.htm';
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0301');
        vm.dateseach = moment().format();
        vm.max = moment().format();
        vm.getorder = getorder;
        vm.getDetail = getDetail;
        vm.order = [];
        vm.ListOrder = [];
        vm.Listlisthis = [];
        vm.DemograficoInconsistensias = localStorageService.get('DemograficoInconsistensias');
        vm.formatDateAge = localStorageService.get('FormatoFecha').toUpperCase();
        vm.typedocument = localStorageService.get('ManejoTipoDocumento');
        vm.typedocument = vm.typedocument === 'True' || vm.typedocument === true ? true : false;
        vm.ManejoRace = localStorageService.get('ManejoRaza');
        vm.ManejoRace = vm.ManejoRace === 'True' || vm.ManejoRace === true ? true : false;
        vm.demograficolis = '';
        vm.demograficohis = '';
        vm.save = save;
        $rootScope.pageview = 3;
        vm.modalError = modalError;
        vm.ShowPopupError = false;
        vm.isOpenReport = true;
        vm.getsex = getsex;
        vm.getdemographicitems = getdemographicitems;
        vm.gettypedocument = gettypedocument;
        vm.getrace = getrace;
        vm.datehoytoday = moment().format('YYYYMMDD');
        vm.rangeInit = vm.datehoytoday;
        vm.rangeEnd = vm.datehoytoday;
        vm.sortType = 'orderNumber';
        vm.loadingdata = true;
        vm.varnull = $filter('translate')('0681');
        //** Método para sacar el popup de error**//
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        //** Método para resolver la Inconsistencia **//
        function save(id) {
            vm.inconcistencialis = id === 2 ? true : false;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return inconsistenciesDS.resolveinconsistencies(auth.authToken, vm.order.orderNumber, vm.inconcistencialis).then(function (data) {
                if (data.status === 200) {
                    vm.selected = -1;
                    vm.ListOrder = [];
                    vm.order = [];
                    vm.getorder();
                    logger.success($filter('translate')('0302'));

                }

            }, function (error) {
                vm.modalError(error);
            });
        }
        //** Método para resolver la Inconsistencia **//
        function getorder() {
            vm.errorpatientId = false;
            vm.errorname = false;
            vm.errorlastName = false;
            vm.errorbirthday = false;
            vm.errorsex = false;
            vm.selected = -1;
            vm.ListOrder = [];
            vm.HISbirthday = '';
            vm.LISbirthday = '';
            vm.lisname = '';
            vm.hisname = '';
            vm.demograficolis = '';
            vm.demograficohis = '';
            var dateinit = new Date(moment(vm.rangeInit).format()).getTime();
            var dateend = new Date(moment(vm.rangeEnd).format()).getTime();
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.loadingdata = true;
            return inconsistenciesDS.getinconsistencies(auth.authToken, dateinit, dateend).then(function (data) {
                vm.loadingdata = false;
                vm.order = [];
                vm.loadingdata = false;
                if (data.status === 200) {
                    vm.ListOrder = data.data;
                } else {
                    logger.success($filter('translate')('0303'));
                }

            }, function (error) {
                vm.loadingdata = false;
                vm.modalError(error);
            });
        }

        //** Método para obtener lista de género **//
        function getsex() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return listDS.getList(auth.authToken, 6).then(function (data) {
                vm.getdemographicitems();
                if (data.status === 200) {
                    vm.sex = data.data;
                }
            },
                function (error) {
                    vm.modalError(error);
                });

        }
        //** Método para obtener lista de race **//
        function getrace() {
            vm.race = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return raceDS.getrace(auth.authToken).then(function (data) {
                vm.getorder();
                if (data.status === 200) {
                    vm.race = data.data;
                }
            },
                function (error) {
                    vm.modalError(error);
                });

        }
        //** Método para obtener lista de tipo de socumento **//
        function gettypedocument() {
            vm.documenttypes = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return documenttypesDS.getDocumentType(auth.authToken).then(function (data) {
                vm.getrace();
                if (data.status === 200) {
                    vm.documenttypes = data.data;
                }
            },
                function (error) {
                    vm.modalError(error);
                });

        }
        //** Método para obtener lista de item demografico **//
        function getdemographicitems() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return demographicsItemDS.getState(auth.authToken).then(function (data) {
                vm.gettypedocument();
                if (data.status === 200) {
                    vm.demographicsItem = data.data;
                }
            },
                function (error) {
                    vm.modalError(error);
                });

        }
        //** Método que llena la listas de lis y his **//
        function getDetail(order) {
            vm.selected = order;
            vm.Listlisthis = [];
            vm.order = [];
            vm.Listlisthis = $filter('filter')(vm.ListOrder, { orderNumber: order })[0];
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
            vm.lisname = vm.Listlisthis.patientLIS.name2 === undefined ? vm.Listlisthis.patientLIS.name1 : vm.Listlisthis.patientLIS.name1 + " " + vm.Listlisthis.patientLIS.name2;
            var Hisname2 = vm.Listlisthis.patientHIS.name2 === undefined ? "" : vm.Listlisthis.patientHIS.name2;
            vm.hisname = vm.Listlisthis.patientHIS.name1 + " " + Hisname2;
            vm.demograficolis = '';
            vm.demograficohis = '';
            vm.demographicsname = '';


            // if (vm.DemograficoInconsistensias === '-7'){
            //      if(vm.ManejoRace===true) {                  
            //      vm.demo = $filter('filter')(vm.race, { id: vm.Listlisthis.patientLIS.race.id })[0];
            //      vm.demograficolis = vm.demo.name;

            //      vm.demoh = $filter('filter')(vm.race, { id: vm.Listlisthis.patientHIS.race.id })[0];
            //      vm.demograficohis = vm.demo.name;

            //      }

            // }else if (vm.DemograficoInconsistensias === '-10'){
            //    if(vm.typedocument===true){
            //     vm.demo = $filter('filter')( vm.documenttypes, { id: vm.Listlisthis.patientLIS.documentType.id })[0];
            //     vm.demograficolis = vm.demo.name;

            //     vm.demoh = $filter('filter')(vm.documenttypes, { id: vm.Listlisthis.patientHIS.documentType.id })[0];
            //     vm.demograficohis = vm.demo.name; 
            //    }
            // }else if (vm.DemograficoInconsistensias === '-106'){
            //      vm.demograficolis = vm.Listlisthis.patientLIS.email;
            //      vm.demograficohis = vm.Listlisthis.patientHIS.email;

            // }else 
            if (vm.DemograficoInconsistensias !== '?' && vm.DemograficoInconsistensias !== '0') {

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
            vm.errorpatientId = vm.inconsistencies.indexOf("patientId") >= 0 ? true : false;
            vm.errorname = vm.inconsistencies.indexOf("name") >= 0 ? true : false;
            vm.errorlastName = vm.inconsistencies.indexOf("lastName") >= 0 ? true : false;
            vm.errorsurName = vm.inconsistencies.indexOf("surName") >= 0 ? true : false;
            vm.errorbirthday = vm.inconsistencies.indexOf("birthday") >= 0 ? true : false;
            vm.errorsex = vm.inconsistencies.indexOf("sex") >= 0 ? true : false;
            vm.errordemographip = vm.demograficohis === vm.demograficolis ? false : true;

            vm.order = vm.Listlisthis;

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
            vm.getsex();
        }

        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */