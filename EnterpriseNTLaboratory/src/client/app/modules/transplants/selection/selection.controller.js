/* jshint ignore:start */
(function () {
    'use strict';
    angular
        .module('app.selection')
        .controller('selectionController', selectionController);
    selectionController.$inject = ['localStorageService', 'logger', '$scope',
        '$filter', '$state', 'moment', '$rootScope', 'common', 'recepctionDS', 'selectionDS'];
    function selectionController(localStorageService, logger, $scope,
        $filter, $state, moment, $rootScope, common, recepctionDS, selectionDS) {
        var vm = this;
        vm.title = 'selection';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.pageview = 3;
        $rootScope.NamePage = $filter('translate')('3320');
        vm.modalError = modalError;
        function modalError(error) {
            vm.Error = error;
            vm.ShowPopupError = true;
        }
        vm.isAuthenticate = isAuthenticate;
        function isAuthenticate() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            if (auth === null || auth.token) {
                $state.go('login');
            } else {
                vm.init();
            }
        }
        vm.init = init;
        function init() {
            vm.formatDate = localStorageService.get('FormatoFecha');
            vm.ListBloodtype = [
                {
                    id: '0',
                    name: $filter('translate')('0353')
                },
                {
                    id: 'A',
                    name: 'A'
                },
                {
                    id: 'B',
                    name: 'B'
                },
                {
                    id: 'AB',
                    name: 'AB'
                },
                {
                    id: 'O',
                    name: 'O'
                }
            ]
            vm.organDonor = [
                {
                    id: 1,
                    name: $filter('translate')('2091')
                }, //Corazón
                {
                    id: 2,
                    name: $filter('translate')('2092')
                }, //Riñón
                {
                    id: 3,
                    name: $filter('translate')('2093')
                },//Hígado
                {
                    id: 4,
                    name: $filter('translate')('2094')
                },//Pulmón
                {
                    id: 5,
                    name: $filter('translate')('2095')
                },//Intestino
                {
                    id: 6,
                    name: $filter('translate')('2096')
                },//Páncreas
                {
                    id: 7,
                    name: $filter('translate')('2097')
                },//Vías aéreas
                {
                    id: 8,
                    name: $filter('translate')('2098')
                },//Células Limbares
                {
                    id: 9,
                    name: $filter('translate')('2099')
                },//Multivisceral
                {
                    id: 10,
                    name: $filter('translate')('3308')
                },//islotes pancreáticos           
            ];
            vm.organ = _.clone(vm.organDonor);
            vm.ListDonor = [];
            vm.getInstitution();
        }
        vm.getInstitution = getInstitution;
        function getInstitution() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListInstitution = [];
            return recepctionDS.getinstitution(auth.authToken).then(
                function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        vm.ListInstitution = data.data;
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.getdonor = getdonor;
        function getdonor(input) {
            if (input === 1) {
                $scope.$apply(function () {
                    vm.idorgantype = undefined;
                    vm.donor = {};
                    vm.datadonor = {};
                    vm.organ = _.clone(vm.organDonor);
                });
            }
            if (vm.institution.selected !== undefined && vm.idorgantype !== undefined) {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                vm.ListDonor = [];
                return selectionDS.getDonorIntitutionOrgan(auth.authToken, vm.institution.selected.id, vm.idorgantype).then(
                    function (data) {
                        vm.loadingdata = false;
                        if (data.status === 200) {
                            data.data.forEach(function (value) {
                                value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName
                            });
                            vm.ListDonor = data.data;
                        }
                    },
                    function (error) {
                        vm.loadingdata = false;
                        vm.modalError(error);
                    }
                );

            }

        }
        vm.getdonorchangue = getdonorchangue;
        function getdonorchangue() {
            if (vm.donor.selected !== undefined) {
                vm.datadonor = {};
                vm.donorselect = {};
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                return selectionDS.getdonorHLAPatient(auth.authToken, vm.donor.selected.id).then(
                    function (data) {
                        vm.loadingdata = false;
                        if (data.status === 200) {
                            vm.donorselect = data.data;
                            vm.datadonor.bloodgroup = data.data.bloodgroup;
                            vm.datadonor.hladbr1 = data.data.drb1.replace(/\./g, ',');
                            vm.datadonor.hlab = data.data.b.replace(/\./g, ',');
                            vm.datadonor.hlaa = data.data.a.replace(/\./g, ',');
                            var numeros = _.map(_.split(data.data.donatedorgan, ','), function (item) {
                                return parseInt(item, 10); // 10 es la base numérica (decimal)
                            });
                            vm.selected = numeros;
                            var validateorgan = false;
                            var donatedorgan = [];
                            vm.selected.forEach(function (value) {
                                if (vm.idorgantype === value) {
                                    validateorgan = true;
                                }
                                var data = _.filter(_.clone(vm.organDonor), function (o) { return value === o.id; });
                                donatedorgan.push(data[0]);
                            });
                            if (!validateorgan) {
                                vm.idorgantype = undefined;
                            }
                            vm.organ = donatedorgan;
                        }
                    },
                    function (error) {
                        vm.loadingdata = false;
                        vm.modalError(error);
                    }
                );

            }
        }
        vm.searchkey = searchkey;
        function searchkey($event) {
            var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
            if (keyCode === 13) {
                vm.getseach();
            }
        }
        vm.getseach = getseach;
        function getseach() {
            vm.listSelection = [];
            vm.loadingdata = true;
            vm.datadonor.hladbr1 = vm.datadonor.hladbr1.replace(/\./g, ',');
            vm.datadonor.hlaa = vm.datadonor.hlaa.replace(/\./g, ',');
            vm.datadonor.hlab = vm.datadonor.hlab.replace(/\./g, ',');
            var hladbr1 = vm.datadonor.hladbr1.split(',');
            var hlaa = vm.datadonor.hlaa.split(',');
            var hlab = vm.datadonor.hlab.split(',');
            vm.searchSelection = {
                "a1": hlaa[0],
                "a2": hlaa[1],
                "b1": hlab[0],
                "b2": hlab[1],
                "drb11": hladbr1[0],
                "drb12": hladbr1[1],
                "bloodgroup": vm.datadonor.bloodgroup,
                "organ": vm.idorgantype
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return selectionDS
                .getreciverSelection(auth.authToken, vm.searchSelection)
                .then(
                    function (data) {
                        vm.loadingdata = false;
                        if (data.data.length !== 0) {
                            data.data.forEach(function (value) {
                                value.age = common.getAgeAsString(moment(value.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                                value.name = value.name1 + ' ' + value.name2 + ' ' + value.surName + ' ' + value.lastName;
                                if (vm.searchSelection.organ === 2) {
                                    value.listscore = [];
                                    value.total = 0;
                                    value.scorea = 0;
                                    value.scoreb = 0;
                                    value.scoredrb = 0;
                                    value.scorebloodgroup = 0;
                                    value.scoreage = 0;

                                    value.percentagedrb = 0;
                                    value.percentagea = 0;
                                    value.percentageb = 0;
                                    value.percentageage = 0;
                                    value.percentagebloodgroup = 0;

                                    // tiempo en lista de espera
                                    var agedateinclusionwaitinglist = moment(value.dateinclusionwaitinglist).format('YYYY-MM-DD');
                                    var yearsdateinclusionwaitinglist = moment().diff(agedateinclusionwaitinglist, 'years');
                                    if (yearsdateinclusionwaitinglist >= 1) {
                                        value.total = yearsdateinclusionwaitinglist * 1;
                                        var detailscore = {
                                            name: $filter('translate')('3641'),
                                            score: yearsdateinclusionwaitinglist * 1
                                        }
                                        value.listscore.push(detailscore);
                                    }

                                    // edad del receptor
                                    var agereceptor = moment(value.birthday).format('YYYY-MM-DD');
                                    var yearsreceptor = moment().diff(agereceptor, 'years');

                                    // grupo sanguineo igual compatible 15 puntos
                                    if (value.bloodgroup === vm.donorselect.bloodgroup) {
                                        value.scorebloodgroup = value.scorebloodgroup + 15;
                                        value.percentagebloodgroup = 100;
                                        var detailscore = {
                                            name: $filter('translate')('3642'),
                                            score: 15
                                        }
                                        value.listscore.push(detailscore);
                                    } else {
                                        // grupo sanguineo diferente en menores de 18 años: compatible 15 puntos
                                        if (vm.donorselect.bloodgroup === 'A' && value.bloodgroup === 'AB' && yearsreceptor < 18) {
                                            value.scorebloodgroup = value.scorebloodgroup + 15;
                                            value.percentagebloodgroup = 100;
                                            var detailscore = {
                                                name: $filter('translate')('3643'),
                                                score: 15
                                            }
                                            value.listscore.push(detailscore);
                                        }
                                        if (vm.donorselect.bloodgroup === 'B' && value.bloodgroup === 'AB' && yearsreceptor < 18) {
                                            value.scorebloodgroup = value.scorebloodgroup + 15;
                                            value.percentagebloodgroup = 100;
                                            var detailscore = {
                                                name: $filter('translate')('3643'),
                                                score: 15
                                            }
                                            value.listscore.push(detailscore);
                                        }
                                        if (vm.donorselect.bloodgroup === 'O' && value.bloodgroup === 'A' && yearsreceptor < 18) {
                                            value.scorebloodgroup = value.scorebloodgroup + 15;
                                            value.percentagebloodgroup = 100;
                                            var detailscore = {
                                                name: $filter('translate')('3643'),
                                                score: 15
                                            }
                                            value.listscore.push(detailscore);
                                        }
                                        if (vm.donorselect.bloodgroup === 'O' && value.bloodgroup === 'B' && yearsreceptor < 18) {
                                            value.scorebloodgroup = value.scorebloodgroup + 15;
                                            value.percentagebloodgroup = 100;
                                            var detailscore = {
                                                name: $filter('translate')('3643'),
                                                score: 15
                                            }
                                            value.listscore.push(detailscore);
                                        }
                                        if (vm.donorselect.bloodgroup === 'O' && value.bloodgroup === 'AB' && yearsreceptor < 18) {
                                            value.scorebloodgroup = value.scorebloodgroup + 15;
                                            value.percentagebloodgroup = 100;
                                            var detailscore = {
                                                name: $filter('translate')('3643'),
                                                score: 15
                                            }
                                            value.listscore.push(detailscore);
                                        }
                                    }

                                    // edad del donante
                                    var agedonor = moment(vm.donorselect.birthday).format('YYYY-MM-DD');
                                    var yearsdonor = moment().diff(agedonor, 'years');

                                    //Donante menor de 30 años /receptor menor de 60 años 2 puntos
                                    if (yearsdonor < 30 && yearsreceptor < 60) {
                                        value.scoreage = value.scoreage + 2;
                                        value.percentageage = value.percentageage + 20;
                                        var detailscore = {
                                            name: $filter('translate')('3644'),
                                            score: 2
                                        }
                                        value.listscore.push(detailscore);
                                    }

                                    //Donante mayor de 60 años /receptor mayor de 60 años 2 puntos
                                    if (yearsdonor > 60 && yearsreceptor > 60) {
                                        value.scoreage = value.scoreage + 2;
                                        value.percentageage = value.percentageage + 20;
                                        var detailscore = {
                                            name: $filter('translate')('3645'),
                                            score: 2
                                        }
                                        value.listscore.push(detailscore);
                                    }

                                    //Donante menor de 18 años /receptor menor de 18 años 4 puntos
                                    if (yearsdonor < 18 && yearsreceptor < 18) {
                                        value.scoreage = value.scoreage + 4;
                                        value.percentageage = value.percentageage + 40;
                                        var detailscore = {
                                            name: $filter('translate')('3646'),
                                            score: 4
                                        }
                                        value.listscore.push(detailscore);
                                    }

                                    // edad de receptores pediatricos
                                    // donantes menores de 35 y receptores menores 11
                                    if (yearsdonor < 35 && yearsreceptor < 11) {
                                        value.scoreage = value.scoreage + 9;
                                        var detailscore = {
                                            name: $filter('translate')('3647'),
                                            score: 9
                                        }
                                        value.listscore.push(detailscore);
                                    }
                                    // donantes menores de 35 y receptores entre 11 y 18
                                    if (yearsdonor < 35 && yearsreceptor >= 11 && yearsreceptor <= 18) {
                                        value.scoreage = value.scoreage + 6;
                                        var detailscore = {
                                            name: $filter('translate')('3648'),
                                            score: 6
                                        }
                                        value.listscore.push(detailscore);
                                    }
                                    if (value.drb1.indexOf(vm.searchSelection.drb11) !== -1) {
                                        value.scoredrb = value.scoredrb + 6;
                                        value.percentagedrb = value.percentagedrb + 50;
                                    }

                                    if (value.drb1.indexOf(vm.searchSelection.drb12) !== -1) {
                                        value.scoredrb = value.scoredrb + 6;
                                        value.percentagedrb = value.percentagedrb + 50;
                                    }

                                    if (value.scoredrb !== 0) {
                                        var detailscore = {
                                            name: 'HLA - DRB1',
                                            score: value.scoredrb
                                        }
                                        value.listscore.push(detailscore);
                                    }

                                    if (value.b.indexOf(vm.searchSelection.b1) !== -1) {
                                        value.scoreb = value.scoreb + 1;
                                        value.percentageb = value.percentageb + 50;
                                    }

                                    if (value.b.indexOf(vm.searchSelection.b2) !== -1) {
                                        value.scoreb = value.scoreb + 1;
                                        value.percentageb = value.percentageb + 50;
                                    }

                                    if (value.scoreb !== 0) {
                                        var detailscore = {
                                            name: 'HLA - B',
                                            score: value.scoreb
                                        }
                                        value.listscore.push(detailscore);
                                    }


                                    if (value.a.indexOf(vm.searchSelection.a1) !== -1) {
                                        value.scorea = value.scorea + 1;
                                        value.percentagea = value.percentagea + 50;
                                    }

                                    if (value.a.indexOf(vm.searchSelection.a2) !== -1) {
                                        value.scorea = value.scorea + 1;
                                        value.percentagea = value.percentagea + 50;
                                    }

                                    if (value.scorea !== 0) {
                                        var detailscore = {
                                            name: 'HLA - A',
                                            score: value.scorea
                                        }
                                        value.listscore.push(detailscore);
                                    }

                                    if (value.scoredrb === 0 && value.scoreb === 0 && value.scorea === 0) {
                                        value.total = 10;
                                    }
                                    // pacientes con cero mis-match con grupo sanguineo diferente compatible 15 puntos
                                    if (value.scoredrb === 0 && value.scoreb === 0 && value.scorea === 0 && vm.donorselect.bloodgroup === 'A' && value.bloodgroup === 'AB') {
                                        value.scorebloodgroup = value.scorebloodgroup + 15;
                                        var detailscore = {
                                            name: $filter('translate')('3649'),
                                            score: 15
                                        }
                                        value.listscore.push(detailscore);
                                    }
                                    if (value.scoredrb === 0 && value.scoreb === 0 && value.scorea === 0 && vm.donorselect.bloodgroup === 'B' && value.bloodgroup === 'AB') {
                                        value.scorebloodgroup = value.scorebloodgroup + 15;
                                        var detailscore = {
                                            name: $filter('translate')('3649'),
                                            score: 15
                                        }
                                        value.listscore.push(detailscore);
                                    }
                                    if (value.scoredrb === 0 && value.scoreb === 0 && value.scorea === 0 && vm.donorselect.bloodgroup === 'A' && value.bloodgroup === 'AB') {
                                        value.scorebloodgroup = value.scorebloodgroup + 15;
                                        var detailscore = {
                                            name: $filter('translate')('3649'),
                                            score: 15
                                        }
                                        value.listscore.push(detailscore);
                                    }
                                    if (value.scoredrb === 0 && value.scoreb === 0 && value.scorea === 0 && vm.donorselect.bloodgroup === 'O' && value.bloodgroup === 'A') {
                                        value.scorebloodgroup = value.scorebloodgroup + 15;
                                        var detailscore = {
                                            name: $filter('translate')('3649'),
                                            score: 15
                                        }
                                        value.listscore.push(detailscore);
                                    }
                                    if (value.scoredrb === 0 && value.scoreb === 0 && value.scorea === 0 && vm.donorselect.bloodgroup === 'O' && value.bloodgroup === 'B') {
                                        value.scorebloodgroup = value.scorebloodgroup + 15;
                                        var detailscore = {
                                            name: $filter('translate')('3649'),
                                            score: 15
                                        }
                                        value.listscore.push(detailscore);
                                    }
                                    if (value.scoredrb === 0 && value.scoreb === 0 && value.scorea === 0 && vm.donorselect.bloodgroup === 'O' && value.bloodgroup === 'AB') {
                                        value.scorebloodgroup = value.scorebloodgroup + 15;
                                        var detailscore = {
                                            name: $filter('translate')('3649'),
                                            score: 15
                                        }
                                        value.listscore.push(detailscore);
                                    }

                                    value.total = value.total + value.scoredrb + value.scoreb + value.scorea + value.scorebloodgroup + value.scoreage;

                                } else {
                                    value.scorea = 0;
                                    value.scoreb = 0;
                                    value.scoredrb = 0;

                                    value.percentagedrb = 0;
                                    value.percentagea = 0;
                                    value.percentageb = 0;


                                    if (value.drb1.indexOf(vm.searchSelection.drb11) !== -1) {
                                        value.scoredrb = value.scoredrb + 4;
                                        value.percentagedrb = value.percentagedrb + 50;
                                    }

                                    if (value.drb1.indexOf(vm.searchSelection.drb12) !== -1) {
                                        value.scoredrb = value.scoredrb + 4;
                                        value.percentagedrb = value.percentagedrb + 50;
                                    }

                                    if (value.b.indexOf(vm.searchSelection.b1) !== -1) {
                                        value.scoreb = value.scoreb + 3;
                                        value.percentageb = value.percentageb + 50;
                                    }

                                    if (value.b.indexOf(vm.searchSelection.b2) !== -1) {
                                        value.scoreb = value.scoreb + 3;
                                        value.percentageb = value.percentageb + 50;
                                    }


                                    if (value.a.indexOf(vm.searchSelection.a1) !== -1) {
                                        value.scorea = value.scorea + 2;
                                        value.percentagea = value.percentagea + 50;
                                    }

                                    if (value.a.indexOf(vm.searchSelection.a2) !== -1) {
                                        value.scorea = value.scorea + 2;
                                        value.percentagea = value.percentagea + 50;
                                    }
                                    value.total = value.scoredrb + value.scoreb + value.scorea;
                                }

                            });
                            vm.listSelection = _.orderBy(data.data, 'total', 'desc');
                        } else {
                            logger.info($filter('translate')('3379'));
                        }
                    },
                    function (error) {
                        vm.modalError(error);
                        vm.loadingdata = false;
                    }
                );
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */