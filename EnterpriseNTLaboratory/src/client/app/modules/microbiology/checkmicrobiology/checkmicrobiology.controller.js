/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.checkmicrobiology')
        .controller('checkmicrobiologyController', checkmicrobiologyController);

    checkmicrobiologyController.$inject = ['microbiologyDS', 'sampletrackingsDS', 'localStorageService',
        'logger', '$filter', '$state', '$rootScope', 'destinationDS', 'orderentryDS'];

    function checkmicrobiologyController(microbiologyDS, sampletrackingsDS, localStorageService,
        logger, $filter, $state, $rootScope, destinationDS, orderentryDS) {

        var vm = this;
        vm.isAuthenticate = isAuthenticate;
        vm.init = init;
        vm.title = 'CheckMicrobiology';
        vm.state = true;
        $rootScope.menu = true;
        $rootScope.NamePage = $filter('translate')('0024');
        $rootScope.helpReference = '03.Microbiology/checkmicrobiology.htm';
        vm.getSampleOrder = getSampleOrder;
        vm.modalError = modalError;
        vm.order = '';
        vm.menssageinformative = '';
        vm.numberOrder = null;
        vm.verification = verification;
        vm.sample = '';
        vm.getanatomicalsites = getanatomicalsites;
        vm.getcollectionmethod = getcollectionmethod;
        vm.update = update;
        vm.openanatomic = false;
        vm.New = New;
        vm.save = save;
        vm.getanatomicalsitessave = getanatomicalsitessave;
        vm.Repeatabbr = false;
        vm.Repeat = false;
        vm.getDetailSample = getDetailSample;
        vm.detail = [];
        vm.Trazability = localStorageService.get('Trazabilidad');
        vm.DestinationMicrobiology = localStorageService.get('DestinoVerificaMicrobiologia');
        vm.DestinationMicrobiology2 = localStorageService.get('DestinoVerificaMicrobiologia2');
        vm.keytakesample = localStorageService.get('TomaMuestra');
        vm.viewalarm =
        localStorageService.get("VerAlarmaCalidadMuestra") === "True";

        console.log(vm.viewalarm)
  
        vm.takesample = takesample;
        vm.verifyInitial = verifyInitial;
        vm.verifyDestination = verifyDestination;
        vm.insertdatamicrobiology = insertdatamicrobiology;
        vm.samplesate = -1;
        vm.buttonedit = false;
        vm.subSampleid = [];
        vm.anatomicalsitesid = [];
        vm.getcollectionmethodid = [];
        vm.listtest = [];
        vm.enablecomment = false;
        vm.edit = false;
        vm.requerid = false;
        vm.formatDate = localStorageService.get('FormatoFecha') + ', HH:mm:ss';
        vm.loadingdata = true;
        vm.listroutesampleconfigurate = true;
        vm.getrouteSample = getrouteSample;
        vm.notes = [];
        vm.Butondemographics = false;
        vm.closemodaldemographics = closemodaldemographics;
        vm.getDestination = getDestination;
        $rootScope.pageview = 3;

        function closemodaldemographics() {
            UIkit.modal("#demographicsmodal").hide();
        }
        function New() {
            vm.openanatomic = true;
            vm.Repeatabbr = false;
            vm.Repeat = false;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.data = {
                'user': {
                    'id': auth.id
                },
                'id': null,
                'name': '',
                'abbr': '',
                'state': true
            };
        }
        function save() {
            vm.Repeatabbr = '';
            vm.Repeat = '';
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.Newanatomicalsites(auth.authToken, vm.data).then(function (data) {
                if (data.status === 200) {
                    vm.openanatomic = false;
                    vm.saveabr = vm.data.abbr;
                    vm.getanatomicalsitessave();
                }
            }, function (error) {
                vm.modalError(error);
            });
        }
        function modalError(error) {
            vm.loadingdata = false;
            if (error.data !== null) {
                if (error.data.code === 2) {
                    error.data.errorFields.forEach(function (value) {
                        var item = value.split('|');
                        if (item[0] === '1' && item[1] === 'name') {
                            vm.Repeat = true;
                        }
                        if (item[0] === '1' && item[1] === 'abbr') {
                            vm.Repeatabbr = true;
                        }
                        if (item[0] === '0' && item[1] === 'sample') {
                            if (vm.samplemicro) {
                                vm.menssageinformative = $filter('translate')('0505');
                            } else {
                                vm.menssageinformative = $filter('translate')('1596');
                            }
                        }
                        if (item[0] === '0' && item[1] === 'The sample has not been configured') {
                            if (vm.samplemicro) {
                                vm.menssageinformative = $filter('translate')('0505');
                            } else {
                                vm.menssageinformative = $filter('translate')('1596');
                            }
                        }
                        if (item[0] === '0' && item[1] === 'Not tests to growth') {
                            vm.menssageinformative = $filter('translate')('0506');
                        }
                    });
                }
            }
            if (vm.Repeat === false && vm.Repeatabbr === false && vm.menssageinformative === '') {
                vm.Error = error;
                vm.ShowPopupError = true;
            }
        }
        function verification() {
            vm.Butondemographics = false;
            vm.menssageinformative = '';
            vm.enablecomment = false;
            vm.Butonbarcode = false;
            vm.Butoninterview = false;
            angular.element('#verification').select();
            vm.clean = 1;
            var number = vm.order;
            vm.numberOrder = number;
            vm.getSampleOrder();
            vm.detail = [];
            vm.Repeat = false;
            vm.Repeatabbr = false;
            vm.edit = false;
        }
        function getSampleOrder() {
            vm.listSample = [];
            vm.showsample = false;
            vm.samplemicro = false;
            vm.menssageinformative = '';
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (vm.order !== undefined) {
                return sampletrackingsDS.sampleorder(auth.authToken, vm.order).then(function (data) {
                    if (data.status === 200) {
                        vm.Butondemographics = true;
                        if (data.data.length > 0) {
                            if (vm.sample !== '') {
                                var sample = $filter("filter")(data.data, function (e) {
                                    return e.codesample === vm.sample;
                                })
                                if (sample.length === 0) {
                                    vm.menssageinformative = $filter('translate')('0180');
                                } else {
                                    if ($filter('filter')(sample, { sampleTrackings: { state: 0 } }).length === 0) {
                                        vm.samplesate = sample[0].sampleState.state;
                                        vm.menssageinformative = '';
                                        vm.samplemicro = sample[0].laboratorytype.search("3") === -1 ? true : false;
                                        vm.getDetailSample();
                                        if (parseInt(vm.Trazability) === 3 && vm.DestinationMicrobiology !== "") {
                                            vm.getrouteSample();
                                        }
                                    } else {
                                        vm.menssageinformative = $filter('translate')('0507');
                                    }
                                }
                            } else {
                                var samplemicrobiology = [];
                                data.data.forEach(function (value, key) {
                                    var sampleverific = $filter("filter")(
                                        value.sampleTrackings,
                                        {
                                            state: 4,
                                        }
                                    );
                                    value.tests = $filter("filter")(value.tests, function (e) {
                                        return e.testType === 0;
                                    })
                                    if (value.qualityFlag === 3 && sampleverific.length > 0) {
                                        var minutes = moment().diff(
                                            sampleverific[0].date,
                                            "seconds"
                                        );
                                        var timeline = moment().subtract(
                                            minutes - value.qualityTime * 59,
                                            "seconds"
                                        );
                                        value.time = parseInt(moment(timeline).format("x"));
                                    } else if (
                                        value.qualityFlag === 2 &&
                                        sampleverific.length > 0
                                    ) {
                                        var minutes = moment().diff(
                                            sampleverific[0].date,
                                            "seconds"
                                        );
                                        var timeline = moment().add(
                                            value.qualityTime * 59 - minutes,
                                            "seconds"
                                        );
                                        value.time = parseInt(moment(timeline).format("x"));
                                    }
                                    if (value.laboratorytype.search("3") !== -1) {
                                        samplemicrobiology.push(value)
                                    }
                                });

                                if (samplemicrobiology.length === 0) {
                                    vm.menssageinformative = $filter('translate')('1595');
                                    vm.showsample = false;
                                } else {
                                    vm.listSample = _.orderBy(samplemicrobiology, ["codesample"], ["asc"]);
                                    vm.showsample = true;
                                }
                            }
                        }
                    }
                    else {
                        vm.menssageinformative = $filter('translate')('0179');
                        vm.numberOrder = null;
                    }
                }, function (error) {
                    if (error.data === null) {
                        vm.modalError(error);
                    }
                });
            }
        }
        function getDetailSample(sampleState) {

            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.getgrowthordersample(auth.authToken, vm.order, vm.sample).then(function (data) {
                if (data.status === 200) {
                    if (data.data.anatomicalSite === undefined) {
                        vm.anatomicalsitesid.selected = [];
                    } else {
                        vm.edit = data.data.anatomicalSite.id === undefined ? true : false;
                        vm.anatomicalsitesid.selected = data.data.anatomicalSite.id === undefined ? [] : data.data.anatomicalSite;
                    }
                    if (data.data.collectionMethod === undefined) {
                        vm.getcollectionmethodid.selected = [];
                    } else {
                        vm.getcollectionmethodid.selected = data.data.collectionMethod.id === undefined ? [] : data.data.collectionMethod;
                    }
                    vm.filtersubSample = data.data.sample.subSamples;
                    var selected = _.filter(vm.filtersubSample, function (o) { return o.selected; });
                    vm.subSampleid.selected = selected.length === 0 ? [] : selected[0];
                    data.data.test = data.data.test === null || data.data.test === undefined ? (data.data.tests.length > 0 ? data.data.tests[0] : null) : data.data.test;
                    vm.listtest = data.data.tests;
                    vm.detail = data.data;
                    vm.Butonbarcode = true;
                    vm.Butoninterview = true;
                    vm.listDestination.selected = _.filter(vm.listDestination, function (o) { return o.id === parseInt(data.data.destination) })[0];


                }
                else {
                    vm.menssageinformative = $filter('translate')('0179');
                }
            }, function (error) {
                vm.modalError(error);

            });
        }
        function takesample() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return sampletrackingsDS.sampletrackingstake(auth.authToken, vm.order, vm.sample).then(function (data) {
                if (data.status === 200) {
                    vm.verifyInitial();
                } else {
                    vm.loadingdata = false;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        function verifyInitial() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return sampletrackingsDS.sampletrackings(auth.authToken, vm.order, vm.sample).then(function (data) {
                if (data.status === 200) {
                    if (parseInt(vm.Trazability) === 3 && vm.DestinationMicrobiology !== "") {
                        vm.verifyDestination();
                    }
                    else {
                        vm.insertdatamicrobiology();
                    }
                } else {
                    vm.loadingdata = false;
                }
            }, function (error) {
                vm.modalError(error);
            });
        }

        function getrouteSample() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return sampletrackingsDS.SampleOrderRoute(auth.authToken, vm.order, vm.sample).then(function (data) {
                if (data.status === 204) {
                    vm.listroutesampleconfigurate = false;
                    vm.menssageinformative = $filter('translate')('0482');
                }
                else {
                    vm.routerSample = data.data;
                }
            });
        }
        function verifyDestination() {

            var selected = _.filter(vm.routerSample.destinationRoutes, function (o) { return o.destination.id === parseInt(vm.DestinationMicrobiology) });
            if (selected.length > 0) {
                if (selected[0].verify === false) {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    var detail = {
                        "order": vm.order,
                        "sample": vm.sample,
                        "destination": selected[0].id,
                        "approved": true,
                        "assigmentDestination": 0,
                        "branch": auth.branch
                    };

                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return sampletrackingsDS.sampleVerifyDestination(auth.authToken, detail).then(function (data) {
                        if (data.status === 200) {
                            vm.insertdatamicrobiology();
                        }
                    }, function (error) {
                        if (error.data.code === 2) {
                            vm.insertdatamicrobiology();
                        }
                        else {
                            vm.modalError(error);
                        }
                    });
                } else {
                    vm.insertdatamicrobiology();
                }
            }
            else {
                vm.insertdatamicrobiology();
            }
        }
        function getanatomicalsitessave() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.getanatomicalsites(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.anatomicalsites = data.data;
                    vm.anatomicalsitesid.selected = $filter('filter')(vm.anatomicalsites, { abbr: vm.saveabr }, true)[0];
                }
            }, function (error) {
                vm.modalError(error);

            });
        }
        function getanatomicalsites() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.getanatomicalsites(auth.authToken).then(function (data) {
                vm.getcollectionmethod();
                if (data.status === 200) {
                    vm.anatomicalsites = data.data;
                }
            }, function (error) {
                vm.modalError(error);

            });
        }

        function getDestination() {

            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return destinationDS.getdestinations(auth.authToken).then(function (data) {
                if (data.status === 200) {
                    vm.listDestination = _.filter(data.data, function (o) { return o.id === parseInt(vm.DestinationMicrobiology) || o.id === parseInt(vm.DestinationMicrobiology2) });
                    vm.listDestination.select = vm.listDestination[0];
                }
            }, function (error) {
                vm.modalError(error);

            });
        }

        function getcollectionmethod() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.getcollectionmethod(auth.authToken).then(function (data) {
                vm.loadingdata = false;
                vm.getDestination();
                if (data.status === 200) {
                    vm.getcollectionmethod = data.data;
                }
            }, function (error) {
                vm.modalError(error);

            });
        }
        function update() {
            vm.loadingdata = true;
            switch (vm.samplesate) {
                case 2:
                    if (vm.keytakesample === "True") {
                        vm.takesample();
                    }
                    else {
                        vm.verifyInitial();
                    }
                    break;
                case 3:
                    vm.verifyInitial();
                    break;
                case 4:
                    if (vm.Trazability === "3" && vm.DestinationMicrobiology !== "") {
                        vm.verifyDestination();
                    }
                    else {
                        vm.insertdatamicrobiology();
                    }
                    break;
            }
        }
        function insertdatamicrobiology() {
            vm.loadingdata = true;
            vm.detail.commentMicrobiology = vm.notes.length === 0 ? '' : JSON.stringify(vm.notes);
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var datainsert = {
                'user': vm.detail.user,
                'order': vm.detail.order,
                'test': vm.detail.test,
                'sample': vm.detail.sample,
                'commentMicrobiology': vm.detail.commentMicrobiology.isAuthenticate
            };

            if (vm.getcollectionmethodid.selected !== undefined) {
                if (vm.getcollectionmethodid.selected.length !== 0) {
                    datainsert.collectionMethod = vm.getcollectionmethodid.selected;
                }
            }

            if (vm.anatomicalsitesid.selected !== undefined) {
                if (vm.anatomicalsitesid.selected.length !== 0) {
                    datainsert.anatomicalSite = vm.anatomicalsitesid.selected;
                }
            }

            if (vm.subSampleid.selected !== undefined) {
                if (vm.subSampleid.selected.length !== 0) {
                    datainsert.subSample = vm.subSampleid.selected;
                }
            }

            if (vm.listDestination.selected !== undefined) {
                if (vm.listDestination.selected.length !== 0) {
                    datainsert.destination = vm.listDestination.selected.id;
                }
            }



            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return microbiologyDS.insertmicrobiology(auth.authToken, datainsert).then(function (data) {
                if (data.status === 200) {
                    vm.verification();
                    vm.loadingdata = false;
                    logger.success($filter('translate')('0149'));
                }
                else {
                    vm.loadingdata = false;
                    vm.menssageinformative = $filter('translate')('0179');
                }
            }, function (error) {
                vm.loadingdata = false;
                vm.modalError(error);
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


        function init() {
            vm.loadDemographicControls();
            vm.getanatomicalsites();
        }

        vm.isAuthenticate();
    };
})();
/* jshint ignore:end */
