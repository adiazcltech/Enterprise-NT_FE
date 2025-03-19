/* jshint ignore:start */
(function () {
    'use strict';

    angular
        .module('app.donor')
        .controller('donorsamplesController', donorsamplesController);
    donorsamplesController.$inject = ['LZString', 'localStorageService', 'logger', 'patientDS', 'donorDS', 'reportsDS',
        '$filter', '$state', 'moment', '$rootScope', 'common', '$translate', 'documenttypesDS', 'recepctionDS', 'orderentryDS'];
    function donorsamplesController(LZString, localStorageService, logger, patientDS, donorDS, reportsDS,
        $filter, $state, moment, $rootScope, common, $translate, documenttypesDS, recepctionDS, orderentryDS) {
        var vm = this;
        vm.title = 'donor';
        $rootScope.menu = true;
        vm.loadingdata = false;
        $rootScope.NamePage = $filter('translate')('3318');
        vm.selected = -1;
        vm.isOpenReport = true;
        vm.button = false;
        vm.viewadjunto = false;
        vm.exportdatareception = exportdatareception;
        vm.initzip = initzip;
        $rootScope.pageview = 3;
        vm.staticDemoIds = {
            'patientDB': -99,
            'patientComment': -997,
            'documentType': -10,
            'patientId': -100,
            'lastName': -101,
            'surName': -102,
            'name1': -103,
            'name2': -109,
            'sex': -104,
            'birthday': -105,
            'age': -110,
            'email': -106,
            'weight': -8,
            'size': -9,
            'race': -7, //demografico
            'orderDB': -998,
            'orderComment': -996,
            'order': -107,
            'orderDate': -108,
            'orderType': -4, //demografico
            'rate': -3, //demografico
            'branch': -5, //demografico
            'service': -6, //demografico
            'account': -1, //demografico
            'physician': -2, //demografico
            'phone': -111,
            'address': -112,
            'createUser': -113
        };



        function initzip() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');

            vm.indexorgan = 0;
            vm.listreport = [];
            vm.zip = new JSZip();
            return donorDS.getDonorAll(auth.authToken).then(
                function (data) {
                    if (data.status === 200) {
                        if (data.data.length > 0) {
                            data.data.forEach(function (item) {
                                item.donatedorgan = _.map(item.donatedorgan, function (o) {
                                    var objeto = _.find(vm.organ, { 'id': parseInt(o) });
                                    return objeto ? objeto.name : o;
                                })
                            })

                            var solido = _.filter(data.data, function (e) {

                                return e.idorgantype === 0
                            });
                            var celulas = _.filter(data.data, function (e) {
                                return e.idorgantype === 1
                            });

                            vm.listreport = [
                                {
                                    name: "Solidos",
                                    organ: solido
                                }, {
                                    name: "Celulas hematopoyeticas",
                                    organ: celulas
                                }
                            ]

                            vm.exportdatareception();
                        }

                    }
                },
                function (error) {
                    vm.modalError(error);
                }
            );

        }

        function exportdatareception() {
            UIkit.modal('#modalprogressprint', { bgclose: false, escclose: false, modal: false }).show();
            vm.porcent = Math.round((vm.indexorgan * 100) / 2);
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            generalexcel(vm.listreport[vm.indexorgan].organ)

        }

        function generalexcel(data) {
            var report = {
                "type": "csv",
                "data": data,
                "template": "transplant/donor"
            }

            reportsDS.generarpdf(report).then(function (response) {
                if (response.status === 200) {
                    var buffer = _base64ToArrayBuffer(response.data);
                    var byteArray = new Uint8Array(buffer);
                    // Decodificar los bytes en una cadena UTF-8
                    var decoder = new TextDecoder('utf-8');
                    var utf8String = decoder.decode(byteArray);

                    // Volver a codificar la cadena en UTF-8
                    var encoder = new TextEncoder();
                    var utf8Bytes = encoder.encode(utf8String);


                    var byteString = '';
                    for (var i = 0; i < utf8Bytes.byteLength; i++) {
                        byteString += String.fromCharCode(utf8Bytes[i]);
                    }
                    vm.zip.file(vm.listreport[vm.indexorgan].name + ".csv", byteString, { binary: true });

                    if (vm.indexorgan < vm.listreport.length - 1) {
                        vm.indexorgan = vm.indexorgan + 1;
                        vm.exportdatareception();
                    }
                    else {
                        UIkit.modal('#modalprogressprint', { bgclose: false, keyboard: false }).hide();
                        var blob = vm.zip.generate({ type: "blob" });
                        var nameZip = 'Donor_' + moment().format('DD') + '_' + moment().format('MM') + '_' + moment().format('YYYY') + '.zip';
                        saveAs(blob, nameZip);
                    }
                }
            })

        }
        function _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(JSON.parse(base64));
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
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

            if (vm.typeresport.id === 0) {
                vm.searchTypeOrgan = -1;
                setTimeout(function () {
                    document.getElementById('typeOrgan').focus();
                }, 400);
            }
            if (vm.typeresport.id === 1) {
                vm.searchTypeOrgan = 0;
                setTimeout(function () {
                    document.getElementById('txt_patientid').focus();
                }, 400);
            }
            if (vm.typeresport.id === 2) {
                vm.searchTypeOrgan = 0;
                setTimeout(function () {
                    document.getElementById('txt_lastname').focus();
                }, 400);
            }
            vm.searchreception = '';

            vm.listDonor = [];
            vm.record = '';
            vm.lastname = '';
            vm.surname = '';
            vm.name1 = '';
            vm.name2 = '';
            vm.searchtypeDonor = null;
        }
        vm.getseach = getseach;
        function getseach() {
            if (vm.searchTypeOrgan === -1) {
                return true
            }
            if (vm.typeresport.id === 0) {
                var data = {
                    "typeFilter": 0,
                    "idorgantype": vm.searchTypeOrgan,
                    "typeDonor": vm.searchtypeDonor
                }
            }
            if (vm.typeresport.id === 1) {
                var data = {
                    "typeFilter": 1,
                    "patientId": vm.record,
                    "idorgantype": vm.searchTypeOrgan,
                    "typeDonor": vm.searchtypeDonor
                }
                if (vm.documentTypepatient.id !== 0) {
                    data.documentType = { "id": vm.documentTypepatient.id }
                }
            }
            if (vm.typeresport.id === 2) {
                if (vm.name1.trim() === '' && vm.name2.trim() === '' && vm.lastname.trim() === '' && vm.surname.trim() === '') {
                    vm.loadingdata = false;
                    return false;
                }
                var data = {
                    "typeFilter": 2,
                    "idorgantype": vm.searchTypeOrgan,
                    "typeDonor": vm.searchtypeDonor
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
            vm.listDonor = [];
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            return donorDS
                .donorpatientfilter(auth.authToken, data)
                .then(
                    function (data) {
                        vm.loadingdata = false;
                        if (data.data.length !== 0) {
                            data.data.forEach(function (data) {
                                data.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                            });
                            vm.listDonor = data.data;
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
        vm.init = init;
        function init() {
            vm.labeldonante = 'Nuevo Donante';
            vm.labelfallecido = $filter('translate')('3331');
            vm.labelVivo = $filter('translate')('3332');
            vm.labelSolido = $filter('translate')('3395');
            vm.labelCelulas = $filter('translate')('3327');
            vm.formatDate = localStorageService.get('FormatoFecha');
            vm.typedocument = localStorageService.get('ManejoTipoDocumento');
            vm.typedocument = vm.typedocument === 'True' || vm.typedocument === true ? true : false;
            vm.historyautomatic = localStorageService.get('HistoriaAutomatica');
            vm.historyautomatic = vm.historyautomatic === 'True' || vm.historyautomatic === true ? true : false;
            vm.history = undefined;
            vm.maxDate = new Date();
            vm.patientPhoto = 'images/user.png';
            // lista de grupo sanguineo
            vm.ListBloodtype = [
                {
                    id: $filter('translate')('0162'),
                    name: $filter('translate')('0162')
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
            // lista de RH
            vm.ListRH = [
                {
                    id: $filter('translate')('0162'),
                    name: $filter('translate')('0162')
                }, {
                    id: $filter('translate')('3328'),
                    name: $filter('translate')('3328')
                },
                {
                    id: $filter('translate')('3329'),
                    name: $filter('translate')('3329')
                }
            ]
            // lista tipo de organo
            vm.ListTypeOrgan = [
                {
                    id: 0,
                    name: $filter('translate')('3395')
                }, {
                    id: 1,
                    name: $filter('translate')('3327')
                }
            ]
            //Lista de tipo de donante 
            vm.ListtypeDonor = [{
                id: 0,
                name: $filter('translate')('3331')
            },
            {
                id: 1,
                name: $filter('translate')('3332')
            }
            ]

            //Lista de tipo de donante 
            vm.ListtypeDonorSearch = [
                {
                    id: null,
                    name: $filter('translate')('0353')
                },
                {
                    id: 0,
                    name: $filter('translate')('3331')
                },
                {
                    id: 1,
                    name: $filter('translate')('3332')
                }
            ]
            //Lista de parentesco
            vm.Listrelationship = [{
                id: $filter('translate')('3404'),
                name: $filter('translate')('3404')
            },
            {
                id: $filter('translate')('3405'),
                name: $filter('translate')('3405')
            },
            {
                id: $filter('translate')('3406'),
                name: $filter('translate')('3406')
            },
            {
                id: $filter('translate')('3407'),
                name: $filter('translate')('3407')
            },
            {
                id: $filter('translate')('3408'),
                name: $filter('translate')('3408')
            },
            {
                id: $filter('translate')('3409'),
                name: $filter('translate')('3409')
            },
            {
                id: $filter('translate')('3410'),
                name: $filter('translate')('3410')
            },
            {
                id: $filter('translate')('3411'),
                name: $filter('translate')('3411')
            }
            ]
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
            vm.selected = [];
            vm.searchTypeOrgan = -1;
            vm.searchtypeDonor = null;
            vm.loadDemographicControls();
            vm.getseach();
            vm.getInsurance();
            vm.getInstitution();
            setTimeout(function () {
                document.getElementById('typeOrgan').focus();
            }, 400);
        }
        vm.toggle = toggle;
        function toggle(item, list) {
            var idx = list.indexOf(item.id);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item.id);
            }
        }
        vm.exists = exists;
        function exists(item, list) {
            return list.indexOf(item.id) > -1;
        }
        vm.getInsurance = getInsurance;
        function getInsurance() {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.Listinsurance = [];
            return recepctionDS.getinsurance(auth.authToken).then(
                function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        vm.Listinsurance = data.data;
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
        vm.eventUndo = eventUndo;
        function eventUndo() {
            vm.documentType = {
                'id': 0
            };
            vm.disabledpatient = true;
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
            vm.datadonor = vm.jsonDone();
            //Limpia el formulario de los indicadores de obligatorios
            vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
            });
        }
        vm.eventEdit = eventEdit;
        function eventEdit() {
            //Habilita los datos del paciente
            var patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, false);
            vm.patientDemosDisabled = patientDemosDisabled;
            vm.patientDemosDisabled[-100] = vm.historyautomatic;
            var findpropertydemografic = _.filter(vm.patientDemos, function (e) {
                return e.modify === false
            });
            if (findpropertydemografic.length > 0) {
                findpropertydemografic.forEach(function (e) {
                    disabledDemo(vm.patientDemosDisabled, e.id, true);
                })
            }
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['lastName'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['surName'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['name1'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['name2'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['sex'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['birthday'], true);
            disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['age'], true);
        }
        vm.loadDemographicControls = loadDemographicControls;
        function loadDemographicControls() {
            //Carga la historia
            var patientDemosValues = {};
            var patientDemosDisabled = {};
            var index = 1;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            orderentryDS.getDemographics(auth.authToken, 'H').then(function (response) {
                response.data.forEach(function (value, key) {
                    value.tabIndex = index;
                    value.name = ($filter('translate')(value.name)).toLowerCase();
                    value.format = value.format === undefined || value.format === '' ? '' : value.format;
                    if (value.id === -8 || value.id === -9) {
                        value.placeholder = '';
                        value.format = '';
                    }
                    if (value.id === -105) {
                        value.date = true;
                        value.format = value.placeholder;
                    } else if (value.format !== undefined && value.format !== '') {
                        if (value.format.search("DATE") === -1) {
                            value.date = false;
                        } else {
                            value.date = true;
                            value.format = value.format.slice(5);
                        }
                    }
                    value.showRequired = false;
                    value.idOrigin = '|' + value.id + 'H';
                    patientDemosValues[value.id] = '';
                    patientDemosDisabled[value.id] = true;
                    if (value.encoded) {
                        var itemsdefault = '';
                        var viewdefault = false;
                        value.items.forEach(function (item, indexItem) {
                            item.idDemo = value.id;
                            item.showValue = (item.code + '. ' + item.name).toUpperCase();
                            if (item.defaultItem) {
                                itemsdefault = item;
                                viewdefault = true;
                            }
                        });
                        value.itemsdefault = itemsdefault;
                        value.viewdefault = viewdefault;
                    }
                    index++;
                });

                //Actualiza la vista
                vm.patientDemos = response.data;
                vm.patientDemosValues = patientDemosValues;
                vm.patientDemosDisabled = patientDemosDisabled;
                vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, true);
            },
                function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
        }
        vm.eventNew = eventNew;
        function eventNew() {
            vm.labeldonante = 'Nuevo Donante';
            vm.editdonor = false;
            vm.disabledpatient = true;
            vm.documentType = {
                'id': 0
            };
            vm.patientId = '';
            vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
            vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, !vm.historyautomatic);
            vm.patientDemosDisabled[-100] = vm.historyautomatic;
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

            vm.editDisabled = true;
            vm.neweventUndoDisabled = false;
            vm.datadonor = vm.jsonDone();
            //Limpia el formulario de los indicadores de obligatorios
            vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
            });
            UIkit.modal('#modal_editdonor').show();
        }
        function getPatientData() {
            var patient = {};
            var patientDemographics = [];
            vm.patientDemos.forEach(function (demo, index) {
                if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
                    if (demo.encoded) {
                        if (demo.id === vm.staticDemoIds['documentType']) {
                            patient.documentType = {
                                'id': vm.patientDemosValues[demo.id].id
                            };
                        } else if (demo.id === vm.staticDemoIds['sex']) {
                            patient.sex = {
                                'id': vm.patientDemosValues[demo.id].id
                            };
                        } else if (demo.id === vm.staticDemoIds['race']) {
                            if (typeof vm.patientDemosValues[demo.id] === 'object' && vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                                patient.race = {
                                    'id': vm.patientDemosValues[demo.id].id
                                };
                            } else {
                                patient.race = null;
                            }
                        } else {
                            if (typeof vm.patientDemosValues[demo.id] === 'object' && vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                                patientDemographics.push({
                                    'idDemographic': demo.id,
                                    'encoded': true,
                                    'notCodifiedValue': '',
                                    'codifiedId': vm.patientDemosValues[demo.id].id
                                });
                            }
                        }
                    } else {
                        if (demo.id !== vm.staticDemoIds['age']) {
                            if (demo.id === vm.staticDemoIds['patientDB']) {
                                patient.id = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['patientId']) {
                                patient.patientId = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['lastName']) {
                                patient.lastName = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['surName']) {
                                patient.surName = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null);
                            } else if (demo.id === vm.staticDemoIds['name1']) {
                                patient.name1 = vm.patientDemosValues[demo.id].toUpperCase();
                            } else if (demo.id === vm.staticDemoIds['name2']) {
                                patient.name2 = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id].toUpperCase() : null);
                            } else if (demo.id === vm.staticDemoIds['birthday']) {
                                var birthday = moment(vm.patientDemosValues[demo.id], vm.formatDate.toUpperCase()).valueOf();
                                if (isNaN(birthday)) {
                                    var datebirthday = moment(vm.patientDemosValues[demo.id]).format(vm.formatDate.toUpperCase());
                                    var birthday = moment(datebirthday, vm.formatDate.toUpperCase()).valueOf()
                                }
                                patient.birthday = birthday;
                            } else if (demo.id === vm.staticDemoIds['email']) {
                                patient.email = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['weight']) {
                                patient.weight = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['size']) {
                                patient.size = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['phone']) {
                                patient.phone = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else if (demo.id === vm.staticDemoIds['address']) {
                                patient.address = (vm.patientDemosValues[demo.id] !== undefined ? vm.patientDemosValues[demo.id] : null);
                            } else {
                                if (demo.date === true) {
                                    if (vm.patientDemosValues[demo.id] !== '') {
                                        var format = demo.format === '' ? vm.formatDate.toUpperCase() : demo.format.toUpperCase();
                                        vm.patientDemosValues[demo.id] = moment(vm.patientDemosValues[demo.id]).format(format);
                                    }
                                }
                                if (vm.patientDemosValues[demo.id] !== undefined && vm.patientDemosValues[demo.id] !== '' && vm.patientDemosValues[demo.id] !== null) {
                                    patientDemographics.push({
                                        'idDemographic': demo.id,
                                        'encoded': false,
                                        'notCodifiedValue': vm.patientDemosValues[demo.id],
                                        'codifiedId': ''
                                    });
                                } else {
                                    if (demo.id === vm.staticDemoIds['surName']) {
                                        patient.surName = '';
                                    } else if (demo.id === vm.staticDemoIds['name1']) {
                                        patient.name1 = '';
                                    } else if (demo.id === vm.staticDemoIds['email']) {
                                        patient.email = '';
                                    } else {
                                        patientDemographics.push({
                                            'idDemographic': demo.id,
                                            'encoded': false,
                                            'notCodifiedValue': '',
                                            'codifiedId': ''
                                        });
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (demo.id === -997) {
                        patient.diagnostic = (vm.patientDemosValues[demo.id] !== undefined && vm.patientDemosValues[demo.id] !== '' ? vm.patientDemosValues[demo.id] : []);
                    } else if (demo.id === vm.staticDemoIds['surName']) {
                        patient.surName = '';
                    } else if (demo.id === vm.staticDemoIds['name1']) {
                        patient.name1 = '';
                    } else if (demo.id === vm.staticDemoIds['email']) {
                        patient.email = '';
                    } else if (demo.id === vm.staticDemoIds['phone']) {
                        patient.phone = '';
                    } else if (demo.id === vm.staticDemoIds['address']) {
                        patient.address = '';
                    } else if (demo.id > 0) {
                        patientDemographics.push({
                            'idDemographic': demo.id,
                            'encoded': demo.encoded,
                            'notCodifiedValue': '',
                            'codifiedId': ''
                        });
                    }
                }
            });
            if (patient.documentType === undefined) {
                patient.documentType = {
                    'id': 1
                };
            }
            patient.demographics = patientDemographics;
            return patient;
        }
        vm.eventSave = eventSave;
        function eventSave(edit) {
            vm.loading = true;
            vm.editPatient = edit;
            if (validateForm()) {
                //Se obtiene la informacion del paciente
                var patient = getPatientData();
                if (vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== null && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== undefined && vm.patientDemosValues[vm.staticDemoIds['patientDB']] !== '') {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Invoca el servicio que actualiza el paciente                    
                    patient.id = vm.patientDemosValues[vm.staticDemoIds['patientDB']];
                    patientDS.updatePatient(auth.authToken, patient).then(function (data) {
                        if (data.status === 200) {
                            logger.success($filter('translate')('0671'));
                            vm.savephotopatient(vm.patientDemosValues[vm.staticDemoIds['patientDB']]);
                            afterSavePatient(data.data);
                        } else {
                            vm.loading = false;
                            logger.warning($filter('translate')('0673'));
                        }
                    }, function (error) {
                        if (error.data !== null) {
                            vm.loading = false;
                            if (error.data.code === 2) {
                                error.data.errorFields.forEach(function (value) {
                                    var item = value.split('|');
                                    if (item[0] === '0' && item[1] === 'Patient exists') {
                                        logger.warning($filter('translate')('0672'));
                                        //vm.cleanform = 1;
                                        vm.statepatient = 5;
                                    }
                                });
                            }
                        } else {
                            vm.loading = false;
                            vm.modalError(error);
                        }
                    });
                } else {
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    //Invoca el servicio que crea el paciente
                    patientDS.insertPatient(auth.authToken, patient).then(function (data) {
                        if (data.status === 200) {
                            logger.success($filter('translate')('0670'));
                            vm.savephotopatient(data.data.id);
                            afterSavePatient(data.data);
                        }
                    }, function (error) {
                        if (error.data !== null) {
                            vm.loading = false;
                            if (error.data.code === 2) {
                                error.data.errorFields.forEach(function (value) {
                                    var item = value.split('|');
                                    if (item[0] === '0' && item[1] === 'Patient already exists') {
                                        logger.warning('El paciente ya existe!');
                                        //vm.cleanform = 1;
                                        vm.statepatient = 5;
                                    }
                                });
                            }
                        } else {
                            vm.loading = false;
                            vm.modalError(error);
                        }
                    });
                }

            } else {
                vm.loading = false;
                logger.warning($filter('translate')('0663'));
            }
        }
        function afterSavePatient(response) {
            vm.dataresponsePatient = response;
            vm.patientDemosValues[vm.staticDemoIds['patientDB']] = vm.dataresponsePatient.id;
            if (vm.historyautomatic) {
                vm.patientDemosValues[vm.staticDemoIds['patientId']] = vm.dataresponsePatient.id;
            }
            vm.patientDemosValues[-99] = vm.dataresponsePatient.id;
            vm.datadonor.trialdate = vm.datadonor.trialdate === null ? null : new Date(moment(vm.datadonor.trialdate).format()).getTime();
            vm.datadonor.datesamplecollection = vm.datadonor.datesamplecollection === null ? null : new Date(moment(vm.datadonor.datesamplecollection).format()).getTime();
            vm.datadonor.dateentry = vm.datadonor.dateentry === null ? null : new Date(moment(vm.datadonor.dateentry).format()).getTime();
            vm.datadonor.insurance = vm.datadonor.insurance.selected === undefined ? { 'id': 0 } : vm.datadonor.insurance.selected;
            vm.datadonor.institution = vm.datadonor.institution.selected === undefined ? { 'id': 0 } : vm.datadonor.institution.selected;
            vm.datadonor.donatedorgan = vm.selected.length === 0 ? '11' : vm.selected.toString();
            if (vm.editdonor) {
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                donorDS.updateDonar(auth.authToken, vm.datadonor).then(
                    function (data) {
                        vm.loading = false;
                        UIkit.modal('#modal_editdonor').hide();
                    }, function (error) {
                        vm.modalError(error);
                        vm.loading = false;
                    });

            } else {
                vm.datadonor.id = vm.dataresponsePatient.id;
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                donorDS.newDonar(auth.authToken, vm.datadonor).then(
                    function (data) {
                        vm.loading = false;
                        UIkit.modal('#modal_editdonor').hide();
                    }, function (error) {
                        vm.modalError(error);
                        vm.loading = false;
                    });
            }
        }
        vm.savephotopatient = savephotopatient;
        function savephotopatient(id) {
            var auth = localStorageService.get('Enterprise_NT.authorizationData');

            var datapatient = {
                'id': id,
                'photoInBase64': vm.patientPhoto
            };
            patientDS.insertphotopatient(auth.authToken, datapatient).then(
                function (response) { });
        }
        function validateForm() {
            var fieldsComplete = true;
            vm.patientDemos.forEach(function (demo, index) {
                demo.showRequired = false;
                if (demo.obligatory === 1) {
                    if (vm.patientDemosValues.hasOwnProperty(demo.id)) {
                        if (demo.encoded) {
                            if (typeof vm.patientDemosValues[demo.id] !== 'object') {
                                demo.showRequired = true;
                                fieldsComplete = false;
                            } else {
                                if (!vm.patientDemosValues[demo.id].hasOwnProperty('id')) {
                                    demo.showRequired = true;
                                    fieldsComplete = false;
                                } else if (vm.patientDemosValues[demo.id].id === undefined) {
                                    demo.showRequired = true;
                                    fieldsComplete = false;
                                }
                            }
                        } else {
                            if (demo.date === true && vm.patientDemosValues[demo.id] !== null && demo.date === true && vm.patientDemosValues[demo.id] !== '') {

                            } else if (demo.date === true && vm.patientDemosValues[demo.id] === null || demo.date === true && vm.patientDemosValues[demo.id] === '' || demo.date === true && vm.patientDemosValues[demo.id] === 'Invalid date') {
                                demo.showRequired = true;
                                fieldsComplete = false;
                            } else if (vm.patientDemosValues[demo.id] === undefined || vm.patientDemosValues[demo.id].trim() === '') {
                                demo.showRequired = true;
                                fieldsComplete = false;
                            }
                        }
                    } else if (demo.id === -111 && vm.maskphone !== '' && vm.patientDemosValues[demo.id] !== undefined) {
                        if (vm.patientDemosValues[demo.id].length < vm.maskphone.length) {
                            demo.showInvalidmask = true;
                        } else {
                            demo.showInvalidmask = false;
                        }
                    }
                }
            });
            return fieldsComplete;
        }
        vm.selectedPatientId = selectedPatientId;
        function selectedPatientId() {
            vm.loading = true;
            var searchById_DB = vm.historyautomatic ? 'patientDB' : 'patientId';
            vm.patientId = vm.patientDemosValues[vm.staticDemoIds[searchById_DB]];
            if (vm.patientId.toString().trim() !== '') {
                vm.documentType = vm.patientDemosValues[vm.staticDemoIds['documentType']];
                var idDocumentType = 0;

                var patientDemosValues = {};
                if (!vm.historyautomatic) {

                    if (vm.typedocument === true) {
                        idDocumentType = vm.documentType.id;
                    } else {
                        idDocumentType = 1
                    }
                }
                var auth = localStorageService.get('Enterprise_NT.authorizationData');
                patientDS.getPatientbyIddocument(auth.authToken, vm.patientId, idDocumentType).then(function (response) {
                    vm.disabledpatient = false;
                    vm.viewphoto = true;
                    vm.patientDemosDisabled.photo = true;
                    vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, response.data.length > 0);
                    vm.editDisabled = response.data.length === 0;
                    vm.newsaveDisabled = false;
                    vm.neweventUndoDisabled = false;
                    if (response.data.length > 0) {
                        vm.listpatientid = response.data;
                        var auth = localStorageService.get('Enterprise_NT.authorizationData');
                        return donorDS.getdetailpatient(auth.authToken, parseInt(vm.listpatientid[0].value))
                            .then(
                                function (data) {
                                    vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
                                    vm.listpatientid.forEach(function (demographic, index) {
                                        if (demographic.encoded) {
                                            patientDemosValues[demographic.idDemographic] = {
                                                'id': demographic.codifiedId,
                                                'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                                                'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                                                'showValue': demographic.value !== undefined ? demographic.value : ''
                                            };
                                        } else {
                                            patientDemosValues[demographic.idDemographic] = demographic.value;
                                            if (demographic.idDemographic == vm.staticDemoIds['birthday']) {
                                                //Si el demografico es la fecha de nacimiento calcula la edad
                                                patientDemosValues[vm.staticDemoIds['age']] = common.getAge(demographic.value, vm.formatDate.toUpperCase());
                                            }
                                        }
                                    });
                                    vm.patientDemosValues = patientDemosValues;
                                    vm.patientDemosDisabled.photo = true;
                                    if (data.data.length !== 0) {
                                        vm.editdonor = true;
                                        data.data.trialdate = data.data.trialdate === undefined ? null : moment(data.data.trialdate).format();
                                        data.data.datesamplecollection = data.data.datesamplecollection === undefined ? null : moment(data.data.datesamplecollection).format();
                                        data.data.dateentry = data.data.dateentry === undefined ? null : moment(data.data.dateentry).format();

                                        if (data.data.insurance.id !== undefined) {
                                            var insurelist = _.filter(_.clone(vm.Listinsurance), function (o) { return o.id === data.data.insurance.id; });
                                            if (insurelist.length !== 0) {
                                                var insurance = {
                                                    id: insurelist[0].id,
                                                    code: insurelist[0].code,
                                                    name: insurelist[0].name,
                                                }
                                                data.data.insurance = {
                                                    id: insurelist[0].id,
                                                    code: insurelist[0].code,
                                                    name: insurelist[0].name,
                                                    selected: insurance
                                                }
                                            }
                                        }
                                        if (data.data.institution.id !== undefined) {
                                            var institutionlist = _.filter(_.clone(vm.ListInstitution), function (o) { return o.id === data.data.institution.id; });
                                            if (institutionlist.length !== 0) {
                                                var institution = {
                                                    id: institutionlist[0].id,
                                                    code: institutionlist[0].code,
                                                    name: institutionlist[0].name,
                                                }
                                                data.data.institution = {
                                                    id: institutionlist[0].id,
                                                    code: institutionlist[0].code,
                                                    name: institutionlist[0].name,
                                                    selected: institution
                                                }
                                            }
                                        }
                                        if (data.data.donatedorgan !== '') {
                                            var numeros = _.map(_.split(data.data.donatedorgan, ','), function (item) {
                                                return parseInt(item, 10); // 10 es la base numérica (decimal)
                                            });
                                            vm.selected = numeros;
                                        }
                                        vm.datadonor = data.data;
                                        vm.loading = false;
                                    } else {
                                        vm.patientDemosDisabled.photo = true;
                                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
                                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
                                        setTimeout(function () {
                                            document.getElementById('idorgantype').focus();
                                        }, 100);
                                        vm.editdonor = false;
                                        vm.datadonor = vm.jsonDone();
                                        vm.loading = false;
                                    }
                                },
                                function (error) {
                                    vm.modalError(error);
                                    vm.loadingdata = false;
                                }
                            );

                    } else {
                        vm.cleanAllDemos();
                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['documentType'], true);
                        disabledDemo(vm.patientDemosDisabled, vm.staticDemoIds['patientId'], true);
                        setTimeout(function () {
                            document.getElementById('demo_' + vm.staticDemoIds['lastName']).focus();
                        }, 100);
                        vm.datadonor = vm.jsonDone();
                        vm.editdonor = false;
                        vm.loading = false;
                    }

                }, function (error) {
                    vm.Error = error;
                    vm.ShowPopupError = true;
                });
            }
        }
        vm.changetypeOrgan = changetypeOrgan;
        function changetypeOrgan() {
            vm.datadonor.dateentry = null;
            vm.datadonor.insurance = {};
            vm.datadonor.institution = {};
            vm.datadonor.physician = '';
            vm.datadonor.a = '';
            vm.datadonor.drb1 = '';
            vm.datadonor.dpa = '';
            vm.datadonor.b = '';
            vm.datadonor.dqa = '';
            vm.datadonor.dpb = '';
            vm.datadonor.c = '';
            vm.datadonor.dqb = '';
            vm.datadonor.datesamplecollection = null;
            vm.datadonor.trialdate = null;
            vm.datadonor.observation = '';
            vm.datadonor.bloodgroup = '';
            vm.datadonor.rh = '';
            vm.selected = [];
            vm.datadonor.donatedorgan = '';
            vm.datadonor.donordeath = '';
            vm.datadonor.hotweather = 0;
            vm.datadonor.coldweather = 0;
            vm.datadonor.kinship = 'No relacionado';
            vm.datadonor.haplotipos = 0;
            vm.datadonor.incompatibilitya = '';
            vm.datadonor.incompatibilitydrb1 = '';
            vm.datadonor.incompatibilityb = '';
            vm.datadonor.incompatibilitydqa = '';
            vm.datadonor.incompatibilityc = '';
            vm.datadonor.incompatibilitydqb = '';
            vm.datadonor.typeDonor = 1;

        }
        vm.jsonDone = jsonDone;
        function jsonDone() {
            var dataNew = {
                "id": '',
                "typeDonor": 1, //tipo de donante
                "idorgantype": -1,//tipo de organo
                "insurance": {},
                "institution": {},
                "bloodgroup": "",
                "rh": "",
                "donatedorgan": "",
                "physician": "",
                "cmv": "",
                "donordeath": "",
                "hotweather": 0,
                "local": "",
                "coldweather": 0,
                "preservationmethod": "",
                "preservationsolution": "",
                "kinship": "No relacionado",
                "haplotipos": 0,
                "a": "",
                "b": "",
                "c": "",
                "drb1": "",
                "dqa": "",
                "dqb": "",
                "dpa": "",
                "dpb": "",
                "datesamplecollection": null,
                "trialdate": null,
                "dateentry": null,
                "serology": "",
                "incompatibilitya": "",
                "incompatibilityb": "",
                "incompatibilityc": "",
                "incompatibilitydrb1": "",
                "incompatibilitydqa": "",
                "incompatibilitydqb": "",
                "incompatibilitydpa": "",
                "incompatibilitydpb": "",
                "observation": ""
            }
            return dataNew;
        }
        vm.editrecepcion = editrecepcion;
        function editrecepcion(donor) {
            vm.labeldonante = 'Editar donante';
            var patientDemosValues = {};
            vm.loadingdata = true;
            vm.editdonor = true;
            vm.patientId = donor.patientId;
            var idDocumentType = donor.documentType.id;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            patientDS.getPatientbyIddocument(auth.authToken, vm.patientId, idDocumentType).then(function (response) {
                vm.disabledpatient = false;
                vm.viewphoto = true;
                vm.patientDemosDisabled.photo = true;
                vm.patientDemosDisabled = vm.disabledAllDemo(vm.patientDemosDisabled, response.data.length > 0);
                vm.editDisabled = response.data.length === 0;
                vm.newsaveDisabled = false;
                vm.neweventUndoDisabled = false;
                if (response.data.length > 0) {
                    vm.listpatientid = response.data;
                    var auth = localStorageService.get('Enterprise_NT.authorizationData');
                    return donorDS.getdetailpatient(auth.authToken, parseInt(vm.listpatientid[0].value))
                        .then(
                            function (data) {
                                vm.patientDemosValues = vm.cleanAllDemos(vm.patientDemosValues);
                                vm.listpatientid.forEach(function (demographic, index) {
                                    if (demographic.encoded) {
                                        patientDemosValues[demographic.idDemographic] = {
                                            'id': demographic.codifiedId,
                                            'code': demographic.codifiedCode !== undefined ? demographic.codifiedCode : '',
                                            'name': demographic.codifiedName !== undefined ? demographic.codifiedName : '',
                                            'showValue': demographic.value !== undefined ? demographic.value : ''
                                        };
                                    } else {
                                        patientDemosValues[demographic.idDemographic] = demographic.value;
                                        if (demographic.idDemographic == vm.staticDemoIds['birthday']) {
                                            //Si el demografico es la fecha de nacimiento calcula la edad
                                            patientDemosValues[vm.staticDemoIds['age']] = common.getAge(demographic.value, vm.formatDate.toUpperCase());
                                        }
                                    }
                                });
                                vm.patientDemosValues = patientDemosValues;
                                vm.patientDemosDisabled.photo = true;
                                if (data.data.length !== 0) {
                                    vm.editdonor = true;
                                    data.data.trialdate = data.data.trialdate === undefined ? null : moment(data.data.trialdate).format();
                                    data.data.datesamplecollection = data.data.datesamplecollection === undefined ? null : moment(data.data.datesamplecollection).format();
                                    data.data.dateentry = data.data.dateentry === undefined ? null : moment(data.data.dateentry).format();

                                    if (data.data.insurance.id !== undefined) {
                                        var insurelist = _.filter(_.clone(vm.Listinsurance), function (o) { return o.id === data.data.insurance.id; });
                                        if (insurelist.length !== 0) {
                                            var insurance = {
                                                id: insurelist[0].id,
                                                code: insurelist[0].code,
                                                name: insurelist[0].name,
                                            }
                                            data.data.insurance = {
                                                id: insurelist[0].id,
                                                code: insurelist[0].code,
                                                name: insurelist[0].name,
                                                selected: insurance
                                            }
                                        }
                                    }
                                    if (data.data.institution.id !== undefined) {
                                        var institutionlist = _.filter(_.clone(vm.ListInstitution), function (o) { return o.id === data.data.institution.id; });
                                        if (institutionlist.length !== 0) {
                                            var institution = {
                                                id: institutionlist[0].id,
                                                code: institutionlist[0].code,
                                                name: institutionlist[0].name,
                                            }
                                            data.data.institution = {
                                                id: institutionlist[0].id,
                                                code: institutionlist[0].code,
                                                name: institutionlist[0].name,
                                                selected: institution
                                            }
                                        }
                                    }
                                    if (data.data.donatedorgan !== '') {
                                        var numeros = _.map(_.split(data.data.donatedorgan, ','), function (item) {
                                            return parseInt(item, 10); // 10 es la base numérica (decimal)
                                        });
                                        vm.selected = numeros;
                                    }
                                    vm.datadonor = data.data;
                                    UIkit.modal('#modal_editdonor').show();
                                    vm.loadingdata = false;
                                } else {
                                    vm.editdonor = false;
                                }
                            },
                            function (error) {
                                vm.modalError(error);
                                vm.loadingdata = false;
                            }
                        );

                } else {
                    vm.editdonor = false;
                }

            }, function (error) {
                vm.Error = error;
                vm.ShowPopupError = true;
            });

        }
        vm.addrecepcion = addrecepcion;
        function addrecepcion(donor) {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            vm.ListRecepcion = [];
            vm.idDonor = donor.idDonor;
            return donorDS.receiverbyDonor(auth.authToken, vm.idDonor).then(
                function (data) {
                    vm.loadingdata = false;
                    if (data.status === 200) {
                        data.data.forEach(function (data) {
                            data.idDonor = vm.idDonor;
                            data.age = common.getAgeAsString(moment(data.birthday).format(vm.formatDate.toUpperCase()), vm.formatDate.toUpperCase());
                        });
                        vm.ListRecepcion = data.data;
                        UIkit.modal('#addrecepcion').show();
                    }
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );

        }
        vm.eventSaverecepcion = eventSaverecepcion;
        function eventSaverecepcion() {
            vm.loadingdata = true;
            var auth = localStorageService.get('Enterprise_NT.authorizationData');
            var data = _.filter(vm.ListRecepcion, function (o) { return o.selected; });
            return donorDS.updatereceiverbyDonor(auth.authToken, data).then(
                function (data) {
                    vm.loadingdata = false;
                    UIkit.modal('#addrecepcion').hide();
                },
                function (error) {
                    vm.loadingdata = false;
                    vm.modalError(error);
                }
            );

        }
        function disabledDemo(demos, id, disabled) {
            for (var property in demos) {
                if (property == id) {
                    if (demos.hasOwnProperty(property)) {
                        demos[property] = disabled;
                    }
                }
            }
            return demos;
        }
        vm.cleanAllDemos = cleanAllDemos;
        function cleanAllDemos(demos) {
            var cleanDemos = {};
            for (var property in demos) {
                if (demos.hasOwnProperty(property)) {
                    cleanDemos[property] = '';
                }
            }
            return cleanDemos;
        }
        vm.disabledAllDemo = disabledAllDemo;
        function disabledAllDemo(demos, disabled) {
            var disabledDemos = {};
            for (var property in demos) {
                if (demos.hasOwnProperty(property)) {
                    disabledDemos[property] = disabled;
                }
            }
            return disabledDemos;
        }
        vm.isAuthenticate();
    }
})();
/* jshint ignore:end */
