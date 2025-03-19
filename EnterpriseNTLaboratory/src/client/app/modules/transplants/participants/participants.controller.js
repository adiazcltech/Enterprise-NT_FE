/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.participants')
        .controller('participantsController', participantsController);
    participantsController.$inject = ['localStorageService', 'logger',
        '$filter', '$state', 'moment', '$rootScope', 'common', 'documenttypesDS', 'recepctionDS'];
    function participantsController(localStorageService, logger,
        $filter, $state, moment, $rootScope, common, documenttypesDS, recepctionDS) {
        var vm = this;
        vm.title = 'participants';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.NamePage = $filter('translate')('3074');
        vm.selected = -1;
        vm.isOpenReport = true;
        vm.button = false;
        vm.modalError = modalError;
        $rootScope.pageview = 3;
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
        vm.gettypedocument = gettypedocument;
        function gettypedocument() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return documenttypesDS.getstatetrue(auth.authToken).then(
                function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        vm.documentTypelist = data.data;
                        vm.documentTypelist.push({
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        });
                        vm.documentTypepatient = {
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        };
                    } else {
                        vm.documentTypelist.push({
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        });
                        vm.documentTypepatient = {
                            'id': 0,
                            'abbr': 'NI',
                            'name': $filter('translate')('0919')
                        };
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.getInstitution = getInstitution;
        function getInstitution() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListInstitution = [];
            return recepctionDS.getinstitution(auth.authToken).then(
                function (data) {                    
                    if (data.status === 200) {
                        vm.ListInstitution = data.data;
                        vm.ListInstitution.push({ "id": null, "code": "", "name": "Todas" })
                        vm.listremision = { "selected": { "id": null, "code": "", "name": "Todas" } }
                    }
                    vm.getseach();
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );
        }
        vm.changefilter = changefilter;
        function changefilter() {
            vm.searchreception = '';
            if (vm.typedocument) {
                vm.documentTypepatient = {
                    'id': 0,
                    'abbr': 'NI',
                    'name': $filter('translate')('0919')
                };
            }
            vm.organsearch = {
                id: 0,
                name: $filter('translate')('3334')
            }

            vm.organsearchname = {
                id: 0,
                name: $filter('translate')('3334')
            }
            if (vm.typeresport.id === 0) {
                setTimeout(function () {
                    document.getElementById('searchgrille').focus();
                }, 400);
            }
            if (vm.typeresport.id === 1) {
                setTimeout(function () {
                    document.getElementById('txt_patientid').focus();
                }, 400);
            }
            if (vm.typeresport.id === 2) {
                setTimeout(function () {
                    document.getElementById('txt_lastname').focus();
                }, 400);
            }
            vm.ListOrder = [];
            vm.record = '';
            vm.lastname = '';
            vm.surname = '';
            vm.name1 = '';
            vm.name2 = '';
            if (vm.typeresport.id === 0) {
                vm.getseach();
            }
        }
        vm.getseach = getseach;
        function getseach() {
            vm.loadingdata = true;
            if (vm.typeresport.id === 0) {
                var data = {
                    "typeFilter": 0
                }
            }
            if (vm.typeresport.id === 1) {
                var data = {
                    "typeFilter": 1,
                    "patientId": vm.record
                }
                if (vm.documentTypepatient.id !== 0) {
                    data.documentType = { "id": vm.documentTypepatient.id }
                }
                if (vm.organsearch.id !== 0) {
                    data.idOrgan = vm.organsearch.id
                }
            }
            if (vm.typeresport.id === 2) {
                if (vm.name1.trim() === '' && vm.name2.trim() === '' && vm.lastname.trim() === '' && vm.surname.trim() === '') {
                    vm.loadingdata = false;
                    return false;
                }
                var data = {
                    "typeFilter": 2
                }
                if (vm.name1.trim() !== '') {
                    data.name1 = vm.name1;
                }
                if (vm.name2.trim() !== '') {
                    data.name2 = vm.name2;
                }
                if (vm.lastname.trim() !== '') {
                    data.lastName = vm.lastname;
                }

                if (vm.surname.trim() !== '') {
                    data.surName = vm.surname;
                }
                

            }
            if (vm.organsearch.id !== 0) {
                data.idOrgan = vm.organsearch.id
            }
            data.partaker = vm.typefilter;
            data.institution = vm.listremision.selected.id;
            vm.ListOrder = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS
                .getpartaker(auth.authToken, data)
                .then(
                    function (data) {
                        vm.loadingdata = false;
                        if (data.data.length !== 0) {
                            data.data.forEach(function (data) {
                                data.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                                if (data.listTransplant.length !== 0) {
                                    data.listTransplant.forEach(function (dataOrgan) {
                                        dataOrgan.nameorgan = vm.changuenameOrgan(dataOrgan.organ);
                                        dataOrgan.listOrgan = {
                                            'id': dataOrgan.organ,
                                            'name': dataOrgan.nameorgan
                                        }
                                    });
                                }
                            });
                            vm.ListOrder = data.data;
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
        vm.changuenameOrgan = changuenameOrgan;
        function changuenameOrgan(number) {
            if (number === 1) {
                return vm.organ[0].name;
            } else if (number === 2) {
                return vm.organ[1].name;
            } else if (number === 3) {
                return vm.organ[2].name;
            } else if (number === 4) {
                return vm.organ[3].name;
            } else if (number === 5) {
                return vm.organ[4].name;
            } else if (number === 6) {
                return vm.organ[5].name;
            } else if (number === 7) {
                return vm.organ[6].name;
            } else if (number === 8) {
                return vm.organ[7].name;
            } else if (number === 9) {
                return vm.organ[8].name;
            } else if (number === 10) {
                return vm.organ[9].name;
            } else if (number === 11) {
                return vm.organ[10].name;
            } else if (number === 12) {
                return vm.organ[11].name;
            } else if (number === 13) {
                return vm.organ[12].name;
            }
        }
        vm.searchtype = searchtype;
        function searchtype() {
            if (vm.typeresport.id === 1) {
                setTimeout(function () {
                    document.getElementById('txt_patientid').focus();
                }, 400);
                if (vm.record === '') {
                    return true;
                } else {
                    vm.getseach();
                }
            }
        }
        vm.keyselectpatientid = keyselectpatientid;
        function keyselectpatientid($event) {
            var keyCode = $event !== undefined ? $event.which || $event.keyCode : 13;
            if (keyCode === 13) {
                vm.getseach();
            }
        }
        vm.eventUndo = eventUndo;
        function eventUndo() {
            vm.documentType = {
                'id': 0
            };
            vm.patientId = '';
            vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
            vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, !vm.managehistoryauto);
            vm.patientDemosDisabled[-100] = vm.managehistoryauto;
            vm.patientDemos.forEach(function (demo, index) {
                if (demo.encoded && demo.viewdefault) {
                    vm.patientDemosValues[demo.id] = demo.itemsdefault;
                }
            });
            if (vm.typedocument) {
                vm.patientDemosDisabled[-10] = false;
                setTimeout(function () {
                    document.getElementById('demo_' + vm.staticDemoIds['documentType'] + '_value').focus();
                }, 100);
            } else {
                if (!vm.historyautomatic) {
                    setTimeout(function () {
                        document.getElementById('demo_' + vm.staticDemoIds['patientId']).focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
                    }, 100);
                }
            }

            //Limpia el formulario de los indicadores de obligatorios
            vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
            });
        }
        vm.assingpartaker = assingpartaker;
        function assingpartaker(idpatient, type, reentry) {
            vm.loadingdata = true;
            var data = {
                "partaker": type,
                "reEntry": reentry ? 1 : 0,
                "id": idpatient
            }
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return recepctionDS
                .updatepartaker(auth.authToken, data)
                .then(
                    function (data) {
                        vm.loadingdata = false;
                        vm.getseach();
                    },
                    function (error) {
                        vm.modalError(error);
                        vm.loadingdata = false;
                    }
                );
        }
        vm.init = init;
        function init() {
            vm.loadingdata = true;
            vm.formatDate = localStorageService.get('FormatoFecha');
            vm.typedocument = localStorageService.get('ManejoTipoDocumento');
            vm.typedocument = vm.typedocument === 'True' || vm.typedocument === true ? true : false;
            vm.historyautomatic = localStorageService.get('HistoriaAutomatica');
            vm.historyautomatic = vm.historyautomatic === 'True' || vm.historyautomatic === true ? true : false;
            vm.history = undefined;
            vm.typeresport = [
                {
                    id: 0,
                    name: $filter('translate')('0353')
                }, //historia
                {
                    id: 1,
                    name: $filter('translate')('0117')
                }, //historia
                {
                    id: 2,
                    name: $filter('translate')('0133') + "/" + $filter('translate')('0134')
                } //Apellido
            ];

            vm.organ = [
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
                },//Células Lumbares
                {
                    id: 9,
                    name: $filter('translate')('2099')
                },//Multivisceral
                {
                    id: 10,
                    name: $filter('translate')('3308')
                },//islotes pancreáticos
                {
                    id: 11,
                    name: $filter('translate')('3327')
                },//células hematopoyéticas
                {
                    id: 12,
                    name: $filter('translate')('3333')
                },//Asociación con enfermedad
                {
                    id: 13,
                    name: 'PRA'
                }//PRA
            ];

            vm.listSearchorgan = _.clone(vm.organ);

            var organ = {
                id: 0,
                name: $filter('translate')('3334')
            }
            vm.listSearchorgan.push(organ);

            vm.organsearch = {
                id: 0,
                name: $filter('translate')('3334')
            }

            vm.organsearchname = {
                id: 0,
                name: $filter('translate')('3334')
            }

            vm.typeresport.id = 0;
            if (vm.typedocument) {
                vm.gettypedocument();
            }
            else {
                vm.documentTypelist = [];
                vm.documentTypelist.push({
                    'id': 0,
                    'abbr': 'NI',
                    'name': $filter('translate')('0919')
                });
                vm.documentTypepatient = vm.documentTypelist[0];
            }
            vm.typefilter = 0;
            vm.getInstitution();
            setTimeout(function () {
                document.getElementById('searchgrille').focus();
            }, 400);
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */
